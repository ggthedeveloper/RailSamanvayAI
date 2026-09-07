import os
import sys
import uuid
from datetime import datetime

import pandas as pd
from ortools.sat.python import cp_model

# Add the project root and backend to Python's import path
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKEND_DIR = os.path.join(PROJECT_ROOT, "backend")

sys.path.insert(0, BACKEND_DIR)

from app.db.database import SessionLocal
from app.db.models import OptimizationRun
from app.api.endpoints import load_real_demands_and_blocks


def run_optimization(horizon="weekly", objective_profile="safety_first", output_file=None):
    print("=" * 70)
    print("RAILSAMANVAYAI — AI AUTOMATIC BLOCK PLANNING (REAL INDIAN RAILWAYS DATA)")
    print("=" * 70)

    if output_file is None:
        output_file = os.path.join(PROJECT_ROOT, "data", "processed", "optimized_plan.csv")

    # 1. LOAD REAL DATASETS
    print(f"\nLoading real Indian Railways demands and corridor availability (Horizon: {horizon})...")
    tasks_df, blocks_df, density_map = load_real_demands_and_blocks(PROJECT_ROOT, horizon)

    print(f"Maintenance demands loaded: {len(tasks_df)} (TMS/SMMS/TDMS + BDMS)")
    print(f"COA corridor availability windows loaded: {len(blocks_df)}")

    if len(tasks_df) == 0 or len(blocks_df) == 0:
        print("Error: Insufficient real maintenance data or availability windows.")
        return

    # 2. CREATE CP-SAT MODEL
    print("\nBuilding Google OR-Tools CP-SAT model with Multi-Department Synergy...")
    model = cp_model.CpModel()
    x = {}

    for t_idx, task in tasks_df.iterrows():
        for b_idx, block in blocks_df.iterrows():
            if task["corridor_id"] != block["corridor_id"]:
                continue
            if int(task["required_duration_min"]) > int(block["max_duration_min"]):
                continue
            x[(t_idx, b_idx)] = model.NewBoolVar(f"x_{t_idx}_{b_idx}")

    print(f"Decision variables created: {len(x)}")

    if len(x) == 0:
        print("No valid task/corridor pairings found.")
        return

    # Constraint 1: Each task assigned at most once
    for t_idx in tasks_df.index:
        vars_t = [x[(t_idx, b_idx)] for b_idx in blocks_df.index if (t_idx, b_idx) in x]
        if vars_t:
            model.AddAtMostOne(vars_t)

    # Constraint 2 & 3: Block capacity & Max 2 tasks per window
    joint_vars = {}
    for b_idx, block in blocks_df.iterrows():
        b_vars = [x[(t_idx, b_idx)] for t_idx in tasks_df.index if (t_idx, b_idx) in x]
        if not b_vars:
            continue
        model.Add(sum(b_vars) <= 2)
        durs = [int(tasks_df.loc[t_idx, "required_duration_min"]) for t_idx in tasks_df.index if (t_idx, b_idx) in x]
        model.Add(sum(b_vars[i] * durs[i] for i in range(len(b_vars))) <= int(block["max_duration_min"]))

        # Joint Multi-Department Synergy bonus
        t_indices = [t_idx for t_idx in tasks_df.index if (t_idx, b_idx) in x]
        depts = set(tasks_df.loc[t_idx, "department"] for t_idx in t_indices)
        if len(depts) >= 2:
            j_var = model.NewBoolVar(f"joint_{b_idx}")
            joint_vars[b_idx] = j_var
            model.Add(sum(b_vars) == 2).OnlyEnforceIf(j_var)
            model.Add(sum(b_vars) != 2).OnlyEnforceIf(j_var.Not())

    # Objective Function
    obj_terms = []
    for (t_idx, b_idx), var in x.items():
        p_score = int(tasks_df.loc[t_idx, "priority_score"])
        if tasks_df.loc[t_idx, "safety_critical"]:
            p_score += 150 if objective_profile == "safety_first" else 100
        p_score += int(tasks_df.loc[t_idx, "overdue_days"]) * 5

        # Freight Off-Peak incentive
        b_corridor = blocks_df.loc[b_idx, "corridor_id"]
        f_density = density_map.get(b_corridor, "Medium")
        if f_density == "Low":
            p_score += 80
        elif f_density == "High":
            p_score -= 40

        obj_terms.append(var * p_score)

    # Multi-Department Joint Possession Synergy Bonus (+250 points)
    for b_idx, j_var in joint_vars.items():
        obj_terms.append(j_var * 250)

    model.Maximize(sum(obj_terms))

    print("\nRunning CP-SAT solver...")
    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = 30.0
    status = solver.Solve(model)

    status_text = "OPTIMAL" if status == cp_model.OPTIMAL else ("FEASIBLE" if status == cp_model.FEASIBLE else "INFEASIBLE")
    print(f"Solver status: {status_text}")

    if status not in (cp_model.OPTIMAL, cp_model.FEASIBLE):
        print("CP-SAT could not find a feasible schedule.")
        return

    print(f"Objective value: {solver.ObjectiveValue()}")

    # Post-process assignments
    block_assignments = {}
    for (t_idx, b_idx), var in x.items():
        if solver.Value(var) == 1:
            block_assignments.setdefault(b_idx, []).append(t_idx)

    plan = []
    blocks_used = set()
    joint_possessions_count = 0

    for b_idx, assigned_t_indices in block_assignments.items():
        blk = blocks_df.loc[b_idx]
        b_id = str(blk["block_id"])
        blocks_used.add(b_id)

        assigned_depts = [tasks_df.loc[t_idx, "department"] for t_idx in assigned_t_indices]
        is_joint = len(assigned_t_indices) >= 2 and len(set(assigned_depts)) >= 2
        if is_joint:
            joint_possessions_count += 1
        downtime_saved = 180 if is_joint else 0

        for t_idx in assigned_t_indices:
            tsk = tasks_df.loc[t_idx]
            other_tasks = [
                f"{tasks_df.loc[o_idx, 'task_id']} ({tasks_df.loc[o_idx, 'department']})"
                for o_idx in assigned_t_indices if o_idx != t_idx
            ]
            bundled_with_str = ", ".join(other_tasks) if other_tasks else "None (Single Task)"

            plan.append({
                "task_id": str(tsk["task_id"]),
                "asset_id": str(tsk["asset_id"]),
                "block_id": b_id,
                "section_id": str(blk["corridor_id"]),
                "corridor_id": str(blk["corridor_id"]),
                "corridor_name": str(blk["corridor_id"]),
                "date": str(blk["date"]),
                "window_start": str(blk["window_start"]),
                "window_end": str(blk["window_end"]),
                "task_type": str(tsk["task_type"]),
                "department": str(tsk["department"]),
                "crew_type": str(tsk.get("crew_type", "Standard Gang")),
                "priority": str(tsk["priority"]),
                "required_duration_min": int(tsk["required_duration_min"]),
                "duration": int(tsk["required_duration_min"]),
                "overdue_days": int(tsk["overdue_days"]),
                "safety_critical": bool(tsk["safety_critical"]),
                "is_joint_possession": is_joint,
                "coordination_status": "JOINT_POSSESSION" if is_joint else "INDEPENDENT",
                "bundled_with": bundled_with_str,
                "downtime_saved_min": downtime_saved,
                "freight_density": density_map.get(str(blk["corridor_id"]), "Medium"),
                "power_isolation_required": str(blk.get("power_isolation_required", "No")),
                "restrictions": str(blk.get("restriction", "Standard night maintenance block")),
                "planning_status": status_text,
                "approval_status": "PENDING_APPROVAL",
                "approved_by": "Chief Controller",
                "solver": "Google OR-Tools CP-SAT"
            })

    # Save to CSV
    plan_df = pd.DataFrame(plan)
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    plan_df.to_csv(output_file, index=False)

    print(f"\nSuccessfully scheduled {len(plan)} tasks across {len(blocks_used)} block windows.")
    print(f"Joint multi-department possessions bundled: {joint_possessions_count}")
    print(f"Total corridor downtime saved: {joint_possessions_count * 180} minutes ({round(joint_possessions_count * 180 / 60, 1)} hours)")
    print(f"Plan saved to: {output_file}")

    # Log to Database
    db = SessionLocal()
    try:
        run_id = f"OPT_{uuid.uuid4().hex[:8]}"
        opt_run = OptimizationRun(
            id=run_id,
            run_timestamp=datetime.now(),
            solver_version="ortools-9.15",
            objective_profile=f"{objective_profile}_{horizon}",
            status=status_text,
            total_blocks_used=len(blocks_used),
            critical_tasks_completed=len(plan)
        )
        db.add(opt_run)
        db.commit()
    except Exception as e:
        print(f"Warning: Failed to log run to database: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    horizon = sys.argv[1] if len(sys.argv) > 1 else "weekly"
    run_optimization(horizon=horizon)
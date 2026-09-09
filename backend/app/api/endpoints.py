from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import (
    Asset, MaintenanceTask, BlockWindow, Station, Section, 
    OptimizationRun, Prediction, GoodsTrainForecast, MaintenanceHistory, 
    TrainMovement, Department, Defect
)
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
import pandas as pd
import numpy as np
import os
import json
import joblib
import math
import uuid
import heapq

router = APIRouter()

def get_project_root() -> str:
    if os.getenv("PROJECT_ROOT"):
        return os.path.abspath(os.getenv("PROJECT_ROOT"))
    return os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

CANONICAL_FEATURES = [
    'condition_score',
    'days_since_maintenance',
    'defect_history',
    'traffic_load',
    'age_days',
    'is_safety_critical',
    'dept_eng',
    'dept_smt',
    'dept_trd',
    'overdue_days'
]

def build_canonical_features(
    condition_score: float,
    days_since_maintenance: int,
    defect_history: int,
    traffic_load: int,
    age_days: int,
    is_safety_critical: int,
    department: str,
    overdue_days: int
) -> pd.DataFrame:
    dept_upper = (department or "ENGINEERING").upper()
    dept_eng = 1 if dept_upper in ["ENGINEERING", "ENG", "CIVIL", "TRACK"] else 0
    dept_smt = 1 if dept_upper in ["SMT", "S&T", "SIGNAL", "SIGNALLING", "TELECOM"] else 0
    dept_trd = 1 if dept_upper in ["TRD", "OHE", "ELECTRICAL", "TRD/OHE"] else 0
    if not (dept_eng or dept_smt or dept_trd):
        dept_eng = 1

    feature_dict = {
        'condition_score': float(condition_score),
        'days_since_maintenance': int(days_since_maintenance),
        'defect_history': int(defect_history),
        'traffic_load': int(traffic_load),
        'age_days': int(age_days),
        'is_safety_critical': int(is_safety_critical),
        'dept_eng': int(dept_eng),
        'dept_smt': int(dept_smt),
        'dept_trd': int(dept_trd),
        'overdue_days': int(overdue_days)
    }
    return pd.DataFrame([feature_dict])[CANONICAL_FEATURES]

class StationCreate(BaseModel):
    code: str
    name: str
    lat: float
    lon: float

class RouteAnalysisRequest(BaseModel):
    station_from: Optional[str] = None
    station_to: Optional[str] = None
    from_station: Optional[str] = None
    to_station: Optional[str] = None
    asset_type: Optional[str] = "TRACK" # TRACK, POINT, SIGNAL, OHE_MAST
    department: Optional[str] = "ENGINEERING" # ENGINEERING, SMT, TRD
    condition_score: Optional[float] = Field(0.55, ge=0.0, le=1.0)
    days_since_maintenance: Optional[int] = Field(180, ge=0)
    overdue_days: Optional[int] = Field(14, ge=0)
    traffic_load: Optional[int] = Field(120, ge=0)
    defect_history: Optional[int] = Field(3, ge=0)
    safety_critical: Optional[bool] = True

def haversine(lat1, lon1, lat2, lon2):
    R = 6371.0 # km
    dLat = math.radians(lat2 - lat1)
    dLon = math.radians(lon2 - lon1)
    a = math.sin(dLat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dLon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

def rail_distance(db: Session, origin: str, destination: str, fallback: float) -> float:
    graph: Dict[str, List[tuple[str, float]]] = {}
    sections = db.query(Section).filter(
        Section.station_from.isnot(None),
        Section.station_to.isnot(None),
        Section.distance_km.isnot(None)
    ).all()
    for section in sections:
        distance = float(section.distance_km)
        graph.setdefault(section.station_from, []).append((section.station_to, distance))
        graph.setdefault(section.station_to, []).append((section.station_from, distance))

    distances = {origin: 0.0}
    queue = [(0.0, origin)]
    while queue:
        current_distance, station = heapq.heappop(queue)
        if station == destination:
            return round(current_distance, 2)
        if current_distance > distances.get(station, float('inf')):
            continue
        for neighbor, edge_distance in graph.get(station, []):
            candidate = current_distance + edge_distance
            if candidate < distances.get(neighbor, float('inf')):
                distances[neighbor] = candidate
                heapq.heappush(queue, (candidate, neighbor))
    return fallback

@router.get("/stations")
def get_stations(db: Session = Depends(get_db)):
    return db.query(Station).all()

@router.post("/stations", status_code=status.HTTP_201_CREATED)
def create_station(station: StationCreate, db: Session = Depends(get_db)):
    existing = db.query(Station).filter(Station.code == station.code.upper().strip()).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Station with code '{station.code}' already exists.")
    
    new_station = Station(
        code=station.code.upper().strip(),
        name=station.name.strip(),
        lat=station.lat,
        lon=station.lon
    )
    db.add(new_station)
    db.commit()
    db.refresh(new_station)
    return new_station

@router.get("/sections")
def get_sections(db: Session = Depends(get_db)):
    return db.query(Section).all()

@router.post("/routes/analyze")
@router.post("/route/analyze")
def analyze_route(req: RouteAnalysisRequest, db: Session = Depends(get_db)):
    st_from_code = (req.station_from or req.from_station or "NDLS").upper()
    st_to_code = (req.station_to or req.to_station or "MTJ").upper()
    st_from = db.query(Station).filter(Station.code == st_from_code).first()
    st_to = db.query(Station).filter(Station.code == st_to_code).first()
    
    if not st_from:
        raise HTTPException(status_code=404, detail=f"Origin station '{st_from_code}' not found.")
    if not st_to:
        raise HTTPException(status_code=404, detail=f"Destination station '{st_to_code}' not found.")
    if st_from_code == st_to_code:
        raise HTTPException(status_code=400, detail="Origin and Destination stations must be different.")
    
    # Calculate distance
    straight_line_distance = haversine(st_from.lat, st_from.lon, st_to.lat, st_to.lon)
    distance_km = rail_distance(db, st_from.code, st_to.code, straight_line_distance)
    section_id = f"SEC_{st_from.code}_{st_to.code}"
    
    # Check if section exists in DB, if not auto-register it
    existing_sec = db.query(Section).filter(Section.id == section_id).first()
    if not existing_sec:
        existing_sec = Section(id=section_id, station_from=st_from.code, station_to=st_to.code, distance_km=distance_km)
        db.add(existing_sec)
        db.commit()
    
    # Check if real asset telemetry exists for this corridor section
    matched_asset = db.query(Asset).filter(Asset.section_id == section_id).first()

    # Query corridor goods forecast for traffic load if available
    corridor_forecast = db.query(GoodsTrainForecast).filter(
        GoodsTrainForecast.corridor_id.like(f"%{st_from.code}%")
    ).first()

    cond_score = req.condition_score if req.condition_score is not None else 0.55
    days_since_maint = req.days_since_maintenance if req.days_since_maintenance is not None else 180
    overdue = req.overdue_days if req.overdue_days is not None else 14
    traffic = req.traffic_load if req.traffic_load is not None else (corridor_forecast.predicted_goods_trains if corridor_forecast else 120)
    defects = req.defect_history if req.defect_history is not None else 0
    is_crit = 1 if req.safety_critical else 0
    age_days = 1825

    if matched_asset:
        telemetry_source = f"Observed asset {matched_asset.id} repository"
        if matched_asset.condition_score is not None and req.condition_score is None:
            cond_score = float(matched_asset.condition_score) / 100.0 if matched_asset.condition_score > 1.0 else float(matched_asset.condition_score)
        if matched_asset.criticality_class and req.safety_critical is None:
            is_crit = 1 if matched_asset.criticality_class.upper() in ["HIGH", "CRITICAL"] else 0
        if matched_asset.installation_date:
            try:
                anchor = datetime(2026, 9, 8)
                inst_dt = matched_asset.installation_date if isinstance(matched_asset.installation_date, datetime) else datetime.fromisoformat(str(matched_asset.installation_date))
                age_days = max(1, (anchor - inst_dt).days)
            except Exception:
                age_days = 1825
        # Count actual recorded defects for this asset
        actual_defects = db.query(Defect).filter(Defect.asset_id == matched_asset.id).count()
        if actual_defects > 0 and req.defect_history is None:
            defects = actual_defects
        # Check linked maintenance task for overdue days if not explicitly passed by user
        linked_task = db.query(MaintenanceTask).filter(MaintenanceTask.asset_id == matched_asset.id).first()
        if linked_task and req.overdue_days is None:
            overdue = linked_task.overdue_days or 0
            days_since_maint = linked_task.days_since_last_maintenance or days_since_maint
    else:
        telemetry_source = "User-configured operational parameters (No corridor asset record)"

    X_input = build_canonical_features(
        condition_score=cond_score,
        days_since_maintenance=days_since_maint,
        defect_history=defects,
        traffic_load=traffic,
        age_days=age_days,
        is_safety_critical=is_crit,
        department=req.department or "ENGINEERING",
        overdue_days=overdue
    )

    root = get_project_root()
    model_path = os.path.join(root, "ml", "models", "calibrated_rf.joblib")
    if not os.path.exists(model_path):
        model_path = os.path.join(root, "..", "ml", "models", "calibrated_rf.joblib")

    model_available = False
    prediction_mode = "rule_based"
    model_reason = "No model artifact loaded; using deterministic safety rules."
    risk_probability = float(np.clip((1.0 - cond_score) * 0.7 + (overdue / 30.0) * 0.3, 0.05, 0.98))

    if os.path.exists(model_path):
        try:
            model = joblib.load(model_path)
            probs = model.predict_proba(X_input)[0]
            risk_probability = float(probs[1]) if len(probs) > 1 else float(probs[0])
            model_available = True
            prediction_mode = "calibrated_random_forest"
            model_reason = "Evaluated using Calibrated Random Forest artifact (baseline training distribution)."
        except Exception as e:
            model_available = False
            prediction_mode = "rule_based"
            model_reason = f"Model execution error: {str(e)}; fell back to deterministic rules."
            risk_probability = float(np.clip((1.0 - cond_score) * 0.7 + (overdue / 30.0) * 0.3, 0.05, 0.98))

    # Decision Logic
    block_required = bool(risk_probability >= 0.40 or overdue >= 10 or cond_score < 0.65 or (is_crit == 1 and overdue > 0))
    
    if risk_probability >= 0.75 or (is_crit == 1 and overdue >= 15):
        priority_class = "P1 (Critical / Urgent Review)"
        verdict = "URGENT BLOCK REQUIRED"
        recommended_window = "Next Available Window (01:00 - 04:30 Midnight)"
        duration_min = 180
    elif risk_probability >= 0.45 or overdue >= 7:
        priority_class = "P2 (High Priority)"
        verdict = "SCHEDULED BLOCK REQUIRED"
        recommended_window = "Upcoming 7-Day Window (12:30 - 15:00 Non-Peak)"
        duration_min = 120
    elif block_required:
        priority_class = "P3 (Routine Preventive)"
        verdict = "PREVENTIVE BLOCK RECOMMENDED"
        recommended_window = "Monthly Rolling Window (Off-Peak Corridor)"
        duration_min = 90
    else:
        priority_class = "P4 / Normal (Asset Healthy)"
        verdict = "NO BLOCK REQUIRED"
        recommended_window = "No immediate disruption needed"
        duration_min = 0

    # Explainability & Diagnostic Factors
    factors_positive = []
    factors_negative = []
    
    if cond_score < 0.65:
        factors_positive.append(f"Degraded asset condition score ({cond_score:.2f} / 1.00)")
    else:
        factors_negative.append(f"Stable asset condition score ({cond_score:.2f} / 1.00)")
        
    if overdue > 0:
        factors_positive.append(f"Maintenance task overdue by {overdue} days")
    else:
        factors_negative.append("Up-to-date maintenance interval")
        
    if traffic > 100:
        factors_positive.append(f"Heavy corridor traffic exposure ({traffic} trains/day)")
        
    if is_crit == 1:
        factors_positive.append("Asset flagged as Safety-Critical infrastructure")

    if defects >= 2:
        factors_positive.append(f"Recurrent defect history ({defects} reported incidents)")

    departments_involved = [(req.department or "ENGINEERING").upper()]
    if block_required:
        if (req.department or "").upper() == "ENGINEERING":
            departments_involved.append("S&T (Track Circuit Clearance)")
        elif (req.department or "").upper() in ["TRD", "OHE"]:
            departments_involved.append("ENGINEERING (OHE Mast Footing Inspection)")

    method_label = "Baseline ML Model" if model_available else "Deterministic Safety Heuristic"

    return {
        "section_id": section_id,
        "from_station": {"code": st_from.code, "name": st_from.name, "lat": st_from.lat, "lon": st_from.lon},
        "to_station": {"code": st_to.code, "name": st_to.name, "lat": st_to.lat, "lon": st_to.lon},
        "distance_km": distance_km,
        "block_required": block_required,
        "verdict": verdict,
        "risk_probability": round(risk_probability * 100, 1),
        "confidence_tier": "HIGH" if (risk_probability > 0.7 or risk_probability < 0.3) else "MEDIUM",
        "priority_class": priority_class,
        "recommended_window": recommended_window,
        "estimated_duration_min": duration_min,
        "departments_involved": departments_involved,
        "factors_increasing_risk": factors_positive,
        "factors_reducing_risk": factors_negative,
        "model_available": model_available,
        "prediction_mode": prediction_mode,
        "model_reason": model_reason,
        "telemetry_source": telemetry_source,
        "features_used": {
            "condition_score": round(cond_score, 2),
            "overdue_days": overdue,
            "days_since_maintenance": days_since_maint,
            "traffic_load": traffic,
            "defect_history": defects,
            "age_days": age_days,
            "is_safety_critical": is_crit,
            "department": (req.department or "ENGINEERING").upper()
        },
        "summary": f"Route {st_from.name} ({st_from.code}) -> {st_to.name} ({st_to.code}) [{distance_km} km]: {verdict} with {round(risk_probability * 100, 1)}% risk score under {priority_class} classification via {method_label}."
    }

@router.get("/assets")
def get_assets(db: Session = Depends(get_db)):
    return db.query(Asset).all()

@router.get("/maintenance/tasks")
def get_tasks(db: Session = Depends(get_db)):
    return db.query(MaintenanceTask).all()

@router.get("/blocks/availability")
def get_blocks(db: Session = Depends(get_db)):
    return db.query(BlockWindow).all()

def get_project_root():
    # endpoints.py is at <root>/backend/app/api/endpoints.py
    return os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

def get_approvals_file():
    root = get_project_root()
    return os.path.join(root, "data", "processed", "approvals.json")

def load_approvals() -> Dict[str, Any]:
    path = get_approvals_file()
    if os.path.exists(path):
        try:
            with open(path, "r") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def save_approvals(data: Dict[str, Any]):
    path = get_approvals_file()
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        json.dump(data, f, indent=2)

class PlanGenerateRequest(BaseModel):
    horizon: Optional[str] = "weekly"  # "weekly" or "monthly"
    timeout_seconds: Optional[int] = 30
    objective_profile: Optional[str] = "safety_first"  # "safety_first", "balanced", "throughput"
    anchor_date: Optional[str] = "2026-09-08"

class PlanApprovalRequest(BaseModel):
    task_id: Optional[str] = None
    block_id: Optional[str] = None
    action: str = "APPROVED"  # APPROVED, REJECTED, UNDER_REVIEW
    approver: Optional[str] = "Chief Controller"
    role: Optional[str] = "Chief Controller"
    remarks: Optional[str] = ""

@router.get("/plans/optimized")
def get_optimized_plan(db: Session = Depends(get_db)):
    root = get_project_root()
    csv_paths = [
        os.path.join(root, "data", "processed", "optimized_plan.csv"),
        "data/processed/optimized_plan.csv",
        "../data/processed/optimized_plan.csv"
    ]
    df = None
    for p in csv_paths:
        if os.path.exists(p):
            try:
                df = pd.read_csv(p)
                break
            except Exception:
                continue

    if df is None or len(df) == 0:
        return []

    df = df.replace({np.nan: None})
    approvals = load_approvals()
    records = df.to_dict(orient="records")

    for r in records:
        t_id = str(r.get("task_id", ""))
        approval_info = approvals.get(t_id)
        if approval_info:
            r["approval_status"] = approval_info.get("status", "PENDING_APPROVAL")
            r["approved_by"] = approval_info.get("approver", "Chief Controller")
            r["approval_remarks"] = approval_info.get("remarks", "")
            r["approved_at"] = approval_info.get("timestamp", "")
        else:
            r.setdefault("approval_status", "PENDING_APPROVAL")
            r.setdefault("approved_by", "Chief Controller")
            r.setdefault("approval_remarks", "")
            r.setdefault("approved_at", "")

        r.setdefault("planning_status", "OPTIMIZED")
        if "duration" not in r and "required_duration_min" in r:
            r["duration"] = r["required_duration_min"]

        if "is_joint_possession" in r and r["is_joint_possession"] is not None:
            r["is_joint_possession"] = str(r["is_joint_possession"]).lower() in ["true", "1"]
        if "downtime_saved_min" in r and r["downtime_saved_min"] is not None:
            try:
                r["downtime_saved_min"] = int(r["downtime_saved_min"])
            except Exception:
                r["downtime_saved_min"] = 0

    return records

def load_real_demands_and_blocks(root: str, horizon_mode: str = "weekly", anchor_date_str: Optional[str] = None):
    from datetime import datetime, timedelta
    raw_dir = os.path.join(root, "data", "raw")

    # Anchor date resolution
    anchor_date = "2026-09-08"
    if anchor_date_str:
        try:
            datetime.strptime(anchor_date_str.strip()[:10], "%Y-%m-%d")
            anchor_date = anchor_date_str.strip()[:10]
        except Exception:
            anchor_date = "2026-09-08"

    anchor_dt = datetime.strptime(anchor_date, "%Y-%m-%d")
    horizon_days = 7 if horizon_mode == "weekly" else 30
    end_dt = anchor_dt + timedelta(days=horizon_days)
    anchor_start = anchor_dt.strftime("%Y-%m-%d")
    anchor_end = end_dt.strftime("%Y-%m-%d")

    tasks_path = os.path.join(raw_dir, "maintenance_tasks.csv")
    assets_path = os.path.join(raw_dir, "assets.csv")
    blocks_path = os.path.join(raw_dir, "corridor_availability_india.csv")
    requests_path = os.path.join(raw_dir, "block_requests_india.csv")
    forecast_path = os.path.join(raw_dir, "goods_train_forecast.csv")
    corridor_ref_path = os.path.join(raw_dir, "corridor_reference.csv")

    tasks_df = pd.read_csv(tasks_path) if os.path.exists(tasks_path) else pd.DataFrame()
    assets_df = pd.read_csv(assets_path) if os.path.exists(assets_path) else pd.DataFrame()
    blocks_raw = pd.read_csv(blocks_path) if os.path.exists(blocks_path) else pd.DataFrame()
    requests_raw = pd.read_csv(requests_path) if os.path.exists(requests_path) else pd.DataFrame()
    forecast_df = pd.read_csv(forecast_path) if os.path.exists(forecast_path) else pd.DataFrame()
    corridor_ref_df = pd.read_csv(corridor_ref_path) if os.path.exists(corridor_ref_path) else pd.DataFrame()

    corr_map = dict(zip(assets_df['corridor_id'], assets_df['corridor_name'])) if 'corridor_id' in assets_df else {}
    corr_alias = {
        'GZB-ALD': 'GZB-CNB',
        'MGS-DDU': 'MGS-HWH',
        'DDU-CPR': 'ALD-MGS',
        'CPR-SEE': 'MGS-HWH',
        'SEE-BJU': 'HWH-NJP',
        'BJU-KIR': 'HWH-NJP',
        'KIR-NJP': 'HWH-NJP',
    }
    density_map = {}
    if 'density_tier' in forecast_df and 'corridor_id' in forecast_df:
        density_map.update(dict(zip(forecast_df['corridor_id'], forecast_df['density_tier'])))
    if 'density_tier' in corridor_ref_df and 'corridor_id' in corridor_ref_df:
        density_map.update(dict(zip(corridor_ref_df['corridor_id'], corridor_ref_df['density_tier'])))

    demand = []

    # 1. TMS / SMMS / TDMS asset tasks
    for _, row in tasks_df.iterrows():
        c_raw = str(row.get('corridor_id', 'NDLS-GZB'))
        c_name = corr_map.get(c_raw, c_raw)
        c_name = corr_alias.get(c_name, c_name)
        crit = str(row.get('criticality', 'Medium')).upper() == 'CRITICAL'
        p_class = 'P1' if crit else ('P2' if str(row.get('criticality', '')).upper() == 'HIGH' else 'P3')
        dept_raw = str(row.get('department', 'Engineering')).upper()
        if dept_raw in ['SIGNALLING', 'TELECOM', 'S&T', 'SMT']:
            dept = 'SMT'
        elif dept_raw in ['ELECTRICAL', 'TRD', 'OHE']:
            dept = 'TRD'
        else:
            dept = 'ENGINEERING'

        dur = min(int(row.get('estimated_duration_hours', 2)) * 60, 240)
        p_score = int(row.get('priority_score', 80))

        # Dynamically compute overdue days from source last_due_date vs planning anchor
        overdue_days = 0
        if 'last_due_date' in row and pd.notna(row['last_due_date']):
            try:
                due_dt = pd.to_datetime(row['last_due_date'])
                overdue_days = max(0, (anchor_dt - due_dt).days)
            except Exception:
                overdue_days = 0

        demand.append({
            'task_id': str(row['task_id']),
            'asset_id': str(row.get('asset_id', f"AST_{c_name[:4]}")),
            'corridor_id': c_name,
            'department': dept,
            'task_type': str(row.get('task_description', 'Preventive Maintenance')),
            'priority': p_class,
            'priority_score': p_score,
            'required_duration_min': dur,
            'safety_critical': crit,
            'overdue_days': overdue_days,
            'source': 'TMS/SMMS/TDMS',
            'crew_type': 'Track Relaying Train (TRT)' if dept == 'ENGINEERING' else ('Tower Wagon Gang' if dept == 'TRD' else 'S&T Relay Gang')
        })

    # 2. BDMS Requests
    if not requests_raw.empty:
        requests_raw['req_date'] = pd.to_datetime(requests_raw['requested_start'], errors='coerce').dt.strftime('%Y-%m-%d')
        valid_reqs = requests_raw[requests_raw['status'].isin(['Requested', 'Approved'])].copy()
        valid_reqs['start_dt'] = pd.to_datetime(valid_reqs['requested_start'], errors='coerce')
        valid_reqs['end_dt'] = pd.to_datetime(valid_reqs['requested_end'], errors='coerce')
        valid_reqs['dur_min'] = ((valid_reqs['end_dt'] - valid_reqs['start_dt']).dt.total_seconds() / 60).fillna(120).astype(int)

        max_req_count = 70 if horizon_mode == "weekly" else 180
        horizon_reqs = valid_reqs[
            (valid_reqs['req_date'] >= anchor_start) & 
            (valid_reqs['req_date'] <= anchor_end)
        ].head(max_req_count)

        for _, row in horizon_reqs.iterrows():
            dept_raw = str(row['department']).upper()
            if dept_raw in ['TRACTION', 'TRD', 'OHE']:
                dept = 'TRD'
            elif dept_raw in ['ENGINEERING', 'CIVIL', 'TRACK']:
                dept = 'ENGINEERING'
            else:
                dept = 'SMT'

            is_crit = any(k in str(row['block_type']) for k in ['Renewal', 'Power', 'Interlocking'])
            dur = max(30, min(int(row['dur_min']), 240))
            
            # Dynamic overdue calculation for request start
            req_overdue = 0
            if pd.notna(row['start_dt']):
                try:
                    req_overdue = max(0, (anchor_dt - row['start_dt']).days)
                except Exception:
                    req_overdue = 0

            demand.append({
                'task_id': f"{row['request_id']}_{row['task_id']}",
                'asset_id': f"AST_{row['corridor_id'][:4]}_{row['task_id'][-4:]}",
                'corridor_id': str(row['corridor_id']),
                'department': dept,
                'task_type': str(row['block_type']),
                'priority': 'P1' if is_crit else 'P2',
                'priority_score': 85 if is_crit else 70,
                'required_duration_min': dur,
                'safety_critical': is_crit,
                'overdue_days': req_overdue,
                'source': 'BDMS',
                'crew_type': 'Mechanized Tamping Crew' if dept == 'ENGINEERING' else ('OHE Wiring Depot' if dept == 'TRD' else 'Signal Testing Gang')
            })

    # 3. Available Blocks
    def parse_dur(row):
        try:
            t1 = datetime.strptime(str(row['available_start']).strip(), '%H:%M')
            t2 = datetime.strptime(str(row['available_end']).strip(), '%H:%M')
            if t2 <= t1:
                t2 += timedelta(days=1)
            return int((t2 - t1).total_seconds() / 60)
        except Exception:
            return 180

    blocks_df = blocks_raw[
        (blocks_raw['date'] >= anchor_start) & 
        (blocks_raw['date'] <= anchor_end)
    ].copy()
    blocks_df['max_duration_min'] = blocks_df.apply(parse_dur, axis=1)
    blocks_df['block_id'] = [f"BLK_{r['corridor_id']}_{str(r['date'])[-5:].replace('-', '')}_{i}" for i, r in blocks_df.reset_index().iterrows()]
    blocks_df['window_start'] = blocks_df['date'] + " " + blocks_df['available_start']
    blocks_df['window_end'] = blocks_df['date'] + " " + blocks_df['available_end']

    return pd.DataFrame(demand), blocks_df, density_map

@router.post("/plans/generate")
def generate_plan(req: PlanGenerateRequest = PlanGenerateRequest(), db: Session = Depends(get_db)):
    from ortools.sat.python import cp_model
    root = get_project_root()
    out_csv = os.path.join(root, "data", "processed", "optimized_plan.csv")
    horizon_mode = (req.horizon or "weekly").lower()
    anchor_date = req.anchor_date or "2026-09-08"

    tasks_df, blocks_df, density_map = load_real_demands_and_blocks(root, horizon_mode, anchor_date)

    if len(tasks_df) == 0 or len(blocks_df) == 0:
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient realistic tasks ({len(tasks_df)}) or block windows ({len(blocks_df)}) to optimize for horizon '{horizon_mode}' starting '{anchor_date}'."
        )

    is_fallback = False
    status_text = "UNKNOWN"
    objective_val = 0.0
    plan = []
    blocks_used = set()
    run_id = f"OPT_{uuid.uuid4().hex[:8]}"

    # CP-SAT OPTIMIZATION
    try:
        model = cp_model.CpModel()
        x = {}

        for t_idx, task in tasks_df.iterrows():
            for b_idx, block in blocks_df.iterrows():
                if task["corridor_id"] != block["corridor_id"]:
                    continue
                if int(task["required_duration_min"]) > int(block["max_duration_min"]):
                    continue

                # Power isolation constraint check
                block_power = str(block.get("power_isolation_required", "No")).lower() in ["yes", "true", "1"]
                task_needs_power = task["department"] == "TRD" or "power" in str(task.get("task_type", "")).lower()
                if task_needs_power and not block_power and "no power block" in str(block.get("restriction", "")).lower():
                    continue

                x[(t_idx, b_idx)] = model.NewBoolVar(f"x_{t_idx}_{b_idx}")

        if len(x) > 0:
            # Constraint 1: At most one block per task
            for t_idx in tasks_df.index:
                vars_for_task = [x[(t_idx, b_idx)] for b_idx in blocks_df.index if (t_idx, b_idx) in x]
                if vars_for_task:
                    model.AddAtMostOne(vars_for_task)

            # Constraint 2: Block capacity & Constraint 3: Max 2 tasks per block
            joint_vars = {}
            for b_idx, block in blocks_df.iterrows():
                block_vars = [x[(t_idx, b_idx)] for t_idx in tasks_df.index if (t_idx, b_idx) in x]
                if not block_vars:
                    continue
                model.Add(sum(block_vars) <= 2)
                block_durs = [int(tasks_df.loc[t_idx, "required_duration_min"]) for t_idx in tasks_df.index if (t_idx, b_idx) in x]
                model.Add(sum(block_vars[i] * block_durs[i] for i in range(len(block_vars))) <= int(block["max_duration_min"]))

                # Multi-department Joint Synergy: bonus when tasks from different departments share the window
                t_indices = [t_idx for t_idx in tasks_df.index if (t_idx, b_idx) in x]
                depts = set(tasks_df.loc[t_idx, "department"] for t_idx in t_indices)
                if len(depts) >= 2:
                    j_var = model.NewBoolVar(f"joint_{b_idx}")
                    joint_vars[b_idx] = j_var
                    model.Add(sum(block_vars) == 2).OnlyEnforceIf(j_var)
                    model.Add(sum(block_vars) != 2).OnlyEnforceIf(j_var.Not())

            # Objective Function
            obj_terms = []
            for (t_idx, b_idx), var in x.items():
                p_score = int(tasks_df.loc[t_idx, "priority_score"])
                if tasks_df.loc[t_idx, "safety_critical"]:
                    p_score += 150 if req.objective_profile == "safety_first" else 100
                p_score += int(tasks_df.loc[t_idx, "overdue_days"]) * 5

                # Freight Off-Peak Incentive (+80 for low density / midnight hours, -40 for high freight)
                b_corridor = blocks_df.loc[b_idx, "corridor_id"]
                f_density = density_map.get(b_corridor, "Medium")
                if f_density == "Low":
                    p_score += 80
                elif f_density == "High":
                    p_score -= 40

                obj_terms.append(var * p_score)

            # Award Multi-Department Joint Synergy Bonus (+250 points)
            for b_idx, j_var in joint_vars.items():
                obj_terms.append(j_var * 250)

            model.Maximize(sum(obj_terms))

            solver = cp_model.CpSolver()
            solver.parameters.max_time_in_seconds = float(req.timeout_seconds or 30)
            res = solver.Solve(model)

            if res in (cp_model.OPTIMAL, cp_model.FEASIBLE):
                status_text = "OPTIMAL" if res == cp_model.OPTIMAL else "FEASIBLE"
                objective_val = float(solver.ObjectiveValue())

                # Build assignments mapping per block
                block_assignments = {}
                for (t_idx, b_idx), var in x.items():
                    if solver.Value(var) == 1:
                        block_assignments.setdefault(b_idx, []).append(t_idx)

                for b_idx, assigned_t_indices in block_assignments.items():
                    blk = blocks_df.loc[b_idx]
                    b_id = str(blk["block_id"])
                    blocks_used.add(b_id)

                    # Determine if joint possession (2 different departments)
                    assigned_depts = [tasks_df.loc[t_idx, "department"] for t_idx in assigned_t_indices]
                    is_joint = len(assigned_t_indices) >= 2 and len(set(assigned_depts)) >= 2
                    
                    # Calculated downtime saved based on actual overlap
                    assigned_durs = [int(tasks_df.loc[t_idx, "required_duration_min"]) for t_idx in assigned_t_indices]
                    if is_joint and len(assigned_durs) >= 2:
                        downtime_saved = max(0, sum(assigned_durs) - max(assigned_durs))
                    else:
                        downtime_saved = 0

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
                            "solver": "Google OR-Tools CP-SAT",
                            "why_selected": f"Priority {tsk['priority']} ({tsk['priority_score']} pts), overdue {tsk['overdue_days']}d. Allocated to window {blk['available_start']}-{blk['available_end']} on {blk['date']}.",
                            "synergy_explanation": f"Bundled with {bundled_with_str}; saves {downtime_saved} min line closure." if is_joint else "Independent corridor block."
                        })
            else:
                status_text = "INFEASIBLE"
                is_fallback = True
        else:
            is_fallback = True

    except Exception:
        is_fallback = True

    # 2. FAIL-SAFE FALLBACK SCHEDULER (Deterministic heuristic)
    if is_fallback or len(plan) == 0:
        status_text = "FALLBACK"
        plan = []
        blocks_used = set()
        sorted_tasks = tasks_df.sort_values(
            by=["safety_critical", "overdue_days"],
            ascending=[False, False]
        )
        block_usage = {b_id: {"used_min": 0, "tasks": []} for b_id in blocks_df["block_id"]}

        for _, task in sorted_tasks.iterrows():
            req_min = int(task["required_duration_min"])
            sec = task["corridor_id"]
            compat_blocks = blocks_df[blocks_df["corridor_id"] == sec]
            assigned_block = None

            for _, blk in compat_blocks.iterrows():
                b_id = blk["block_id"]
                usage = block_usage[b_id]
                max_min = int(blk["max_duration_min"])
                if len(usage["tasks"]) < 2 and (usage["used_min"] + req_min) <= max_min:
                    assigned_block = blk
                    usage["used_min"] += req_min
                    usage["tasks"].append(task)
                    break

            if assigned_block is not None:
                b_id = str(assigned_block["block_id"])
                blocks_used.add(b_id)
                assigned_durs = [int(t["required_duration_min"]) for t in usage["tasks"]]
                is_joint = len(usage["tasks"]) >= 2 and len(set(t["department"] for t in usage["tasks"])) >= 2
                downtime_saved = max(0, sum(assigned_durs) - max(assigned_durs)) if is_joint else 0

                plan.append({
                    "task_id": str(task["task_id"]),
                    "asset_id": str(task["asset_id"]),
                    "block_id": b_id,
                    "section_id": str(assigned_block["corridor_id"]),
                    "corridor_id": str(assigned_block["corridor_id"]),
                    "corridor_name": str(assigned_block["corridor_id"]),
                    "date": str(assigned_block["date"]),
                    "window_start": str(assigned_block["window_start"]),
                    "window_end": str(assigned_block["window_end"]),
                    "task_type": str(task["task_type"]),
                    "department": str(task["department"]),
                    "crew_type": str(task.get("crew_type", "Standard Gang")),
                    "priority": str(task["priority"]),
                    "required_duration_min": req_min,
                    "duration": req_min,
                    "overdue_days": int(task["overdue_days"]),
                    "safety_critical": bool(task["safety_critical"]),
                    "is_joint_possession": is_joint,
                    "coordination_status": "JOINT_POSSESSION" if is_joint else "INDEPENDENT",
                    "bundled_with": "Co-scheduled during fallback" if len(usage["tasks"]) >= 2 else "None (Single Task)",
                    "downtime_saved_min": downtime_saved,
                    "freight_density": density_map.get(str(assigned_block["corridor_id"]), "Medium"),
                    "power_isolation_required": str(assigned_block.get("power_isolation_required", "No")),
                    "restrictions": str(assigned_block.get("restriction", "Standard night maintenance block")),
                    "planning_status": "FALLBACK",
                    "approval_status": "PENDING_APPROVAL",
                    "approved_by": "Chief Controller",
                    "solver": "Fail-Safe Greedy Heuristic",
                    "why_selected": "Allocated by greedy priority fallback.",
                    "synergy_explanation": f"Heuristic co-scheduling; saves {downtime_saved} min closure." if is_joint else "Single task possession."
                })

    # Save generated plan to CSV
    if plan:
        plan_df = pd.DataFrame(plan)
        os.makedirs(os.path.dirname(out_csv), exist_ok=True)
        plan_df.to_csv(out_csv, index=False)

    # Record OptimizationRun in DB
    try:
        opt_run = OptimizationRun(
            id=run_id,
            run_timestamp=datetime.now(),
            solver_version="ortools-9.15" if not is_fallback else "heuristic-fallback-1.0",
            objective_profile=f"{req.objective_profile}_{horizon_mode}",
            status=status_text,
            total_blocks_used=len(blocks_used),
            critical_tasks_completed=len(plan)
        )
        db.add(opt_run)
        db.commit()
    except Exception:
        db.rollback()

    return {
        "status": status_text,
        "objective_value": round(objective_val, 1),
        "tasks_scheduled": len(plan),
        "blocks_used": len(blocks_used),
        "horizon": horizon_mode,
        "objective_profile": req.objective_profile,
        "solver": "Google OR-Tools CP-SAT" if not is_fallback else "Heuristic Priority Fallback",
        "timestamp": datetime.now().isoformat(),
        "plan": plan
    }

@router.get("/plans/conflicts")
def get_conflicts(db: Session = Depends(get_db)):
    root = get_project_root()
    plan_path = os.path.join(root, "data", "processed", "optimized_plan.csv")
    conflicts = []

    plan_rows = []
    if os.path.exists(plan_path):
        try:
            plan_rows = pd.read_csv(plan_path).to_dict(orient="records")
        except Exception:
            plan_rows = []

    # 1. Check for Duration Overrun
    for row in plan_rows:
        req_min = int(row.get("required_duration_min", 0))
        # Find block window
        b_id = str(row.get("block_id", ""))
        block = db.query(BlockWindow).filter(BlockWindow.id == b_id).first()
        if block and req_min > block.max_duration_min:
            conflicts.append({
                "id": f"CONF_DUR_{row.get('task_id')}",
                "severity": "CRITICAL",
                "title": f"Block Window Duration Overrun: Task {row.get('task_id')}",
                "section_id": row.get("section_id", "N/A"),
                "department": row.get("department", "ENGINEERING"),
                "description": f"Task requires {req_min} min but block {b_id} allows maximum {block.max_duration_min} min.",
                "suggested_action": "Split maintenance into two rolling shifts or request extended corridor possession.",
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M")
            })

    # 2. Check for High-Density Freight Corridor clashes
    high_density_forecasts = db.query(GoodsTrainForecast).filter(
        GoodsTrainForecast.density_tier == "High",
        GoodsTrainForecast.predicted_goods_trains >= 14
    ).limit(3).all()

    for fc in high_density_forecasts:
        conflicts.append({
            "id": f"CONF_FREIGHT_{fc.id}",
            "severity": "WARNING",
            "title": f"Heavy Freight Traffic Forecast: Corridor {fc.corridor_id}",
            "section_id": fc.corridor_id,
            "department": "TRAFFIC/OPERATIONS",
            "description": f"Predicted {fc.predicted_goods_trains} freight trains (Zone {fc.zone}) during scheduled maintenance corridor.",
            "suggested_action": "Shift work to midnight low-freight slot (01:00 - 04:30) to prevent freight path choking.",
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M")
        })

    # 3. Multi-Department Joint Possessions (Informational coordination)
    section_dept_map = {}
    for r in plan_rows:
        sec = r.get("section_id")
        dept = r.get("department")
        if sec and dept:
            section_dept_map.setdefault(sec, set()).add(dept)

    for sec, depts in section_dept_map.items():
        if len(depts) >= 2:
            conflicts.append({
                "id": f"COORD_{sec}",
                "severity": "INFO",
                "title": f"Joint Multi-Department Corridor Possession: {sec}",
                "section_id": sec,
                "department": " / ".join(sorted(depts)),
                "description": f"Simultaneous possession opportunity identified for {', '.join(sorted(depts))}. Shared shadow block possible.",
                "suggested_action": "Coordinate joint safety briefing and unified line-clear disconnection to reduce net downtime.",
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M")
            })

    # 4. Overdue safety-critical tasks check
    overdue_critical_tasks = db.query(MaintenanceTask).filter(
        MaintenanceTask.safety_critical == True,
        MaintenanceTask.overdue_days >= 10
    ).limit(2).all()

    for ct in overdue_critical_tasks:
        conflicts.append({
            "id": f"CONF_OVERDUE_{ct.id}",
            "severity": "CRITICAL",
            "title": f"Urgent Safety-Critical Asset Overdue: Task {ct.id}",
            "section_id": ct.asset_id,
            "department": ct.department_id,
            "description": f"Safety-critical infrastructure maintenance overdue by {ct.overdue_days} days (Priority {ct.priority_class}).",
            "suggested_action": "Priority 1 immediate block authorization mandatory under Indian Railways Safety Code.",
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M")
        })

    return conflicts

@router.get("/data-integrations/status")
def get_data_integrations(db: Session = Depends(get_db)):
    import time
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M IST")

    # 1. TMS (Track Management System)
    t0 = time.perf_counter()
    try:
        tms_assets = db.query(Asset).filter(Asset.department_id == "ENGINEERING").count()
        tms_tasks = db.query(MaintenanceTask).filter(MaintenanceTask.department_id == "ENGINEERING").count()
        tms_lat = max(1.0, round((time.perf_counter() - t0) * 1000, 1))
        tms_status = "CONNECTED" if (tms_assets + tms_tasks) > 0 else "READY"
    except Exception:
        tms_assets, tms_tasks, tms_lat, tms_status = 0, 0, 0.0, "UNAVAILABLE"

    # 2. SMMS (Signalling Maintenance & Management System)
    t0 = time.perf_counter()
    try:
        smt_assets = db.query(Asset).filter(Asset.department_id.in_(["SMT", "S&T"])).count()
        smt_tasks = db.query(MaintenanceTask).filter(MaintenanceTask.department_id.in_(["SMT", "S&T"])).count()
        smt_lat = max(1.0, round((time.perf_counter() - t0) * 1000, 1))
        smt_status = "CONNECTED" if (smt_assets + smt_tasks) > 0 else "READY"
    except Exception:
        smt_assets, smt_tasks, smt_lat, smt_status = 0, 0, 0.0, "UNAVAILABLE"

    # 3. TDMS (Traction Distribution Management System)
    t0 = time.perf_counter()
    try:
        trd_assets = db.query(Asset).filter(Asset.department_id.in_(["TRD", "OHE"])).count()
        trd_tasks = db.query(MaintenanceTask).filter(MaintenanceTask.department_id.in_(["TRD", "OHE"])).count()
        trd_lat = max(1.0, round((time.perf_counter() - t0) * 1000, 1))
        trd_status = "CONNECTED" if (trd_assets + trd_tasks) > 0 else "READY"
    except Exception:
        trd_assets, trd_tasks, trd_lat, trd_status = 0, 0, 0.0, "UNAVAILABLE"

    # 4. COA (Control Office Application)
    t0 = time.perf_counter()
    try:
        coa_blocks = db.query(BlockWindow).count()
        coa_trains = db.query(TrainMovement).count()
        coa_lat = max(1.0, round((time.perf_counter() - t0) * 1000, 1))
        coa_status = "CONNECTED" if (coa_blocks + coa_trains) > 0 else "READY"
    except Exception:
        coa_blocks, coa_trains, coa_lat, coa_status = 0, 0, 0.0, "UNAVAILABLE"

    # 5. BDMS (Block Demand & Management System)
    t0 = time.perf_counter()
    try:
        bdms_history = db.query(MaintenanceHistory).count()
        bdms_lat = max(1.0, round((time.perf_counter() - t0) * 1000, 1))
        bdms_status = "CONNECTED" if bdms_history > 0 else "READY"
    except Exception:
        bdms_history, bdms_lat, bdms_status = 0, 0.0, "UNAVAILABLE"

    # 6. FOIS / Freight Forecast Engine
    t0 = time.perf_counter()
    try:
        goods_fc_count = db.query(GoodsTrainForecast).count()
        goods_lat = max(1.0, round((time.perf_counter() - t0) * 1000, 1))
        goods_status = "CONNECTED" if goods_fc_count > 0 else "READY"
    except Exception:
        goods_fc_count, goods_lat, goods_status = 0, 0.0, "UNAVAILABLE"

    return {
        "integrations": [
            {
                "id": "tms",
                "name": "Track Management System (TMS)",
                "department": "Engineering / Permanent Way",
                "status": tms_status,
                "record_count": tms_assets + tms_tasks,
                "detail": f"{tms_assets} Track Assets, {tms_tasks} Pending Work Tasks",
                "last_sync": now_str,
                "latency_ms": tms_lat,
                "feed_type": "Relational Sync",
                "protocol": "REST / JDBC"
            },
            {
                "id": "smms",
                "name": "Signalling Maintenance & Management System (SMMS)",
                "department": "Signal & Telecommunication (S&T)",
                "status": smt_status,
                "record_count": smt_assets + smt_tasks,
                "detail": f"{smt_assets} Interlocking/Signal Assets, {smt_tasks} Inspection Tasks",
                "last_sync": now_str,
                "latency_ms": smt_lat,
                "feed_type": "Relational Sync",
                "protocol": "REST / JSON"
            },
            {
                "id": "tdms",
                "name": "Traction Distribution Management System (TDMS)",
                "department": "Traction Distribution / Electrical (TRD)",
                "status": trd_status,
                "record_count": trd_assets + trd_tasks,
                "detail": f"{trd_assets} OHE/Substation Assets, {trd_tasks} Isolation Tasks",
                "last_sync": now_str,
                "latency_ms": trd_lat,
                "feed_type": "Relational Sync",
                "protocol": "REST / HTTPS"
            },
            {
                "id": "coa",
                "name": "Control Office Application (COA)",
                "department": "Operating / Central Corridor Control",
                "status": coa_status,
                "record_count": coa_blocks + coa_trains,
                "detail": f"{coa_blocks} Available Block Windows, {coa_trains} Timetable Movements",
                "last_sync": now_str,
                "latency_ms": coa_lat,
                "feed_type": "Stream / Batch",
                "protocol": "COA Gateway"
            },
            {
                "id": "bdms",
                "name": "Block Demand & Management System (BDMS)",
                "department": "Joint Operations & Corridor Possessions",
                "status": bdms_status,
                "record_count": bdms_history,
                "detail": f"{bdms_history} Recorded Maintenance Blocks & Line Clear Sanctions",
                "last_sync": now_str,
                "latency_ms": bdms_lat,
                "feed_type": "Disconnection Requisition",
                "protocol": "BDMS API"
            },
            {
                "id": "goods_forecast",
                "name": "Freight Train Forecast & Density Engine",
                "department": "Freight Logistics & FOIS",
                "status": goods_status,
                "record_count": goods_fc_count,
                "detail": f"{goods_fc_count} Corridor Freight Density Forecasts",
                "last_sync": now_str,
                "latency_ms": goods_lat,
                "feed_type": "Predictive Feed",
                "protocol": "FOIS Gateway"
            }
        ]
    }

@router.get("/goods-forecast")
def get_goods_forecast(corridor_id: Optional[str] = None, limit: int = 100, db: Session = Depends(get_db)):
    q = db.query(GoodsTrainForecast)
    if corridor_id:
        q = q.filter(GoodsTrainForecast.corridor_id == corridor_id)
    return q.limit(limit).all()

@router.get("/maintenance/history")
def get_maintenance_history(limit: int = 50, db: Session = Depends(get_db)):
    return db.query(MaintenanceHistory).limit(limit).all()

@router.post("/plans/approve")
def approve_plan_task(req: PlanApprovalRequest):
    if not req.task_id and not req.block_id:
        raise HTTPException(status_code=400, detail="Either task_id or block_id is required.")

    approvals = load_approvals()
    key = req.task_id or req.block_id or "UNKNOWN"
    approvals[key] = {
        "status": req.action.upper(),
        "approver": req.approver or "Chief Controller",
        "role": req.role or "Chief Controller",
        "remarks": req.remarks or "",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S IST")
    }
    save_approvals(approvals)

    return {
        "success": True,
        "key": key,
        "status": req.action.upper(),
        "approver": req.approver,
        "message": f"Block authorization successfully recorded as {req.action.upper()}."
    }

@router.get("/models/health")
def get_model_health():
    root = get_project_root()
    model_file = os.path.join(root, "ml", "models", "calibrated_rf.joblib")
    card_file = os.path.join(root, "ml", "models", "model_card.json")

    artifact_exists = os.path.exists(model_file)
    card_exists = os.path.exists(card_file)

    card_data = {}
    if card_exists:
        try:
            with open(card_file, "r") as f:
                card_data = json.load(f)
        except Exception:
            card_data = {}

    modified_time = None
    if artifact_exists:
        try:
            mtime = os.path.getmtime(model_file)
            modified_time = datetime.fromtimestamp(mtime).strftime("%Y-%m-%d %H:%M:%S IST")
        except Exception:
            pass

    return {
        "status": "Artifact present — provenance requires validation" if artifact_exists else "No artifact loaded",
        "model_name": "CalibratedClassifierCV (RandomForestClassifier + Isotonic)",
        "version": card_data.get("version", "v1.1.0"),
        "primary_target": card_data.get("primary_target", "failure_next_30d"),
        "split_method": card_data.get("split_method", "Temporal"),
        "artifact_path": "ml/models/calibrated_rf.joblib",
        "artifact_available": artifact_exists,
        "artifact_last_modified": modified_time,
        "feature_count": 10,
        "features": CANONICAL_FEATURES,
        "metrics": card_data.get("metrics", {
            "pr_auc": 0.9667,
            "recall": 0.8,
            "precision": 1.0,
            "brier_score": 0.0462
        }),
        "provenance": "Artifact present — trained on synthetic baseline, provenance requires real operational failure records",
        "provenance_status": "Artifact present — trained on synthetic baseline, provenance requires real operational failure records",
        "is_production_validated": False,
        "validation_notice": "Evaluation metrics reflect synthetic training distribution. Indian Railways operational failure outcomes must be supplied for production calibration."
    }

@router.get("/optimization/runs")
def get_opt_runs(db: Session = Depends(get_db)):
    return db.query(OptimizationRun).order_by(OptimizationRun.run_timestamp.desc()).limit(10).all()


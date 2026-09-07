import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json().get("status") in ["ok", "healthy"]

def test_auth_and_data_endpoints():
    # Invalid login
    bad_res = client.post("/auth/token", data={"username": "wrong", "password": "bad"})
    assert bad_res.status_code == 401

    # Valid login
    res = client.post("/auth/token", data={"username": "debosmita12@gmail.com", "password": "admin123"})
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    token = data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Test stations
    stations_res = client.get("/stations", headers=headers)
    assert stations_res.status_code == 200
    stations = stations_res.json()
    assert isinstance(stations, list)
    assert len(stations) > 0
    for s in stations[:10]:
        assert isinstance(s["lat"], (int, float))
        assert isinstance(s["lon"], (int, float))

    # Test sections
    sections_res = client.get("/sections", headers=headers)
    assert sections_res.status_code == 200
    assert isinstance(sections_res.json(), list)

    # Test maintenance tasks
    tasks_res = client.get("/maintenance/tasks", headers=headers)
    assert tasks_res.status_code == 200
    assert isinstance(tasks_res.json(), list)

    # Test assets
    assets_res = client.get("/assets", headers=headers)
    assert assets_res.status_code == 200
    assert isinstance(assets_res.json(), list)

    # Test blocks availability
    blocks_res = client.get("/blocks/availability", headers=headers)
    assert blocks_res.status_code == 200
    assert isinstance(blocks_res.json(), list)

    # Test integrations
    integrations_res = client.get("/data-integrations/status", headers=headers)
    assert integrations_res.status_code == 200
    int_data = integrations_res.json()
    assert "integrations" in int_data
    assert len(int_data["integrations"]) == 6

    # Test model health
    models_res = client.get("/models/health", headers=headers)
    assert models_res.status_code == 200
    mh = models_res.json()
    assert "status" in mh
    assert "provenance" in mh
    assert mh.get("is_production_validated") is False

def test_route_analysis():
    login_res = client.post("/auth/token", data={"username": "debosmita12@gmail.com", "password": "admin123"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    res = client.post(
        "/route/analyze",
        json={"from_station": "NDLS", "to_station": "MTJ"},
        headers=headers
    )
    assert res.status_code == 200
    data = res.json()
    assert "risk_probability" in data
    assert "verdict" in data
    assert "prediction_mode" in data

def test_plan_generation_and_approval():
    login_res = client.post("/auth/token", data={"username": "debosmita12@gmail.com", "password": "admin123"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Weekly plan generation
    gen_res = client.post(
        "/plans/generate",
        json={"horizon": "weekly", "objective_profile": "safety_first", "anchor_date": "2026-09-08"},
        headers=headers
    )
    assert gen_res.status_code == 200
    data = gen_res.json()
    assert data["status"] in ["OPTIMAL", "FEASIBLE", "HEURISTIC_FALLBACK"]
    assert "plan" in data
    plan = data["plan"]
    assert isinstance(plan, list)
    assert len(plan) > 0

    # Approval endpoint test
    first_task = plan[0]
    task_id = first_task["task_id"]
    approve_res = client.post(
        "/plans/approve",
        json={
            "task_id": task_id,
            "action": "APPROVED",
            "approver": "Chief Controller",
            "role": "Chief Controller",
            "remarks": "Test automated sign-off"
        },
        headers=headers
    )
    assert approve_res.status_code == 200
    assert approve_res.json().get("success") is True
    assert approve_res.json().get("status") == "APPROVED"

    # Reject workflow test
    reject_res = client.post(
        "/plans/approve",
        json={
            "task_id": task_id,
            "action": "REJECTED",
            "approver": "Section Controller",
            "role": "Section Controller",
            "remarks": "Peak corridor traffic congestion"
        },
        headers=headers
    )
    assert reject_res.status_code == 200
    assert reject_res.json().get("status") == "REJECTED"

def test_monthly_plan_and_auxiliary_endpoints():
    login_res = client.post("/auth/token", data={"username": "debosmita12@gmail.com", "password": "admin123"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Monthly plan generation
    gen_res = client.post(
        "/plans/generate",
        json={"horizon": "monthly", "objective_profile": "balanced", "anchor_date": "2026-09-08"},
        headers=headers
    )
    assert gen_res.status_code == 200
    data = gen_res.json()
    assert data["status"] in ["OPTIMAL", "FEASIBLE", "HEURISTIC_FALLBACK"]
    assert "plan" in data
    assert len(data["plan"]) > 50

    # Conflicts endpoint
    conflicts_res = client.get("/plans/conflicts", headers=headers)
    assert conflicts_res.status_code == 200
    assert isinstance(conflicts_res.json(), list)

    # Goods forecast endpoint
    gf_res = client.get("/goods-forecast?limit=50", headers=headers)
    assert gf_res.status_code == 200
    gf_list = gf_res.json()
    assert isinstance(gf_list, list)
    assert len(gf_list) > 0

    # Route analyze edge cases
    bad_station_res = client.post(
        "/route/analyze",
        json={"from_station": "NONEXISTENT", "to_station": "MTJ"},
        headers=headers
    )
    assert bad_station_res.status_code == 404

    same_station_res = client.post(
        "/route/analyze",
        json={"from_station": "NDLS", "to_station": "NDLS"},
        headers=headers
    )
    assert same_station_res.status_code == 400

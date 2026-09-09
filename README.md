# RailSamanvayAI — AI-Powered Automatic Block Planning

**Ministry:** Ministry of Railways
**Theme:** Transportation & Logistics
**Problem ID:** SIH26027

## Project Mission
Build a production-style decision-support prototype for SIH26027: "AI-Powered Automatic Block Planning to Maximize Asset Availability for Train Operations on Indian Railways."

## Architecture
- **Data Engineering**: Controlled synthetic internal railway data + real public station/timetable sources.
- **ML Pipeline**: Temporal train/validation splitting, Calibrated Classifiers to predict `future_failure_next_30d` (not just static priority).
- **Optimization**: Google OR-Tools `CP-SAT` engine to enforce hard constraints (crew limits, maximum block durations, concurrent task execution) and maximize completion of critical maintenance.
- **SaaS Backend**: `FastAPI` + `SQLite/PostgreSQL` + `Alembic` + `JWT Authentication`.
- **Frontend Dashboard**: `React` + `Tailwind` + `Leaflet` geospatial visualization.

## Setup Instructions
```bash
# 1. Start virtual environment and install dependencies
python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt

# 2. Run Database Migrations
cd backend
alembic upgrade head
cd ..

# 3. Generate Data and Run ML/Opt Pipeline
python scripts/seed_database.py
python scripts/build_features.py
python scripts/train_models.py
python scripts/run_optimizer.py

# 4. Start Servers (Frontend and Backend)
./run_all.sh
```

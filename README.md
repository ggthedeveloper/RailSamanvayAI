# RailSamanvayAI --- AI-Powered Automatic Block Planning

```{=html}
<p align="center">
```
`<strong>`{=html}Plan Smarter. Coordinate Better. Keep Railways
Moving.`</strong>`{=html}
```{=html}
</p>
```
```{=html}
<p align="center">
```
Decision-support for maintenance block planning on Indian Railways
```{=html}
</p>
```

------------------------------------------------------------------------

## Project Overview

**RailSamanvayAI** is a production-style decision-support prototype
developed for **Smart India Hackathon 2026 --- SIH26027**.

The system combines **failure-risk prediction** with **constraint-based
optimisation** to help railway controllers convert competing maintenance
requests into a coordinated, constraint-valid block plan.

Instead of treating maintenance as a static priority list,
RailSamanvayAI:

1.  Collects maintenance, asset, corridor, timetable and possession
    information.
2.  Engineers time-aware features from the available data.
3.  Predicts the likelihood of asset failure within the next 30 days.
4.  Prioritises maintenance tasks using risk-aware information.
5.  Uses Google OR-Tools CP-SAT to construct a feasible block plan under
    operational constraints.
6.  Presents the recommended plan through a controller-focused
    geospatial dashboard.

> **Important:** The prototype uses controlled synthetic internal
> railway maintenance/planning data together with public
> station/timetable information. It does not use live Indian Railways
> operational data.

------------------------------------------------------------------------

## Problem Statement

**Problem ID:** SIH26027

**Title:** AI-Powered Automatic Block Planning to Maximize Asset
Availability for Train Operations on Indian Railways

### The challenge

Railway maintenance requests compete for limited possession/block
windows across assets such as:

-   Track
-   Signalling
-   OHE
-   Bridges
-   Other railway infrastructure

Independent planning can create overlapping tasks, fragmented work
windows and avoidable asset downtime.

RailSamanvayAI addresses this by combining **risk-aware maintenance
prioritisation** with **constraint-based scheduling**.

------------------------------------------------------------------------

## Key Features

### 1. Risk-Aware Maintenance Planning

A calibrated machine-learning classifier predicts:

``` text
future_failure_next_30d
```

The model uses temporal train/validation splitting so that future
information is not mixed into the training period.

### 2. Task Prioritisation

Maintenance requests can be prioritised using predicted failure risk and
planning attributes rather than relying only on a static priority value.

### 3. Constraint-Based Optimisation

The Google OR-Tools **CP-SAT** solver creates a feasible maintenance
block plan while enforcing hard constraints such as:

-   Crew limits
-   Maximum block duration
-   Concurrent task limits
-   Operational constraints

The optimisation objective is to maximise completion of critical
maintenance within available possession windows.

### 4. Controller-Centric Decision Support

The system provides a dashboard for reviewing:

-   Railway network/map information
-   Maintenance tasks
-   Risk indicators
-   Recommended block assignments
-   Scheduling timelines
-   Block utilisation

The AI provides recommendations; the human controller remains
responsible for the final decision.

### 5. Geospatial Visualisation

The frontend uses **React + Leaflet** to present railway and maintenance
information spatially.

------------------------------------------------------------------------

## System Architecture

``` text
┌──────────────────────────────┐
│     Railway Data Inputs      │
│ Maintenance • Assets •       │
│ Corridors • Timetable •      │
│ Possession Availability      │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│      Feature Engineering     │
│ Time-aware planning features │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│   Calibrated ML Classifier   │
│ Predict failure in next 30d  │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│      Task Prioritisation     │
│      Risk-aware ranking      │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│      OR-Tools CP-SAT         │
│ Constraint-based optimisation│
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│     Controller Dashboard     │
│ Map • Risk • Tasks • Blocks  │
│ Timeline • Recommendations   │
└──────────────────────────────┘
```

------------------------------------------------------------------------

## Technology Stack

  Layer                 Technologies
  --------------------- -----------------------------------
  Machine Learning      Python, calibrated classification
  Optimisation          Google OR-Tools CP-SAT
  Backend               FastAPI
  Database              SQLite / PostgreSQL
  Database Migrations   Alembic
  Authentication        JWT
  Frontend              React, Tailwind CSS
  Geospatial UI         Leaflet
  Data Processing       Python
  Development           Git, GitHub

------------------------------------------------------------------------

## Repository Structure

The repository is organised into dedicated backend, frontend, data,
ML-model and script components:

``` text
RailSamanvayAI/
│
├── backend/              # FastAPI backend, database and API services
├── frontend/             # React + Tailwind + Leaflet dashboard
├── data/                 # Project datasets and planning data
├── docs/                 # Project documentation
├── ml/
│   └── models/           # Trained ML model artefacts
├── scripts/              # Data, feature, training and optimisation scripts
│
├── .env.example          # Environment configuration template
├── docker-compose.yml    # Container configuration
├── railway_saas.db       # Local SQLite database
├── run_all.sh            # Start backend and frontend
├── render.yaml           # Deployment configuration
├── vercel.json           # Frontend deployment configuration
└── README.md
```

------------------------------------------------------------------------

## Installation & Setup

### Prerequisites

Make sure the following are installed:

-   Python 3
-   Node.js and npm
-   Git
-   A supported database configuration (SQLite for local development or
    PostgreSQL)

### 1. Clone the repository

``` bash
git clone https://github.com/ggthedeveloper/RailSamanvayAI.git
cd RailSamanvayAI
```

### 2. Create and activate a Python virtual environment

``` bash
python3 -m venv venv
source venv/bin/activate
```

On Windows PowerShell:

``` powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 3. Install backend dependencies

``` bash
pip install -r backend/requirements.txt
```

### 4. Run database migrations

``` bash
cd backend
alembic upgrade head
cd ..
```

### 5. Generate data and run the ML/optimisation pipeline

``` bash
python scripts/seed_database.py
python scripts/build_features.py
python scripts/train_models.py
python scripts/run_optimizer.py
```

### 6. Start the application

``` bash
./run_all.sh
```

If `run_all.sh` is not executable on Linux/macOS:

``` bash
chmod +x run_all.sh
./run_all.sh
```

------------------------------------------------------------------------

## End-to-End Workflow

``` text
Maintenance Requests
        │
        ▼
Asset & Network Data
        │
        ▼
Feature Engineering
        │
        ▼
Failure-Risk Prediction
        │
        ▼
Task Prioritisation
        │
        ▼
CP-SAT Optimisation
        │
        ▼
Constraint-Valid Block Plan
        │
        ▼
Controller Review
        │
        ▼
Final Maintenance Schedule
```

------------------------------------------------------------------------

## Data Strategy

RailSamanvayAI follows a hybrid prototype-data strategy:

### Controlled synthetic internal data

Used for internal railway maintenance/planning attributes that are not
publicly available.

Examples include:

-   Maintenance requests
-   Asset condition/planning attributes
-   Possession availability
-   Block planning information
-   Maintenance scheduling constraints

### Public railway information

Public station and timetable information is used to provide realistic
railway-network context.

This separation allows the prototype to demonstrate the complete
planning workflow without claiming access to live operational railway
data.

------------------------------------------------------------------------

## Machine Learning Pipeline

The ML pipeline is designed around a forward-looking prediction target:

``` text
future_failure_next_30d
```

### Pipeline

``` text
Historical / Planning Data
          │
          ▼
Feature Engineering
          │
          ▼
Temporal Train / Validation Split
          │
          ▼
Classifier Training
          │
          ▼
Probability Calibration
          │
          ▼
Failure-Risk Prediction
```

The calibrated probability is then used as an input to risk-aware
maintenance prioritisation.

------------------------------------------------------------------------

## Optimisation Model

The optimisation layer uses **Google OR-Tools CP-SAT**.

### Hard constraints include

-   Crew availability
-   Maximum block duration
-   Concurrent task limits
-   Operational constraints
-   Possession/block availability

### Optimisation objective

The planner aims to construct a feasible schedule that maximises
completion of critical maintenance while respecting the available
operational windows.

``` text
Tasks + Risk + Resources + Possession Windows
                    │
                    ▼
              CP-SAT Solver
                    │
                    ▼
        Feasible Block Allocation
                    │
                    ▼
        Controller Review Dashboard
```

------------------------------------------------------------------------

## Controller Dashboard

The frontend is designed for railway controllers and planners rather
than general passengers.

The dashboard brings together:

-   Railway map
-   Maintenance requests
-   Risk indicators
-   Task list
-   Scheduling timeline
-   Block allocation
-   Recommended maintenance plan

The system is intended as **decision support**, not an autonomous
replacement for operational authority.

------------------------------------------------------------------------

## Authentication & Backend

The SaaS backend is built using:

-   **FastAPI** for API services
-   **SQLite/PostgreSQL** for persistence
-   **Alembic** for database migrations
-   **JWT authentication** for authenticated access

Environment-specific configuration should be supplied through
environment variables rather than hard-coded secrets.

------------------------------------------------------------------------

## Deployment

The repository includes deployment/configuration files for the
application stack, including:

``` text
docker-compose.yml
render.yaml
vercel.json
.env.example
```

Deployment configuration may require environment-specific values for
databases, authentication and frontend/backend URLs.

------------------------------------------------------------------------

## Prototype Scope & Limitations

This is a **prototype decision-support system** developed for SIH26027.

### Current scope

-   Controlled synthetic railway maintenance/planning data
-   Public railway station/timetable context
-   ML-based failure-risk prediction
-   Constraint-based block planning
-   Controller-facing visualisation

### Important limitation

The prototype does **not** use live Indian Railways operational data.
Any deployment for real operational use would require validated railway
datasets, integration with authorised railway systems, operational
safety validation, security review and domain-expert approval.

------------------------------------------------------------------------

## Expected Benefits

RailSamanvayAI is designed to support:

-   Better possession-window utilisation
-   Fewer incompatible scheduling assignments
-   Risk-aware maintenance prioritisation
-   Reduced unnecessary asset downtime
-   Better controller decision support
-   More coordinated maintenance planning

------------------------------------------------------------------------

## Future Enhancements

Potential future development areas include:

-   Integration with authorised live railway data feeds
-   More detailed crew/resource modelling
-   Advanced disruption and delay modelling
-   What-if scenario planning for controllers
-   Explainable risk predictions
-   Multi-corridor optimisation
-   Real-time schedule re-optimisation
-   Role-based access control and audit trails
-   Production-grade monitoring and observability

------------------------------------------------------------------------

## Project

**RailSamanvayAI**

**Smart India Hackathon 2026**

-   **Problem ID:** SIH26027
-   **Ministry:** Ministry of Railways
-   **Theme:** Transportation & Logistics

------------------------------------------------------------------------

## Disclaimer

RailSamanvayAI is an SIH prototype and decision-support demonstration.
It is not an operational railway control system and should not be used
for real-world railway scheduling without appropriate validation,
authorised data integration, safety processes and human operational
oversight.

------------------------------------------------------------------------

## Repository

GitHub: https://github.com/ggthedeveloper/RailSamanvayAI

------------------------------------------------------------------------

```{=html}
<p align="center">
```
`<strong>`{=html}RailSamanvayAI`</strong>`{=html}`<br>`{=html} Plan
Smarter. Coordinate Better. Keep Railways Moving.
```{=html}
</p>
```

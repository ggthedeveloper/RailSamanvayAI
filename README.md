# RailSamanvayAI

### AI-Powered Automatic Block Planning for Railway Maintenance

<p align="center">

**Intelligent Maintenance Planning • Risk Prediction • Constraint-Based Optimisation**

</p>

<p align="center">

An AI-driven decision-support platform for optimising railway maintenance blocks while maximising asset availability and minimising operational conflicts.

</p>

---

## 📌 Project Overview

**RailSamanvayAI** is an AI-powered decision-support system developed for **Smart India Hackathon 2026 — Problem Statement SIH26027**, under the **Ministry of Railways** and the **Transportation & Logistics** theme.

Railway infrastructure requires continuous inspection and maintenance to ensure safe and reliable train operations. However, maintenance activities compete for limited railway possession/block windows and may require shared resources such as maintenance crews and equipment.

Traditional planning approaches can make it difficult to simultaneously consider:

* Asset condition and failure risk
* Maintenance urgency
* Train movement constraints
* Available possession windows
* Crew and resource availability
* Maintenance duration
* Concurrent maintenance activities
* Network-level operational conflicts

RailSamanvayAI addresses this challenge through an integrated pipeline combining **Machine Learning, Feature Engineering, Risk Assessment, Constraint Programming, and Geospatial Visualisation**.

The system predicts future asset-failure risk, prioritises maintenance activities accordingly, and generates feasible maintenance block plans using **Google OR-Tools CP-SAT**.

The final recommendation is presented through a controller-oriented dashboard, where the human operator can review and approve the proposed maintenance plan.

---

# 🎯 Problem Statement

### SIH26027

**AI-Powered Automatic Block Planning to Maximize Asset Availability for Train Operations on Indian Railways**

Railway maintenance activities need to be scheduled without unnecessarily disrupting train operations.

A maintenance block represents a period during which railway infrastructure can be taken out of normal operation so that maintenance personnel can safely perform required work.

The planning process becomes challenging when multiple maintenance requests compete for the same:

* Time windows
* Railway sections
* Maintenance crews
* Equipment
* Possession periods

The challenge is therefore to automatically generate maintenance plans that prioritise critical assets while satisfying operational and resource constraints.

---

# 💡 Proposed Solution

RailSamanvayAI introduces a multi-stage intelligent planning pipeline:

```text
Railway & Maintenance Data
            │
            ▼
     Data Preparation
            │
            ▼
     Feature Engineering
            │
            ▼
   Failure-Risk Prediction
            │
            ▼
  Maintenance Prioritisation
            │
            ▼
 Possible Block Generation
            │
            ▼
 Constraint Validation
            │
            ▼
   CP-SAT Optimisation
            │
            ▼
 Recommended Block Plan
            │
            ▼
     Human Controller
            │
            ▼
      Final Schedule
```

The system separates **risk assessment** from **schedule optimisation**.

The Machine Learning layer answers:

> **Which assets are at greater risk and require attention?**

The optimisation layer answers:

> **When and how can the required maintenance be scheduled while respecting operational constraints?**

---

# 🧠 Core Intelligence

## 1. Predictive Asset Risk

Instead of relying solely on manually assigned maintenance priorities, RailSamanvayAI uses a Machine Learning model to estimate whether an asset is likely to experience a failure within the next 30 days.

### Prediction Target

```text
future_failure_next_30d
```

The model produces a probability that can subsequently be used as an input to maintenance prioritisation.

This changes the planning approach from:

```text
Static Priority
      ↓
Maintenance Schedule
```

to:

```text
Historical Asset Information
          ↓
Future Failure Risk
          ↓
Risk-Aware Priority
          ↓
Optimised Maintenance Schedule
```

---

# 📊 Machine Learning Pipeline

The ML pipeline is designed for a time-dependent maintenance prediction problem.

```text
Historical Data
      │
      ▼
Data Cleaning
      │
      ▼
Feature Engineering
      │
      ▼
Temporal Train / Validation Split
      │
      ▼
Model Training
      │
      ▼
Probability Calibration
      │
      ▼
Future Failure Prediction
      │
      ▼
Risk Score
```

### Temporal Validation

A temporal train/validation strategy is used instead of randomly mixing historical and future observations.

This is important because the objective is to simulate a real maintenance-planning scenario where the model predicts future failures using information that would have been available at the prediction time.

### Probability Calibration

The model uses calibrated probabilities so that the predicted values can be incorporated into downstream risk-aware decision-making.

---

# 🔧 Maintenance Prioritisation

The predicted failure probability is incorporated into maintenance prioritisation.

A maintenance task can be evaluated using multiple factors, including:

* Predicted failure risk
* Asset condition
* Maintenance urgency
* Task duration
* Available possession windows
* Operational constraints

The resulting information is provided to the optimisation layer.

---

# 🧮 Constraint-Based Optimisation

The scheduling engine uses:

### Google OR-Tools CP-SAT

CP-SAT is a constraint-programming and optimisation solver capable of handling complex combinatorial scheduling problems.

RailSamanvayAI uses it to identify feasible combinations of maintenance activities and assign them to available block windows.

---

## 🔒 Hard Constraints

The optimisation model incorporates operational constraints such as:

### Crew Availability

A maintenance task can only be assigned when the required crew resources are available.

### Maximum Block Duration

Each maintenance block must remain within the permitted duration.

### Concurrent Task Limits

The number of simultaneously executing maintenance activities is constrained.

### Possession Windows

Maintenance activities must be assigned to valid railway possession periods.

### Operational Compatibility

Conflicting maintenance assignments must not be scheduled together when they violate defined operational constraints.

---

# 🎯 Optimisation Objective

The optimisation engine aims to maximise the completion of critical maintenance activities while satisfying the defined constraints.

Conceptually:

```text
Maximise:

Critical Maintenance Completed
+
Risk Reduction
+
Block Utilisation

Subject to:

Crew Constraints
Block Duration Constraints
Concurrent Task Constraints
Possession Constraints
Operational Constraints
```

The optimisation process therefore does not simply select the highest-risk task.

Instead, it searches for a **globally feasible combination of maintenance activities**.

---

# 🗺️ Geospatial Visualisation

The frontend provides geospatial context using **Leaflet**.

Railway assets and maintenance activities can be visualised geographically to help users understand:

* Asset locations
* Maintenance locations
* Railway corridors
* Maintenance blocks
* Network-level planning information

This provides a spatial representation of the generated maintenance plan.

---

# 🖥️ Decision-Support Dashboard

The frontend is designed around the workflow of a railway controller or maintenance planner.

The dashboard provides visibility into:

### Asset Risk

Identification of assets with higher predicted failure risk.

### Maintenance Tasks

Overview of maintenance activities requiring attention.

### Block Planning

Visualisation of proposed maintenance blocks.

### Resource Utilisation

Visibility into resource and crew allocation.

### Schedule

Timeline-oriented representation of maintenance activities.

### Network Map

Geographical representation of relevant railway infrastructure.

---

# 👤 Human-in-the-Loop Architecture

RailSamanvayAI is designed as a **decision-support system**, not as an autonomous railway control system.

The system follows:

```text
AI Prediction
      ↓
Risk Assessment
      ↓
Optimisation
      ↓
Recommendation
      ↓
Human Review
      ↓
Approval / Modification
      ↓
Final Maintenance Plan
```

The final operational decision remains with the authorised human controller.

This architecture allows AI to assist with complex planning while maintaining human oversight.

---

# 🏗️ System Architecture

```text
                         ┌───────────────────────┐
                         │   Railway Data Layer  │
                         │                       │
                         │ Assets                │
                         │ Maintenance Tasks     │
                         │ Timetables            │
                         │ Possession Windows    │
                         │ Network Information   │
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │   Feature Engineering │
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │   ML Risk Prediction  │
                         │                       │
                         │ Failure Risk < 30 Days│
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │ Maintenance Priority  │
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │ Block Generation      │
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │ OR-Tools CP-SAT       │
                         │ Optimisation Engine   │
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │ Recommended Schedule  │
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │ Controller Dashboard  │
                         └───────────────────────┘
```

---

# 🛠️ Technology Stack

| Component                | Technology                            |
| ------------------------ | ------------------------------------- |
| Programming Language     | Python                                |
| ML                       | Scikit-learn / Calibrated Classifiers |
| Optimisation             | Google OR-Tools CP-SAT                |
| Backend Framework        | FastAPI                               |
| Database                 | SQLite / PostgreSQL                   |
| ORM / Data Layer         | SQLAlchemy                            |
| Database Migration       | Alembic                               |
| Authentication           | JWT                                   |
| Frontend                 | React                                 |
| Styling                  | Tailwind CSS                          |
| Geospatial Visualisation | Leaflet                               |
| API Communication        | REST APIs                             |
| Deployment               | Render / Vercel                       |
| Containerisation         | Docker                                |
| Version Control          | Git / GitHub                          |

---

# 📂 Project Structure

```text
RailSamanvayAI/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── ...
│
├── data/
│   ├── raw/
│   ├── processed/
│   └── ...
│
├── docs/
│   └── project documentation
│
├── ml/
│   └── models/
│
├── scripts/
│   ├── seed_database.py
│   ├── build_features.py
│   ├── train_models.py
│   └── run_optimizer.py
│
├── .env.example
├── docker-compose.yml
├── render.yaml
├── vercel.json
├── run_all.sh
├── railway_saas.db
└── README.md
```

---

# 📥 Data Strategy

The project follows a hybrid data strategy.

## Public Data

Publicly available railway information is used where appropriate to provide realistic network and timetable context.

## Controlled Synthetic Data

Internal railway maintenance and operational information that is not publicly available is represented using controlled synthetic data.

This can include:

* Asset information
* Maintenance requirements
* Failure indicators
* Maintenance duration
* Resource requirements
* Possession windows
* Scheduling constraints

This approach allows the project to demonstrate the complete planning pipeline without claiming access to confidential or live railway operational data.

---

# 🔄 Data-to-Decision Pipeline

```text
                    DATA
                     │
                     ▼
          ┌────────────────────┐
          │ Data Preparation   │
          └─────────┬──────────┘
                    │
                    ▼
          ┌────────────────────┐
          │ Feature Engineering│
          └─────────┬──────────┘
                    │
                    ▼
          ┌────────────────────┐
          │ ML Risk Prediction │
          └─────────┬──────────┘
                    │
                    ▼
          ┌────────────────────┐
          │ Priority Assessment│
          └─────────┬──────────┘
                    │
                    ▼
          ┌────────────────────┐
          │ Candidate Blocks   │
          └─────────┬──────────┘
                    │
                    ▼
          ┌────────────────────┐
          │ Conflict Detection │
          └─────────┬──────────┘
                    │
                    ▼
          ┌────────────────────┐
          │ CP-SAT Optimisation│
          └─────────┬──────────┘
                    │
                    ▼
          ┌────────────────────┐
          │ Recommended Plan   │
          └─────────┬──────────┘
                    │
                    ▼
                 HUMAN
```

---

# ⚙️ Installation

## Prerequisites

Ensure the following are installed:

* Python 3.x
* Node.js
* npm
* Git
* SQLite or PostgreSQL

---

## 1. Clone the Repository

```bash
git clone https://github.com/ggthedeveloper/RailSamanvayAI.git

cd RailSamanvayAI
```

---

## 2. Create a Virtual Environment

### Linux / macOS

```bash
python3 -m venv venv

source venv/bin/activate
```

### Windows

```powershell
python -m venv venv

.\venv\Scripts\activate
```

---

## 3. Install Python Dependencies

```bash
pip install -r backend/requirements.txt
```

---

# 🗄️ Database Configuration

Run the database migrations:

```bash
cd backend

alembic upgrade head

cd ..
```

The project supports SQLite for local development and PostgreSQL for deployment-oriented environments.

---

# 🤖 Run the ML Pipeline

Generate or initialise the required project data:

```bash
python scripts/seed_database.py
```

Build the ML features:

```bash
python scripts/build_features.py
```

Train the predictive model:

```bash
python scripts/train_models.py
```

Run the optimisation pipeline:

```bash
python scripts/run_optimizer.py
```

---

# ▶️ Running the Application

The repository provides a combined startup script:

```bash
./run_all.sh
```

If necessary, make the script executable:

```bash
chmod +x run_all.sh
```

Then:

```bash
./run_all.sh
```

---

# 🔐 Environment Variables

Create a local environment configuration based on:

```text
.env.example
```

Environment variables should be used for configuration such as:

* Database connection
* JWT configuration
* Backend URL
* Frontend URL
* Deployment-specific settings

Sensitive credentials should never be committed to the repository.

---

# 🐳 Docker

The repository includes:

```text
docker-compose.yml
```

which can be used to run the required application services in a containerised environment.

A typical workflow is:

```bash
docker compose up --build
```

---

# Deployment

The project contains deployment configuration for:

* **Render** — backend / service deployment
* **Vercel** — frontend deployment

Relevant configuration files include:

```text
render.yaml
vercel.json
```

Deployment requires appropriate environment variables and database configuration.

---

# Backend

The backend is implemented using **FastAPI**.

Its responsibilities include:

* Authentication
* User management
* Asset data
* Maintenance data
* Risk information
* Optimisation results
* Schedule information
* Dashboard APIs

The backend acts as the bridge between the frontend dashboard, database, ML pipeline and optimisation engine.

---

# Authentication

The application uses **JWT-based authentication**.

The authentication flow is conceptually:

```text
User Login
    ↓
Credentials Validation
    ↓
JWT Generation
    ↓
Authenticated API Requests
    ↓
Protected Resources
```

Passwords and authentication credentials should be handled securely and should never be stored as plain text.

---

# Database

The application supports:

### SQLite

Suitable for:

* Local development
* Prototype demonstrations
* Lightweight testing

### PostgreSQL

Suitable for:

* Production-oriented deployments
* Multi-user environments
* Scalable data storage

Database schema changes are managed through **Alembic migrations**.

---

# Key Performance Dimensions

The system can be evaluated using several categories of metrics.

## Machine Learning

Possible evaluation metrics include:

* Accuracy
* Precision
* Recall
* F1-score
* ROC-AUC
* Calibration quality

Because failure prediction is used for prioritisation, probability quality and class-specific performance are particularly important.

---

## Optimisation

The scheduling engine can be evaluated using:

* Number of critical tasks completed
* Block utilisation
* Resource utilisation
* Number of conflicts
* Constraint violations
* Total maintenance duration
* Unscheduled critical tasks

---

## Operational Planning

Additional evaluation dimensions include:

* Reduction in scheduling conflicts
* Maintenance coverage
* Asset-risk coverage
* Resource feasibility
* Schedule stability

---

# Validation Strategy

The prototype should be evaluated in stages.

### Stage 1 — Data Validation

Verify:

* Missing values
* Invalid records
* Time consistency
* Asset identifiers
* Maintenance durations
* Resource requirements

### Stage 2 — ML Validation

Evaluate:

* Predictive performance
* Temporal generalisation
* Calibration
* Class imbalance

### Stage 3 — Optimisation Validation

Verify that generated schedules satisfy all hard constraints.

### Stage 4 — Scenario Testing

Test the optimiser under different conditions:

```text
Normal Capacity
Reduced Crew Availability
High Maintenance Demand
Reduced Possession Windows
Multiple High-Risk Assets
Conflicting Maintenance Requests
```

---

# Example Planning Scenario

Consider a railway section containing several assets:

```text
Asset A → High predicted failure risk
Asset B → Medium predicted failure risk
Asset C → Low predicted failure risk
```

Available maintenance window:

```text
22:00 – 02:00
```

Available resources:

```text
2 Maintenance Crews
```

The optimiser evaluates the available maintenance activities and determines which combination can be executed within the available window.

For example:

```text
22:00 ───────────────────────── 02:00

Crew 1:
[──── Asset A Maintenance ────]

Crew 2:
[── Asset B Maintenance ──]
```

If two activities require the same unavailable resource, exceed the block duration, or violate another constraint, the optimiser must find an alternative feasible allocation.

The result is therefore not simply:

> "Perform the highest-risk task."

It is:

> "Select the most valuable feasible combination of maintenance tasks under the available operational constraints."

---

# Why Machine Learning + Optimisation?

Machine Learning and optimisation solve different parts of the problem.

### Machine Learning

Answers:

> **What is likely to happen?**

For example:

```text
Probability of failure within 30 days = 0.82
```

### Optimisation

Answers:

> **What should we schedule given the available constraints?**

For example:

```text
Available block = 4 hours
Available crews = 2
Tasks = 8
```

The optimiser determines the feasible combination.

Therefore:

```text
Machine Learning
       +
Optimisation
       ↓
Intelligent Maintenance Planning
```

---

# Advantages of the Proposed Architecture

## Risk-Aware

Uses predicted future failure risk rather than relying exclusively on static priorities.

## Constraint-Aware

Generates plans while respecting operational and resource constraints.

## Scalable Architecture

Separates:

* Data
* ML
* Optimisation
* Backend
* Frontend

so that individual components can evolve independently.

## Human-Centric

The system assists railway planners rather than replacing operational authority.

## Explainable Workflow

The planning process can be decomposed into:

```text
Risk
 ↓
Priority
 ↓
Candidate Blocks
 ↓
Constraints
 ↓
Optimisation
 ↓
Recommendation
```

---

# Current Limitations

RailSamanvayAI is currently a **prototype / decision-support demonstration**.

### Data Limitation

The prototype does not rely on live, confidential Indian Railways operational data.

### Operational Validation

A production railway system would require extensive testing and validation under real operational conditions.

### Safety Certification

The current prototype is not safety-certified and must not be connected directly to railway control systems.

### Model Generalisation

Machine-learning performance depends on the quality, quantity and representativeness of the available training data.

### Real-Time Integration

Full real-time train movement and disruption data integration is outside the current prototype scope.

---

# Future Scope

## 1. Real-Time Railway Data Integration

Integrate authorised real-time:

* Train movement
* Asset health
* Maintenance
* Possession
* Network status

data.

---

## 2. Real-Time Re-Optimisation

When unexpected events occur, the system could automatically regenerate the maintenance plan.

```text
Initial Schedule
       ↓
Unexpected Event
       ↓
Updated Constraints
       ↓
Re-Optimisation
       ↓
Updated Schedule
```

---

## 3. What-If Simulation

Controllers could test alternative scenarios before approving a plan.

Examples:

```text
What if a crew becomes unavailable?

What if the block is shortened?

What if a high-risk asset requires urgent maintenance?

What if a train is delayed?

What if multiple maintenance requests arrive simultaneously?
```

---

## 4. Explainable AI

Provide explanations for predicted asset risk and maintenance prioritisation.

---

## 5. Advanced Resource Optimisation

Extend the model to include:

* Crew skills
* Equipment
* Tools
* Material availability
* Travel time
* Crew positioning

---

## 6. Multi-Corridor Planning

Extend the optimisation engine to coordinate maintenance across multiple railway corridors simultaneously.

---

## 7. Predictive Maintenance Integration

Integrate continuous asset-health signals to update failure probabilities dynamically.

---

## 8. Audit & Governance

Maintain complete records of:

* AI recommendations
* Optimisation runs
* Human modifications
* Approved schedules
* Schedule changes

This would support accountability and operational traceability.

---

# Safety & Governance

RailSamanvayAI should be treated as a **decision-support layer**.

It should not directly control:

* Railway signalling
* Train movement
* Safety-critical infrastructure
* Real-world railway control systems

Any real-world deployment would require appropriate:

* Safety validation
* Cybersecurity assessment
* Data governance
* Operational testing
* Domain-expert review
* Regulatory approval
* Human oversight

---

# Project Documentation

Additional project documentation is available in:

```text
docs/
```

This directory can contain:

* System architecture
* ML documentation
* Optimisation formulation
* API documentation
* Database design
* Deployment information
* Testing documentation

---

# Contribution

Contributions are welcome.

A typical contribution workflow is:

```bash
git checkout -b feature/<feature-name>

# Make changes

git add .

git commit -m "Add <feature-name>"

git push origin feature/<feature-name>
```

Then create a Pull Request describing:

* What was changed
* Why it was changed
* How it was tested
* Any limitations or dependencies

---

# License

Refer to the repository's license file for the applicable licensing terms.

---

# Disclaimer

RailSamanvayAI is an academic and hackathon-oriented prototype developed to demonstrate the application of Artificial Intelligence and optimisation techniques to railway maintenance planning.

The system does not claim access to confidential or live Indian Railways operational systems.

The recommendations generated by the prototype are intended for demonstration and decision-support purposes only and must not be used for actual railway operations without appropriate validation, authorisation, safety procedures and human oversight.

---

# 📌 Project Details

| Field               | Details                                     |
| ------------------- | ------------------------------------------- |
| Project Name        | RailSamanvayAI                              |
| Problem ID          | SIH26027                                    |
| Ministry            | Ministry of Railways                        |
| Theme               | Transportation & Logistics                  |
| Domain              | AI / ML / Optimisation / Railway Operations |
| Application Type    | Decision-Support System                     |
| ML Task             | Future Failure Risk Prediction              |
| Optimisation        | Constraint-Based Maintenance Scheduling     |
| Backend             | FastAPI                                     |
| Frontend            | React                                       |
| Database            | SQLite / PostgreSQL                         |
| Optimisation Engine | Google OR-Tools CP-SAT                      |
| Geospatial Engine   | Leaflet                                     |

---

# 🔗 Repository

**GitHub:**
https://github.com/ggthedeveloper/RailSamanvayAI

**Live Demo:**

---

<p align="center">

### RailSamanvayAI

**Predict Risk. Optimise Blocks. Maximise Asset Availability.**

# Contributors

RailSamanvayAI is developed collaboratively by a multidisciplinary student team.

| Contributor                | Role        |
| -------------------------- | ----------- |
| **Gaurav Gautam**          | Team Member |
| **Debosmita Mukhopadhyay** | Team Leader |
| **Shashwat Sahu**          | Team Member |
| **Parinita Ramsagar**      | Team Member |
| **Likhita Ganga**          | Team Member |
| **Shubham Sagar**          | Team Member |


The team collaboratively contributed to the ideation, system design, data engineering, machine-learning pipeline, optimisation framework, application development, testing, documentation, and overall implementation of RailSamanvayAI.


</p>

# RailSamanvayAI

## AI-Powered Railway Maintenance Block Planning & Coordination

> **Predict smarter. Coordinate better. Optimize maintenance.**

RailSamanvayAI is an **AI-powered railway maintenance planning and decision-support system** designed to help railway planners prioritize maintenance work, coordinate activities across departments, and efficiently utilize limited maintenance blocks.

The system combines **Machine Learning, Constraint Optimization, Geospatial Visualization, Conflict Detection, and Human-in-the-Loop Approval** into a single planning workflow.

---

## Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Our Solution](#-our-solution)
- [How It Works](#-how-it-works)
- [Key Features](#-key-features)
- [AI Risk Prediction](#-ai-risk-prediction)
- [Maintenance Prioritization](#-maintenance-task-prioritization)
- [Intelligent Block Planning](#-intelligent-block-planning)
- [Cross-Department Coordination](#-cross-department-coordination)
- [Interactive Network Map](#-interactive-railway-network-map)
- [Route Analyzer](#-route-analyzer)
- [Conflict Detection](#-conflict-detection)
- [Human-in-the-Loop](#-human-in-the-loop)
- [Dashboard](#-planner-dashboard)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Backend Setup](#-backend-setup)
- [Frontend Setup](#-frontend-setup)
- [API Endpoints](#-api-endpoints)
- [ML + Optimization](#-ml--optimization)
- [Explainability](#-explainability)
- [Data](#-data)
- [Model Evaluation](#-model-evaluation)
- [Current Limitations](#-current-limitations)
- [Future Scope](#-future-scope)
- [Expected Impact](#-expected-impact)
- [Intended Users](#-intended-users)
- [SIH Context](#-sih-context)
- [Contributors](#-contributors)
- [Disclaimer](#-disclaimer)

---

# Overview

Railway infrastructure requires regular inspection, preventive maintenance, repair, and renewal.

This includes infrastructure managed by departments such as:

- **Engineering**
- **Traction Distribution (TRD)**
- **Signalling & Telecommunication (S&T)**

However, maintenance activities have to be performed within limited **maintenance blocks / possessions**, while railway operations continue.

This creates a complex planning problem:

- Which maintenance task is the most urgent?
- Which asset has the highest risk?
- Which maintenance block should be selected?
- Can multiple compatible tasks be performed together?
- Will the proposed work conflict with railway operations?
- How can available maintenance windows be used efficiently?

### RailSamanvayAI addresses this problem through an integrated planning workflow.

> **AI identifies what is urgent.  
> Optimization determines when and where it can be scheduled.  
> Human planners make the final decision.**

---

#  Problem Statement

Traditional railway maintenance planning can involve multiple departments planning their requirements independently.

Because maintenance blocks are limited, decentralized planning can result in:

 Inefficient utilization of maintenance blocks  
 Repeated possession of the same corridor  
 Poor coordination between departments  
 Delayed maintenance of critical assets  
 Scheduling conflicts  
 Increased operational disruption  
 Reduced asset availability  

The challenge is therefore not just to identify maintenance work, but to determine:

> **What should be maintained, where, when, and how multiple activities can be coordinated within available operational constraints.**

---

# Our Solution

RailSamanvayAI combines several intelligent components:

### Machine Learning

Predicts the risk or urgency associated with maintenance conditions.

### Constraint Optimization

Finds feasible maintenance schedules within available blocks and operational restrictions.

### Cross-Department Coordination

Identifies opportunities to combine compatible maintenance activities.

###  Geospatial Visualization

Provides geographic context through an interactive railway network map.

### Conflict Detection

Highlights scheduling and operational issues that require attention.

###  Human Approval

Keeps the final decision with an authorized railway planner.

---

# How It Works

```text
                    Railway Data
                         │
                         ▼
              ┌─────────────────────┐
              │ Data Ingestion &    │
              │ Validation          │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ Feature Engineering │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ ML Risk Prediction  │
              │                     │
              │ Which assets are    │
              │ most at risk?       │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ Task Prioritization │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ Joint Opportunity   │
              │ Detection           │
              │                     │
              │ Can compatible work │
              │ be combined?        │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ OR-Tools CP-SAT     │
              │ Optimization        │
              │                     │
              │ When + Where?       │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ Conflict Detection  │
              │ & Explanation       │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ Planner Dashboard   │
              │                     │
              │ Review + Approve    │
              └─────────────────────┘

              # Team The Steel Bytes 800

## Our Team

RailSamanvayAI is developed collaboratively by a team of six members - Team The Steel Bytes 800:

| # | Contributor |
|---|---|
| 1 | **Gaurav Gautam** |
| 2 | **Debosmita Mukhopadhyay** |
| 3 | **Shashwat Sahu** |
| 4 | **Likhitha Ganga** |
| 5 | **Parinita Ramsagar** |
| 6 | **Shubham Sagar** |

### Team Vision

> **Together, we aim to make railway maintenance planning smarter, safer, more coordinated, and more efficient through AI-driven decision support and optimization.**

# Time Manager

A collaborative Epitech time-tracking application with a React frontend, Python API and Keycloak authentication. This repository is a fork of [DrownedMilan/time_manager](https://github.com/DrownedMilan/time_manager); credit belongs to the original team and subsequent contributors.

## Implemented features

- User and team management through API routers and frontend views.
- Clock records and employee, manager and organization dashboards.
- KPI endpoints and chart components.
- Keycloak login, JWT verification through JWKS, and business roles.
- SQLModel data models, PostgreSQL persistence and a SQLAdmin interface.
- A custom Keycloak login theme using Keycloakify.

These features are evidenced by source code. Full user journeys and production authorization behavior were not validated in this review.

## Architecture

```text
Browser -> Nginx -> React / Vite
                 -> FastAPI -> PostgreSQL
                 -> Keycloak -> separate PostgreSQL database
```

| Layer | Technologies |
| --- | --- |
| Frontend | React 18, TypeScript, Vite, React Router, Material UI, Radix UI, TanStack Query, Recharts |
| Backend | Python, FastAPI, SQLModel, SQLAlchemy, psycopg2, APScheduler, SQLAdmin |
| Identity | Keycloak, keycloak-js, python-jose, Keycloakify |
| Infrastructure | Docker, Docker Compose, Nginx, PostgreSQL 17 |
| Automation | GitHub Actions, SonarCloud, Bandit, Trivy, frontend build artifacts |

## Source map

- [`backend/app/routers`](backend/app/routers): users, teams, clocks and KPIs.
- [`backend/app/models.py`](backend/app/models.py): data models.
- [`backend/app/auth.py`](backend/app/auth.py): token verification and user mapping.
- [`frontend/src/features`](frontend/src/features): authentication, dashboards, employees and teams.
- [`docker-compose.yml`](docker-compose.yml): six development services.
- [CI workflow](.github/workflows/github-action.yml): builds, analysis and scans.

## Setup status

Compose expects root and frontend environment files, a Keycloak realm import and consistent identity URLs. Database configuration names are defined in [`backend/app/database.py`](backend/app/database.py). Startup was not verified during review, so a runnable installation recipe is pending validation.

The configuration includes Keycloak development mode and backend reload. Production deployment is not claimed.

## Tests and CI limitations

Backend pytest files are in [`backend/app/tests`](backend/app/tests); frontend tests are in [`frontend/src/tests`](frontend/src/tests). The frontend declares a `vitest run` script but does not declare Vitest or Testing Library dependencies. Dependency and configuration review is required before a reliable frontend test command can be documented.

The workflow allows several test, lint and scan failures to continue. Its presence demonstrates CI configuration, not passing quality gates. No coverage percentage, end-to-end result or automated deployment is claimed.

## Attribution

Academic team project maintained here as a fork. This README describes the repository as a whole, not the fork owner's individual contribution. See the upstream repository and history for authorship.

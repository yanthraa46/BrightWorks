# BrightWorks

React frontend for the **NC DHHS Phase 0** dashboard prototype. This repository contains a **prototype-only** UI that demonstrates the dashboard narrative and interactive flows using static demo data.

## Current visible prototype sections (Phase 0)
The app renders a multi-tab dashboard for leadership-style walkthroughs:

- **Prototype notice / demo limitation banner**: indicates the dashboard uses static prototype data only.
- **Regional Map**: table/map-style narrative section.
- **Provider Readiness Summary**: readiness summary and related content.
- **Vendor Evaluation**: includes a selection flow that navigates to a detail view.
- **AI Governance**: includes an alert/summary and governance-related content.

> There is **no user-facing section labeled “Raw UI Style Guide”** in the live UI.

## Frontend structure
- **React + React Router** (`frontend/src`): routing and page scaffolding used by the prototype.
- **Testing**: component/UI tests run with **Vitest + Testing Library**.
- **Accessibility**: tests include **jest-axe** checks against rendered UI.

## Testing / QA and CI
### Local QA
Run the frontend QA/test suite from the repo root:

```sh
npm run qa --prefix frontend
```

### CI (GitHub Actions)
This repository uses the frontend QA workflow:
- `.github/workflows/frontend-qa.yml`
- Triggers: **push** and **pull_request**
- Executes: `npm run qa` in `frontend/` with **Node.js 20**.

## Local setup
From the repo root:

```sh
npm ci --prefix frontend
```

## Commands
### Install
```sh
npm ci --prefix frontend
```

### Test / QA
```sh
npm run qa --prefix frontend
```

### Build
```sh
npm run build --prefix frontend
```

### Preview (local)
```sh
npm run preview --prefix frontend
```

## Notes
- UI headings/buttons and visible flows are validated by automated tests.
- If you add or remove a visible section/tab, update the corresponding tests.

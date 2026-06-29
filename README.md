# BrightWorks

React frontend for the **NC DHHS Phase 0** dashboard prototype. This repository contains a **prototype-only** UI that demonstrates the dashboard narrative and interactive flows using static demo data.

## What the dashboard prototype does
The app renders a multi-tab dashboard for leadership-style walkthroughs. It uses a demo-data notice and includes interactive navigation between major narrative sections.

### Major visible sections (current UI)
- **Prototype notice / demo limitation banner**: communicates that the dashboard is running on static prototype data only.
- **Tab navigation (multi-page prototype)**:
  - **Regional Map** (table/map-style narrative section)
  - **Provider Readiness Summary** (readiness summary and related content)
  - **Vendor Evaluation** (includes a selection flow to a detail view)
  - **AI Governance** (includes an alert/summary and governance-related content)

> Note: the repository no longer includes any user-facing section labeled **"Raw UI Style Guide"**.

## Frontend structure (high level)
- **React + React Router**: `frontend/src` contains the prototype UI and routing scaffolding used in tests.
- **Component-level unit/integration tests**: Vitest + Testing Library are used to render the UI and validate interactions and accessibility.
- **Accessibility checks**: tests run `jest-axe` against rendered UI.

## Testing / QA and CI (already set up)
### Local QA
The test suite is run via Vitest.

### CI
GitHub Actions workflow:
- `.github/workflows/frontend-qa.yml`
- Runs on `push` and `pull_request`
- Uses Node.js **20** and executes the frontend QA script:
  - `npm run qa` in `frontend/`

## Local setup
From the repo root:

```sh
npm ci --prefix frontend
```

(If you prefer running commands directly in `frontend/`, `cd frontend` and run the equivalent `npm ci` there.)

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

### Lint
There is currently no lint script defined in `frontend/package.json`. If you add one later, update this section.

### CI
CI runs the same QA command as above:
```sh
npm run qa
```
(with working directory set to `frontend/`).

## Notes for developers
- Prototype content and text such as **"Static prototype / demo data only"** are validated by automated tests.
- If UI sections are added/removed, update tests that assert on visible headings/buttons.

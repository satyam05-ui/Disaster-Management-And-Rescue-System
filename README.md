# Disaster Management And Rescue System (DMRS)

Disaster Management And Rescue System (DMRS) is the frontend for our Java PBL project. The idea is to give an emergency-response team one place to review reported incidents and coordinate people, equipment, medical facilities and shelters.

## What is included

- `index.html` — project landing page
- `login.html` — demo sign-in screen
- `dashboard.html` — overview of the current response situation
- `disasters.html` and `emergencies.html` — disaster records and individual emergency reports
- `rescue-teams.html` — team availability and deployment
- `hospitals.html` and `shelters.html` — capacity information
- `resources.html` and `volunteers.html` — relief stock and volunteer records
- `alerts.html` — public-warning records
- `map.html` — operations-map view
- `analytics.html` — summary charts
- `users.html`, `audit.html` and `settings.html` — administration screens
- `css/style.css` — shared layout and visual styles
- `js/` — page behaviour, demo records, validation and API helpers

## Run it locally

1. Extract the project folder.
2. Open the folder in VS Code.
3. Install the Live Server extension if you do not already have it.
4. Right-click `index.html` and choose **Open with Live Server**.

The demo sign-in is:

- Email: `admin@resq.local`
- Password: `admin123`

These credentials are only for the local demonstration. Do not use them for a deployed application.

## Demo data and backend

The current frontend starts in demo mode. Sample records are defined in `js/app.js`, and browser-side changes may be saved in `localStorage`. The sample figures and locations are illustrative; they are not a live emergency feed.

The API helper in `js/api.js` is prepared for a backend at `http://localhost:8080/api`. The Java backend needs to be running before live requests can succeed. Demo mode and backend mode should be tested separately.

## API routes expected by the frontend

- `POST /api/auth/login`
- `/api/disasters`
- `/api/emergencies`
- `/api/rescue-teams`
- `/api/hospitals`
- `/api/shelters`
- `/api/resources`
- `/api/volunteers`
- `/api/alerts`
- `GET /api/analytics/summary`
- `GET /api/audit`
- WebSocket endpoint: `/ws`

The frontend API contract and the backend implementation should be checked together whenever a field or route changes.

## Before submitting the PBL

Please adapt the sample data, labels, screenshots and report to your team's actual design decisions. Record which features you implemented and tested yourselves. In particular, verify form validation, navigation, empty states, API errors and how the UI behaves when the backend is unavailable. The demo screens are a prototype, not a production emergency-response system.

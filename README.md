# FridayQuest 🎮

> **An offline-first Fun Friday arranger, game master, scorekeeper and predictor, delivered as a web app (PWA).**  
> *Prepared for Kirxa | MVP Release 1.0*

---

## 🚀 Overview

FridayQuest solves chaotic office Fun Fridays by acting as the **game-show host inside everyone's phone**. The games are played in real life, offline, with colleagues and simple props. The web app serves as the host, referee, scorekeeper, and memory-keeper.

### MVP Scope (Section 6.1)
- **Accounts & Workspaces**: Multi-tenant company workspace registration, unique invite codes (`KIRXA-7F3Q`), role-based access (`orgAdmin`, `organizer`, `player`), user approvals.
- **Game Library Section**: Architecture, schemas, filters, and builder ready for game definitions (games to be decided and connected in the next phase).
- **Friday Sessions**: Scheduling, voting, agenda generation, and live status lifecycle (`voting` -> `planned` -> `live` -> `done`).
- **Vibe Check**: 4-question mood check (attendance, energy 1-5, vibe style: active/calm/brainy, game skips).
- **Auto Planner (Arranger)**: Pure mathematical scoring engine (`score = avgRating*0.4 + energyMatch*0.25 + freshness*0.2 + preferenceMatch*0.15`) that schedules warm-up, main event, and finale with 5-minute buffers.
- **Team Maker**: Fair-mix algorithm running 200 greedy permutations to balance team sizes, minimize same-department clustering, and reduce repeat pairings.
- **Live Session Engine (Phone-as-Prop)**: Real-time Socket.io rooms (`session:<id>`) powering synchronized timers, secret role cards (press-and-hold reveal), first-tap buzzers, and organizer controls.
- **Scoring & Leaderboard**: Event-sourced point updates with live standings and simple recap.

---

## 🛠️ Tech Stack

### Backend
- **Runtime & Framework**: Node.js, Express, TypeScript
- **Database**: MongoDB + Mongoose (Multi-tenant scoped by `orgId`)
- **Real-Time WebSockets**: Socket.io
- **Validation**: Zod (strict schema validation on all inputs)
- **Security**: JWT (15-min access, 7-day refresh in httpOnly cookies), bcrypt password hashing, Helmet, CORS, express-rate-limit
- **Scoring Evaluator**: json-logic-js & safe expression evaluator (zero `eval()`)
- **Logging**: Pino & pino-pretty
- **Testing**: Jest + ts-jest

### Frontend
- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS (Mobile-first, dark mode, accessible tap targets)
- **State Management**: Zustand (`useAuthStore`, `useLiveSessionStore`)
- **Data Fetching**: Native Fetch API client with credentials support
- **Icons**: Lucide React
- **PWA**: `manifest.json` configured for standalone installation

---

## 📁 Project Structure

```text
FridayQuest/
├── docker-compose.yml              # MongoDB local service container
├── README.md                       # Complete documentation
├── .gitignore                      # Git ignore rules
│
├── server/                         # Express + TypeScript Backend
│   ├── src/
│   │   ├── config/                 # Env configuration & MongoDB connection
│   │   ├── types/                  # TypeScript interfaces & Express augmentation
│   │   ├── utils/                  # Logger, JWT, Password, Response helpers
│   │   ├── middleware/             # Auth, Role, Tenant scoping, Validate, Error
│   │   ├── models/                 # Organization, User, Game, Session, VibeCheck,
│   │   │                           # Team, SessionState, ScoreEvent, Rating
│   │   ├── engine/                 # Scoring evaluator, Game runner, Tools:
│   │   │   └── tools/              # Timer, SecretRole, Buzzer, Scorekeeper, Voting
│   │   ├── sockets/                # Socket.io live handlers & room broadcaster
│   │   ├── modules/
│   │   │   ├── auth/               # Register org, join company, login, refresh
│   │   │   ├── users/              # User profile, approvals, role updates
│   │   │   ├── games/              # Game Library section, builder validation & dry-run
│   │   │   ├── sessions/           # Session management & status transitions
│   │   │   ├── vibe/               # Vibe check submission & live analytics
│   │   │   ├── planner/            # Auto-planner pure algorithm & alternatives
│   │   │   ├── teams/              # Team maker fair-mix cost algorithm
│   │   │   ├── scoring/            # Event-sourced scoring & leaderboards
│   │   │   ├── ratings/            # Post-game feedback & ratings
│   │   │   └── recap/              # Session recap & winners
│   │   ├── app.ts                  # Express application setup
│   │   └── server.ts               # HTTP & Socket.io server bootstrap
│   ├── package.json
│   ├── tsconfig.json
│   ├── jest.config.js
│   └── .env.example
│
└── client/                         # Next.js App Router Frontend
    ├── src/
    │   ├── app/
    │   │   ├── (auth)/             # Login, Register workspace, Join with invite
    │   │   ├── (app)/              # Protected Dashboard, Sessions, Games, Teams
    │   │   ├── session/[id]/play   # Player mobile live view (Timer, Role, Buzzer)
    │   │   ├── session/[id]/screen # Projector / TV big-screen display
    │   │   ├── layout.tsx
    │   │   ├── page.tsx            # Fast room code join & hero landing
    │   │   └── globals.css
    │   ├── lib/                    # api.ts (REST client), socket.ts (Socket.io)
    │   ├── stores/                 # Zustand stores (useAuthStore, useLiveSessionStore)
    │   └── types/                  # Frontend shared types
    ├── public/
    │   └── manifest.json           # PWA configuration
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.ts
    └── next.config.mjs
```

---

## ⚡ Quick Start

### 1. Start MongoDB with Docker
```bash
docker compose up -d
```

### 2. Start the Backend Server
```bash
cd server
npm run dev
```
- Server runs on: `http://localhost:5000`
- Health check: `http://localhost:5000/api/v1/health`

### 3. Run Unit Tests (Pure Functions)
```bash
cd server
npm test
```
Verifies:
- Auto Planner algorithm (`plannerLogic.test.ts`)
- Team Maker cost function & fair-mix clustering (`teamLogic.test.ts`)
- Scoring Evaluator safe conditions without `eval()` (`scoringEvaluator.test.ts`)

### 4. Start the Frontend App
```bash
cd client
npm run dev
```
- Web App runs on: `http://localhost:3000`

---

## 🔒 Security & Architecture Principles
1. **Multi-tenant scoping**: `orgId` is always extracted from the cryptographically verified JWT token. Client input never dictates organization boundary.
2. **Layered Separation**: `Route -> Controller -> Service -> Model`. Business logic resides in services and pure functions so both REST and WebSockets share identical logic.
3. **Safe Evaluation**: Custom scoring conditions use `json-logic-js` and safe token evaluators. `eval()` is strictly prohibited.
4. **Game Library Section**: The catalog structure and builder API are fully functional; specific games are to be decided and populated in the subsequent development step as planned.


# FridayQuest 🎮

> **An enterprise offline-first Fun Friday arranger, game master, scorekeeper and live engine, delivered as a Progressive Web App (PWA).**  
> *Built for high-energy workplace team building, live buzzer face-offs, and fair-play tournament dynamics.*

---

## 🚀 Overview

FridayQuest transforms office Fun Fridays into a seamless, game-show style experience. Colleagues play in real life, offline in their physical campuses (or hybrid), while their phones act as interactive controllers (buzzers, private secret role cards, live timers, and response pads). The big screen TV displays synchronized leaderboards, countdowns, and game rounds.

---

## 📁 Optimal Production Folder Structure

The project follows an optimal production-level monorepo structure with strict separation of concerns, vertical slice feature modules, reusable design system primitives, centralized constants, barrel exports, and multi-stage containerization.

```text
FridayQuest/
├── docker-compose.yml              # Production orchestration (Client + Server + MongoDB)
├── package.json                    # Monorepo workspaces & root tasks (build, typecheck, seed)
├── README.md                       # Comprehensive architecture & operational documentation
├── .gitignore                      # Production Git ignore rules
│
├── scripts/                        # Maintenance, migration & operational utility scripts
│   └── update-live-session.mjs     # Standalone session lifecycle updater
│
├── client/                         # Next.js 14 App Router Frontend (PWA)
│   ├── Dockerfile                  # Multi-stage production container build
│   ├── next.config.mjs             # Next.js configuration
│   ├── tailwind.config.ts          # Tailwind CSS theme & plugin tokens
│   ├── tsconfig.json               # Path aliases (@/*) & strict TS configuration
│   ├── package.json
│   ├── public/                     # Static assets, icons, manifest.json
│   └── src/
│       ├── app/                    # Next.js 14 App Router
│       │   ├── (auth)/             # Route group: Authentication (login, onboarding)
│       │   ├── (app)/              # Route group: Authenticated workspace pages
│       │   │   ├── dashboard/      # Role-based dashboards (Player, Organizer, Admin)
│       │   │   ├── profile/        # Player profile, avatar upload & preferences
│       │   │   ├── achievements/   # 12-badge trophy showcase & progress tiers
│       │   │   ├── settings/       # Campus GPS verification, alert toggles, theme
│       │   │   ├── games/          # Catalog of Fun Friday games & builder
│       │   │   ├── sessions/       # Session scheduler & live room access
│       │   │   ├── teams/          # AI team maker & balanced roster preview
│       │   │   ├── analytics/      # Company participation KPIs & trend charts
│       │   │   ├── approvals/      # Pending employee access approvals
│       │   │   └── roles/          # Role management & permissions
│       │   ├── session/[id]/       # Live game sessions
│       │   │   ├── play/           # Phone controller (live buzzer, secret roles)
│       │   │   └── screen/         # Big-screen projector / TV presentation view
│       │   ├── globals.css         # Tailwind base, utilities & custom keyframes
│       │   └── layout.tsx          # Root HTML layout with zero-flash theme script
│       │
│       ├── components/             # Component-driven architecture
│       │   ├── ui/                 # Atomic design system primitives (Button, Card, Badge, Input, Modal)
│       │   ├── layout/             # Shells: RoleAppShell, Sidebar, Header
│       │   ├── navigation/         # Navbar, Breadcrumbs, NavItems
│       │   ├── dashboard/          # PlayerDashboardView, OrganizerDashboardView, etc.
│       │   ├── theme/              # ThemeToggle (Direct Light/Dark toggle button)
│       │   ├── pwa/                # NetworkStatusBanner, PWA install prompts
│       │   ├── trial/              # TrialCountdownBanner
│       │   └── providers/          # QueryProvider, ThemeProvider, ToastProvider
│       │
│       ├── constants/              # Centralized platform constants (Campuses, Timezones, Routes)
│       ├── hooks/                  # Custom React hooks & index barrel export
│       ├── stores/                 # Global Zustand stores (Auth, Theme, Session) & barrel export
│       ├── lib/                    # api.ts (REST client), socket.ts (WebSockets), utils.ts (cn, formatters)
│       └── types/                  # Shared TypeScript domain models & API contracts
│
└── server/                         # Express + TypeScript Real-time Backend Engine
    ├── Dockerfile                  # Multi-stage production container build
    ├── tsconfig.json               # NodeNext module resolution & strict TS
    ├── jest.config.js              # Unit testing configuration
    ├── package.json
    └── src/
        ├── app.ts                  # Express application pipeline & security middleware
        ├── server.ts               # HTTP & Socket.IO server bootstrap
        ├── config/                 # Environment validation (Zod) & MongoDB connection
        ├── constants/              # Global constants (Timezone IST, Campuses, Roles)
        ├── models/                 # Mongoose schemas (User, Session, Game, Team, etc.) & barrel export
        ├── middleware/             # Express middlewares (Auth, Tenant, Role, Validate, Error) & barrel export
        ├── engine/                 # Core Real-Time Fun Friday Game Engine
        │   ├── gameRunner.ts       # State machine & round progression
        │   ├── scoringEvaluator.ts # Safe rule evaluator (zero eval())
        │   └── tools/              # Phone-as-Prop tools (Buzzer, Timer, SecretRole, Voting)
        ├── modules/                # Vertical Slice Feature Modules
        │   ├── auth/               # Login, registration, JWT refresh & cookie management
        │   ├── users/              # User profile, GPS check-ins, employee approvals
        │   ├── games/              # Catalog management & game definitions
        │   ├── sessions/           # Session lifecycle (voting -> planned -> live -> recap)
        │   ├── vibe/               # Real-time vibe checks & mood analytics
        │   ├── planner/            # Automated agenda arrangement engine
        │   ├── teams/              # Fair-mix 200-permutation team balancing
        │   ├── scoring/            # Event-sourced live leaderboard & score events
        │   ├── ratings/            # Post-session reviews & employee feedback
        │   ├── recap/              # Automated session summaries & winner podiums
        │   ├── analytics/          # Company participation metrics & engagement trends
        │   └── approvals/          # Team access approval workflows
        ├── seed/                   # Production-grade seed generators for demo & tests
        ├── sockets/                # Socket.IO rooms, connection lifecycle & event dispatchers
        ├── types/                  # Express augmentation & backend type declarations
        └── utils/                  # Reusable utilities (JWT, password, response, logger, HttpError)
```

---

## 🛠️ Monorepo Commands

All commands can be run directly from the project root:

```bash
# Development (Start both client & server)
npm run dev:server      # Starts Express API + WebSockets on :5000
npm run dev:client      # Starts Next.js frontend on :3000

# Quality Assurance & Type Checking
npm run typecheck       # Runs tsc --noEmit across both client & server
npm test                # Executes Jest unit tests on pure algorithm functions

# Database & Session Management
npm run seed            # Seeds official games, users, and active demo session
npm run session:update  # Pin session status to live

# Production Builds
npm run build           # Compiles both server (tsc) and client (next build)
npm run start           # Launches production server
```

---

## 🐳 Docker Deployment

To spin up the entire production stack (Frontend, Backend, and MongoDB) with persistent storage and health checks:

```bash
docker compose up --build -d
```

- **Frontend Client**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`
- **Health Check**: `http://localhost:5000/api/v1/health`
- **MongoDB**: `localhost:27017`

---

## 🔒 Production Architecture Principles

1. **Multi-Tenant Scoping**: All database queries and operations enforce `orgId` tenancy automatically via middleware.
2. **Layered Separation (Vertical Slice)**: Modules isolate `Routes -> Controller -> Service -> Schema`.
3. **Safe Evaluation**: Dynamic scoring and conditional mechanics execute via `json-logic-js` with zero usage of `eval()`.
4. **Indian Standard Time (IST)**: All session scheduling, countdown timers, and event timestamps operate in `Asia/Kolkata` standard.
5. **Atomic UI Primitives**: Standardized components (`Button`, `Card`, `Badge`, `Input`, `Modal`) ensure consistent styling and accessible interaction patterns.

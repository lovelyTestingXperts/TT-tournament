<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->

PROJECT: Tournament Management Application (Full Stack)
CURRENT PHASE: Backend Development (NestJS + GraphQL + MongoDB)
ARCHITECTURE: Nx Monorepo

==========================================================
1. PROJECT OVERVIEW
==========================================================

Building a scalable Tournament Management System.

The application supports:

- Tournament creation & management
- Match scheduling and management
- Player/member registration
- Referee assignment
- Audience/member role system
- Dashboard analytics
- Authentication & authorization
- Role-based access control (RBAC)

Goal:
Build a production-grade scalable SaaS-style platform using Nx monorepo architecture.

Current focus:
Backend development (NestJS + GraphQL + MongoDB/Mongoose).

Frontend foundation already exists.

==========================================================
2. TECH STACK
==========================================================

MONOREPO:
- Nx Monorepo

FRONTEND:
- React (Vite)
- TypeScript
- React Router
- TailwindCSS
- React Hook Form
- Zod
- clsx
- tailwind-merge
- CVA (class-variance-authority)
- lucide-react

BACKEND:
- NestJS
- GraphQL (Apollo Driver)
- Mongoose (MongoDB)
- JWT Authentication
- Passport
- Zod shared validation (optional later via shared libs)

DATABASE:
- MongoDB
- Mongoose (conventional approach)

COMMUNICATION:
- GraphQL only
(no REST planned)

VALIDATION:
- Zod in frontend
- DTO/class-validator or zod backend approach (decision pending)

AUTH:
- JWT Access Token
- Refresh token (recommended)

==========================================================
3. NX MONOREPO STRUCTURE
==========================================================

Apps:

apps/
├── tt-client/     → React frontend
├── gateway/       → NestJS GraphQL API

Libraries (future):

libs/
├── shared/
│   ├── types/
│   ├── constants/
│   ├── enums/
│   ├── zod/
│   └── utils/

Future scalable approach:

libs/shared should contain:

- enums
- reusable TS types
- GraphQL generated types
- constants
- zod schemas
- utility functions

==========================================================
4. FRONTEND ARCHITECTURE
==========================================================

Feature-based architecture.

Frontend folder structure:

src/
│
├── app/
│   ├── layouts/
│   ├── providers/
│   └── router/
│
├── components/
│   ├── common/
│   └── ui/
│
├── constants/
├── graphql/
├── hooks/
├── lib/
├── store/
├── styles/
├── types/
│
├── features/
│   ├── auth/
│   ├── tournament/
│   ├── member/
│   ├── match/
│   └── dashboard/
│
└── pages/

Pattern:

pages/
→ route-level page components

features/
→ domain/business logic

components/ui/
→ reusable design system

components/common/
→ generic reusable app components

==========================================================
5. DESIGN SYSTEM
==========================================================

Theme:
Premium red-black esports style.

Inspired by:
- sports analytics dashboards
- esports admin panels
- premium SaaS glassmorphism

Theme characteristics:

- Black background
- Deep red gradients
- Glass cards
- Soft blur
- Rounded containers
- Premium UI feel

Primary colors:

Deep Black: #050505
Soft Black: #0A0A0A
Dark Red: #5A0008
Primary Red: #B30017
Accent Red: #D90429

UI Style:
- Glassmorphism
- Rounded corners
- Gradient background
- Sticky collapsible sidebar
- Dashboard layout

==========================================================
6. USER ROLES
==========================================================

There are four main roles:

1. ADMIN
2. REFEREE
3. PLAYER
4. MEMBER

----------------------------------------------------------
ADMIN
----------------------------------------------------------

Highest privileges.

Capabilities:

- Full system access
- Tournament CRUD
- Match CRUD
- Assign referees
- Manage members
- Dashboard analytics
- Update tournament status
- Generate brackets
- Manage players
- View reports

----------------------------------------------------------
REFEREE
----------------------------------------------------------

Tournament operational role.

Capabilities:

- View assigned matches
- Update match scores
- Update match results
- Manage ongoing match state

Cannot:
- Create tournaments
- Delete tournaments
- Access admin analytics

----------------------------------------------------------
PLAYER
----------------------------------------------------------

Tournament participant.

Capabilities:

- Register for tournaments
- Join tournaments
- View matches
- View standings
- Track performance

----------------------------------------------------------
MEMBER
----------------------------------------------------------

Audience/general member.

Capabilities:

- Register account
- View tournaments
- View matches
- Watch standings

No operational privileges.

==========================================================
7. AUTHENTICATION FLOW
==========================================================

Expected auth flow:

Register
→ Login
→ Receive JWT token
→ Store token
→ Protected routes

Recommended:

Access Token:
- short expiry

Refresh Token:
- longer expiry

Auth system should include:

Auth module:
- register
- login
- me
- refresh-token
- logout

Authorization:
RBAC guards

Recommended:

GraphQL Auth Guard
+
Roles Guard

==========================================================
8. FRONTEND PAGES COMPLETED
==========================================================

AUTH
✓ Login page
✓ Register page

DASHBOARD
✓ Dashboard home

TOURNAMENTS
✓ Tournament listing
✓ Create Tournament
✓ Tournament Details page

MEMBERS
✓ Members listing page

MATCHES
✓ Matches listing page

LAYOUT
✓ Sticky sidebar
✓ Collapsible sidebar
✓ Topbar
✓ Dashboard layout

UI SYSTEM
✓ Buttons
✓ Inputs
✓ Form wrappers
✓ Cards
✓ Status badges
✓ Select components
✓ Search input
✓ Layout primitives

==========================================================
9. APPLICATION FLOW
==========================================================

User Journey:

Login/Register
        ↓
Dashboard
        ↓
Tournaments
        ↓
Create Tournament
        ↓
Players Register
        ↓
Admin Approves
        ↓
Generate Matches
        ↓
Assign Referees
        ↓
Match Execution
        ↓
Update Scores
        ↓
Determine Winners
        ↓
Tournament Completion

==========================================================
10. TOURNAMENT DOMAIN
==========================================================

Tournament is the central entity.

Tournament contains:

- Players
- Matches
- Referees
- Standings
- Schedule
- Brackets

Tournament lifecycle:

Draft
→ Upcoming
→ Active
→ Completed

Tournament formats:

1. Single Elimination
2. Double Elimination
3. Round Robin
4. League
5. Future: Custom format

Tournament types:

- Online
- Offline

Tournament visibility:

- Public
- Private

==========================================================
11. TOURNAMENT FIELDS
==========================================================

Tournament entity should include:

id
name
description
category

type:
- online
- offline

format:
- single_elimination
- double_elimination
- round_robin
- league

status:
- draft
- upcoming
- active
- completed

visibility:
- public
- private

bannerImage

maxPlayers

entryFee

startDate
endDate
registrationDeadline

createdBy (admin)

participants[]

referees[]

matches[]

winner

timestamps

==========================================================
12. MEMBER DOMAIN
==========================================================

Single User entity.

User roles determine behavior.

Fields:

id
name
email
phone
password

role:
- admin
- referee
- player
- member

avatar

isVerified
isActive

registeredTournaments[]

assignedMatches[]

timestamps

==========================================================
13. MATCH DOMAIN
==========================================================

Match belongs to tournament.

Fields:

id

tournamentId

teamA/playerA
teamB/playerB

scheduledAt

status:
- scheduled
- live
- completed
- cancelled

refereeId

scoreA
scoreB

winnerId

round

notes

timestamps

==========================================================
14. RELATIONSHIPS
==========================================================

USER
1 → many TOURNAMENTS (created)

USER
many ↔ many TOURNAMENTS (participation)

USER
many ↔ many MATCHES (assigned referee)

TOURNAMENT
1 → many MATCHES

TOURNAMENT
many → many USERS

MATCH
belongs to TOURNAMENT

==========================================================
15. GRAPHQL ARCHITECTURE
==========================================================

NestJS GraphQL.

Recommended approach:

Code-first GraphQL.

Module structure:

gateway/src/modules/

modules/
├── auth/
├── users/
├── tournaments/
├── matches/
├── members/
├── dashboard/

Each module contains:

module
resolver
service
schema/model
dto
types
guards

Example:

tournaments/
├── dto/
├── entities/
├── schemas/
├── tournament.module.ts
├── tournament.resolver.ts
└── tournament.service.ts

==========================================================
16. INITIAL BACKEND MODULE ORDER
==========================================================

Recommended build order:

1. Auth Module
2. Users Module
3. Tournament Module
4. Match Module
5. Member Module
6. Dashboard Analytics

Reason:
Everything depends on users/auth first.

==========================================================
17. GRAPHQL FEATURES EXPECTED
==========================================================

AUTH

Mutations:
- register
- login
- refreshToken
- logout

Queries:
- me

----------------------------------------------------------

TOURNAMENTS

Mutations:
- createTournament
- updateTournament
- deleteTournament
- registerTournament
- assignReferee
- generateBracket

Queries:
- tournaments
- tournament(id)
- myTournaments

----------------------------------------------------------

MATCHES

Mutations:
- createMatch
- updateScore
- updateStatus
- assignReferee

Queries:
- matches
- match(id)
- tournamentMatches

----------------------------------------------------------

MEMBERS

Queries:
- users
- user(id)
- players
- referees

==========================================================
18. AUTHORIZATION
==========================================================

Role-based access.

ADMIN:
Everything

REFEREE:
Assigned matches only

PLAYER:
Tournament participation

MEMBER:
Read-only

Need:

@Roles()

decorator

+
RolesGuard

==========================================================
19. FUTURE FEATURES
==========================================================

Future scalability:

- Notifications
- Email verification
- OTP
- Tournament brackets
- Live scoring
- Leaderboards
- Team tournaments
- Payment integration
- Spectator mode
- Real-time updates
- Chat
- Analytics
- Multi-sport support

==========================================================
20. CURRENT TASK
==========================================================

Start backend implementation.

Recommended first step:

Setup NestJS backend architecture:

- GraphQL
- Apollo
- Mongoose
- Config module
- Env validation
- Auth module
- JWT
- User schema
- Register/Login

Then continue sequentially.

IMPORTANT:
Backend should be scalable, modular, production-grade and aligned with Nx monorepo architecture.


{"name":"tournament_management_prisma_reference_schema_v1","type":"document","content":"# Tournament Management System — Database Reference Schema (Prisma-style)

> NOTE:
> This schema is for architecture, ERD reference and planning.
> Production backend uses MongoDB + Mongoose (NestJS GraphQL).
> Prisma syntax is used only because it is convenient for visualization.

---

## ENUMS

`prisma
enum UserRole {
  ADMIN
  REFEREE
  PLAYER
  MEMBER
}

enum TournamentFormat {
  SINGLE_ELIMINATION
  ROUND_ROBIN

  // future
  DOUBLE_ELIMINATION
  LEAGUE
}

enum TournamentStatus {
  DRAFT
  UPCOMING
  ACTIVE
  COMPLETED
  CANCELLED
}

enum TournamentVisibility {
  PUBLIC
  PRIVATE
}

enum TournamentType {
  ONLINE
  OFFLINE
}

enum CompetitionType {
  INDIVIDUAL
  TEAM
}

enum ApprovalMode {
  AUTOMATIC
  MANUAL
}

enum RegistrationStatus {
  PENDING
  APPROVED
  REJECTED
  WITHDRAWN
}

enum MatchStatus {
  SCHEDULED
  LIVE
  COMPLETED
  CANCELLED
}

enum CompetitorType {
  PLAYER
  TEAM
}

enum OfficialRole {
  REFEREE
  UMPIRE
  ASSISTANT_REFEREE
  SCORER
}
`

---

## USER

`prisma
model User {
  id String @id @default(auto())

  name String
  email String @unique
  phone String?
  password String

  role UserRole @default(MEMBER)

  avatar String?

  isVerified Boolean @default(false)
  isActive Boolean @default(true)

  refreshToken String?

  createdTournaments Tournament[] @relation(\"TournamentCreator\")

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
`

---

## GAME

`prisma
model Game {
  id String @id @default(auto())

  name String @unique
  slug String @unique

  description String?
  icon String?

  supportsIndividual Boolean @default(true)
  supportsTeam Boolean @default(false)

  defaultMinTeamSize Int @default(1)
  defaultMaxTeamSize Int @default(1)

  scoringType String?

  tournaments Tournament[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
`

---

## TOURNAMENT

`prisma
model Tournament {
  id String @id @default(auto())

  name String
  description String?

  gameId String
  game Game @relation(fields: [gameId], references: [id])

  type TournamentType

  format TournamentFormat

  competitionType CompetitionType

  status TournamentStatus @default(DRAFT)

  visibility TournamentVisibility @default(PUBLIC)

  approvalMode ApprovalMode @default(MANUAL)

  bannerImage String?

  maxParticipants Int

  minTeamSize Int @default(1)
  maxTeamSize Int @default(1)

  entryFee Float? @default(0)
  prizePool Float? @default(0)

  registrationOpen Boolean @default(true)

  startDate DateTime
  endDate DateTime?

  registrationDeadline DateTime

  currentRound Int @default(1)
  totalRounds Int?

  rules String[]

  location String?

  isFeatured Boolean @default(false)

  winnerId String?
  winner User? @relation(fields: [winnerId], references: [id])

  createdById String
  createdBy User @relation(
    \"TournamentCreator\",
    fields: [createdById],
    references: [id]
  )

  registrations TournamentRegistration[]

  teams Team[]

  matches Match[]

  metadata Json?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([gameId])
  @@index([createdById])
  @@index([status])
  @@index([competitionType])
}
`

---

## TEAM (Tournament Scoped)

`prisma
model Team {
  id String @id @default(auto())

  tournamentId String

  tournament Tournament @relation(
    fields: [tournamentId],
    references: [id]
  )

  name String

  logo String?

  captainId String

  captain User @relation(
    fields: [captainId],
    references: [id]
  )

  members TeamMember[]

  metadata Json?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([tournamentId])
}
`

---

## TEAM MEMBER

`prisma
model TeamMember {
  id String @id @default(auto())

  teamId String
  team Team @relation(
    fields: [teamId],
    references: [id]
  )

  userId String
  user User @relation(
    fields: [userId],
    references: [id]
  )

  joinedAt DateTime @default(now())

  @@index([teamId])
  @@index([userId])
}
`

---

## TOURNAMENT REGISTRATION

`prisma
model TournamentRegistration {
  id String @id @default(auto())

  tournamentId String

  tournament Tournament @relation(
    fields: [tournamentId],
    references: [id]
  )

  playerId String?
  player User? @relation(
    fields: [playerId],
    references: [id]
  )

  teamId String?
  team Team? @relation(
    fields: [teamId],
    references: [id]
  )

  status RegistrationStatus @default(PENDING)

  approvedById String?
  approvedBy User? @relation(
    fields: [approvedById],
    references: [id]
  )

  notes String?

  metadata Json?

  createdAt DateTime @default(now())

  @@index([tournamentId])
  @@index([playerId])
  @@index([teamId])
  @@index([status])
}
`

---

## MATCH

`prisma
model Match {
  id String @id @default(auto())

  tournamentId String

  tournament Tournament @relation(
    fields: [tournamentId],
    references: [id]
  )

  competitorType CompetitorType

  competitorAId String
  competitorBId String

  winnerId String?

  bracketRound Int

  matchNumber Int?

  nextMatchId String?

  bestOf Int?

  scoreA Int @default(0)
  scoreB Int @default(0)

  sets MatchSet[]

  matchOfficials MatchOfficial[]

  scheduledAt DateTime?
  startedAt DateTime?
  endedAt DateTime?

  status MatchStatus @default(SCHEDULED)

  notes String?

  metadata Json?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([tournamentId])
  @@index([winnerId])
  @@index([bracketRound])
  @@index([status])
}
`

---

## MATCH SET (Embedded in Mongo)

`prisma
type MatchSet {
  setNumber Int

  scoreA Int
  scoreB Int

  winnerId String?
}
`

Example:

`json
[
  {
    \"setNumber\": 1,
    \"scoreA\": 11,
    \"scoreB\": 8
  },
  {
    \"setNumber\": 2,
    \"scoreA\": 9,
    \"scoreB\": 11
  }
]
`

---

## MATCH OFFICIAL (Embedded in Mongo)

`prisma
type MatchOfficial {
  userId String

  role OfficialRole
}
`

Example:

`json
[
  {
    \"userId\": \"user123\",
    \"role\": \"REFEREE\"
  }
]
`

---

# RELATIONSHIPS (ERD)

`txt
User
 ├── creates many Tournaments
 ├── joins many TournamentRegistrations
 ├── belongs to many Teams
 └── can be MatchOfficial

Game
 └── has many Tournaments

Tournament
 ├── belongs to Game
 ├── created by User
 ├── has many Teams
 ├── has many Matches
 └── has many TournamentRegistrations

Team
 ├── belongs to Tournament
 ├── has many TeamMembers
 └── used in TournamentRegistrations

TournamentRegistration
 ├── belongs to Tournament
 ├── references User OR Team
 └── approval lifecycle

Match
 ├── belongs to Tournament
 ├── competitorA / competitorB
 ├── contains MatchSet[]
 └── contains MatchOfficial[]
`

---

# MONGODB IMPLEMENTATION NOTES

REFERENCE COLLECTIONS:

- users
- games
- tournaments
- teams
- registrations
- matches

EMBEDDED DOCUMENTS:

- match.sets[]
- match.matchOfficials[]
- tournament.rules[]

DYNAMICALLY COMPUTED:

- standings
- leaderboard
- statistics

FUTURE MODULES:

- payments
- notifications
- chat
- live scoring
- analytics
- spectator mode
- email verification
- OTP
"}}

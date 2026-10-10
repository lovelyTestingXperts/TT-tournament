# Core Use Cases & Prompt Blueprints

> A practical guide for AI-assisted development in NestJS / GraphQL / MongoDB codebases.
> All examples below are grounded in a real-world **Tournament Tracker** monorepo architecture.

---

## 1. Boilerplate Generation

### When to Use

Setting up a brand-new service module, feature domain, or standalone utility **from scratch** — before any business logic is written. The goal is to produce a structurally complete, architecture-compliant scaffold that a developer can review, run, and start building on.

### Prompt Blueprint

```
Act as a Senior Backend Engineer. Read @application-architecture.md (or relevant
architecture/schema docs) to understand our architectural standards, database schema,
and naming conventions.

Generate a clean, production-ready [Language/Framework] boilerplate for a new
[Module/Feature] module that handles [domain description].

Include:
- Standard directory layout matching existing modules
- Mongoose schema with appropriate field types, indexes, and validations
- GraphQL entity (ObjectType) mirroring the schema
- DTOs (InputTypes) with class-validator decorators
- Enums registered with GraphQL
- Constants file for magic numbers/strings
- Service class with constructor injection (no implementation bodies yet)
- Resolver/Controller class with method signatures (no implementation bodies yet)
- Module file with proper imports/exports
- Wire the new module into the root AppModule

Do NOT write full implementation logic yet. Present the complete file structure,
scaffolding, and type-safe signatures first. The developer will review the structure
and run the application to verify everything compiles before proceeding.
```

### Concrete Example Prompt — Scaffolding a `User` Module

```
Act as a Senior Backend Engineer specialising in NestJS + GraphQL (code-first)
+ MongoDB/Mongoose within an Nx monorepo.

Review @docs/architecture/database-schema.md for the full database schema, field
types, indexes, and enum definitions. Also review the existing module at
@apps/gateway/src/app/modules/tournament/ as the reference implementation for our
directory layout, naming conventions, and coding patterns.

Generate a production-ready boilerplate for a new **User Management** module named
`user` under `apps/gateway/src/app/modules/user/`.

Scaffold the following files:

```
user/
├── dto/
│   ├── update-user.input.ts      # Partial update DTO with class-validator
│   └── users.input.ts            # Pagination/search/sort input DTO
├── entity/
│   ├── user.entity.ts            # GraphQL ObjectType
│   └── paginated-users.entity.ts # Wraps items[] + PaginationMeta
├── enums/
│   ├── sort-order.enum.ts        # ASC / DESC (register with GraphQL)
│   └── user-sort-field.enum.ts   # CREATED_AT, EMAIL, FULL_NAME
├── schemas/
│   └── user.schema.ts            # Mongoose schema matching DB docs
├── user.constants.ts             # Password lengths, name limits, salt rounds
├── user.module.ts                # NestJS module
├── user.resolver.ts              # GraphQL resolver (method stubs only)
└── user.service.ts               # Injectable service (method stubs only)
```

Requirements:
- The User schema must include all fields from @docs/architecture/database-schema.md:
  firstName, lastName, email (unique), password, phoneNumber, employeeId (unique),
  avatar, bio, role (enum: ADMIN/MEMBER/PLAYER/REFEREE), isActive, isEmailVerified,
  emailVerifiedAt, lastLoginAt, timestamps.
- Add a virtual field `fullName` (firstName + lastName).
- Register the `UserRole` enum with `registerEnumType`.
- DTOs must use `class-validator` decorators and reference constants for limits.
- The `PaginatedUsersEntity` should reuse the same `PaginationMeta` ObjectType pattern
  from the tournament module.
- Wire `UserModule` into `AppModule` at
  @apps/gateway/src/app/app.module.ts.
- Do NOT implement business logic in service methods — leave them as empty stubs
  with correct return types so the app compiles.

After generating, I will:
1. Review the file structure and code manually
2. Run `npx nx serve gateway` to confirm zero compilation errors
3. Verify the GraphQL playground loads with the new User types
```

---

## 2. Feature Building (New Implementation)

### When to Use

Adding **complete working functionality** — endpoints, service methods, queries, mutations — to an existing, established module. The scaffold already exists; now you're implementing the real business logic, query patterns, and edge-case handling.

### Prompt Blueprint

```
Review @instruction.md (or relevant architecture docs) for our coding practices,
error-handling conventions, and response formats.

I need to build a new feature: [detailed feature description with acceptance criteria].

Relevant context files:
- @Model/Schema file(s)
- @Existing Service(s) to integrate with
- @Module file(s)
- @DTO/Entity file(s)
- @Constants file(s)

Implementation requirements:
1. [Specific requirement — e.g., pagination pattern, sorting, filtering]
2. [Specific requirement — e.g., soft delete vs hard delete]
3. [Specific requirement — e.g., input validation rules]
4. [Specific requirement — e.g., error handling / NotFoundException]

Write a step-by-step plan first. Once confirmed, generate:
- Full service logic with proper Mongoose queries
- Resolver/Controller methods with decorators
- Updated DTOs if new fields are needed
- Unit tests for the service layer

Constraint: Do not break any existing functionality. All current queries/mutations
must continue to work as-is.
```

### Concrete Example Prompt — Building User CRUD APIs

```
Act as a Senior Backend Engineer. Review the following files for our established
patterns and current code:

- @apps/gateway/src/app/modules/user/user.service.ts
- @apps/gateway/src/app/modules/user/user.resolver.ts
- @apps/gateway/src/app/modules/user/user.module.ts
- @apps/gateway/src/app/modules/user/schemas/user.schema.ts
- @apps/gateway/src/app/modules/user/dto/users.input.ts
- @apps/gateway/src/app/modules/user/dto/update-user.input.ts
- @apps/gateway/src/app/modules/user/entity/user.entity.ts
- @apps/gateway/src/app/modules/user/entity/paginated-users.entity.ts
- @apps/gateway/src/app/modules/user/user.constants.ts
- @apps/gateway/src/app/modules/user/enums/sort-order.enum.ts
- @apps/gateway/src/app/modules/user/enums/user-sort-field.enum.ts

Also reference the tournament module's soft-delete implementation as the proven
pattern in our codebase:
- @apps/gateway/src/app/modules/tournament/tournament.service.ts

Task: Implement the complete CRUD API set for the User module with the following
specifications:

### 1. List Users — `users` Query (already exists, verify/enhance)
- Proper cursor-based pagination with `page`, `limit` params (max 100 per page)
- Search across `firstName`, `lastName`, `email` fields (case-insensitive regex)
- Sortable by `CREATED_AT`, `EMAIL`, `FULL_NAME` with `ASC`/`DESC` direction
- Must filter OUT soft-deleted users (`isDeleted: false`) — currently missing
- Return shape: `{ items: UserEntity[], meta: { total, page, limit, totalPages } }`

### 2. User Details — `user` Query (already exists, verify/enhance)
- Fetch single user by ID
- Must exclude soft-deleted users
- Throw `NotFoundException` with descriptive message if not found

### 3. Update User — `updateUser` Mutation (already exists, verify/enhance)
- Accept partial update via `UpdateUserInput`
- Validate all fields via class-validator decorators
- Must NOT allow updating soft-deleted users
- Return the updated `UserEntity`

### 4. Delete User — `deleteUser` Mutation (MODIFY — currently hard-deletes)
- **Change from hard delete to soft delete**: set `isDeleted = true` instead of
  calling `findByIdAndDelete()`
- Follow the exact same pattern used in `tournament.service.ts → softDelete()`
- Return `true` on success, throw `NotFoundException` if user not found or
  already deleted

### 5. Schema Update Required
- Add `isDeleted: Boolean` field to `user.schema.ts` (default: `false`)
- Add `isDeleted` field to `user.entity.ts` GraphQL ObjectType
- Update `@docs/architecture/database-schema.md` to reflect this new field

### Constraints:
- All existing queries/mutations must continue to work
- Follow existing error-handling patterns (NotFoundException with interpolated IDs)
- Use constants from `user.constants.ts` for any magic numbers
- All Mongoose queries on user lists must include `{ isDeleted: false }` in filter

After implementation, I will:
1. Run `npx nx serve gateway` to verify compilation
2. Test all mutations/queries in GraphQL Playground
3. Verify soft-deleted users are excluded from list and detail queries
4. Confirm the schema.gql auto-regenerates with the new `isDeleted` field
```

---

## 3. Feature Editing & Modification

### When to Use

Modifying **existing working logic** — adding fields, changing behavior, integrating cross-module data, fixing bugs, or refactoring specific blocks. This is the most precision-critical use case because you're changing live functionality.

### Prompt Blueprint

```
We are modifying our [Module/Feature]. Review the current implementation in these
files:

- @PrimaryService — the service being changed
- @PrimaryModel/Schema — the data model
- @RelatedService(s) — cross-module dependencies
- @RelatedModel(s) — related data models
- @DTOs — input/output types that may need updating
- @Entities — GraphQL types that may need updating

Task: [Precise description of the modification with clear before/after behavior]

Constraints:
- Because this changes [specific contract/interface], you MUST update BOTH
  [file A] AND [file B]
- Ensure no existing fields are broken or removed
- Existing API consumers must not experience breaking changes
- [Any additional constraint — backward compatibility, migration, etc.]

List every file you will modify and the exact changes before writing code.
```

### Concrete Example Prompt — Enriching User Details with Orders Data

```
Act as a Senior Backend Engineer. We are enhancing the User Details API to include
the user's order history alongside their profile information.

Review the current implementations:

**Primary module (being modified):**
- @apps/gateway/src/app/modules/user/user.service.ts
- @apps/gateway/src/app/modules/user/user.resolver.ts
- @apps/gateway/src/app/modules/user/entity/user.entity.ts
- @apps/gateway/src/app/modules/user/user.module.ts

**Cross-module dependency (data source for orders):**
- @apps/gateway/src/app/modules/order/order.service.ts
- @apps/gateway/src/app/modules/order/schemas/order.schema.ts
- @apps/gateway/src/app/modules/order/order.module.ts

Task: Modify the `user(id)` query so that the response includes the user's
recent orders. Specifically:

### Changes Required:

1. **`user.entity.ts`** — Add a new field:
   ```typescript
   @Field(() => [OrderEntity], { nullable: true })
   recentOrders?: OrderEntity[];
   ```

2. **`user.resolver.ts`** — Add a `@ResolveField()` for `recentOrders` that
   calls `OrderService.findByUserId(userId)` to lazily load orders only when
   the client requests them via the GraphQL query.

3. **`user.module.ts`** — Import `OrderModule` so that `OrderService` is
   available for injection in the resolver.

4. **`user.service.ts`** — No changes needed here. The order data comes from
   `OrderService`, not from the User collection. Keep separation of concerns.

### Constraints:
- Do NOT modify `order.service.ts` or `order.schema.ts` — they are read-only
  dependencies in this task
- The `users` (list) query must NOT be affected — `recentOrders` is only
  resolved on the single `user(id)` detail query to avoid N+1 performance issues
- Use `@ResolveField()` decorator pattern (not eager loading) so orders are
  fetched only when the client's GraphQL query includes `recentOrders` in the
  selection set
- Ensure `OrderModule` exports `OrderService` (verify this; if not, flag it
  as a prerequisite change)
- Add the new `OrderEntity` import — do not duplicate the type definition
- Existing fields on `UserEntity` must remain unchanged

### After implementation, I will:
1. Review all changed files to verify no existing fields were removed or renamed
2. Run `npx nx serve gateway` to confirm compilation
3. Test the `user(id)` query WITH `recentOrders` in the selection set
4. Test the `user(id)` query WITHOUT `recentOrders` to confirm no unnecessary
   DB calls
5. Test the `users` (list) query to confirm it is unaffected
```

---

## Quick Reference — Prompt Anatomy

Every effective AI prompt for code generation follows this structure:

| Section | Purpose | Example |
|---------|---------|---------|
| **Role** | Sets expertise level and domain | *"Act as a Senior Backend Engineer specialising in NestJS + GraphQL"* |
| **Context** | Points to architecture docs and reference files | *"Review @database-schema.md ... also reference @tournament.service.ts"* |
| **Task** | Clear, unambiguous description of what to build | *"Implement soft delete following the tournament pattern"* |
| **Specifications** | Numbered acceptance criteria | *"1. Pagination with max 100 per page..."* |
| **Constraints** | Guardrails and non-negotiables | *"Must not break existing queries"* |
| **File References** | Explicit `@file` tags for every relevant file | *"@user.service.ts @user.schema.ts @user.entity.ts"* |
| **Verification Steps** | What the developer will do after AI finishes | *"Run the app, test in Playground, verify schema.gql"* |

---

## Workflow Summary

```
┌─────────────────────────────────────────────────────────────────────┐
│                     AI-Assisted Development Flow                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────┐    Developer    ┌──────────────────────────┐  │
│  │  1. BOILERPLATE   │───reviews &───▶│  2. FEATURE BUILDING     │  │
│  │  GENERATION       │   runs app     │  (New Implementation)    │  │
│  │                   │                │                          │  │
│  │  • Module scaffold│                │  • Full CRUD logic       │  │
│  │  • Schema/Entity  │                │  • Pagination / search   │  │
│  │  • DTOs / Enums   │                │  • Soft delete           │  │
│  │  • Method stubs   │                │  • Error handling        │  │
│  │  • Wiring         │                │  • Validation            │  │
│  └──────────────────┘                └────────────┬─────────────┘  │
│                                         Developer │                 │
│                                         reviews & │                 │
│                                         tests APIs│                 │
│                                                   ▼                 │
│                                      ┌──────────────────────────┐  │
│                                      │  3. FEATURE EDITING      │  │
│                                      │  (Modification)          │  │
│                                      │                          │  │
│                                      │  • Cross-module changes  │  │
│                                      │  • New field additions   │  │
│                                      │  • Behavior changes      │  │
│                                      │  • Contract updates      │  │
│                                      └────────────┬─────────────┘  │
│                                         Developer │                 │
│                                         reviews & │                 │
│                                         tests API │                 │
│                                                   ▼                 │
│                                           ✅ Ship It                │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Tips for Maximum Effectiveness

> [!TIP]
> **Always attach real file references.** Generic prompts produce generic code.
> `@user.service.ts` forces the AI to match your actual patterns.

> [!IMPORTANT]
> **Separate scaffolding from implementation.** Don't ask the AI to scaffold AND
> implement in one shot. Review the structure first, then fill in the logic. This
> catches architectural mismatches before they compound.

> [!WARNING]
> **Specify soft delete vs hard delete explicitly.** If you don't, the AI will
> default to `findByIdAndDelete()`. Always reference the pattern you want:
> *"Follow the soft-delete pattern in @tournament.service.ts"*.

> [!CAUTION]
> **Cross-module changes are the highest risk.** When a modification touches
> multiple modules (e.g., adding order data to user details), explicitly list
> EVERY file that must change and EVERY file that must NOT change. Ambiguity
> here causes silent breakage.

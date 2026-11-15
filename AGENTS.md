<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# PH Car Wash System — Project Source of Truth

Last updated: 2026-11-16. Status: public services list (cards, branch filter) and service details page (Book Now) built. The public list currently shows no cards because of an in-progress owner filter in `services.ts` (K38). Earlier status: backend foundation done. Branch manager services page done (list own services, Add Service dialog, create through a server action), tested in headless Chrome. Not yet secured: the Express POST has no auth (K20). Open decisions in §14 (D1, D3, D5 block the JWT step).

This file lives in the client repo and covers both repos. Update it when a decision changes or a phase completes.

## 1. Project overview

A car washing booking system for a Programming Hero conceptual session.

- **Users** browse services, filter by branch, view service details, book, pay with Stripe, and see their own bookings (including upcoming ones).
- **Branch managers** create services for their own branch, and view the services they created and the bookings for their branch.
- **Admins** view and manage users, update user roles, and view all services and all bookings.
- **Branches** are hardcoded (no collection): **Dhaka, Chittagong, Khulna, Sylhet**.

Working rules from the brief: keep it simple and beginner-friendly; no unnecessary libraries; reuse existing components; do not break auth or the dashboard; the backend verifies JWTs; never trust a role sent by the frontend; branch managers are limited to their own branch; users see only their own bookings; admins see everything.

Coding style (owner instruction, 2026-11-15, applies to all new and changed code): write every file in a beginner-friendly, easy-to-understand way. Use plain code and clear names, keep functions short with one job each, add short plain-English comments that explain *why*, avoid advanced TypeScript and clever patterns when a simple version works, and avoid new libraries unless they are needed. Implement only the core feature that was asked for. No over-engineering and no extra validation unless leaving it out would crash the page (owner instruction, 2026-11-16).

## 2. Repositories and current architecture

Workspace root: `e:\PH\B14\Conceptual_session\milestone-9\`

| Repo | Folder | Stack | State |
|---|---|---|---|
| Client | `ph-car-wash-system-client/` | Next.js 16 (App Router) | Auth works. Dashboard shell exists. Most pages are placeholders. |
| Server | `ph-car-wash-system-server/` | Express 5, plain JavaScript (ESM) | Foundation done. Routes mounted at root: `GET /test`, `GET/POST /services` (no auth yet). See K23. |

```
Browser ──► Next.js client :3000
            ├─ /api/auth/*  Better Auth (cookie session) ──► MongoDB "ph-car-wash-system"
            └─ pages / dashboard (server reads session with auth.api.getSession)

Browser ──► Next.js server actions / Server Components ──► Express server :5000 (`/services`)
                                                            (the browser never calls Express directly)
            └─ MongoDB "ph-car-wash-system"
```

Next.js 16 renamed Middleware to **Proxy** (`proxy.ts`). Per Next's docs, Proxy is an optimistic check only and should not be the sole authorization layer. Check sessions in layouts and data access too.

## 3. Frontend stack (client)

- Next.js 16.4.6 (App Router), React 19.3.0, TypeScript 5. React Compiler enabled in `next.config.ts`.
- Tailwind CSS 4.3.3, shadcn/ui components in `src/components/ui/`, lucide-react icons.
- Better Auth 1.7.19 with `@better-auth/mongo-adapter`; `mongodb` 7.8.0 driver.
- Many shadcn-related packages are already installed. Reuse before adding new packages.

Route map (current):

| Route | Status |
|---|---|
| `/` (root layout: Header + Navbar) | Placeholder ("Homepage") |
| `/signin`, `/signup` | Working (Better Auth client) |
| `/services` | **Public.** Service cards with a branch filter (`?branch=Dhaka`). Plain links, no JavaScript needed. |
| `/services/[id]` | **Public.** Service details with key features and a Book Now button. Unknown id → 404 page. |
| `/booking/[id]` | Placeholder page. The real booking form is the bookings step. |
| `/dashboard` | Placeholder (no redirect to role dashboard) |
| `/dashboard/user`, `/bookings`, `/bookings/upcoming`, `/profile` | Placeholders |
| `/dashboard/branchManager/services` | **Working.** Own services in a shadcn table, "Add Service" dialog (server action) |
| `/dashboard/branchManager`, `/bookings`, `/bookings/upcoming`, `/profile` | Placeholders |
| `/dashboard/admin`, `/users`, `/services`, `/bookings`, `/bookings/upcoming`, `/branches`, `/branches/add`, `/profile` | Placeholders |
| `/api/auth/[...all]` | Better Auth handler |

## 4. Backend stack (server)

- Express 5.3.0, `"type": "module"`, plain JavaScript (ESM). TypeScript dropped by owner decision (D2).
- `mongodb` 7.8.0 native driver, `cors`, `dotenv` 18. No other packages.
- Scripts: `npm start` (`node src/index.js`), `npm run dev` (`node --watch src/index.js`). No test runner yet.
- Structure:

```
src/
  index.js               entry: connect to MongoDB, then listen
  app.js                 Express app: CORS, JSON parsing, routes at root, 404, error handler
  config/env.js          loads .env, requires DB_URI, exports `env`
  config/db.js           connectDB / getDb / closeDB (database name ph-car-wash-system)
  middleware/notFound.js 404 for unknown routes
  middleware/errorHandler.js  one place that turns errors into JSON
  routes/index.js        mounts routers at root; GET /test (health check)
  routes/services/       GET /services, POST /services (raw insert, no validation yet)
  routes/users/          placeholder (endpoints in Phase 5)
  routes/bookings/       placeholder (endpoints in Phase 3)
  utils/ApiError.js      error with an HTTP status code
  utils/apiResponse.js   sendSuccess helper
```

- Response shapes: success `{ success: true, message, data }`; error `{ success: false, message }`.
- Unknown route → 404. Malformed JSON → 400. Unexpected errors → 500 with a generic message; the details are logged on the server only.
- CORS allows only `CLIENT_URL` (default `http://localhost:3000`).
- Route handlers use `getDb()`. They can throw `ApiError`, and Express 5 forwards async errors to the error handler.

## 5. Authentication flow (existing — do not replace)

1. Sign up / sign in in the browser through `authClient` (`src/lib/auth-client.ts`), which calls Better Auth endpoints under `/api/auth/*` on Next.js.
2. Better Auth stores data in MongoDB collections `user`, `session`, `account`, `verification`.
3. Better Auth sets a session cookie. Server components read it with `auth.api.getSession({ headers })` (`src/app/(dashboard)/layout.tsx`).
4. `role` is an additional user field (`src/lib/auth.ts`): type `admin | user | branchManager`, `input: false` (clients cannot set it at signup), default `user`. `branch` is also a user field: one of the four branches, optional (`required: false`), `input: false`. Signup with a `branch` in the body is rejected (400 `FIELD_NOT_ALLOWED`). A `role` in the body is ignored. `update-user` rejects `branch`. Only the server can set it, through an admin endpoint that is not built yet (ADM1). Better Auth does not validate enum values at runtime, so Express must check the value.
5. Google sign-in is a stub (`src/components/auth/GoogleButton.tsx`).

**Planned, not built:** Express must verify a JWT sent by the frontend. Better Auth 1.7.19 ships a `jwt` plugin that exposes `/api/auth/token` (returns a JWT for the current session) and `/api/auth/jwks` (public keys for verification). It is not enabled yet. Enabling it adds to the existing setup and does not replace it. Confirm the token payload and key algorithm when enabling.

## 6. Authorization flow (planned)

Reusable Express middleware:

- **`verifyToken`**: reads `Authorization: Bearer <jwt>`, verifies the signature against the JWKS, checks expiry, loads the user from the `user` collection by the token's subject id, and sets `req.user = { id, email, role, branch }`. Returns 401 on any failure.
- **`requireRole(...roles)`**: returns 403 unless `req.user.role` is one of `roles`. Never reads the role from body, query, or headers.

Handler rules:

- **Services create / update / delete**: `branchManager` or `admin`. A branch manager's branch comes from `req.user.branch`, never from the body. Editing another branch's service → 403 (admin is exempt).
- **Bookings list**: `user` → own bookings only (`user = req.user.id`). `branchManager` → `branch = req.user.branch`. `admin` → all.
- **Booking create**: `user` role only. The booking's `user` is always `req.user.id`.
- **Admin endpoints** (users, roles, branches): `admin` only.
- Frontend role checks (sidebar, redirects) are UI only and are never a security boundary.

## 7. User roles

| Value in code (use this) | Name in brief | Dashboard path | Users in dev DB |
|---|---|---|---|
| `user` | user | `/dashboard/user` | 3 |
| `branchManager` | branch_manager | `/dashboard/branchManager` | 1 |
| `admin` | admin | `/dashboard/admin` | 1 |

Counts checked read-only on 2026-11-15. No emails are recorded here. See D1.

## 8. Database collections

| Collection | Owner | Exists now | Notes |
|---|---|---|---|
| `user` | Better Auth + `role` (+ planned `branch`) | Yes (5 docs) | No server code reads it yet. Always use `user`, not `users` (K3). |
| `session`, `account` | Better Auth | Yes (6 / 5 docs) | |
| `verification` | Better Auth | No | Created on first use. |
| `jwks` | Better Auth jwt plugin | No | Created when the jwt plugin is enabled. |
| `services` | App | No | Created on first insert. |
| `bookings` | App | No | Created on first insert. |
| `branches` | — | Not a collection | Hardcoded constant. Server has it commented out. |

Planned fields:

- **services**: `name`, `branch` (one of the 4 branches), `image` (URL string), `description`, `price` (number), `duration` (minutes), `keyFeatures` (string array), `slot` (optional string), `createdBy` (user id), `createdAt`, `updatedAt`.
- **bookings**: `user` (user id), `service` (service id), `branch`, `bookingDate` (Date), `slot` (optional string), `paymentStatus` (`pending | paid | failed`), `stripeSessionId`, `stripePaymentIntentId` (optional), `bookingStatus` (`pending | confirmed | cancelled`), `createdAt`, `updatedAt`.
- **user** (added, implemented in `src/lib/auth.ts`): `branch` (one of the 4 branches, optional, `input: false`). Only branch managers should have one, so the admin endpoint must set it for `branchManager` and clear it when the role changes. No user has one yet (K17).

"Upcoming" = `bookingDate >= now` and `bookingStatus !== "cancelled"`.

## 9. API modules (partly built; rest planned)

Implemented:
- `GET /test`: health check (renamed from `/api/health` by the owner).
- `GET /services`: public, unfiltered, returns `{ success, message, data }`.
- `GET /services/:id`: one service (added 2026-11-16 for the details page). Returns 404 for a bad or unknown id.
- `POST /services`: inserts the raw request body with `insertOne`, no auth, no validation, and returns the raw insert result (`{ acknowledged, insertedId }`), not the standard shape (K20, K21).
- `/users` and `/bookings` are mounted as routers. Only placeholder routes exist.

The planned `/api` prefix (below) is not in use. Next.js keeps `/api/auth/*` on port 3000. The URL shape needs a decision (K23).

| Module | Method & path | Access | Notes |
|---|---|---|---|
| services | GET `/api/services?branch=` | Public | Optional branch filter |
| services | GET `/api/services/:id` | Public | Service details |
| services | GET `/api/services/mine` | branchManager | Services they created |
| services | POST `/api/services` | branchManager, admin | Branch forced to the manager's branch |
| services | PATCH `/api/services/:id` | branchManager (own branch), admin | |
| services | DELETE `/api/services/:id` | branchManager (own branch), admin | Optional for MVP |
| bookings | POST `/api/bookings` | user | Creates a `pending` booking |
| bookings | GET `/api/bookings?upcoming=true` | user, branchManager, admin | One endpoint; results scoped by role (§6) |
| payments | POST `/api/payments/checkout` | user | Creates a Stripe Checkout session for the user's own pending booking |
| payments | POST `/api/payments/webhook` | Stripe (signature verified) | Mount before `express.json()` so the raw body is available |
| users | GET `/api/users` | admin | |
| users | PATCH `/api/users/:id/role` | admin | Allowed values only; cannot change own role |
| users | PATCH `/api/users/:id/branch` | admin | Needed for branch managers |

Auth endpoints stay on Next.js. Express does not implement auth.

## 10. Environment variables

Values are intentionally not recorded in this file. Both `.env` files are git-ignored.

**Client** (`ph-car-wash-system-client/.env`, exists):
- `BETTER_AUTH_SECRET`: Better Auth signing secret.
- `BETTER_AUTH_URL`: `http://localhost:3000`.
- `DB_URI`: MongoDB connection string.

**Client, planned:**
- `NEXT_PUBLIC_API_URL`: Express base URL, e.g. `http://localhost:5000`. Implemented (read by `src/lib/api/config.ts`; the app only calls it from the server). Template: `.env.example`, which `.gitignore` now allows.

**Server** (`ph-car-wash-system-server/.env`, git-ignored):
- `DB_URI`: required. The server exits at startup if it is missing.
- `PORT`, `CLIENT_URL`: optional. Defaults are 5000 and `http://localhost:3000`. They are not in the current `.env`, so the defaults apply.
- Template: `ph-car-wash-system-server/.env.example` (placeholders only, committed).

**Server, planned:**
- `BETTER_AUTH_URL`: where to fetch the JWKS (`<this>/api/auth/jwks`). Needed for B5.
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`. Needed for Phase 4.

## 11. Current implementation status

| Area | Status |
|---|---|
| Sign up / sign in / sign out (Better Auth) | Working |
| `role` additional field | Done (3 values present in dev DB) |
| Dashboard shell (sidebar, header, user menu, role-based nav) | Done (UI only) |
| Role dashboards and subpages | Placeholder text only |
| Route protection (signed-out redirect, wrong-role block) | Missing |
| Public services list (cards, branch filter) and service details (Book Now) | Done (2026-11-16) |
| Public pages (home, booking form, about, compare) | Missing / placeholder |
| Services: branch manager create + own list | **Working in the UI.** Create goes through a server action; the list is `GET /services` filtered to the caller on the page. The server still has no auth and no owner filter (K20, K25). |
| Services: public browse, branch filter, details, edit, delete | Missing |
| Bookings (create, list, upcoming) | Missing |
| Stripe payment | Missing (package not installed) |
| Express foundation (structure, env validation, MongoDB connection, CORS, JSON parsing, errors, response shape) | Done and tested |
| Express JWT verification (`verifyToken`, `requireRole`) | Missing (B5) |
| Better Auth JWT plugin | Not enabled |
| Branch assignment for branch managers | Partly. The `branch` field exists on the user and in the session (`src/lib/auth.ts`). The admin endpoint that sets it is missing (ADM1). |
| Admin user management | Missing |
| Frontend ↔ backend calls | Two, both server-side in Next.js: `getServices()` (`src/lib/api/services.ts`, GET) and `createService` (`src/lib/action/services.ts`, POST) |
| Automated tests | None in the repo. A 12-check smoke test was run once from outside the repo and passed (2026-11-15). |
| Type check | `tsc` reports an error in `src/app/(root)/layout.tsx` (K7) |

## 12. Completed tasks

- Public pages (2026-11-16): `/services` (service cards from `GET /services`, branch filter with plain links), `/services/[id]` (details, key features, Book Now link), `/booking/[id]` placeholder, and server route `GET /services/:id`. Checked with 13 HTTP checks (API, list, filter, details, 404, placeholder) and a headless screenshot of the list. The `[id]` route and the filter both worked before the in-progress edit in K38.

- Client: Next.js app with shadcn/ui; Better Auth configured with the MongoDB adapter and `role` field; signup and signin forms; Better Auth route handler. (Initial commit `9d88e3d`.)
- Client: dashboard layout with role-based sidebar and header; per-role page folders created (placeholders).
- Server (original): Express app that connected to MongoDB and served `GET /services`. Superseded by the foundation below.
- Server: backend foundation in JavaScript (Phase 1 B1–B3). Folder structure, env validation, MongoDB connection with ping, CORS limited to `CLIENT_URL`, JSON parsing, 404 and error handler, response helpers, `/api` routing, `start` and `dev` scripts, `.env.example`. The old root `index.js` was removed.
- Server verified on 2026-11-15 (12/12 checks): startup and listen, MongoDB connection, health, services read, 404 JSON, malformed JSON → 400, CORS allow and deny, preflight, missing `DB_URI` and unreachable database both exit with code 1. `npm start` and `npm run dev` both start on port 5000.
- Client: branch manager services page (`/dashboard/branchManager/services`). Server Component reads the session, redirects signed-out or wrong-role visitors, loads services with `getServices()`, and shows only the caller's own (`createdBy === session.user.id`) in a shadcn table. Includes an empty state and an "Add Service" button at the top of the page.
- Client: "Add Service" dialog (shadcn Dialog) with a form (name, branch select of the four branches, image URL, description, price, duration in minutes, key features one per line, optional slot). The form's `onSubmit` calls `createService(new FormData(form))` inside `startTransition` (the pattern in the Next.js docs), and shows field errors from the result next to each field. Inputs keep their values after an error because the form has no action reset. A successful save closes the dialog and shows a toast. The table refreshes through `revalidatePath`, about 2.8s later in dev.
- Client: `createService(formData)` server action (`src/lib/action/services.ts`). Reads the session on the server, allows `branchManager` and `admin` only, validates every field, sets `createdBy` from the session (never from the form), POSTs to Express, and calls `revalidatePath`. Unexpected errors are logged with a stack and return a plain message.
- Client: shared types (`TService`, `TServiceFormState`), `BRANCHES` constant (`src/lib/branches.ts`), `.env.example`, and `.gitignore` allows `.env.example`.
- Auth data: `branch` user field added in `src/lib/auth.ts` (enum of the four branches, `input: false`, optional). Verified through Better Auth's handler: signup with `branch` returns 400 `FIELD_NOT_ALLOWED`, `role` in the body is ignored, `update-user` rejects `branch`, and a branch set on the server appears in the session.
- Data: backfill script `ph-car-wash-system-server/scripts/backfill-branch-managers.js` (dry run by default, `--apply` to write). Ran on 2026-11-15: one branch manager set to `Dhaka`. Re-run dry-run showed 0 left.
- Verified 2026-11-15 in headless Chrome, against the developer's running servers, with a temporary branch manager that was deleted afterward: page renders; Add Service opens the dialog; invalid submit shows field errors and saves nothing; valid submit saves a row with `createdBy` = session user, closes the dialog, shows a toast, and lists the service; the table shows branch, price, duration. 11/11 checks. Screenshots were reviewed.
- Verified read-only on the dev database: collections `user`, `session`, `account` exist; `services`, `bookings`, `verification`, `jwks` do not yet.

## 13. Pending tasks and roadmap

Work in phases. Finish one phase, review it, then start the next. Keep each step small enough to test by hand.

### Phase 0 — Fix foundations (client; no new features)

- **P0-1** Fix `src/lib/auth-client.ts`: remove the import of the server `auth` module (K1). Use one `createAuthClient` and import `auth` as a type only for `inferAdditionalFields<typeof auth>()`.
- **P0-2** Fix the type error in `src/app/(root)/layout.tsx` (K7).
- **P0-3** Route protection: add `src/proxy.ts` for an optimistic redirect to `/signin` when there is no session cookie. In `(dashboard)/layout.tsx`, redirect signed-out users to `/signin`. Make `/dashboard` redirect to `/dashboard/{role}`. Each role folder checks the role on the server and redirects a mismatch to the user's own dashboard (K2).
- **P0-4** Make `Header.tsx` use `auth.api.getSession`, like the dashboard layout, and remove the unused import (K9).
- **P0-5** Remove debug `console.log` calls (K12).
- **P0-6** Resolve D1 (role string) and D10 (admin Branches pages).

### Phase 1 — Backend foundation (server)

- **B1 ✅ Done, in JavaScript (D2).** Foundation built and tested (see §12).
- **B2 ✅ Done.** Structure is `src/app.js`, `src/index.js`, `src/config/`, `src/middleware/`, `src/routes/{users,services,bookings}/`, `src/utils/`. Still to add: `src/constants/branches.js` (Phase 2) and `src/routes/payments/` (Phase 4).
- **B3 ✅ Done.** No code reads `users` (K3). The only data access is the `services` collection.
- **B4** Enable the Better Auth `jwt()` plugin in `src/lib/auth.ts`. Add the `branch` additional field (D5). Verify `/api/auth/token` and `/api/auth/jwks` from a signed-in browser session, and confirm the payload includes the user id.
- **B5** Implement `verifyToken` (D3, D4) and `requireRole`. Verify: no token → 401, wrong role → 403, right role → 200.
- **B6** Add `GET /api/services/mine` as the first protected route, to prove the whole chain end to end.

### Phase 2 — Services (vertical slice 1)

- **S1** Backend: `GET /api/services` (branch filter), `GET /api/services/:id`, `POST`, `PATCH`, `DELETE`, `GET /mine` (§9). Validate `branch` against the constant list, `price` ≥ 0, `duration` > 0.
- **S2 (partly ✅)** Frontend: branch manager page `/dashboard/branchManager/services` is done (own-services table, Add Service dialog, create action; image as a URL input, D7), and `NEXT_PUBLIC_API_URL` is wired. Still to do: public `/services` page with branch tabs (reuse `Card`, `Badge`, `Tabs`), `/services/[id]` details page, and switching the page from client-side owner filtering to `GET /services/mine` once it exists.
- Pause for owner review before Phase 3.

### Phase 3 — Bookings (vertical slice 2)

- **BK1** Backend: `POST /api/bookings` (user, `pending`); `GET /api/bookings?upcoming=true` (role-scoped).
- **BK2** Frontend: `/booking/[serviceId]` (date + optional slot); user bookings and upcoming pages; branch manager bookings and upcoming pages; admin bookings and upcoming pages.
- Pause for review.

### Phase 4 — Stripe payment (vertical slice 3)

- **PAY1** Install `stripe` in the server (required by the brief). `POST /api/payments/checkout` creates a Checkout Session for the user's own pending booking, stores `stripeSessionId`, and returns the URL.
- **PAY2** `POST /api/payments/webhook` with signature verification. On `checkout.session.completed`, set `paymentStatus: paid` and `bookingStatus: confirmed`. Mount before `express.json()`. (D8)
- **PAY3** Frontend: redirect to Stripe; `/booking/success` and `/booking/cancel` pages.

### Phase 5 — Admin

- **ADM1** `GET /api/users`, `PATCH /api/users/:id/role`, `PATCH /api/users/:id/branch`.
- **ADM2** Admin users page (table with role and branch selects). Reuse the services and bookings list pages for the admin "all" views.

### Phase 6 — Polish

- Replace placeholder pages. Fix dead links (K8) by implementing or removing them. Add `/profile` pages.
- Set app metadata (K14). Add setup steps to both READMEs.

## 14. Important decisions

**Locked** (already in code or data):
- Better Auth stays as the auth system. Do not replace it.
- `role` is a Better Auth additional field with `input: false`.
- Database name `ph-car-wash-system`, shared by both apps.
- Branches are a hardcoded list, not a collection.
- `.env` files are not committed.

**Proposed — need owner answers** (recommendation first):

| ID | Question | Recommendation |
|---|---|---|
| D1 | Role string: `branchManager` (in code and in dev DB) or `branch_manager` (brief)? | Keep `branchManager`. Switching means code changes plus migrating the existing user document. |
| D2 | Server language | **Resolved: JavaScript** (owner instruction, 2026-11-15). The brief said TypeScript; that was not pursued. |
| D3 | JWT verification library | `jose` with the JWKS (small, standard). Alternative: `verifyJWT` exported by `better-auth` (no new package, but the server then imports better-auth). |
| D4 | Where `verifyToken` gets the role | Load role and branch from the `user` collection on each request, so admin changes apply immediately. Alternative: trust the JWT claim (changes apply only after the token expires). |
| D5 | How a branch manager gets a branch | Add a `branch` additional field (`input: false`), set through an admin endpoint. |
| D6 | Booking time model | `bookingDate` (date) + optional `slot` string. No capacity limits for MVP. |
| D7 | Service image | URL string, matching the signup form's image URL field. No upload library. |
| D8 | Payment confirmation | Stripe webhook (reliable). Alternative: confirm on the success page (simpler, less reliable). |
| D9 | Mongo access in the server | Native `mongodb` driver (already installed in both repos). Alternative: Mongoose (extra dependency). |
| D10 | Admin "Branches" pages | Remove them, since branches are hardcoded. Covers the sidebar item and `/dashboard/admin/branches*`. |
| D11 | Google sign-in | Leave as a stub until requested. |
| D12 | Where this file lives | This client repo only. The server gets no second doc. |

**Status:** D2, D9 (native driver), and D12 are applied. D1, D3, D4, and D5 are still open. They block B4 and B5.

## 15. Known issues

| ID | Issue | Where |
|---|---|---|
| K1 | The client auth module imports the server `auth` module, and it creates two Better Auth clients. The import is used only as `typeof auth`, so the compiler should drop it. The 2026-11-15 browser test compiled the form with no MongoDB errors, so bundling was not observed; keep the import type-only. The second `createAuthClient()` lacks the `inferAdditionalFields` plugin (K34). `BETTER_AUTH_URL` is not `NEXT_PUBLIC_`, so the client `baseURL` is undefined. | `src/lib/auth-client.ts:2,5,11` |
| K2 | Dashboard not protected: signed-out visitors see the shell, and any signed-in user can open another role's dashboard URL. The sidebar only hides links. | `src/app/(dashboard)/layout.tsx` |
| K3 | **Resolved.** The old server read collection `users`, but the real collection is `user`. The old `index.js` was removed and no new code uses `users`. | (removed) |
| K4 | **Partly resolved.** CORS now allows only `CLIENT_URL`. `GET /api/services` is still public and unfiltered. That is intended until Phase 2 adds the branch filter and protection. | `src/app.js`, `src/routes/services/index.js` |
| K5 | **Resolved.** Startup connects to MongoDB before listening. On failure it logs the error and exits with code 1. The listen log uses the real port. Verified by test. | `src/index.js` |
| K6 | **Resolved.** `start` and `dev` scripts were added. The language is JavaScript by decision (D2). | `package.json` |
| K7 | **Resolved 2026-11-16.** The root layout now types `children`. (Old note: type error: `children` implicitly `any` in the root layout. Stale `.next/types` also references the removed `src/app/page.js`; a build clears it. | `src/app/(root)/layout.tsx:5` |
| K8 | Partly resolved 2026-11-16: `/services` and `/services/[id]` now exist. Still dead: `/profile`, `/compare`, `/about`, `/booking` (root, with no id), `/forgot-password`. | `Header.tsx:88`, `DashboardSidebar.tsx:261`, `Navbar.tsx:5-7,30`, `SigninForm.tsx:105` |
| K9 | `Header` is an async server component that calls `authClient.getSession` (an HTTP round-trip to itself) and imports `auth` without using it. The dashboard layout uses `auth.api.getSession`. | `src/components/shared/Header.tsx:12,26` |
| K10 | Role name mismatch with the brief (`branchManager` vs `branch_manager`). | See D1 |
| K11 | Admin "Branches" pages conflict with hardcoded branches. | `src/app/(dashboard)/dashboard/admin/branches/*` |
| K12 | Debug `console.log`: the sidebar logs on every render; sign-in and sign-up log response data. | `DashboardSidebar.tsx:147`, `SigninForm.tsx:47,55`, `SignupForm.tsx:79` |
| K13 | Google sign-in is a stub. | `GoogleButton.tsx:22` |
| K14 | Metadata title is still "Create Next App". | `src/app/layout.tsx` |
| K15 | Both `.env` files hold a database connection string with credentials in plain text. The client `.env` also holds the auth secret. Both are git-ignored and untracked, but rotate them before sharing the folder, screen-sharing, or committing. Values are not recorded here. | Both repos |
| K16 | Uncommitted changes. Client: `src/lib/auth.ts` (trailing comma only) and untracked `src/assets/`. Server: the old root `index.js` was deleted and replaced by `src/index.js`, and the new files are untracked until committed. | `git status` in each repo |
| K17 | **Resolved 2026-11-15.** Existing branch managers had no branch. The one existing branch manager was backfilled to `Dhaka` with `scripts/backfill-branch-managers.js --apply`. Only branch managers missing a branch are touched. Other managers created later need an admin to set their branch (ADM1). | `ph-car-wash-system-server/scripts/backfill-branch-managers.js` |
| K30 | 13 `session` and 13 `account` documents from earlier test runs are orphaned: their `userId` matches no user. They are inert, but still in the database. Cause: the test cleanup deleted by a string `userId`, while the stored value is an ObjectId, so the delete matched nothing. Cleanup was denied by the permission system; it still needs approval. To remove them, delete `session` and `account` documents where `userId` is not in the list of current user `_id`s. | `user`, `session`, `account` collections |
| K31 | `branch manager 2` (gmail account, created 2026-11-15 17:19 UTC) has role `user`, not `branchManager`. The backfill correctly skipped it. Change its role to branch manager through the admin endpoint (ADM1), then set its branch. | `user` collection |
| K32 | `services.ts` now stores `createdBy: session.user.email`. The stable owner key is `session.user.id`, because email can change and is personal data. The browser test's `createdBy` check fails on this. Decide: switch back to the id. | `src/lib/action/services.ts` |
| K33 | The page no longer filters to the signed-in manager's own services. The table shows every service from every branch and creator, which breaks the "owned services" rule (§11). Decide before the next run. | `src/app/(dashboard)/dashboard/branchManager/services/page.tsx` |
| K34 | `ServiceForm` reads `branch` from `useSession()` in `auth-client.ts`. That export comes from the second `createAuthClient()` call, which has no `inferAdditionalFields` plugin, so TypeScript reports `Property 'branch' does not exist` (the build's type check would fail). Fix: use the typed client, or read the session on the server. | `src/lib/auth-client.ts:11`, `src/components/dashboard/branchManager/ServiceForm.tsx:34` |
| K35 | The server still trusts the branch sent in the form. For branch managers it must use `session.user.branch` (see K22). The read-only field in the form is display only. | `src/lib/action/services.ts` |
| K36 | Debug `console.log` calls in `ServiceForm.tsx` (two). Remove before the feature is finished. | `src/components/dashboard/branchManager/ServiceForm.tsx` |
| K37 | If a page says `... is not a function` after you edit a shared file (for example `lib/api/services.ts`), the running `npm run dev` kept an old copy. Stop the dev server and start it again. This happened on 2026-11-16 and cleared after a reload. | Dev server only |
| K38 | **Open, 2026-11-16.** `src/lib/api/services.ts` line 12 is in an in-progress edit: `?createdBy="branchmanager4@gmail.com"` filters the public list, so `/services` shows no cards while it is in place. (The earlier syntax error is fixed; the page returns 200 again.) Keep `getServices()` unfiltered for the public page. Put any owner filter (K25) in a separate function used only by the dashboard. | `src/lib/api/services.ts:12` |
| K18 | On Windows, `child.kill("SIGINT")` is a hard kill, so the graceful shutdown path (close DB, exit 0) is not automated. Check it manually: run `npm run dev`, press Ctrl+C, and confirm the process exits cleanly. | `src/index.js` |
| K19 | `npm test` is a placeholder. The repo has no automated tests. | `package.json` |
| K20 | **Express `POST /services` has no auth and no validation.** Anyone who can reach port 5000 can insert any document, including a fake `createdBy` or branch. The Next action validates, but direct calls to Express bypass it. Fix in B4/B5. | `ph-car-wash-system-server/src/routes/services/index.js` |
| K21 | Express `POST /services` returns the raw `insertOne` result, but `GET` returns `{ success, message, data }`. The action only checks `res.ok`, so the shapes stay inconsistent. | same file |
| K22 | Branch is not enforced. A branch manager can pick any of the four branches in the form, because users have no `branch` field yet (D5). | `src/lib/action/services.ts`, B5 |
| K23 | URL shape is undecided. AGENTS §9 planned `/api/...`, but the server now mounts at root (`/services`), and the health route moved to `/test`. Pick one before more routes are added. | `ph-car-wash-system-server/src/app.js`, `src/routes/index.js` |
| K24 | `createdBy` is set by the Next action from the session. That is correct for now, but Express must set it from the verified token and ignore any body value (B5). | `src/lib/action/services.ts` |
| K25 | "Owned" services are filtered on the page (`createdBy === session.user.id`). Express returns all services, so the full list still goes over the wire. Add `GET /services/mine` (B6) and use it. | `src/app/(dashboard)/dashboard/branchManager/services/page.tsx` |
| K26 | Scripted HTTP clients get `Connection closed.` from Next dev server actions, because a browser's debug channel is missing. The same action works in a real browser (tested in Chrome). The earlier production-only cause was not confirmed. Use a browser to test actions. | Test tooling only |
| K27 | `next dev` logged four `Connection closed.` errors at 10:32–10:33 this morning (before this change). Cause not identified. If it returns during normal use, check the terminal for the stack, which the action now logs. | `.next/dev/logs/next-development.log` |
| K28 | Better Auth does not validate enum values at runtime (its schema for enum fields is `z.any()`). The `branch` value is checked only by TypeScript, so Express must validate it against the four branches (B5/ADM1). | `src/lib/auth.ts` |
| K29 | **Resolved.** `BRANCHES`/`TBranch` had moved into `src/lib/auth.ts`, which broke three client imports and returned 500 on every route. Restored `src/lib/branches.ts` as the client-safe source with no server imports, and `auth.ts` imports it. Rule: client components must never import `auth.ts`, because that pulls `mongodb` into the browser bundle (K1). | `src/lib/branches.ts`, `src/lib/auth.ts` |

## 16. Next recommended step

**B4 + B5 + secure the write path.** Enable the Better Auth `jwt()` plugin on the client, then add `verifyToken` and `requireRole` to the server. Make `POST /services` take `createdBy` and `branch` from the verified token (never from the body), validate input on the server, and return the standard `{ success, message, data }` shape. Then add `GET /services/mine` so the page stops filtering owners on the client. This closes K20, K21, K22, K24, and K25, and it must happen before real users use Add Service.

Before starting, the owner needs to answer:
- **D1** (role string). Default: keep `branchManager`.
- **D3** (JWT library). Default: `jose`.
- **D5** (branch field). Default: yes.

Optional small client fixes to do first: P0-1 (auth-client import, K1) and P0-2 (root layout type error, K7).

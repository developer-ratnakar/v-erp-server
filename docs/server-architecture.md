# Server Architecture

## Stack

- Node.js
- Express
- Supabase Postgres
- Zod validation
- JWT authentication

## Layering

Each module follows:

- `routes`
- `controllers`
- `services`
- `repositories`
- `models`
- `validation`

Responsibilities:

- `routes`: endpoint wiring, auth, permission checks, validation
- `controllers`: HTTP orchestration only
- `services`: business rules and cross-entity validation
- `repositories`: direct Supabase access
- `models`: response/domain shaping
- `validation`: request schemas

## Shared Middleware

- [validate.middleware.js](/c:/Users/HP/OneDrive/Desktop/ERP/server/src/middlewares/validate.middleware.js)
  - Validates `body`, `params`, and `query`
- [auth.middleware.js](/c:/Users/HP/OneDrive/Desktop/ERP/server/src/middlewares/auth.middleware.js)
  - JWT verification
  - permission enforcement via RBAC
- [error.middleware.js](/c:/Users/HP/OneDrive/Desktop/ERP/server/src/middlewares/error.middleware.js)
  - standard error responses

## Security Model

- `auth` remains public for login and registration
- `rbac` requires authentication
- business modules require both:
  - valid JWT
  - module permission

Permission examples:

- `academic.read`
- `academic.write`
- `students.read`
- `students.write`

## Database Source of Truth

Schema changes live in:

- [supabase/migrations](/c:/Users/HP/OneDrive/Desktop/ERP/server/supabase/migrations)

Current major schema areas:

- identity and RBAC
- academic
- students
- operations
- attendance
- exams
- HR
- CLC

## Response Patterns

- single-resource endpoints return the shaped domain model
- paginated list endpoints return `data` and `meta`
- destructive deletes return `204 No Content`
- business conflicts return `409`
- permission failures return `403`
- unauthenticated requests return `401`

## Current Gaps

- no automated test suite yet
- no refresh-token flow
- no file upload/storage pipeline yet
- no PDF generation pipeline for CLC yet
- update/delete live verification is still recommended after this patch set

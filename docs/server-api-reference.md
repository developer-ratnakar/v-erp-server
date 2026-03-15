# Server API Reference

## Base

- Base URL: `/api`
- Content type: `application/json`
- Protected routes require `Authorization: Bearer <token>`

## Auth

Public endpoints:

- `POST /auth/register`
- `POST /auth/login`

Login response returns `accessToken`.

## RBAC

Authenticated endpoints:

- `POST /rbac/roles`
- `GET /rbac/roles`
- `GET /rbac/roles/:roleId/permissions`
- `POST /rbac/roles/:roleId/permissions/:permissionId`
- `POST /rbac/permissions`
- `GET /rbac/permissions`
- `GET /rbac/users/:userId/roles`
- `POST /rbac/users/:userId/roles/:roleId`
- `GET /rbac/users/:userId/permissions`
- `GET /rbac/users/:userId/permissions/:permission`

## Permission Convention

Business modules use:

- `<module>.read`
- `<module>.write`

Current protected modules:

- `academic`
- `students`
- `operations`
- `attendance`
- `exams`
- `hr`
- `clc`

## Pagination

List endpoints accept:

- `page`
- `limit`

Paginated response format:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 0
  }
}
```

## Academic

- `POST /academic/programs`
- `GET /academic/programs`
- `GET /academic/programs/:programId`
- `PATCH /academic/programs/:programId`
- `DELETE /academic/programs/:programId`
- `POST /academic/departments`
- `GET /academic/departments`
- `GET /academic/departments/:departmentId`
- `PATCH /academic/departments/:departmentId`
- `DELETE /academic/departments/:departmentId`
- `POST /academic/batches`
- `GET /academic/batches`
- `GET /academic/batches/:batchId`
- `PATCH /academic/batches/:batchId`
- `DELETE /academic/batches/:batchId`
- `POST /academic/semesters`
- `GET /academic/semesters`
- `GET /academic/semesters/:semesterId`
- `PATCH /academic/semesters/:semesterId`
- `DELETE /academic/semesters/:semesterId`
- `POST /academic/sessions`
- `GET /academic/sessions`
- `GET /academic/sessions/:sessionId`
- `PATCH /academic/sessions/:sessionId`
- `DELETE /academic/sessions/:sessionId`

## Students

- `POST /students`
- `GET /students`
- `GET /students/:studentId`
- `PATCH /students/:studentId`
- `DELETE /students/:studentId`
- `PUT /students/:studentId/parent`
- `GET /students/:studentId/parent`
- `DELETE /students/:studentId/parent`
- `POST /students/:studentId/addresses`
- `GET /students/:studentId/addresses`
- `PATCH /students/:studentId/addresses/:addressId`
- `DELETE /students/:studentId/addresses/:addressId`
- `POST /students/:studentId/documents`
- `GET /students/:studentId/documents`
- `PATCH /students/:studentId/documents/:documentId`
- `DELETE /students/:studentId/documents/:documentId`
- `PATCH /students/:studentId/department`
- `GET /students/:studentId/department-transfers`

## Operations

- `POST /operations/subjects`
- `GET /operations/subjects`
- `GET /operations/subjects/:subjectId`
- `PATCH /operations/subjects/:subjectId`
- `DELETE /operations/subjects/:subjectId`
- `POST /operations/timetables`
- `GET /operations/timetables`
- `GET /operations/timetables/:timetableId`
- `PATCH /operations/timetables/:timetableId`
- `DELETE /operations/timetables/:timetableId`
- `POST /operations/timetables/:timetableId/entries`
- `GET /operations/timetables/:timetableId/entries`
- `PATCH /operations/timetables/:timetableId/entries/:entryId`
- `DELETE /operations/timetables/:timetableId/entries/:entryId`

## Attendance

- `POST /attendance`
- `GET /attendance`
- `GET /attendance/:attendanceId`
- `PATCH /attendance/:attendanceId`
- `DELETE /attendance/:attendanceId`

## Exams

- `POST /exams`
- `GET /exams`
- `GET /exams/:examId`
- `PATCH /exams/:examId`
- `DELETE /exams/:examId`
- `POST /exams/:examId/results`
- `GET /exams/:examId/results`
- `GET /exams/results/:resultId`
- `PATCH /exams/results/:resultId`
- `DELETE /exams/results/:resultId`
- `POST /exams/:examId/marks`
- `GET /exams/:examId/marks`
- `GET /exams/marks/:markId`
- `PATCH /exams/marks/:markId`
- `DELETE /exams/marks/:markId`

## HR

- `POST /hr/staff`
- `GET /hr/staff`
- `GET /hr/staff/:staffId`
- `PATCH /hr/staff/:staffId`
- `DELETE /hr/staff/:staffId`

## CLC

- `POST /clc`
- `GET /clc`
- `GET /clc/:certificateId`
- `PATCH /clc/:certificateId`
- `DELETE /clc/:certificateId`
- `GET /clc/student/:studentId`

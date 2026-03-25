import { z } from "zod";

const attendanceIdParam = z.object({
  attendanceId: z.coerce.number().int().positive(),
});

export const createAttendanceSchema = {
  body: z.object({
    student_id: z.coerce.number().int().positive(),
    subject_id: z.coerce.number().int().positive(),
    month: z.string().date(),
    attendance_data: z.string().trim().min(1),
    program_id: z.coerce.number().int().positive().optional(),
    department_id: z.coerce.number().int().positive().optional(),
    batch_id: z.coerce.number().int().positive().optional(),
    semester_id: z.coerce.number().int().positive().optional(),
    session_id: z.coerce.number().int().positive().optional(),
  }),
};

export const attendanceIdParamSchema = {
  params: attendanceIdParam,
};

export const updateAttendanceSchema = {
  params: attendanceIdParam,
  body: createAttendanceSchema.body.partial(),
};
export const markDailyAttendanceSchema = {
  body: z.object({
    date: z.string().date(),
    subject_id: z.coerce.number().int().positive(),
    students: z.array(
      z.object({
        student_id: z.coerce.number().int().positive(),
        status: z.enum(["P", "A", "L", "-"]),
      }),
    ).min(1),
    program_id: z.coerce.number().int().positive().optional(),
    department_id: z.coerce.number().int().positive().optional(),
    batch_id: z.coerce.number().int().positive().optional(),
    semester_id: z.coerce.number().int().positive().optional(),
    session_id: z.coerce.number().int().positive().optional(),
  }),
};

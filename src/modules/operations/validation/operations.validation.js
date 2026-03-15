import { z } from "zod";

const idParam = z.coerce.number().int().positive();
const timeString = z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Invalid time format");
const timetableEntryBodySchema = z.object({
  day: z.enum(["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]),
  start_time: timeString,
  end_time: timeString,
  subject_id: z.coerce.number().int().positive().optional(),
  is_break: z.boolean().optional(),
  break_name: z.string().trim().max(50).optional(),
  room_no: z.string().trim().max(20).optional(),
  faculty_id: z.coerce.number().int().positive().optional(),
});

export const createSubjectSchema = {
  body: z.object({
    name: z.string().trim().min(2).max(100),
    code: z.string().trim().min(2).max(20),
    department_id: z.coerce.number().int().positive(),
    program_id: z.coerce.number().int().positive().optional(),
    semester_id: z.coerce.number().int().positive().optional(),
    credits: z.coerce.number().int().min(0).optional(),
    is_active: z.boolean().optional(),
  }),
};

export const createTimetableSchema = {
  body: z.object({
    name: z.string().trim().min(2).max(100),
    program_id: z.coerce.number().int().positive(),
    department_id: z.coerce.number().int().positive(),
    batch_id: z.coerce.number().int().positive(),
    session_id: z.coerce.number().int().positive(),
    semester_id: z.coerce.number().int().positive(),
    section: z.string().trim().max(10).optional(),
    is_active: z.boolean().optional(),
  }),
};

export const createTimetableEntrySchema = {
  params: z.object({
    timetableId: idParam,
  }),
  body: timetableEntryBodySchema.refine((data) => {
    if (data.is_break) {
      return Boolean(data.break_name);
    }
    return true;
  }, {
    message: "break_name is required when is_break is true",
    path: ["break_name"],
  }),
};

export const subjectIdParamSchema = {
  params: z.object({
    subjectId: idParam,
  }),
};

export const updateSubjectSchema = {
  params: z.object({
    subjectId: idParam,
  }),
  body: createSubjectSchema.body.partial(),
};

export const timetableIdParamSchema = {
  params: z.object({
    timetableId: idParam,
  }),
};

export const updateTimetableSchema = {
  params: z.object({
    timetableId: idParam,
  }),
  body: createTimetableSchema.body.partial(),
};

export const entryIdParamSchema = {
  params: z.object({
    timetableId: idParam,
    entryId: idParam,
  }),
};

export const updateTimetableEntrySchema = {
  params: z.object({
    timetableId: idParam,
    entryId: idParam,
  }),
  body: timetableEntryBodySchema.partial().refine((data) => {
    if (data.is_break) {
      return Boolean(data.break_name);
    }
    return true;
  }, {
    message: "break_name is required when is_break is true",
    path: ["break_name"],
  }),
};

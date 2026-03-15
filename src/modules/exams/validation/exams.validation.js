import { z } from "zod";

const idParam = z.coerce.number().int().positive();
const examBodySchema = z.object({
  name: z.string().trim().min(2).max(255),
  session_id: z.coerce.number().int().positive(),
  program_id: z.coerce.number().int().positive().optional(),
  batch_id: z.coerce.number().int().positive().optional(),
  semester_id: z.coerce.number().int().positive(),
  start_date: z.string().date(),
  end_date: z.string().date(),
  status: z.enum(["SCHEDULED", "ONGOING", "COMPLETED", "PUBLISHED"]).optional(),
});
const examResultBodySchema = z.object({
  student_id: z.coerce.number().int().positive(),
  total_marks: z.coerce.number().min(0).optional(),
  secured_marks: z.coerce.number().min(0).optional(),
  percentage: z.coerce.number().min(0).max(100).optional(),
  sgpa: z.coerce.number().min(0).optional(),
  cgpa: z.coerce.number().min(0).optional(),
  result_status: z.string().trim().min(2).max(20).optional(),
});
const examMarkBodySchema = z.object({
  student_id: z.coerce.number().int().positive(),
  subject_id: z.coerce.number().int().positive(),
  result_id: z.coerce.number().int().positive().optional(),
  marks_obtained: z.coerce.number().min(0).optional(),
  total_marks: z.coerce.number().min(0).optional(),
  grade: z.string().trim().max(20).optional(),
  grade_point: z.coerce.number().min(0).optional(),
  is_absent: z.boolean().optional(),
  remarks: z.string().trim().optional(),
});

export const createExamSchema = {
  body: examBodySchema.refine((data) => data.end_date >= data.start_date, {
    message: "end_date must be greater than or equal to start_date",
    path: ["end_date"],
  }),
};

export const createExamResultSchema = {
  params: z.object({
    examId: idParam,
  }),
  body: examResultBodySchema,
};

export const createExamMarkSchema = {
  params: z.object({
    examId: idParam,
  }),
  body: examMarkBodySchema,
};

export const examIdParamSchema = {
  params: z.object({
    examId: idParam,
  }),
};

export const resultIdParamSchema = {
  params: z.object({
    resultId: idParam,
  }),
};

export const markIdParamSchema = {
  params: z.object({
    markId: idParam,
  }),
};

export const updateExamSchema = {
  params: z.object({
    examId: idParam,
  }),
  body: examBodySchema.partial().refine((data) => {
    if (data.start_date && data.end_date) {
      return data.end_date >= data.start_date;
    }
    return true;
  }, {
    message: "end_date must be greater than or equal to start_date",
    path: ["end_date"],
  }),
};

export const updateExamResultSchema = {
  params: z.object({
    resultId: idParam,
  }),
  body: examResultBodySchema.partial(),
};

export const updateExamMarkSchema = {
  params: z.object({
    markId: idParam,
  }),
  body: examMarkBodySchema.partial(),
};

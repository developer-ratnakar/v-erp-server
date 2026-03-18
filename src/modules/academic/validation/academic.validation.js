import { z } from "zod";

const idParam = z.coerce.number().int().positive();
const batchBodySchema = z.object({
  name: z.string().trim().min(2).max(50),
  program_id: z.coerce.number().int().positive(),
  department_id: z.coerce.number().int().positive(),
  start_year: z.coerce.number().int().min(1900).max(3000),
  end_year: z.coerce.number().int().min(1900).max(3000),
  current_semester: z.coerce.number().int().min(1).max(20).optional(),
  is_active: z.boolean().optional(),
});
const sessionBodySchema = z.object({
  name: z.string().trim().min(2).max(50),
  start_date: z.string().date(),
  end_date: z.string().date(),
  is_current: z.boolean().optional(),
  is_active: z.boolean().optional(),
});

export const createProgramSchema = {
  body: z.object({
    code: z.string().trim().min(2).max(20),
    name: z.string().trim().min(2).max(100),
    duration_years: z.coerce.number().int().min(1).max(10).optional(),
    description: z.string().trim().optional(),
    is_active: z.boolean().optional(),
  }),
};

export const createDepartmentSchema = {
  body: z.object({
    code: z.string().trim().min(2).max(20),
    name: z.string().trim().min(2).max(100),
    program_id: z.coerce.number().int().positive(),
    description: z.string().trim().optional(),
    is_active: z.boolean().optional(),
  }),
};

export const createBatchSchema = {
  body: batchBodySchema.refine((data) => data.end_year >= data.start_year, {
    message: "end_year must be greater than or equal to start_year",
    path: ["end_year"],
  }),
};

export const createSemesterSchema = {
  body: z.object({
    code: z.string().trim().min(2).max(20),
    name: z.string().trim().min(2).max(100),
    is_active: z.boolean().optional(),
  }),
};

export const createSessionSchema = {
  body: sessionBodySchema.refine((data) => data.end_date >= data.start_date, {
    message: "end_date must be greater than or equal to start_date",
    path: ["end_date"],
  }),
};

export const updateProgramSchema = {
  params: z.object({ programId: idParam }),
  body: createProgramSchema.body.partial(),
};

export const updateDepartmentSchema = {
  params: z.object({ departmentId: idParam }),
  body: createDepartmentSchema.body.partial(),
};

export const updateBatchSchema = {
  params: z.object({ batchId: idParam }),
  body: batchBodySchema.partial().refine((data) => {
    if (data.start_year && data.end_year) {
      return data.end_year >= data.start_year;
    }
    return true;
  }, {
    message: "end_year must be greater than or equal to start_year",
    path: ["end_year"],
  }),
};

export const updateSemesterSchema = {
  params: z.object({ semesterId: idParam }),
  body: createSemesterSchema.body.partial(),
};

export const updateSessionSchema = {
  params: z.object({ sessionId: idParam }),
  body: sessionBodySchema.partial().refine((data) => {
    if (data.start_date && data.end_date) {
      return data.end_date >= data.start_date;
    }
    return true;
  }, {
    message: "end_date must be greater than or equal to start_date",
    path: ["end_date"],
  }),
};

export const programIdParamSchema = {
  params: z.object({
    programId: idParam,
  }),
};

export const departmentIdParamSchema = {
  params: z.object({
    departmentId: idParam,
  }),
};

export const batchIdParamSchema = {
  params: z.object({
    batchId: idParam,
  }),
};

export const semesterIdParamSchema = {
  params: z.object({
    semesterId: idParam,
  }),
};

export const sessionIdParamSchema = {
  params: z.object({
    sessionId: idParam,
  }),
};

import { z } from "zod";

const staffIdParam = z.object({
  staffId: z.coerce.number().int().positive(),
});

const staffBody = z.object({
  name: z.string().trim().min(2).max(100),
  designation: z.string().trim().min(2).max(100),
  department_id: z.coerce.number().int().positive().optional(),
  contact_number: z.string().trim().min(7).max(20).optional(),
  email: z.string().trim().email(),
  role: z.string().trim().min(2).max(50).optional(),
  user_id: z.string().uuid().optional(),
});

export const createStaffSchema = {
  body: staffBody,
};

export const updateStaffSchema = {
  params: staffIdParam,
  body: staffBody.partial(),
};

export const staffIdParamSchema = {
  params: staffIdParam,
};

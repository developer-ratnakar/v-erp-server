import { z } from "zod";

const idParam = z.coerce.number().int().positive();

const staffBodySchema = z.object({
  name: z.string().trim().min(2).max(100),
  designation: z.string().trim().min(2).max(100),
  department_id: z.coerce.number().int().positive().optional(),
  contact_number: z.string().trim().max(20).optional(),
  email: z.string().email(),
  role: z.string().trim().optional(),
  user_id: z.string().uuid().optional(),
  joining_date: z.string().date().optional(),
  qualification: z.string().trim().max(255).optional(),
  date_of_birth: z.string().date().optional(),
  address: z.string().trim().optional(),
  blood_group: z.string().trim().max(10).optional(),
  emergency_contact: z.string().trim().max(20).optional(),
});

export const createStaffSchema = {
  body: staffBodySchema,
};

export const staffIdParamSchema = {
  params: z.object({
    staffId: idParam,
  }),
};

export const leaveIdParamSchema = {
  params: z.object({
    leaveId: idParam,
  }),
};

export const updateStaffSchema = {
  params: z.object({
    staffId: idParam,
  }),
  body: staffBodySchema.partial(),
};

export const upsertAttendanceSchema = {
  body: z.array(z.object({
    staff_id: z.coerce.number().int().positive(),
    date: z.string().date(),
    status: z.enum(['PRESENT', 'ABSENT', 'LEAVE', 'HALF_DAY']),
    remarks: z.string().trim().optional(),
  })),
};

export const applyLeaveSchema = {
  body: z.object({
    staff_id: z.coerce.number().int().positive().optional(),
    leave_type: z.string().trim().min(2).max(50),
    start_date: z.string().date(),
    end_date: z.string().date(),
    reason: z.string().trim().optional(),
    adjustments: z.array(z.any()).optional(),
  }).refine(data => {
    if (data.start_date && data.end_date) {
      return data.end_date >= data.start_date;
    }
    return true;
  }, {
    message: "end_date must be greater than or equal to start_date",
    path: ["end_date"],
  }),
};

export const updateLeaveStatusSchema = {
  params: z.object({
    leaveId: idParam,
  }),
  body: z.object({
    status: z.enum(['APPROVED', 'REJECTED']),
  }),
};

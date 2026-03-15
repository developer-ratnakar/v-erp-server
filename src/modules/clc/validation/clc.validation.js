import { z } from "zod";

const idParam = z.coerce.number().int().positive();
const clcBodySchema = z.object({
  student_id: z.coerce.number().int().positive(),
  certificate_no: z.string().trim().min(3).max(50).optional(),
  serial_no: z.string().trim().min(3).max(50).optional(),
  institute_name: z.string().trim().min(2).max(150).optional(),
  institute_location: z.string().trim().min(2).max(150).optional(),
  affiliating_body: z.string().trim().min(2).max(200).optional(),
  date_of_admission: z.string().date(),
  date_of_leaving: z.string().date(),
  branch_name: z.string().trim().min(2).max(150).optional(),
  status_at_leaving: z.string().trim().min(2).max(100),
  reason_for_leaving: z.string().trim().min(2),
  conduct: z.string().trim().min(2).max(50).optional(),
  father_guardian_name_snapshot: z.string().trim().min(2).max(200).optional(),
  address_snapshot: z.string().trim().min(2).optional(),
  barcode_value: z.string().trim().min(2).max(100).optional(),
  issued_by_staff_id: z.coerce.number().int().positive().optional(),
  verified_by_staff_id: z.coerce.number().int().positive().optional(),
  remarks: z.string().trim().optional(),
});

export const createCLCSchema = {
  body: clcBodySchema.refine((data) => data.date_of_leaving >= data.date_of_admission, {
    message: "date_of_leaving must be greater than or equal to date_of_admission",
    path: ["date_of_leaving"],
  }),
};

export const clcIdParamSchema = {
  params: z.object({
    certificateId: idParam,
  }),
};

export const studentCLCParamSchema = {
  params: z.object({
    studentId: idParam,
  }),
};

export const updateCLCSchema = {
  params: z.object({
    certificateId: idParam,
  }),
  body: clcBodySchema.partial().refine((data) => {
    if (data.date_of_admission && data.date_of_leaving) {
      return data.date_of_leaving >= data.date_of_admission;
    }
    return true;
  }, {
    message: "date_of_leaving must be greater than or equal to date_of_admission",
    path: ["date_of_leaving"],
  }),
};

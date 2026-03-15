import { z } from "zod";

const studentIdParam = z.object({
  studentId: z.coerce.number().int().positive(),
});
const nestedIdParam = z.coerce.number().int().positive();

const nullableString = z.string().trim().min(1).optional();
const nullableUrl = z.string().trim().url().optional();

export const createStudentSchema = {
  body: z.object({
    registration_number: nullableString,
    apaar_id: nullableString,
    first_name: z.string().trim().min(1).max(100),
    middle_name: z.string().trim().max(100).optional(),
    last_name: z.string().trim().min(1).max(100),
    dob: z.string().date(),
    photo_url: nullableUrl,
    email: z.string().trim().email().optional(),
    phone_number: z.string().trim().min(7).max(20).optional(),
    blood_group: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "UNKNOWN"]).optional(),
    admission_type: z.enum(["HOSTELLER", "DAY_SCHOLAR"]).optional(),
    program_id: z.coerce.number().int().positive().optional(),
    department_id: z.coerce.number().int().positive().optional(),
    batch_id: z.coerce.number().int().positive().optional(),
    semester_id: z.coerce.number().int().positive().optional(),
  }),
};

export const studentIdParamSchema = {
  params: studentIdParam,
};

export const updateStudentSchema = {
  params: studentIdParam,
  body: createStudentSchema.body.partial(),
};

export const saveStudentParentSchema = {
  params: studentIdParam,
  body: z.object({
    father_name: z.string().trim().max(100).optional(),
    mother_name: z.string().trim().max(100).optional(),
    guardian_name: z.string().trim().max(100).optional(),
    father_photo_url: nullableUrl,
    mother_photo_url: nullableUrl,
    guardian_photo_url: nullableUrl,
    income_certificate_url: nullableUrl,
    caste_certificate_url: nullableUrl,
    residence_certificate_url: nullableUrl,
  }),
};

export const createStudentAddressSchema = {
  params: studentIdParam,
  body: z.object({
    address_type: z.enum(["PERMANENT", "CURRENT"]).optional(),
    country: z.string().trim().min(1).max(100).optional(),
    state: z.string().trim().min(1).max(100),
    district: z.string().trim().min(1).max(100),
    city: z.string().trim().max(100).optional(),
    pincode: z.string().trim().min(3).max(20),
    address_line1: z.string().trim().min(1),
    address_line2: z.string().trim().optional(),
  }),
};

export const addressIdParamSchema = {
  params: studentIdParam.extend({
    addressId: nestedIdParam,
  }),
};

export const updateStudentAddressSchema = {
  params: studentIdParam.extend({
    addressId: nestedIdParam,
  }),
  body: createStudentAddressSchema.body.partial(),
};

export const createStudentDocumentSchema = {
  params: studentIdParam,
  body: z.object({
    document_type: z.enum([
      "10TH_MARKSHEET",
      "12TH_MARKSHEET",
      "DIPLOMA_CERTIFICATE",
      "JEE_MARKSHEET",
      "OJEE_MARKSHEET",
      "INCOME_CERTIFICATE",
      "CASTE_CERTIFICATE",
      "RESIDENCE_CERTIFICATE",
      "OTHER",
    ]),
    file_url: z.string().trim().url(),
  }),
};

export const documentIdParamSchema = {
  params: studentIdParam.extend({
    documentId: nestedIdParam,
  }),
};

export const updateStudentDocumentSchema = {
  params: studentIdParam.extend({
    documentId: nestedIdParam,
  }),
  body: createStudentDocumentSchema.body.partial(),
};

export const changeStudentDepartmentSchema = {
  params: studentIdParam,
  body: z.object({
    to_program_id: z.coerce.number().int().positive().optional(),
    to_department_id: z.coerce.number().int().positive().optional(),
    to_batch_id: z.coerce.number().int().positive().optional(),
    to_semester_id: z.coerce.number().int().positive().optional(),
    reason: z.string().trim().min(2).optional(),
    effective_date: z.string().date(),
  }).refine((data) => (
    data.to_program_id ||
    data.to_department_id ||
    data.to_batch_id ||
    data.to_semester_id
  ), {
    message: "At least one target academic field is required",
    path: ["to_department_id"],
  }),
};

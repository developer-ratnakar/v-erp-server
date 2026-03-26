import { supabaseAdmin } from "../../../config/supabase.js";
import StudentAddress from "../models/student-address.model.js";
import StudentDepartmentTransfer from "../models/student-department-transfer.model.js";
import StudentDocument from "../models/student-document.model.js";
import StudentParent from "../models/student-parent.model.js";
import Student from "../models/student.model.js";

class StudentRepository {
  async createStudent(studentData) {
    const { data, error } = await supabaseAdmin
      .from("students")
      .insert(studentData)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return new Student(data);
  }

  async getAllStudents(params) {
    const from = params?.from || 0;
    const to = params?.to || (params?.limit ? from + params.limit - 1 : from + 9);
    const { search, program_id, department_id, batch_id, semester_id } = params || {};
    let query = supabaseAdmin
      .from("students")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,registration_number.ilike.%${search}%,email.ilike.%${search}%`);
    }

    if (program_id) {
      query = query.eq("program_id", program_id);
    }
    if (department_id) {
      query = query.eq("department_id", department_id);
    }
    if (batch_id) {
      query = query.eq("batch_id", batch_id);
    }
    if (semester_id) {
      query = query.eq("semester_id", semester_id);
    }

    const { data, error, count } = await query;

    if (error) throw new Error(error.message);

    return {
      data: data ? data.map((item) => new Student(item)) : [],
      count: count ?? 0,
    };
  }

  async findStudentById(studentId) {
    if (!studentId || studentId === 'undefined') return null;
    const { data, error } = await supabaseAdmin
      .from("students")
      .select("*")
      .eq("id", studentId)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data ? new Student(data) : null;
  }

  async findStudentByRegistrationNumber(registrationNumber) {
    const { data, error } = await supabaseAdmin
      .from("students")
      .select("*")
      .eq("registration_number", registrationNumber)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data ? new Student(data) : null;
  }

  async findStudentsByRegistrationNumbers(registrationNumbers) {
    if (!registrationNumbers || registrationNumbers.length === 0) return [];
    
    // Split into chunks if too large to avoid URL length limits, but usually bulk upload is < 1000
    const { data, error } = await supabaseAdmin
      .from("students")
      .select("registration_number")
      .in("registration_number", registrationNumbers);

    if (error) throw new Error(error.message);

    return data;
  }

  async findStudentsByApaarIds(apaarIds) {
    if (!apaarIds || apaarIds.length === 0) return [];
    
    const { data, error } = await supabaseAdmin
      .from("students")
      .select("apaar_id")
      .in("apaar_id", apaarIds);

    if (error) throw new Error(error.message);

    return data;
  }

  async findStudentByApaarId(apaarId) {
    const { data, error } = await supabaseAdmin
      .from("students")
      .select("*")
      .eq("apaar_id", apaarId)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data ? new Student(data) : null;
  }

  async saveStudentParent(parentData) {
    const { data, error } = await supabaseAdmin
      .from("student_parents")
      .upsert(parentData, { onConflict: "student_id" })
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return new StudentParent(data);
  }

  async getStudentParent(studentId) {
    const { data, error } = await supabaseAdmin
      .from("student_parents")
      .select("*")
      .eq("student_id", studentId)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data ? new StudentParent(data) : null;
  }

  async deleteStudentParent(studentId) {
    const { error } = await supabaseAdmin
      .from("student_parents")
      .delete()
      .eq("student_id", studentId);

    if (error) throw new Error(error.message);
  }

  async createStudentAddress(addressData) {
    const { data, error } = await supabaseAdmin
      .from("student_addresses")
      .insert(addressData)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return new StudentAddress(data);
  }

  async getStudentAddresses(studentId) {
    const { data, error } = await supabaseAdmin
      .from("student_addresses")
      .select("*")
      .eq("student_id", studentId)
      .order("id", { ascending: true });

    if (error) throw new Error(error.message);

    return data ? data.map((item) => new StudentAddress(item)) : [];
  }

  async findStudentAddressById(addressId) {
    const { data, error } = await supabaseAdmin
      .from("student_addresses")
      .select("*")
      .eq("id", addressId)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data ? new StudentAddress(data) : null;
  }

  async updateStudentAddress(addressId, addressData) {
    const { data, error } = await supabaseAdmin
      .from("student_addresses")
      .update(addressData)
      .eq("id", addressId)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return new StudentAddress(data);
  }

  async deleteStudentAddress(addressId) {
    const { error } = await supabaseAdmin
      .from("student_addresses")
      .delete()
      .eq("id", addressId);

    if (error) throw new Error(error.message);
  }

  async createStudentDocument(documentData) {
    const { data, error } = await supabaseAdmin
      .from("student_documents")
      .insert(documentData)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return new StudentDocument(data);
  }

  async getStudentDocuments(studentId) {
    const { data, error } = await supabaseAdmin
      .from("student_documents")
      .select("*")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return data ? data.map((item) => new StudentDocument(item)) : [];
  }

  async findStudentDocumentById(documentId) {
    const { data, error } = await supabaseAdmin
      .from("student_documents")
      .select("*")
      .eq("id", documentId)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data ? new StudentDocument(data) : null;
  }

  async updateStudentDocument(documentId, documentData) {
    const { data, error } = await supabaseAdmin
      .from("student_documents")
      .update(documentData)
      .eq("id", documentId)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return new StudentDocument(data);
  }

  async deleteStudentDocument(documentId) {
    const { error } = await supabaseAdmin
      .from("student_documents")
      .delete()
      .eq("id", documentId);

    if (error) throw new Error(error.message);
  }

  async updateStudent(studentId, studentData) {
    const { data, error } = await supabaseAdmin
      .from("students")
      .update(studentData)
      .eq("id", studentId)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return new Student(data);
  }

  async createDepartmentTransfer(transferData) {
    const { data, error } = await supabaseAdmin
      .from("student_department_transfers")
      .insert(transferData)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return new StudentDepartmentTransfer(data);
  }

  async getDepartmentTransfers(studentId) {
    const { data, error } = await supabaseAdmin
      .from("student_department_transfers")
      .select("*")
      .eq("student_id", studentId)
      .order("effective_date", { ascending: false })
      .order("id", { ascending: false });

    if (error) throw new Error(error.message);

    return data ? data.map((item) => new StudentDepartmentTransfer(item)) : [];
  }

  async deleteStudent(studentId) {
    const { error } = await supabaseAdmin
      .from("students")
      .delete()
      .eq("id", studentId);

    if (error) throw new Error(error.message);
  }

  async createStudentsBulk(studentsData) {
    const { data, error } = await supabaseAdmin
      .from("students")
      .insert(studentsData)
      .select("*");

    if (error) throw new Error(error.message);

    return data.map((item) => new Student(item));
  }

  async createParentsBulk(parentsData) {
    const { data, error } = await supabaseAdmin
      .from("student_parents")
      .insert(parentsData)
      .select("*");

    if (error) throw new Error(error.message);
    return data;
  }

  async createAddressesBulk(addressesData) {
    const { data, error } = await supabaseAdmin
      .from("student_addresses")
      .insert(addressesData)
      .select("*");

    if (error) throw new Error(error.message);
    return data;
  }
}

export default new StudentRepository();

import { supabaseAdmin } from "../../../config/supabase.js";
import CLCCertificate from "../models/clc-certificate.model.js";

class CLCRepository {
  async createCertificate(certificateData) {
    const { data, error } = await supabaseAdmin
      .from("clc_certificates")
      .insert(certificateData)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return new CLCCertificate(data);
  }

  async getAllCertificates() {
    const { from, to } = arguments[0] ?? { from: 0, to: 9 };
    const { data, error, count } = await supabaseAdmin
      .from("clc_certificates")
      .select("*", { count: "exact" })
      .order("issue_date", { ascending: false })
      .order("id", { ascending: false })
      .range(from, to);

    if (error) throw new Error(error.message);

    return {
      data: data ? data.map((item) => new CLCCertificate(item)) : [],
      count: count ?? 0,
    };
  }

  async findCertificateById(certificateId) {
    const { data, error } = await supabaseAdmin
      .from("clc_certificates")
      .select("*")
      .eq("id", certificateId)
      .maybeSingle();

    if (error) throw new Error(error.message);

    return data ? new CLCCertificate(data) : null;
  }

  async getCertificatesByStudentId(studentId) {
    const { data, error } = await supabaseAdmin
      .from("clc_certificates")
      .select("*")
      .eq("student_id", studentId)
      .order("issue_date", { ascending: false })
      .order("id", { ascending: false });

    if (error) throw new Error(error.message);

    return data ? data.map((item) => new CLCCertificate(item)) : [];
  }

  async updateCertificate(certificateId, certificateData) {
    const { data, error } = await supabaseAdmin
      .from("clc_certificates")
      .update(certificateData)
      .eq("id", certificateId)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    return new CLCCertificate(data);
  }

  async deleteCertificate(certificateId) {
    const { error } = await supabaseAdmin
      .from("clc_certificates")
      .delete()
      .eq("id", certificateId);

    if (error) throw new Error(error.message);
  }
}

export default new CLCRepository();

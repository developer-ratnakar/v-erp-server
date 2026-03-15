class StudentDocument {
  constructor({ id, student_id, document_type, file_url, created_at }) {
    this.id = id;
    this.studentId = student_id;
    this.documentType = document_type;
    this.fileUrl = file_url;
    this.createdAt = created_at;
  }
}

export default StudentDocument;

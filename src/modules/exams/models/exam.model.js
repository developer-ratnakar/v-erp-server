class Exam {
  constructor({
    id,
    name,
    session_id,
    program_id,
    batch_id,
    semester_id,
    start_date,
    end_date,
    status,
    created_at,
    updated_at,
  }) {
    this.id = id;
    this.name = name;
    this.sessionId = session_id;
    this.programId = program_id;
    this.batchId = batch_id;
    this.semesterId = semester_id;
    this.startDate = start_date;
    this.endDate = end_date;
    this.status = status;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
  }
}

export default Exam;

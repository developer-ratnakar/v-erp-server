class TimetableEntry {
  constructor({
    id,
    timetable_id,
    day,
    start_time,
    end_time,
    subject_id,
    is_break,
    break_name,
    room_no,
    faculty_id,
    created_at,
    updated_at,
  }) {
    this.id = id;
    this.timetableId = timetable_id;
    this.day = day;
    this.startTime = start_time;
    this.endTime = end_time;
    this.subjectId = subject_id;
    this.isBreak = is_break;
    this.breakName = break_name;
    this.roomNo = room_no;
    this.facultyId = faculty_id;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
  }
}

export default TimetableEntry;

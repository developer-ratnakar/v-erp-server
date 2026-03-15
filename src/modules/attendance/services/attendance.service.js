import ApiError from "../../../errors/ApiError.js";
import academicRepository from "../../academic/repositories/academic.repository.js";
import operationsRepository from "../../operations/repositories/operations.repository.js";
import studentRepository from "../../students/repositories/student.repository.js";
import attendanceRepository from "../repositories/attendance.repository.js";

class AttendanceService {
  async createAttendance(dto) {
    const existingAttendance = await attendanceRepository.findAttendanceByUniqueKey(
      dto.student_id,
      dto.subject_id,
      dto.month,
    );

    if (existingAttendance) {
      throw new ApiError(409, "Attendance already exists for this student, subject, and month");
    }

    await this.validateReferences(dto);
    this.validateAttendanceData(dto.attendance_data);

    return await attendanceRepository.createAttendance(dto);
  }

  async getAllAttendance(pagination) {
    return await attendanceRepository.getAllAttendance(pagination);
  }

  async getAttendanceById(attendanceId) {
    const attendance = await attendanceRepository.findAttendanceById(attendanceId);

    if (!attendance) {
      throw new ApiError(404, "Attendance record not found");
    }

    return attendance;
  }

  async updateAttendance(attendanceId, dto) {
    const attendance = await this.getAttendanceById(attendanceId);
    const nextStudentId = dto.student_id ?? attendance.studentId;
    const nextSubjectId = dto.subject_id ?? attendance.subjectId;
    const nextMonth = dto.month ?? attendance.month;

    const existingAttendance = await attendanceRepository.findAttendanceByUniqueKey(
      nextStudentId,
      nextSubjectId,
      nextMonth,
    );

    if (existingAttendance && existingAttendance.id !== Number(attendanceId)) {
      throw new ApiError(409, "Attendance already exists for this student, subject, and month");
    }

    await this.validateReferences({
      student_id: nextStudentId,
      subject_id: nextSubjectId,
      program_id: dto.program_id,
      department_id: dto.department_id,
      batch_id: dto.batch_id,
      semester_id: dto.semester_id,
      session_id: dto.session_id,
    });

    if (dto.attendance_data) {
      this.validateAttendanceData(dto.attendance_data);
    }

    return await attendanceRepository.updateAttendance(attendanceId, dto);
  }

  async deleteAttendance(attendanceId) {
    await this.getAttendanceById(attendanceId);
    await attendanceRepository.deleteAttendance(attendanceId);
  }

  async validateReferences(dto) {
    const [student, subject] = await Promise.all([
      studentRepository.findStudentById(dto.student_id),
      operationsRepository.findSubjectById(dto.subject_id),
    ]);

    if (!student) {
      throw new ApiError(404, "Student not found");
    }

    if (!subject) {
      throw new ApiError(404, "Subject not found");
    }

    const checks = [];

    if (dto.program_id) {
      checks.push(
        academicRepository.findProgramById(dto.program_id).then((program) => {
          if (!program) throw new ApiError(404, "Program not found");
        }),
      );
    }

    if (dto.department_id) {
      checks.push(
        academicRepository.findDepartmentById(dto.department_id).then((department) => {
          if (!department) throw new ApiError(404, "Department not found");
        }),
      );
    }

    if (dto.batch_id) {
      checks.push(
        academicRepository.findBatchById(dto.batch_id).then((batch) => {
          if (!batch) throw new ApiError(404, "Batch not found");
        }),
      );
    }

    if (dto.semester_id) {
      checks.push(
        academicRepository.findSemesterById(dto.semester_id).then((semester) => {
          if (!semester) throw new ApiError(404, "Semester not found");
        }),
      );
    }

    if (dto.session_id) {
      checks.push(
        academicRepository.findSessionById(dto.session_id).then((session) => {
          if (!session) throw new ApiError(404, "Session not found");
        }),
      );
    }

    await Promise.all(checks);
  }

  validateAttendanceData(attendanceData) {
    const allowedStatuses = new Set(["P", "A", "L", "-"]);
    const values = attendanceData.split(",");

    if (values.length === 0 || values.length > 31) {
      throw new ApiError(400, "attendance_data must contain between 1 and 31 day entries");
    }

    const invalidValue = values.find((value) => !allowedStatuses.has(value));

    if (invalidValue) {
      throw new ApiError(400, "attendance_data contains invalid status values");
    }
  }
}

export default new AttendanceService();

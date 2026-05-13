import ApiError from "../../../errors/ApiError.js";
import academicRepository from "../../academic/repositories/academic.repository.js";
import operationsRepository from "../../operations/repositories/operations.repository.js";
import studentRepository from "../../students/repositories/student.repository.js";
import attendanceRepository from "../repositories/attendance.repository.js";
import hrRepository from "../../hr/repositories/hr.repository.js";
import rbacService from "../../rbac/services/rbac.service.js";
import { supabaseAdmin } from "../../../config/supabase.js";

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
  async markDailyAttendance(dto, user) {
    let { date, subject_id, students, batch_id, ...metadata } = dto;

    // Check faculty restrictions
    const roles = await rbacService.getUserRoles(user.id);
    const isAdmin = roles.some(r => r.roleName === 'admin' || r.roleName === 'developer');

    if (!isAdmin) {
      if (!batch_id && students.length > 0) {
        const student = await studentRepository.findStudentById(students[0].student_id);
        batch_id = student?.batchId;
      }

      const staff = await hrRepository.findStaffByEmail(user.email);
      if (!staff) throw new ApiError(403, "Faculty record not found for this user");

      const assignments = await attendanceRepository.getFacultyAssignments(staff.id);

      const isAssigned = assignments.some(a => 
        (a.subject_id === subject_id || a.subject_id === String(subject_id)) && 
        (a.timetable?.batch_id === batch_id || a.timetable?.batch_id === String(batch_id))
      );

      if (!isAssigned) {
        throw new ApiError(403, "You are not assigned to mark attendance for this class/subject");
      }
    }

    const [year, month, day] = date.split("-").map(Number);
    const monthStr = `${year}-${String(month).padStart(2, "0")}-01`;
    const dayIndex = day - 1;

    const studentIds = students.map(s => s.student_id);
    const existingAttendances = await attendanceRepository.findAttendancesForStudents(
      studentIds, subject_id, monthStr
    );

    const { data: studentsInfo } = await supabaseAdmin
      .from("students")
      .select("id, program_id, department_id, batch_id, semester_id")
      .in("id", studentIds);

    const studentInfoMap = new Map();
    if (studentsInfo) {
      for (const s of studentsInfo) {
        studentInfoMap.set(s.id, s);
      }
    }

    const existingMap = new Map();
    for (const record of existingAttendances) {
      existingMap.set(record.studentId, record);
    }

    const results = await Promise.all(
      students.map(async ({ student_id, status }) => {
        let attendance = existingMap.get(student_id);
        const sInfo = studentInfoMap.get(student_id) || {};

        const recordBatchId = batch_id || sInfo.batch_id || metadata.batch_id;
        const recordProgramId = attendance?.programId || sInfo.program_id || metadata.program_id;
        const recordDepartmentId = attendance?.departmentId || sInfo.department_id || metadata.department_id;
        const recordSemesterId = attendance?.semesterId || sInfo.semester_id || metadata.semester_id;

        let dataArray;
        if (attendance && attendance.attendanceData) {
          dataArray = attendance.attendanceData.split(",");
        } else {
          dataArray = Array(31).fill("-");
        }

        while (dataArray.length < 31) dataArray.push("-");
        dataArray[dayIndex] = status;
        const finalData = dataArray.slice(0, 31).join(",");

        const recordPayload = {
          student_id,
          subject_id,
          month: monthStr,
          attendance_data: finalData,
        };

        if (recordBatchId) recordPayload.batch_id = recordBatchId;
        if (recordProgramId) recordPayload.program_id = recordProgramId;
        if (recordDepartmentId) recordPayload.department_id = recordDepartmentId;
        if (recordSemesterId) recordPayload.semester_id = recordSemesterId;

        if (attendance?.id) {
          return await attendanceRepository.updateAttendance(attendance.id, recordPayload);
        } else {
          return await attendanceRepository.createAttendance(recordPayload);
        }
      })
    );

    return results;
  }

  async getFacultyAssignments(email) {
    const staff = await hrRepository.findStaffByEmail(email);
    if (!staff) return [];

    const assignments = await attendanceRepository.getFacultyAssignments(staff.id);
    return assignments.map(a => ({
      subject_id: a.subject_id,
      batch_id: a.timetable?.batch_id,
      semester_id: a.timetable?.semester_id
    }));
  }
}

export default new AttendanceService();

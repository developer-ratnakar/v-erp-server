import ApiError from "../../../errors/ApiError.js";
import academicRepository from "../../academic/repositories/academic.repository.js";
import authRepository from "../../auth/repositories/auth.repository.js";
import hrRepository from "../repositories/hr.repository.js";
import operationsRepository from "../../operations/repositories/operations.repository.js";

class HRService {
  async createStaff(dto) {
    const existingStaff = await hrRepository.findStaffByEmail(dto.email);

    if (existingStaff) {
      throw new ApiError(409, "Staff email already exists");
    }

    await this.validateReferences(dto);

    return await hrRepository.createStaff(dto);
  }

  async getAllStaff(pagination) {
    return await hrRepository.getAllStaff(pagination);
  }

  async getStaffById(staffId) {
    const staff = await hrRepository.findStaffById(staffId);

    if (!staff) {
      throw new ApiError(404, "Staff not found");
    }

    return staff;
  }

  async getStaffByUserId(userId) {
    const staff = await hrRepository.findStaffByUserId(userId);

    if (!staff) {
      throw new ApiError(404, "Staff profile not associated with this user");
    }

    return staff;
  }

  async updateStaff(staffId, dto) {
    const staff = await this.getStaffById(staffId);

    if (dto.email && dto.email !== staff.email) {
      const existingStaff = await hrRepository.findStaffByEmail(dto.email);
      if (existingStaff) {
        throw new ApiError(409, "Staff email already exists");
      }
    }

    await this.validateReferences(dto);

    return await hrRepository.updateStaff(staffId, dto);
  }

  async deleteStaff(staffId) {
    await this.getStaffById(staffId);
    await hrRepository.deleteStaff(staffId);
  }

  async validateReferences(dto) {
    const checks = [];

    if (dto.department_id) {
      checks.push(
        academicRepository.findDepartmentById(dto.department_id).then((department) => {
          if (!department) throw new ApiError(404, "Department not found");
        }),
      );
    }

    if (dto.user_id) {
      checks.push(
        authRepository.findUserById(dto.user_id).then((user) => {
          if (!user) throw new ApiError(404, "User not found");
        }),
      );
    }

    await Promise.all(checks);
  }

  // Attendance
  async upsertAttendance(attendanceData) {
    return await hrRepository.upsertStaffAttendance(attendanceData);
  }

  async getAttendance(date, departmentId) {
    return await hrRepository.getStaffAttendance(date, departmentId);
  }

  // Leaves
  async applyLeave(staffId, leaveData) {
    await this.getStaffById(staffId);
    
    // Default to PENDING if not provided
    const status = leaveData.status || 'PENDING';
    
    const leave = await hrRepository.createLeaveApplication({
      ...leaveData,
      staff_id: staffId,
      status: status
    });

    // If auto-approved (recorded by admin), sync attendance immediately
    if (status === 'APPROVED') {
      await this.syncLeaveToAttendance(staffId, leaveData.start_date, leaveData.end_date);
    }

    return leave;
  }

  async getLeaves(staffId) {
    if (staffId) {
      await this.getStaffById(staffId);
    }
    return await hrRepository.getStaffLeaves(staffId);
  }

  async updateLeaveStatus(leaveId, status, approvedBy) {
    const updated = await hrRepository.updateLeaveStatus(leaveId, {
      status,
      approved_by: approvedBy
    });

    if (status === 'APPROVED') {
      await this.syncLeaveToAttendance(updated.staff_id, updated.start_date, updated.end_date);
    }

    return updated;
  }

  async syncLeaveToAttendance(staffId, startDate, endDate) {
    console.log(`Syncing leave to attendance for staff ${staffId} from ${startDate} to ${endDate}`);
    
    const [sYear, sMonth, sDay] = startDate.split('-').map(Number);
    const [eYear, eMonth, eDay] = endDate.split('-').map(Number);
    
    const start = new Date(sYear, sMonth - 1, sDay);
    const end = new Date(eYear, eMonth - 1, eDay);
    
    const attendanceData = [];
    const current = new Date(start);

    while (current <= end) {
      const dateStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
      
      attendanceData.push({
        staff_id: staffId,
        date: dateStr,
        status: 'LEAVE',
        remarks: 'Auto-marked for Leave'
      });

      current.setDate(current.getDate() + 1);
    }

    if (attendanceData.length > 0) {
      await hrRepository.upsertStaffAttendance(attendanceData);
      console.log(`Successfully synced ${attendanceData.length} attendance records for leave.`);
    }
  }

  async getStaffLoad(staffId, startDate, endDate) {
    console.log(`Getting load for staff ${staffId} from ${startDate} to ${endDate}`);
    const timetable = await operationsRepository.getFacultyTimetable(staffId);
    console.log(`Found ${timetable?.length || 0} timetable entries for staff ${staffId}`);
    
    if (!timetable || timetable.length === 0) return [];

    // Parse dates manually to avoid timezone shifts (Treating YYYY-MM-DD as local)
    const [sYear, sMonth, sDay] = startDate.split('-').map(Number);
    const [eYear, eMonth, eDay] = endDate.split('-').map(Number);
    
    const start = new Date(sYear, sMonth - 1, sDay);
    const end = new Date(eYear, eMonth - 1, eDay);
    const dayMap = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    
    const load = [];
    const current = new Date(start);

    while (current <= end) {
      const dayName = dayMap[current.getDay()];
      console.log(`Checking load for ${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')} (${dayName})`);
      
      // Case-insensitive day match
      const dayEntries = timetable.filter(entry => 
        entry.day?.toUpperCase() === dayName
      );
      
      console.log(`Found ${dayEntries.length} entries for ${dayName}`);

      dayEntries.forEach(entry => {
        load.push({
          date: `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`,
          day: entry.day,
          startTime: entry.start_time,
          endTime: entry.end_time,
          subject: entry.subject,
          roomNo: entry.room_no,
          timetableId: entry.timetable_id,
          timetable: entry.timetable,
          entryId: entry.id
        });
      });

      current.setDate(current.getDate() + 1);
    }

    console.log(`Final load calculated: ${load.length} affected classes`);
    return load;
  }
}

export default new HRService();

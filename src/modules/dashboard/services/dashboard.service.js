import studentService from "../../students/services/student.service.js";
import hrService from "../../hr/services/hr.service.js";
import attendanceService from "../../attendance/services/attendance.service.js";
import examsService from "../../exams/services/exams.service.js";

class DashboardService {
  async getDashboardStats() {
    // Note: These are simplified aggregations for the purpose of the dashboard.
    // In a production environment, dedicated aggregation queries would be used.
    
    const [students, staff, exams] = await Promise.all([
      studentService.getAllStudents({ page: 1, limit: 1 }),
      hrService.getAllStaff({ page: 1, limit: 1 }),
      examsService.getAllExams({ page: 1, limit: 1 })
    ]);

    // Mocking some data that might not be readily available in services yet
    // but would be useful for a premium dashboard.
    const attendanceStats = [
      { name: 'Mon', attendance: 85 },
      { name: 'Tue', attendance: 88 },
      { name: 'Wed', attendance: 92 },
      { name: 'Thu', attendance: 90 },
      { name: 'Fri', attendance: 87 },
      { name: 'Sat', attendance: 80 },
    ];

    const distributionStats = [
      { name: 'Computer Science', value: 400 },
      { name: 'Electrical Eng', value: 300 },
      { name: 'Mechanical Eng', value: 300 },
      { name: 'Business', value: 200 },
    ];

    return {
      summary: {
        totalStudents: students.count || 0,
        totalStaff: staff.count || 0,
        upcomingExams: exams.count || 0,
        averageAttendance: '87.5%'
      },
      charts: {
        attendance: attendanceStats,
        distribution: distributionStats
      }
    };
  }
}

export default new DashboardService();

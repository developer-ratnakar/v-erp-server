import studentService from "../../students/services/student.service.js";
import hrService from "../../hr/services/hr.service.js";
import dashboardRepository from "../repositories/dashboard.repository.js";

class DashboardService {
  async getDashboardStats() {
    // Run all complex aggregations concurrently for optimal performance
    const [
      students, 
      staff, 
      upcomingExams, 
      distributionStats, 
      attendanceStats,
      recentActivities
    ] = await Promise.all([
      studentService.getAllStudents({ page: 1, limit: 1 }),
      hrService.getAllStaff({ page: 1, limit: 1 }),
      dashboardRepository.getUpcomingExamsCount(),
      dashboardRepository.getStudentDistribution(),
      dashboardRepository.calculateAttendanceStats(),
      dashboardRepository.getRecentActivities()
    ]);

    return {
      summary: {
        totalStudents: students.count || 0,
        totalStaff: staff.count || 0,
        upcomingExams: upcomingExams || 0,
        averageAttendance: attendanceStats.averageAttendance
      },
      charts: {
        attendance: attendanceStats.attendanceChart,
        distribution: distributionStats
      },
      recentActivities
    };
  }
}

export default new DashboardService();

import { supabaseAdmin } from "../../../config/supabase.js";

class DashboardRepository {
  async getStudentDistribution() {
    // Supabase RPC or direct join
    const { data, error } = await supabaseAdmin
      .from("students")
      .select(`
        department_id,
        department:academic_departments (
          name
        )
      `);

    if (error) throw new Error(error.message);

    // Group by department name locally (or use RPC if volume is too high, but locally works for most schools)
    const counts = {};
    for (const student of data) {
      const deptName = student.department?.name || 'Unassigned';
      counts[deptName] = (counts[deptName] || 0) + 1;
    }

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }

  async getAttendanceDataForMonth(monthStr) {
    const { data, error } = await supabaseAdmin
      .from("operations_attendance")
      .select("attendance_data")
      .eq("month", monthStr);

    if (error) throw new Error(error.message);

    return data;
  }

  // Returns array of overall counts to calculate average, and last 7 days array
  async calculateAttendanceStats() {
    // Get current and previous month to ensure we have last 7 days
    const now = new Date();
    const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
    
    // We could get previous month too but for simplicity let's stick to current month data
    const { data, error } = await supabaseAdmin
      .from("operations_attendance")
      .select("attendance_data"); // fetching all to get overall avg

    if (error) throw new Error(error.message);

    let totalP = 0;
    let totalValid = 0;
    
    // For last 7 days, we need today's date index
    const today = now.getDate();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Initialize an array of the last 7 days (day 1 to 7)
    // Example: if today is the 15th, last 7 days are 9-15.
    const last7DaysData = Array(7).fill({}).map((_, i) => {
        const d = new Date();
        d.setDate(today - 6 + i); // 6 days ago -> today
        return {
            dateIdx: d.getDate() - 1, // 0-indexed
            name: days[d.getDay()],
            present: 0,
            valid: 0
        };
    });

    for (const record of data) {
      const arr = record.attendance_data.split(",");
      for (let i = 0; i < arr.length; i++) {
        const status = arr[i];
        if (status === 'P' || status === 'A' || status === 'L') {
            totalValid++;
            if (status === 'P') totalP++;
        }
      }
      
      // Calculate for last 7 days (only if the record is from the current month - assuming data refers to current for simplicity, robust impl checks month)
      // Since `data` has all months, let's just use the current month for the chart.
      // Filter current month on the fly or adjust query. For now let's just use the current month records.
    }

    // A better approach for the 7 days: just fetch current month records
    const currentMonthData = await this.getAttendanceDataForMonth(currentMonthStr);
    
    for (const record of currentMonthData) {
        const arr = record.attendance_data.split(",");
        for (const dayObj of last7DaysData) {
            // Only count if dateIdx is within the month limit (e.g. >= 0)
            if (dayObj.dateIdx >= 0 && dayObj.dateIdx < arr.length) {
                const status = arr[dayObj.dateIdx];
                if (status === 'P' || status === 'A' || status === 'L') {
                    dayObj.valid++;
                    if (status === 'P') dayObj.present++;
                }
            }
        }
    }

    const attendanceChart = last7DaysData.map(d => ({
        name: d.name,
        attendance: d.valid > 0 ? Math.round((d.present / d.valid) * 100) : 0
    }));

    const averageAttendance = totalValid > 0 ? ((totalP / totalValid) * 100).toFixed(1) + "%" : "0%";

    return { averageAttendance, attendanceChart };
  }

  async getRecentActivities() {
    // Fetch 5 latest students
    const { data: students } = await supabaseAdmin
      .from("students")
      .select("id, first_name, last_name, created_at, registration_number")
      .order("created_at", { ascending: false })
      .limit(5);

    // Fetch 5 latest staff
    const { data: staff } = await supabaseAdmin
      .from("hr_staff")
      .select("id, first_name, last_name, created_at, employee_id")
      .order("created_at", { ascending: false })
      .limit(5);

    // Fetch 5 latest exams
    const { data: exams } = await supabaseAdmin
      .from("academic_exams")
      .select("id, name, created_at, start_date")
      .order("created_at", { ascending: false })
      .limit(5);

    const activities = [];

    (students || []).forEach(s => {
        const fname = s.first_name || '';
        const lname = s.last_name || '';
        activities.push({
            id: s.id,
            type: 'STUDENT',
            iconText: ((fname[0]||'') + (lname[0]||'')).toUpperCase() || 'ST',
            title: 'New Student Added',
            description: `Added: ${fname} ${lname} (${s.registration_number || 'No ID'})`,
            createdAt: s.created_at
        });
    });

    (staff || []).forEach(s => {
        const fname = s.first_name || '';
        const lname = s.last_name || '';
        activities.push({
            id: s.id,
            type: 'STAFF',
            iconText: ((fname[0]||'') + (lname[0]||'')).toUpperCase() || 'HR',
            title: 'New Staff Member',
            description: `Added: ${fname} ${lname} (${s.employee_id || 'No ID'})`,
            createdAt: s.created_at
        });
    });

    (exams || []).forEach(e => {
        activities.push({
            id: e.id,
            type: 'EXAM',
            iconText: e.name.substring(0, 2).toUpperCase(),
            title: 'Exam Scheduled',
            description: `New: ${e.name} starting ${e.start_date}`,
            createdAt: e.created_at
        });
    });

    // Sort by created_at descending and take top 5
    activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return activities.slice(0, 5);
  }

  async getUpcomingExamsCount() {
    const today = new Date().toISOString().split('T')[0];
    const { count, error } = await supabaseAdmin
      .from("academic_exams")
      .select("*", { count: "exact", head: true })
      .gte("start_date", today);

    if (error) throw new Error(error.message);
    return count || 0;
  }
}

export default new DashboardRepository();

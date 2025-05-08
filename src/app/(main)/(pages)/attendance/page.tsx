'use client';

import React, { useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek, subWeeks, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend, endOfDay } from 'date-fns';
import axios from 'axios';
import {
  BadgeCheck,
  Calendar,
  CalendarDays,
  CalendarX2,
  Clock,
  Download,
  BarChart4,
  UserRoundCheck,
  UsersRound,
  PieChart,
  ArrowUpDown,
  FileSpreadsheet
} from 'lucide-react';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

// UI Components
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Tabs3 as Tabs, TabsContent3 as TabsContent, TabsList3 as TabsList, TabsTrigger3 as TabsTrigger } from '@/components/ui/tabs3';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import Loader from '@/components/ui/loader';
import CustomDatePicker from '@/components/globals/date-picker';

// Type definitions
interface AttendanceEntry {
  date: string;
  day: string;
  present: number;
  leave: number;
  absent: number;
  total: number;
  holiday: number;
}

interface LeaveEntry {
  leaveType: string;
  fromDate: string;
  toDate: string;
  status: string;
}

interface HolidayEntry {
  holidayName: string;
  holidayDate: string;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  reportingManager?: string;
}

interface UserwiseReport {
  user: string;
  present: number;
  leave: number;
  absent: number;
  reportingManager: string;
}

interface ReportEntry {
  user: string;
  status: string;
  loginTime: string;
  logoutTime: string;
  totalDuration: string;
}

// Helper function: Generate month options
const generateMonthOptions = () => {
  const months = [
    { name: 'Jan', value: '01' },
    { name: 'Feb', value: '02' },
    { name: 'Mar', value: '03' },
    { name: 'Apr', value: '04' },
    { name: 'May', value: '05' },
    { name: 'Jun', value: '06' },
    { name: 'Jul', value: '07' },
    { name: 'Aug', value: '08' },
    { name: 'Sep', value: '09' },
    { name: 'Oct', value: '10' },
    { name: 'Nov', value: '11' },
    { name: 'Dec', value: '12' }
  ];

  const currentYear = new Date().getFullYear();

  return months.map((month) => ({
    display: `${month.name}-${currentYear.toString().slice(-2)}`,
    value: `${currentYear}-${month.value}`
  }));
};

// Helper function: Generate weekdays in a month
const generateWeekdaysInMonth = (year: number, month: number) => {
  const date = new Date(year, month, 1);
  const weekdays = [];
  while (date.getMonth() === month) {
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      weekdays.push(new Date(date));
    }
    date.setDate(date.getDate() + 1);
  }
  return weekdays;
};

const AttendanceDashboard: React.FC = () => {
  // State variables
  const [attendance, setAttendance] = useState<AttendanceEntry[]>([]);
  const [leaves, setLeaves] = useState<LeaveEntry[]>([]);
  const [holidays, setHolidays] = useState<HolidayEntry[]>([]);
  const [holidaysCumulative, setHolidaysCumulative] = useState<number>(0);
  const [totalDays, setTotalDays] = useState<number>(0);
  const [totalCumulativeDays, setTotalCumulativeDays] = useState<number>(0);
  const [presentCount, setPresentCount] = useState<number>(0);
  const [leaveCount, setLeaveCount] = useState<number>(0);
  const [absentCount, setAbsentCount] = useState<number>(0);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const [workingDays, setWorkingDays] = useState<number>(0);
  const [holidayCount, setHolidayCount] = useState<number>(0);
  const [period, setPeriod] = useState('thisWeek');
  const [report, setReport] = useState<UserwiseReport[]>([]);
  const [attendanceReport, setAttendanceReport] = useState([]);
  const [managerId, setManagerId] = useState('');
  const [managers, setManagers] = useState<User[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const monthOptions = generateMonthOptions();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isDateSelected, setIsDateSelected] = useState<boolean>(false);
  const currentYear = new Date().getFullYear();
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
  const [selectedAttendanceDate, setSelectedAttendanceDate] = useState<string>(`${currentYear}-${currentMonth}`);
  const [dailyReport, setDailyReport] = useState<ReportEntry[]>([]);
  const [employeeId, setEmployeeId] = useState<string | undefined>(undefined);
  const [weekOffs, setWeekOffs] = useState<number>(0);
  const [attendanceLoading, setAttendanceLoading] = useState<boolean | null>(true);
  const [dailytotalCount, setDailyTotalCount] = useState<number>(0);
  const [dailypresentCount, setDailyPresentCount] = useState<number>(0);
  const [dailyonLeaveCount, setDailyOnLeaveCount] = useState<number>(0);
  const [dailyabsentCount, setDailyAbsentCount] = useState<number>(0);
  const [monthlyReport, setMonthlyReport] = useState<AttendanceEntry[]>([]);
  const [role, setRole] = useState<string>("");
  const [activeTab, setActiveTab] = useState("daily");

  // Effect for computing daily report counts
  useEffect(() => {
    const computeCounts = () => {
      setDailyTotalCount(dailyReport?.length || 0);
      setDailyPresentCount(dailyReport?.filter(entry => entry.status === 'Present').length || 0);
      setDailyOnLeaveCount(dailyReport?.filter(entry => entry.status === 'On Leave').length || 0);
      setDailyAbsentCount(dailyReport?.filter(entry => entry.status === 'Absent').length || 0);
    };

    computeCounts();
  }, [dailyReport]);

  // Fetch users from organization
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users/organization");
        const result = await response.json();

        if (response.ok) {
          setManagers(result.data);
          setEmployees(result.data);
        } else {
          console.error("Error fetching users:", result.error);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Fetch cumulative report based on selected period
  useEffect(() => {
    const fetchCumulativeReport = async () => {
      let startDate: Date;
      let endDate: Date;

      if (period === 'thisMonth') {
        startDate = startOfMonth(new Date());
        endDate = new Date();
      } else if (period === 'lastMonth') {
        startDate = startOfMonth(subMonths(new Date(), 1));
        endDate = endOfMonth(subMonths(new Date(), 1));
      } else if (period === 'thisWeek') {
        startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
        endDate = new Date();
      } else if (period === 'lastWeek') {
        startDate = startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 });
        endDate = endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 });
      } else {
        console.error("Invalid period specified.");
        return;
      }

      try {
        const res = await fetch('/api/reports/cumulative', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            managerId,
            employeeId,
          }),
        });
        const data = await res.json();
        setReport(data.report);
        setTotalCumulativeDays(data.totalDays);
        setWorkingDays(data.workingDays);
        setHolidaysCumulative(data.holidays.length);
        setWeekOffs(data.weekOffs);
      } catch (error) {
        console.error('Error fetching cumulative report:', error);
      }
    };

    if (period) fetchCumulativeReport();
  }, [managerId, period, employeeId]);

  // Fetch attendance data
  useEffect(() => {
    async function fetchAttendanceData() {
      setAttendanceLoading(true);
      try {
        const response = await fetch(`/api/attendance?date=${selectedAttendanceDate}`);
        const data = await response.json();

        // Update leaves and holidays
        setLeaves(data.leaves);
        setHolidays(data.holidays);

        // Parse the selected month and year
        const [selectedYearStr, selectedMonthStr] = selectedAttendanceDate.split('-');
        const selectedYear = parseInt(selectedYearStr, 10);
        const selectedMonth = parseInt(selectedMonthStr, 10) - 1; // JavaScript months are 0-based

        // Get today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to midnight
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();

        // Determine startDate and endDate
        const startDate = new Date(selectedYear, selectedMonth, 1);
        let endDate: Date;

        if (selectedYear === currentYear && selectedMonth === currentMonth) {
          // Selected month is current month, so end date is end of today
          endDate = endOfDay(today); // Set to 23:59:59 of today
        } else {
          // Selected month is not current month, so end date is end of selected month
          const lastDayOfMonth = new Date(selectedYear, selectedMonth + 1, 0); // Last day of the selected month
          endDate = endOfDay(lastDayOfMonth); // Set to 23:59:59 of the last day
        }

        // Generate all days from startDate to endDate
        const allDaysInMonth = eachDayOfInterval({ start: startDate, end: endDate });

        // Exclude weekends if necessary
        const weekdaysInMonth = allDaysInMonth.filter((day: any) => !isWeekend(day));

        // Set totalDays
        setTotalDays(weekdaysInMonth.length);

        // Filter monthlyReport to include only dates up to endDate
        const filteredMonthlyReport = data.monthlyReport.filter((day: AttendanceEntry) => {
          const dayDate = new Date(day.date);
          return dayDate >= startDate && dayDate <= endDate;
        });

        // Update state with the filtered report
        setMonthlyReport(filteredMonthlyReport);

        setAttendanceLoading(false);

        // Calculate summary counts using filteredMonthlyReport
        let totalPresent = 0;
        let totalLeave = 0;
        let totalAbsent = 0;
        let totalHoliday = 0;

        filteredMonthlyReport.forEach((day: any) => {
          totalPresent += day.present;
          totalLeave += day.leave;
          totalAbsent += day.absent;
          totalHoliday += day.holiday;
        });

        setPresentCount(totalPresent);
        setLeaveCount(totalLeave);
        setAbsentCount(totalAbsent);
        setHolidayCount(totalHoliday);

        // Update workingDays accordingly
        setWorkingDays(weekdaysInMonth.length - totalHoliday);

      } catch (error) {
        console.error('Error fetching attendance data:', error);
        setAttendanceLoading(false);
      }
    }

    fetchAttendanceData();
  }, [selectedAttendanceDate]);

  // Fetch daily report
  const fetchDailyReport = async (date: string) => {
    try {
      setAttendanceLoading(true);
      const res = await fetch('/api/reports/daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          managerId,
          employeeId,
        }),
      });
      const data = await res.json();
      setDailyReport(data.report);
      setAttendanceLoading(false);
    } catch (error) {
      console.error('Error fetching daily report:', error);
      setAttendanceLoading(false);
    }
  };

  // Fetch daily report when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchDailyReport(selectedDate);
    }
  }, [selectedDate, employeeId, managerId]);

  // Handler functions
  const handleDateChange = (date: Date) => {
    setSelectedDate(date.toISOString().split('T')[0]); // Convert to YYYY-MM-DD string format
    setIsDateSelected(true);
  };

  const handleCloseDialog = () => {
    setIsDatePickerOpen(false); // Close the dialog
  };

  // Export functions
  const exportDailyReportAsCSV = () => {
    // Transform the data for CSV export
    const csvData = dailyReport.map(entry => ({
      Name: entry.user,
      Status: entry.status,
      'Login Time': entry.loginTime !== 'N/A' && !isNaN(new Date(entry.loginTime).getTime())
        ? format(new Date(entry.loginTime), 'hh:mm a')
        : 'N/A',
      'Logout Time': entry.logoutTime !== 'N/A' && !isNaN(new Date(entry.logoutTime).getTime())
        ? format(new Date(entry.logoutTime), 'hh:mm a')
        : 'N/A',
      'Total Duration': entry.totalDuration
    }));

    // Convert data to CSV
    const csv = Papa.unparse(csvData);

    // Create Blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `Daily_Attendance_Report_${format(new Date(selectedDate), 'yyyy-MM-dd')}.csv`);
  };

  const exportCumulativeReportAsCSV = () => {
    // Transform the data for CSV export
    const csvData = report.map(entry => ({
      Name: entry.user,
      Present: entry.present,
      Leave: entry.leave,
      Absent: entry.absent,
      'Reporting Manager': entry.reportingManager || "Not Assigned"
    }));

    // Convert data to CSV
    const csv = Papa.unparse(csvData);

    // Create Blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `Cumulative_Attendance_Report_${period}.csv`);
  };

  const exportMonthlyReportAsCSV = () => {
    // Transform the data for CSV export
    const csvData = monthlyReport.map(day => ({
      Date: format(new Date(day.date), 'dd MMM yyyy'),
      Day: day.day,
      Present: day.present,
      Leave: day.leave,
      Absent: day.absent,
      Holiday: day.holiday,
      Total: day.total
    }));

    // Convert data to CSV
    const csv = Papa.unparse(csvData);

    // Create Blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `Monthly_Attendance_Report_${selectedAttendanceDate}.csv`);
  };

  // Get current user's role
  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const res = await axios.get('/api/users/me');
        setRole(res.data.data.role);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    }
    getUserDetails();
  }, []);

  // Role-based permissions
  const allowedRoles = ['orgAdmin', 'manager'];
  const adminRoles = ['orgAdmin'];
  const disallowedRoles = ['member'];

  // Loading state
  if (attendanceLoading) {
    return (
       <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-4 border-primary/10 animate-pulse"></div>

                {/* Multiple spinning rings */}
                <div className="h-24 w-24 rounded-full border-t-4 border-r-2 border-primary animate-spin"></div>
                <div className="absolute inset-0 h-20 w-20 m-auto rounded-full border-b-4 border-l-2 border-primary/70 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
                <div className="absolute inset-0 h-16 w-16 m-auto rounded-full border-l-4 border-t-2 border-primary/40 animate-spin" style={{ animationDuration: '2s' }}></div>

                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Clock className="h-8 w-8 text-primary animate-pulse" />
                </div>
              </div>

              <div className="space-y-2 text-center">
                <h3 className="font-semibold text-xl">Loading Your Attendance</h3>
                <p className="text-muted-foreground text-sm">Preparing your attendance records...</p>

                {/* Progress bar */}
                <div className="w-56 h-1.5 bg-muted rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-primary rounded-full animate-loader-progress"></div>
                </div>
              </div>
            </div>
          </div>
    );
  }

  return (
    <div className="p-6 h-screen overflow-y-auto scrollbar-hide">
      {attendanceLoading && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
             <div className="flex flex-col items-center gap-6">
               <div className="relative">
                 {/* Outer ring */}
                 <div className="absolute inset-0 rounded-full border-4 border-primary/10 animate-pulse"></div>

                 {/* Multiple spinning rings */}
                 <div className="h-24 w-24 rounded-full border-t-4 border-r-2 border-primary animate-spin"></div>
                 <div className="absolute inset-0 h-20 w-20 m-auto rounded-full border-b-4 border-l-2 border-primary/70 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
                 <div className="absolute inset-0 h-16 w-16 m-auto rounded-full border-l-4 border-t-2 border-primary/40 animate-spin" style={{ animationDuration: '2s' }}></div>

                 {/* Center icon */}
                 <div className="absolute inset-0 flex items-center justify-center">
                   <Clock className="h-8 w-8 text-primary animate-pulse" />
                 </div>
               </div>

               <div className="space-y-2 text-center">
                 <h3 className="font-semibold text-xl">Loading Your Attendance</h3>
                 <p className="text-muted-foreground text-sm">Preparing your attendance records...</p>

                 {/* Progress bar */}
                 <div className="w-56 h-1.5 bg-muted rounded-full overflow-hidden mt-2">
                   <div className="h-full bg-primary rounded-full animate-loader-progress"></div>
                 </div>
               </div>
             </div>
           </div>
      )}

      {/* Dashboard Header */}
      <div className="flex flex-col space-y-2 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CalendarDays className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Attendance Dashboard</h1>
          </div>
          {allowedRoles.includes(role) && (
            <Button variant="outline" size="sm" className="gap-1" onClick={() => {
              // Determine which export function to call based on active tab
              if (activeTab === "daily") {
                exportDailyReportAsCSV();
              } else if (activeTab === "cumulative") {
                exportCumulativeReportAsCSV();
              } else if (activeTab === "monthly") {
                exportMonthlyReportAsCSV();
              }
            }}>
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </Button>
          )}
        </div>
        <p className="text-muted-foreground text-sm">
          Track and manage attendance and leaves for your organization
        </p>
      </div>

      {/* Admin & Manager Filters */}
      {allowedRoles.includes(role) && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Filter Options</CardTitle>
            <CardDescription>
              Filter attendance data by manager and employee
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {adminRoles.includes(role) && (
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="manager" className="text-xs font-medium text-muted-foreground">Manager</label>
                  <Select onValueChange={setManagerId} value={managerId}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select Manager" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Managers</SelectItem>
                      {managers?.map((manager) => (
                        <SelectItem key={manager._id} value={manager._id}>
                          {manager.firstName} {manager.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex flex-col space-y-1.5">
                <label htmlFor="employee" className="text-xs font-medium text-muted-foreground">Employee</label>
                <Select onValueChange={setEmployeeId} value={employeeId}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select Employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Employees</SelectItem>
                    {employees?.map((employee) => (
                      <SelectItem key={employee._id} value={employee._id}>
                        {employee.firstName} {employee.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dashboard Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <UsersRound className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Active organizational members</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <UserRoundCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{dailypresentCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((dailypresentCount / (dailytotalCount || 1)) * 100)}% of workforce present
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Leave</CardTitle>
            <CalendarX2 className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{dailyonLeaveCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((dailyonLeaveCount / (dailytotalCount || 1)) * 100)}% of workforce on leave
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <Clock className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">{dailyabsentCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((dailyabsentCount / (dailytotalCount || 1)) * 100)}% of workforce absent
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full gap-2 grid-cols-3">
          <TabsTrigger value="daily" className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" />
            <span>Daily View</span>
          </TabsTrigger>
          <TabsTrigger value="cumulative" className="flex items-center gap-1.5">
            <BarChart4 className="h-4 w-4" />
            <span>Cumulative</span>
          </TabsTrigger>
          <TabsTrigger value="monthly" className="flex items-center gap-1.5">
            <PieChart className="h-4 w-4" />
            <span>Monthly</span>
          </TabsTrigger>
        </TabsList>

        {/* Daily Report Tab */}
        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Daily Attendance Report</CardTitle>
                <CardDescription>
                  Detailed view of employee attendance status for {format(new Date(selectedDate), 'MMMM d, yyyy')}
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <Dialog open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(selectedDate), 'MMM d, yyyy')}</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-background p-0 border-none max-w-md">
                    <CustomDatePicker
                      selectedDate={new Date(selectedDate)}
                      onDateChange={handleDateChange}
                      onCloseDialog={handleCloseDialog}
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={exportDailyReportAsCSV}
                  title="Export Daily Report"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center flex-wrap gap-2 mb-4">
                <div className="flex gap-2">
                  <Badge variant="outline" className="flex items-center gap-1.5">
                    <span>Total:</span> <span className="font-semibold">{dailytotalCount}</span>
                  </Badge>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
                    <span>Present:</span> <span className="font-semibold">{dailypresentCount}</span>
                  </Badge>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100">
                    <span>On Leave:</span> <span className="font-semibold">{dailyonLeaveCount}</span>
                  </Badge>
                  <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100">
                    <span>Absent:</span> <span className="font-semibold">{dailyabsentCount}</span>
                  </Badge>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Login Time</TableHead>
                      <TableHead>Logout Time</TableHead>
                      <TableHead className="text-right">Duration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dailyReport?.map((entry, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{entry.user}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              entry.status === 'Present'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : entry.status === 'On Leave'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                            }
                          >
                            {entry.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {entry.loginTime !== 'N/A' && !isNaN(new Date(entry.loginTime).getTime())
                            ? format(new Date(entry.loginTime), 'hh:mm a')
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {entry.logoutTime !== 'N/A' && !isNaN(new Date(entry.logoutTime).getTime())
                            ? format(new Date(entry.logoutTime), 'hh:mm a')
                            : 'N/A'}
                        </TableCell>
                        <TableCell className="text-right">{entry.totalDuration}</TableCell>
                      </TableRow>
                    ))}
                    {dailyReport?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          No attendance records found for this day
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cumulative Report Tab */}
        <TabsContent value="cumulative" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Cumulative Attendance Report</CardTitle>
                <CardDescription>
                  Track attendance patterns over time periods
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="thisWeek">This Week</SelectItem>
                    <SelectItem value="lastWeek">Last Week</SelectItem>
                    <SelectItem value="thisMonth">This Month</SelectItem>
                    <SelectItem value="lastMonth">Last Month</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={exportCumulativeReportAsCSV}
                  title="Export Cumulative Report"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <Calendar className="h-5 w-5 text-primary mb-2" />
                    <p className="text-xs font-medium text-muted-foreground">Total Days</p>
                    <h3 className="text-xl font-bold">{totalCumulativeDays}</h3>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <BadgeCheck className="h-5 w-5 text-emerald-500 mb-2" />
                    <p className="text-xs font-medium text-muted-foreground">Working Days</p>
                    <h3 className="text-xl font-bold text-emerald-600">{workingDays}</h3>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <Calendar className="h-5 w-5 text-amber-500 mb-2" />
                    <p className="text-xs font-medium text-muted-foreground">Week Offs</p>
                    <h3 className="text-xl font-bold text-amber-600">{weekOffs}</h3>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <CalendarX2 className="h-5 w-5 text-rose-500 mb-2" />
                    <p className="text-xs font-medium text-muted-foreground">Holidays</p>
                    <h3 className="text-xl font-bold text-rose-600">{holidaysCumulative}</h3>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-center">Present</TableHead>
                      <TableHead className="text-center">Leave</TableHead>
                      <TableHead className="text-center">Absent</TableHead>
                      <TableHead>Reporting Manager</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report?.map((entry, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{entry.user}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            {entry.present}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                            {entry.leave}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">
                            {entry.absent}
                          </Badge>
                        </TableCell>
                        <TableCell>{entry.reportingManager || "Not Assigned"}</TableCell>
                      </TableRow>
                    ))}
                    {report?.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          No cumulative data available for this period
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monthly Report Tab */}
        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Monthly Attendance Report</CardTitle>
                <CardDescription>
                  View attendance trends for the entire month
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <Select
                  value={selectedAttendanceDate}
                  onValueChange={setSelectedAttendanceDate}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.display}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={exportMonthlyReportAsCSV}
                  title="Export Monthly Report"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-800">
                  <span>Total Days:</span> <span className="font-semibold">{totalDays}</span>
                </Badge>
                <Badge variant="outline" className="border-yellow-200 bg-yellow-50 text-yellow-800">
                  <span>Total Employees:</span> <span className="font-semibold">{employees.length}</span>
                </Badge>
                <Badge variant="outline" className="border-green-200 bg-green-50 text-green-800">
                  <span>Present:</span> <span className="font-semibold">{presentCount}</span>
                </Badge>
                <Badge variant="outline" className="border-red-200 bg-red-50 text-red-800">
                  <span>Leave:</span> <span className="font-semibold">{leaveCount}</span>
                </Badge>
                <Badge variant="outline" className="border-gray-200 bg-gray-50 text-gray-800">
                  <span>Absent:</span> <span className="font-semibold">{absentCount}</span>
                </Badge>
                <Badge variant="outline" className="border-purple-200 bg-purple-50 text-purple-800">
                  <span>Holidays:</span> <span className="font-semibold">{holidayCount}</span>
                </Badge>
              </div>

              {/* For admin and manager roles */}
              {allowedRoles.includes(role) && (
                <div className="rounded-md border mb-8">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Day</TableHead>
                        <TableHead className="text-center">Present</TableHead>
                        <TableHead className="text-center">Leave</TableHead>
                        <TableHead className="text-center">Absent</TableHead>
                        <TableHead className="text-center">Holiday</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {monthlyReport.map((day, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {format(new Date(day.date), 'dd MMM yyyy')}
                          </TableCell>
                          <TableCell>{day.day}</TableCell>
                          <TableCell className="text-center">{day.present}</TableCell>
                          <TableCell className="text-center">{day.leave}</TableCell>
                          <TableCell className="text-center">{day.absent}</TableCell>
                          <TableCell className="text-center">{day.holiday}</TableCell>
                          <TableCell className="text-right font-medium">{day.total}</TableCell>
                        </TableRow>
                      ))}
                      {monthlyReport.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                            No monthly report data available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* For regular members */}
              {disallowedRoles.includes(role) && (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Day</TableHead>
                        <TableHead className="text-center">Present</TableHead>
                        <TableHead className="text-center">Leave</TableHead>
                        <TableHead className="text-center">Holiday</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {monthlyReport.map((day, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {format(new Date(day.date), 'dd MMM yyyy')}
                          </TableCell>
                          <TableCell>{day.day}</TableCell>
                          <TableCell className="text-center">
                            <Checkbox checked={!!day.present} disabled />
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox checked={!!day.leave} disabled />
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox checked={!!day.holiday} disabled />
                          </TableCell>
                        </TableRow>
                      ))}
                      {monthlyReport.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                            No personal attendance data available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <div className="flex items-center justify-between w-full">
                <div className="text-xs text-muted-foreground">
                  Showing data for {format(new Date(selectedAttendanceDate), 'MMMM yyyy')}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={exportMonthlyReportAsCSV}
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Export as CSV</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Additional Summary Information */}
      <div className="mt-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-primary" />
                <span>
                  Attendance rate: {presentCount ? Math.round((presentCount / (presentCount + absentCount + leaveCount)) * 100) : 0}%
                  for the selected month
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>
                  {holidays.length} holidays {holidays.length > 0 ? `(${holidays.map(h => h.holidayName).join(', ')})` : ''} in the selected month
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttendanceDashboard;

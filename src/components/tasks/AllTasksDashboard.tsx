import React, { useState, useEffect } from 'react';
import {
  User2,
  Tag,
  File,
  ArrowRight,
  CircleAlert,
  Circle,
  CheckCircle,
  Search,
  X,
  Calendar,
  BarChart3,
  Clock,
  TrendingUp,
  AlertCircle,
  Filter,
  ChevronDown,
  BellRing,
  ListChecks,
  Timer,
  CalendarCheck,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Tabs3 as Tabs, TabsList3 as TabsList, TabsTrigger3 as TabsTrigger, TabsContent3 as TabsContent } from '@/components/ui/tabs3';
import { Input } from '@/components/ui/input';
import { IconProgress } from "@tabler/icons-react";
import { useTheme } from 'next-themes';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, isWithinInterval } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";

interface AllTasksDashboardProps {
  tasks: any[];
  currentUser: any;
  setActiveTab: (tab: string) => void;
  setSelectedUserId: (user: any) => void;
  setSelectedCategory: (category: any) => void;
}

export default function AllTasksDashboard({
  tasks,
  currentUser,
  setActiveTab,
  setSelectedUserId,
  setSelectedCategory
}: AllTasksDashboardProps) {
  const [activeDashboardTab, setActiveDashboardTab] = useState<string>("employee-wise");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const { theme } = useTheme();

  // Date filter states
  const [dateFilter, setDateFilter] = useState<string>("all-time");
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [filteredTasks, setFilteredTasks] = useState<any[]>(tasks);

  // Apply date filters to tasks
  useEffect(() => {
    let filtered = [...tasks];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = subDays(today, 1);
    const thisWeekStart = startOfWeek(today, { weekStartsOn: 1 });
    const thisWeekEnd = endOfWeek(today, { weekStartsOn: 1 });
    const lastWeekStart = startOfWeek(subDays(today, 7), { weekStartsOn: 1 });
    const lastWeekEnd = endOfWeek(subDays(today, 7), { weekStartsOn: 1 });
    const nextWeekStart = startOfWeek(new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), { weekStartsOn: 1 });
    const nextWeekEnd = endOfWeek(new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), { weekStartsOn: 1 });
    const thisMonthStart = startOfMonth(today);
    const thisMonthEnd = endOfMonth(today);
    const lastMonthStart = startOfMonth(subDays(thisMonthStart, 1));
    const lastMonthEnd = endOfMonth(subDays(thisMonthStart, 1));
    const thisYearStart = startOfYear(today);

    switch (dateFilter) {
      case 'today':
        filtered = tasks.filter(task => {
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() === today.getTime();
        });
        break;
      case 'yesterday':
        filtered = tasks.filter(task => {
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() === yesterday.getTime();
        });
        break;
      case 'this-week':
        filtered = tasks.filter(task => {
          const dueDate = new Date(task.dueDate);
          return isWithinInterval(dueDate, { start: thisWeekStart, end: thisWeekEnd });
        });
        break;
      case 'last-week':
        filtered = tasks.filter(task => {
          const dueDate = new Date(task.dueDate);
          return isWithinInterval(dueDate, { start: lastWeekStart, end: lastWeekEnd });
        });
        break;
      case 'next-week':
        filtered = tasks.filter(task => {
          const dueDate = new Date(task.dueDate);
          return isWithinInterval(dueDate, { start: nextWeekStart, end: nextWeekEnd });
        });
        break;
      case 'this-month':
        filtered = tasks.filter(task => {
          const dueDate = new Date(task.dueDate);
          return isWithinInterval(dueDate, { start: thisMonthStart, end: thisMonthEnd });
        });
        break;
      case 'last-month':
        filtered = tasks.filter(task => {
          const dueDate = new Date(task.dueDate);
          return isWithinInterval(dueDate, { start: lastMonthStart, end: lastMonthEnd });
        });
        break;
      case 'this-year':
        filtered = tasks.filter(task => {
          const dueDate = new Date(task.dueDate);
          return isWithinInterval(dueDate, { start: thisYearStart, end: today });
        });
        break;
      case 'custom-range':
        if (customDateRange?.from && customDateRange?.to) {
          filtered = tasks.filter(task => {
            const dueDate = new Date(task.dueDate);
            return isWithinInterval(dueDate, {
              start: customDateRange.from as Date,
              end: customDateRange.to as Date
            });
          });
        }
        break;
      case 'all-time':
      default:
        // Keep all tasks
        break;
    }

    setFilteredTasks(filtered);
  }, [dateFilter, customDateRange, tasks]);

  // Calculate overall completion percentage
  const getCompletionPercentage = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  // Task statistics - use filteredTasks instead of tasks
  const getTotalTaskStats = () => {
    const overdueTasks = filteredTasks.filter(
      (task) =>
        new Date(task.dueDate) < new Date() && task.status !== "Completed"
    ).length;
    const completedTasks = filteredTasks.filter(
      (task) => task.status === "Completed"
    ).length;
    const inProgressTasks = filteredTasks.filter(
      (task) => task.status === "In Progress"
    ).length;
    const pendingTasks = filteredTasks.filter(
      (task) => task.status === "Pending"
    ).length;
    const delayedTasks = filteredTasks.filter(
      (task) =>
        task.status === "Completed" &&
        new Date(task.completionDate) > new Date(task.dueDate)
    ).length;
    const inTimeTasks = filteredTasks.filter(
      (task) =>
        task.status === "Completed" &&
        new Date(task.completionDate) <= new Date(task.dueDate)
    ).length;

    const dueSoonTasks = filteredTasks.filter(
      (task) => {
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 3 && diffDays >= 0 && task.status !== "Completed";
      }
    ).length;

    const totalTasks = filteredTasks.length;
    const completionRate = getCompletionPercentage(completedTasks, totalTasks);
    const onTimeRate = completedTasks > 0 ? getCompletionPercentage(inTimeTasks, completedTasks) : 0;

    return {
      overdueTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      delayedTasks,
      inTimeTasks,
      dueSoonTasks,
      totalTasks,
      completionRate,
      onTimeRate
    };
  };

  // User task statistics
  const getUserTaskStats = (userId: string) => {
    const userTasks = filteredTasks.filter(
      (task) => task.assignedUser?._id === userId
    );

    const overdueTasks = userTasks.filter(
      (task) =>
        new Date(task.dueDate) < new Date() && task.status !== "Completed"
    ).length;
    const completedTasks = userTasks.filter(
      (task) => task.status === "Completed"
    ).length;
    const inProgressTasks = userTasks.filter(
      (task) => task.status === "In Progress"
    ).length;
    const pendingTasks = userTasks.filter(
      (task) => task.status === "Pending"
    ).length;

    const totalTasks = userTasks.length;
    const completionRate = getCompletionPercentage(completedTasks, totalTasks);

    return {
      overdueTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      totalTasks,
      completionRate
    };
  };

  // Category task statistics
  const getCategoryTaskStats = (categoryId: string) => {
    const categoryTasks = filteredTasks.filter(
      (task) => task?.category?._id === categoryId
    );

    const overdueTasks = categoryTasks.filter(
      (task) =>
        new Date(task.dueDate) < new Date() && task.status !== "Completed"
    ).length;
    const completedTasks = categoryTasks.filter(
      (task) => task.status === "Completed"
    ).length;
    const inProgressTasks = categoryTasks.filter(
      (task) => task.status === "In Progress"
    ).length;
    const pendingTasks = categoryTasks.filter(
      (task) => task.status === "Pending"
    ).length;

    const totalTasks = categoryTasks.length;
    const completionRate = getCompletionPercentage(completedTasks, totalTasks);

    return {
      overdueTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      totalTasks,
      completionRate
    };
  };

  // Task summary stats
  const taskStats = getTotalTaskStats();

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users/organization");
        const result = await response.json();

        if (response.ok) {
          setUsers(result.data);
        } else {
          console.error("Error fetching users:", result.error);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/category/get", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const result = await response.json();

        if (response.ok) {
          setCategories(result.data);
        } else {
          console.log(result.error);
        }
      } catch (error: any) {
        console.log(error.message);
      }
    };

    fetchCategories();
  }, []);

  // Initialize dashboard tab based on user role
  useEffect(() => {
    if (currentUser?.role === "member") {
      setActiveDashboardTab("my-report");
    }
  }, [currentUser]);

  // Get date filter label for display
  const getDateFilterLabel = () => {
    switch (dateFilter) {
      case 'today': return 'Today';
      case 'yesterday': return 'Yesterday';
      case 'this-week': return 'This Week';
      case 'last-week': return 'Last Week';
      case 'next-week': return 'Next Week';
      case 'this-month': return 'This Month';
      case 'last-month': return 'Last Month';
      case 'this-year': return 'This Year';
      case 'custom-range':
        return customDateRange?.from && customDateRange?.to
          ? `${format(customDateRange.from, 'MMM d, yyyy')} - ${format(customDateRange.to, 'MMM d, yyyy')}`
          : 'Custom Range';
      case 'all-time':
      default:
        return 'All Time';
    }
  };

  // Get color based on completion percentage
  const getColorByPercentage = (percentage: number, isEmpty: boolean = false) => {
    if (isEmpty) return "#6C636E"; // Gray for empty
    if (percentage < 50) return "#EF4444"; // Red for <50%
    if (percentage < 80) return "#F59E0B"; // Orange for 50-79%
    return "#10B981"; // Green for 80%+
  };

  // Determine status badge color
  const getStatusBadgeClass = (count: number, type: string) => {
    if (count === 0) return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";

    switch (type) {
      case 'overdue':
        return "bg-red-100 hover:bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case 'pending':
        return "bg-yellow-100 hover:bg-yellow-100/80 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case 'inProgress':
        return "bg-blue-100 hover:bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case 'completed':
        return "bg-green-100 hover:bg-green-100/80 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case 'dueSoon':
        return "bg-amber-100 hover:bg-amber-100/80 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case 'delayed':
        return "bg-red-100 hover:bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case 'inTime':
        return "bg-green-100 hover:bg-green-100/80 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 hover:bg-gray-100/80 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Date Filter Controls */}
      <Card className="border shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center  gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              {/* <h3 className="text-sm font-medium">Data Period:</h3> */}
              <Badge  className="text-xs bg-primary/80 text-white font-normal">
                {getDateFilterLabel()}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Replace dropdown with button group */}
              <div className="flex flex-wrap gap-1">
                <Button
                  variant={dateFilter === "today" ? "default" : "outline"}
                  size="sm"
                  className="gap-1 h-8"
                  onClick={() => setDateFilter("today")}
                >
                  Today
                </Button>
                <Button
                  variant={dateFilter === "yesterday" ? "default" : "outline"}
                  size="sm"
                  className="gap-1 h-8"
                  onClick={() => setDateFilter("yesterday")}
                >
                  Yesterday
                </Button>
                <Button
                  variant={dateFilter === "this-week" ? "default" : "outline"}
                  size="sm"
                  className="gap-1 h-8"
                  onClick={() => setDateFilter("this-week")}
                >
                  This Week
                </Button>
                <Button
                  variant={dateFilter === "last-week" ? "default" : "outline"}
                  size="sm"
                  className="gap-1 h-8"
                  onClick={() => setDateFilter("last-week")}
                >
                  Last Week
                </Button>
                <Button
                  variant={dateFilter === "this-month" ? "default" : "outline"}
                  size="sm"
                  className="gap-1 h-8"
                  onClick={() => setDateFilter("this-month")}
                >
                  This Month
                </Button>
                <Button
                  variant={dateFilter === "all-time" ? "default" : "outline"}
                  size="sm"
                  className="gap-1 h-8"
                  onClick={() => setDateFilter("all-time")}
                >
                  All Time
                </Button>
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={dateFilter === "custom-range" ? "default" : "outline"}
                    size="sm"
                    className="gap-1 h-8"
                  >
                    Custom Range
                    <CalendarCheck className="h-3.5 w-3.5 opacity-70" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <div className="p-3 space-y-3">
                    <h4 className="font-medium text-sm">Select Date Range</h4>
                    <DateRangePicker
                      value={customDateRange}
                      onChange={(range) => {
                        setCustomDateRange(range);
                        setDateFilter("custom-range");
                      }}
                    />
                  </div>
                </PopoverContent>
              </Popover>

              {dateFilter !== "all-time" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setDateFilter("all-time")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Dashboard Overview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold tracking-tight">Task Dashboard</h2>
          <Badge variant="outline" className="text-xs py-1 px-3 flex items-center gap-1.5">
            <ListChecks className="h-3.5 w-3.5" />
            {taskStats.totalTasks} Total Tasks
          </Badge>
        </div>

        {/* Primary Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Completion Summary Card */}
          <Card className="overflow-hidden border-muted">
            <div className="flex h-full">
              <div className="p-4 flex-1">
                <CardTitle className="text-lg flex items-center gap-2 mb-1">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Completion
                </CardTitle>
                <div className="space-y-1 mb-3">
                  <div className="text-2xl font-bold">{taskStats.completionRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    {taskStats.completedTasks} of {taskStats.totalTasks} tasks
                  </p>
                </div>
                <div className="space-y-2  gap-2">
                  <Badge className={`text-xs py-0.5 m-1 px-2 ${getStatusBadgeClass(taskStats.completedTasks, 'completed')}`}>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {taskStats.completedTasks} Completed
                  </Badge>
                  <Badge className={`text-xs m-1 py-0.5 px-2 ${getStatusBadgeClass(taskStats.inProgressTasks, 'inProgress')}`}>
                    <IconProgress className="h-3 w-3 mr-1" />
                    {taskStats.inProgressTasks} In Progress
                  </Badge>
                  <Badge className={`text-xs m-1 py-0.5 px-2 ${getStatusBadgeClass(taskStats.pendingTasks, 'pending')}`}>
                    <Circle className="h-3 w-3 mr-1" />
                    {taskStats.pendingTasks} Pending
                  </Badge>
                </div>
              </div>
              <div className="bg-muted/20 flex items-center justify-center p-4 w-24">
                <div style={{ width: 80, height: 80 }}>
                  <CircularProgressbar
                    value={taskStats.completionRate}
                    text={`${taskStats.completionRate}%`}
                    styles={buildStyles({
                      textSize: '24px',
                      pathColor: getColorByPercentage(taskStats.completionRate),
                      textColor: theme === 'dark' ? '#ffffff' : '#000000',
                      trailColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    })}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Time Performance Card */}
          <Card className="overflow-hidden border-muted">
            <div className="flex h-full">
              <div className="p-4 flex-1">
                <CardTitle className="text-lg flex items-center gap-2 mb-1">
                  <Clock className="h-5 w-5 text-blue-500" />
                  On-Time Rate
                </CardTitle>
                <div className="space-y-1 mb-3">
                  <div className="text-2xl font-bold">{taskStats.onTimeRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    Completed tasks on time
                  </p>
                </div>
                <div className="space-y-2">
                  <Badge className={`text-xs py-0.5 m-2 px-2 ${getStatusBadgeClass(taskStats.inTimeTasks, 'inTime')}`}>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {taskStats.inTimeTasks} In Time
                  </Badge>
                  <Badge className={`text-xs py-0.5 m-2  px-2 ${getStatusBadgeClass(taskStats.delayedTasks, 'delayed')}`}>
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {taskStats.delayedTasks} Delayed
                  </Badge>
                </div>
              </div>
              <div className="bg-muted/20 flex items-center justify-center p-4 w-24">
                <div style={{ width: 80, height: 80 }}>
                  <CircularProgressbar
                    value={taskStats.onTimeRate}
                    text={`${taskStats.onTimeRate}%`}
                    styles={buildStyles({
                      textSize: '24px',
                      pathColor: getColorByPercentage(taskStats.onTimeRate),
                      textColor: theme === 'dark' ? '#ffffff' : '#000000',
                      trailColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    })}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Attention Required Card */}
          <Card className={taskStats.overdueTasks > 0 ? "border-red-200 dark:border-red-900 overflow-hidden" : "overflow-hidden border-muted"}>
            <div className="flex h-full">
              <div className="p-4 flex-1">
                <CardTitle className="text-lg flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Attention Needed
                </CardTitle>
                <div className="space-y-2 mb-3">
                  <Badge className={`text-xs py-0.5 px-2 ${getStatusBadgeClass(taskStats.overdueTasks, 'overdue')}`}>
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {taskStats.overdueTasks} Overdue
                  </Badge>
                  <Badge className={`text-xs py-0.5 px-2 ${getStatusBadgeClass(taskStats.dueSoonTasks, 'dueSoon')}`}>
                    <Timer className="h-3 w-3 mr-1" />
                    {taskStats.dueSoonTasks} Due Soon
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs gap-1.5 mt-2"
                  onClick={() => {
                    setActiveTab('allTasks');
                    // Add a status parameter to specify which filter should be active
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('initialTaskStatusFilter', 'overdue');
                    }
                  }}
                >
                  <CircleAlert className="h-3.5 w-3.5" />
                  View All Overdue Tasks
                </Button>
              </div>
              <div className={`${taskStats.overdueTasks > 0 ? "bg-red-50 dark:bg-red-900/20" : "bg-muted/20"} flex items-center justify-center p-4 w-24`}>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <AlertCircle className={`${taskStats.overdueTasks > 0 ? "text-red-500" : "text-yellow-500"} h-10 w-10 opacity-80`} />
                  </div>
                  <div style={{ width: 80, height: 80 }} className="opacity-20">
                    <CircularProgressbar
                      value={100}
                      styles={buildStyles({
                        pathColor: taskStats.overdueTasks > 0 ? "#EF4444" : "#F59E0B",
                        trailColor: 'transparent',
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions Card Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card
            className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 hover:border-blue-300 cursor-pointer transition-all dark:from-blue-950/30 dark:to-indigo-950/30 dark:border-blue-900"
            onClick={() => setActiveTab('myTasks')}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/60 p-2">
                <User2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium">My Tasks</h3>
                <p className="text-xs text-muted-foreground">View your assigned tasks</p>
              </div>
            </CardContent>
          </Card>

          <Card
            className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100 hover:border-purple-300 cursor-pointer transition-all dark:from-purple-950/30 dark:to-pink-950/30 dark:border-purple-900"
            onClick={() => setActiveTab('delegatedTasks')}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className="rounded-full bg-purple-100 dark:bg-purple-900/60 p-2">
                <ArrowRight className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-medium">Delegated</h3>
                <p className="text-xs text-muted-foreground">Tasks assigned to others</p>
              </div>
            </CardContent>
          </Card>

          <Card
            className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100 hover:border-amber-300 cursor-pointer transition-all dark:from-amber-950/30 dark:to-orange-950/30 dark:border-amber-900"
            onClick={() => setActiveTab('allTasks')}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className="rounded-full bg-amber-100 dark:bg-amber-900/60 p-2">
                <Tag className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-medium">All Tasks</h3>
                <p className="text-xs text-muted-foreground">View all organization tasks</p>
              </div>
            </CardContent>
          </Card>

          <Card
            className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100 hover:border-emerald-300 cursor-pointer transition-all dark:from-emerald-950/30 dark:to-teal-950/30 dark:border-emerald-900"
            onClick={() => setActiveTab('taskTemplates')}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/60 p-2">
                <File className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-medium">Templates</h3>
                <p className="text-xs text-muted-foreground">Manage task templates</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <Tabs
        value={activeDashboardTab}
        onValueChange={setActiveDashboardTab}
        className="w-full pt-2"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <TabsList className="h-10 gap-2 p-1 bg-muted/50">
            {(currentUser?.role === "orgAdmin" || currentUser?.role === "manager") && (
              <>
                <TabsTrigger value="employee-wise" className="">
                  <div className="flex items-center gap-1.5">
                    <User2 className="h-4 w-4" />
                    <span>By Employee</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="category-wise" className="">
                  <div className="flex items-center gap-1.5">
                    <Tag className="h-4 w-4" />
                    <span>By Category</span>
                  </div>
                </TabsTrigger>
              </>
            )}
            <TabsTrigger value="my-report" className="">
              <div className="flex items-center gap-1.5">
                <File className="h-4 w-4" />
                <span>My Report</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="delegatedTasks" className="">
              <div className="flex items-center gap-1.5">
                <ArrowRight className="h-4 w-4" />
                <span>Delegated</span>
              </div>
            </TabsTrigger>
          </TabsList>

          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={`Search ${activeDashboardTab === 'employee-wise' ? 'Employee' : activeDashboardTab === 'category-wise' ? 'Category' : 'Tasks'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-10 bg-background"
            />
            {searchQuery && (
              <X
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer"
                onClick={() => setSearchQuery("")}
              />
            )}
          </div>
        </div>

        {/* Employee Tab Content */}
        <TabsContent value="employee-wise" className="mb-12 mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {users
              .filter((user) => {
                const query = searchQuery.toLowerCase();
                return (
                  user.firstName?.toLowerCase().includes(query) ||
                  user.lastName?.toLowerCase().includes(query) ||
                  `${user.firstName} ${user.lastName}`.toLowerCase().includes(query) ||
                  user.email?.toLowerCase().includes(query)
                );
              })
              .filter((user) => {
                if (currentUser?.role === 'manager') {
                  return (
                    (user.reportingManager && user.reportingManager === currentUser._id) ||
                    user._id === currentUser._id
                  );
                } else {
                  return true;
                }
              })
              .map((user) => {
                const stats = getUserTaskStats(user._id);
                const pathColor = getColorByPercentage(
                  stats.completionRate,
                  stats.totalTasks === 0
                );

                return (
                  <Card
                    key={user._id}
                    onClick={() => {
                      setSelectedUserId(user);
                      setActiveTab("allTasks");
                    }}
                    className="hover:border-primary transition-all cursor-pointer overflow-hidden group"
                  >
                    <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-11 w-11 border-2 border-background">
                          <AvatarImage src={user.profilePic} alt={`${user.firstName} ${user.lastName}`} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {`${user?.firstName?.slice(0, 1) || ''}`}
                            {`${user?.lastName?.slice(0, 1) || ''}`}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base font-medium">
                            {user.firstName} {user.lastName}
                          </CardTitle>
                          <CardDescription className="text-xs truncate max-w-[120px]">
                            {user.email ? (user.email.length > 18 ? `${user.email.slice(0, 15)}...` : user.email) : ''}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="relative" style={{ width: 44, height: 44 }}>
                        <CircularProgressbar
                          value={stats.completionRate}
                          text={`${stats.completionRate}%`}
                          styles={buildStyles({
                            textSize: "26px",
                            pathColor: pathColor,
                            textColor: theme === "dark" ? "#ffffff" : "#000000",
                            trailColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                          })}
                        />
                      </div>
                    </CardHeader>
                    <Separator className="mb-2" />
                    <CardContent className="p-4 pt-1">
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground mb-1">Total Tasks</span>
                          <span className="font-medium">{stats.totalTasks}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground mb-1">Completed</span>
                          <span className="font-medium text-green-600 dark:text-green-400">{stats.completedTasks}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-2 text-xs">
                                <Badge variant="outline" className={getStatusBadgeClass(stats.overdueTasks, 'overdue')}>
                                  {stats.overdueTasks}
                                </Badge>
                                <span>Overdue</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              <p>Tasks past their due date</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-2 text-xs">
                                <Badge variant="outline" className={getStatusBadgeClass(stats.pendingTasks, 'pending')}>
                                  {stats.pendingTasks}
                                </Badge>
                                <span>Pending</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              <p>Tasks not yet started</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-2 text-xs">
                                <Badge variant="outline" className={getStatusBadgeClass(stats.inProgressTasks, 'inProgress')}>
                                  {stats.inProgressTasks}
                                </Badge>
                                <span>In Progress</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              <p>Tasks currently being worked on</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </CardContent>
                    <CardFooter className="p-0">
                      <Button
                        variant="ghost"
                        className="w-full rounded-none rounded-b-lg border-t h-9 text-xs group-hover:bg-primary/5"
                      >
                        View Employee Tasks
                        <ArrowRight className="h-3.5 w-3.5 ml-1.5 opacity-70" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
          </div>
          {users.filter(u => {
            const query = searchQuery.toLowerCase();
            return (
              u.firstName?.toLowerCase().includes(query) ||
              u.lastName?.toLowerCase().includes(query) ||
              `${u.firstName} ${u.lastName}`.toLowerCase().includes(query) ||
              u.email?.toLowerCase().includes(query)
            );
          }).length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/20 rounded-lg">
                <User2 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No employees found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your search criteria</p>
                {searchQuery && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            )}
        </TabsContent>

        {/* Category Tab Content */}
        <TabsContent value="category-wise" className="mb-12 mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories
              .filter((category) => {
                const query = searchQuery.toLowerCase();
                return category?.name?.toLowerCase().includes(query);
              })
              .map((category) => {
                const stats = getCategoryTaskStats(category._id);
                const pathColor = getColorByPercentage(
                  stats.completionRate,
                  stats.totalTasks === 0
                );

                return (
                  <Card
                    key={category._id}
                    onClick={() => {
                      setSelectedCategory(category);
                      setActiveTab("allTasks");
                    }}
                    className="hover:border-primary transition-all cursor-pointer overflow-hidden group"
                  >
                    <CardHeader className="p-4 pb-0 flex flex-row items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                          <Tag className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-base font-medium">{category.name}</CardTitle>
                          <CardDescription className="text-xs">
                            {stats.totalTasks} {stats.totalTasks === 1 ? 'task' : 'tasks'}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="relative" style={{ width: 44, height: 44 }}>
                        <CircularProgressbar
                          value={stats.completionRate}
                          text={`${stats.completionRate}%`}
                          styles={buildStyles({
                            textSize: "26px",
                            pathColor: pathColor,
                            textColor: theme === "dark" ? "#ffffff" : "#000000",
                            trailColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                          })}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      {/* <Progress
                        value={stats.completionRate}
                        className="h-2 mb-4"
                        indicatorClassName={stats.completionRate >= 80 ? "bg-green-500" : stats.completionRate >= 50 ? "bg-amber-500" : "bg-red-500"}
                      /> */}

                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          <Badge variant="outline" className={getStatusBadgeClass(stats.overdueTasks, 'overdue')}>
                            {stats.overdueTasks}
                          </Badge>
                          <span>Overdue</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Badge variant="outline" className={getStatusBadgeClass(stats.pendingTasks, 'pending')}>
                            {stats.pendingTasks}
                          </Badge>
                          <span>Pending</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Badge variant="outline" className={getStatusBadgeClass(stats.inProgressTasks, 'inProgress')}>
                            {stats.inProgressTasks}
                          </Badge>
                          <span>In Progress</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Badge variant="outline" className={getStatusBadgeClass(stats.completedTasks, 'completed')}>
                            {stats.completedTasks}
                          </Badge>
                          <span>Completed</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-0">
                      <Button
                        variant="ghost"
                        className="w-full rounded-none rounded-b-lg border-t h-9 text-xs group-hover:bg-primary/5"
                      >
                        View Category Tasks
                        <ArrowRight className="h-3.5 w-3.5 ml-1.5 opacity-70" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
          </div>
          {categories.filter(c => {
            const query = searchQuery.toLowerCase();
            return c?.name?.toLowerCase().includes(query);
          }).length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/20 rounded-lg">
                <Tag className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No categories found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your search criteria</p>
                {searchQuery && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            )}
        </TabsContent>

        {/* My Report Tab Content */}
        <TabsContent value="my-report" className="mb-12 mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories
              .filter((category) => {
                const query = searchQuery.toLowerCase();
                return category?.name?.toLowerCase().includes(query);
              })
              .filter((category) => {
                // Fetch task stats for the category
                const { overdueTasks, inProgressTasks, pendingTasks } =
                  getCategoryTaskStats(category._id);

                // Only include categories with at least one relevant task
                return (
                  overdueTasks > 0 || pendingTasks > 0 || inProgressTasks > 0
                );
              })
              .map((category) => {
                const stats = getCategoryTaskStats(category._id);
                const pathColor = getColorByPercentage(
                  stats.completionRate,
                  stats.totalTasks === 0
                );

                return (
                  <Card
                    key={category._id}
                    onClick={() => {
                      setSelectedCategory(category);
                      setActiveTab("allTasks");
                    }}
                    className={`
                      hover:border-primary transition-all cursor-pointer overflow-hidden group
                      ${stats.overdueTasks > 0 ? 'border-red-200 dark:border-red-900' : ''}
                    `}
                  >
                    <CardHeader className="p-4 pb-0 flex flex-row items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`
                          h-10 w-10 rounded-full flex items-center justify-center
                          ${stats.overdueTasks > 0
                            ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-primary/10 text-primary'}
                        `}>
                          <Tag className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-base font-medium">{category.name}</CardTitle>
                          <CardDescription className="text-xs flex items-center gap-1">
                            {stats.overdueTasks > 0 && (
                              <Badge variant="destructive" className="text-[10px] h-4">
                                {stats.overdueTasks} overdue
                              </Badge>
                            )}
                            <span>{stats.totalTasks} tasks</span>
                          </CardDescription>
                        </div>
                      </div>
                      <div className="relative" style={{ width: 44, height: 44 }}>
                        <CircularProgressbar
                          value={stats.completionRate}
                          text={`${stats.completionRate}%`}
                          styles={buildStyles({
                            textSize: "26px",
                            pathColor: pathColor,
                            textColor: theme === "dark" ? "#ffffff" : "#000000",
                            trailColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                          })}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      {/* <Progress
                        value={stats.completionRate}
                        className="h-2 mb-4"
                        indicatorClassName={stats.completionRate >= 80 ? "bg-green-500" : stats.completionRate >= 50 ? "bg-amber-500" : "bg-red-500"}
                      /> */}

                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          <Badge variant="outline" className={getStatusBadgeClass(stats.overdueTasks, 'overdue')}>
                            {stats.overdueTasks}
                          </Badge>
                          <span>Overdue</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Badge variant="outline" className={getStatusBadgeClass(stats.pendingTasks, 'pending')}>
                            {stats.pendingTasks}
                          </Badge>
                          <span>Pending</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Badge variant="outline" className={getStatusBadgeClass(stats.inProgressTasks, 'inProgress')}>
                            {stats.inProgressTasks}
                          </Badge>
                          <span>In Progress</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Badge variant="outline" className={getStatusBadgeClass(stats.completedTasks, 'completed')}>
                            {stats.completedTasks}
                          </Badge>
                          <span>Completed</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-0">
                      <Button
                        variant="ghost"
                        className="w-full rounded-none rounded-b-lg border-t h-9 text-xs group-hover:bg-primary/5"
                      >
                        View My Tasks in Category
                        <ArrowRight className="h-3.5 w-3.5 ml-1.5 opacity-70" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
          </div>
          {categories.filter(c => {
            const query = searchQuery.toLowerCase();
            return c?.name?.toLowerCase().includes(query);
          }).filter((category) => {
            const { overdueTasks, inProgressTasks, pendingTasks } = getCategoryTaskStats(category._id);
            return (overdueTasks > 0 || pendingTasks > 0 || inProgressTasks > 0);
          }).length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/20 rounded-lg">
                <File className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No active tasks found</h3>
                <p className="text-sm text-muted-foreground">You don&apos;t have any pending or in-progress tasks in any category</p>
                {searchQuery && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            )}
        </TabsContent>

        {/* Delegated Tasks Tab Content */}
        <TabsContent value="delegatedTasks" className="mb-12 mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {users
              .filter((user) => {
                const query = searchQuery.toLowerCase();
                return (
                  user.firstName?.toLowerCase().includes(query) ||
                  user.lastName?.toLowerCase().includes(query) ||
                  `${user.firstName} ${user.lastName}`.toLowerCase().includes(query) ||
                  user.email?.toLowerCase().includes(query)
                );
              })
              .filter((user) => {
                // Fetch task stats for the user
                const { overdueTasks, inProgressTasks, pendingTasks } =
                  getUserTaskStats(user._id);

                // Only include users with at least one relevant task
                return (
                  overdueTasks > 0 || pendingTasks > 0 || inProgressTasks > 0
                );
              })
              .map((user) => {
                const stats = getUserTaskStats(user._id);
                const pathColor = getColorByPercentage(
                  stats.completionRate,
                  stats.totalTasks === 0
                );

                return (
                  <Card
                    key={user._id}
                    onClick={() => {
                      setSelectedUserId(user);
                      setActiveTab("allTasks");
                    }}
                    className={`
                      hover:border-primary transition-all cursor-pointer overflow-hidden group
                      ${stats.overdueTasks > 0 ? 'border-red-200 dark:border-red-900' : ''}
                    `}
                  >
                    <CardHeader className="p-4 pb-0 flex flex-row items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-11 w-11 border-2 border-background">
                          <AvatarImage src={user.profilePic} alt={`${user.firstName} ${user.lastName}`} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {`${user?.firstName?.slice(0, 1) || ''}`}
                            {`${user?.lastName?.slice(0, 1) || ''}`}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base font-medium">
                            {user.firstName} {user.lastName}
                          </CardTitle>
                          <CardDescription className="text-xs flex items-center gap-1">
                            {/* {stats.overdueTasks > 0 && (
                              <Badge variant="destructive" className="text-[10px] h-4">
                                {stats.overdueTasks} overdue
                              </Badge>
                            )} */}
                            <span className="truncate max-w-[100px]">
                              {user.email ? (user.email.length > 15 ? `${user.email.slice(0, 12)}...` : user.email) : ''}
                            </span>
                          </CardDescription>
                        </div>
                      </div>
                      <div className="relative" style={{ width: 44, height: 44 }}>
                        <CircularProgressbar
                          value={stats.completionRate}
                          text={`${stats.completionRate}%`}
                          styles={buildStyles({
                            textSize: "26px",
                            pathColor: pathColor,
                            textColor: theme === "dark" ? "#ffffff" : "#000000",
                            trailColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                          })}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      {/* <Progress
                        value={stats.completionRate}
                        className="h-2 mb-4"
                        indicatorClassName={stats.completionRate >= 80 ? "bg-green-500" : stats.completionRate >= 50 ? "bg-amber-500" : "bg-red-500"}
                      /> */}

                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          <Badge variant="outline" className={getStatusBadgeClass(stats.overdueTasks, 'overdue')}>
                            {stats.overdueTasks}
                          </Badge>
                          <span>Overdue</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Badge variant="outline" className={getStatusBadgeClass(stats.pendingTasks, 'pending')}>
                            {stats.pendingTasks}
                          </Badge>
                          <span>Pending</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Badge variant="outline" className={getStatusBadgeClass(stats.inProgressTasks, 'inProgress')}>
                            {stats.inProgressTasks}
                          </Badge>
                          <span>In Progress</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Badge variant="outline" className={getStatusBadgeClass(stats.completedTasks, 'completed')}>
                            {stats.completedTasks}
                          </Badge>
                          <span>Completed</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-0">
                      <Button
                        variant="ghost"
                        className="w-full rounded-none rounded-b-lg border-t h-9 text-xs group-hover:bg-primary/5"
                      >
                        View Delegated Tasks
                        <ArrowRight className="h-3.5 w-3.5 ml-1.5 opacity-70" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
          </div>
          {users.filter(u => {
            const query = searchQuery.toLowerCase();
            return (
              u.firstName?.toLowerCase().includes(query) ||
              u.lastName?.toLowerCase().includes(query) ||
              `${u.firstName} ${u.lastName}`.toLowerCase().includes(query) ||
              u.email?.toLowerCase().includes(query)
            );
          }).filter((user) => {
            const { overdueTasks, inProgressTasks, pendingTasks } = getUserTaskStats(user._id);
            return (overdueTasks > 0 || pendingTasks > 0 || inProgressTasks > 0);
          }).length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/20 rounded-lg">
                <ArrowRight className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No delegated tasks</h3>
                <p className="text-sm text-muted-foreground">You haven&apos;t delegated any active tasks to team members</p>
                {searchQuery && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

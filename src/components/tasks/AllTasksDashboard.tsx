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
  ChevronDown
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

  return (
    <div className="space-y-6">
      {/* Date Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2 bg-card rounded-lg p-4 border">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-sm font-medium">Data Period:</h3>
        </div>

        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1 h-9">
                {getDateFilterLabel()}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem onSelect={() => setDateFilter("today")}>
                Today
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setDateFilter("yesterday")}>
                Yesterday
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setDateFilter("this-week")}>
                This Week
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setDateFilter("last-week")}>
                Last Week
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setDateFilter("next-week")}>
                Next Week
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setDateFilter("this-month")}>
                This Month
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setDateFilter("last-month")}>
                Last Month
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setDateFilter("this-year")}>
                This Year
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setDateFilter("all-time")}>
                All Time
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-1 h-9">
                Custom Range
                <ChevronDown className="h-4 w-4 opacity-50" />
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
              className="h-9 w-9"
              onClick={() => setDateFilter("all-time")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Dashboard Overview */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Task Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {/* Completion Summary Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Completion Status
              </CardTitle>
              <CardDescription>Overall task completion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{taskStats.completionRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    {taskStats.completedTasks} of {taskStats.totalTasks} tasks completed
                  </p>
                </div>
                <div style={{ width: 60, height: 60 }}>
                  <CircularProgressbar
                    value={taskStats.completionRate}
                    styles={buildStyles({
                      pathColor: getColorByPercentage(taskStats.completionRate),
                      textColor: theme === 'dark' ? '#ffffff' : '#000000',
                      trailColor: '#e5e7eb',
                    })}
                  />
                </div>
              </div>
              <Separator className="my-3" />
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1.5">
                  <IconProgress className="text-orange-500 h-4 w-4" />
                  <span>In Progress: {taskStats.inProgressTasks}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Circle className="text-yellow-500 h-4 w-4" />
                  <span>Pending: {taskStats.pendingTasks}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time Performance Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                Time Performance
              </CardTitle>
              <CardDescription>Deadline adherence</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{taskStats.onTimeRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    Tasks completed on time
                  </p>
                </div>
                <div style={{ width: 60, height: 60 }}>
                  <CircularProgressbar
                    value={taskStats.onTimeRate}
                    styles={buildStyles({
                      pathColor: getColorByPercentage(taskStats.onTimeRate),
                      textColor: theme === 'dark' ? '#ffffff' : '#000000',
                      trailColor: '#e5e7eb',
                    })}
                  />
                </div>
              </div>
              <Separator className="my-3" />
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="text-green-500 h-4 w-4" />
                  <span>In Time: {taskStats.inTimeTasks}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="text-red-500 h-4 w-4" />
                  <span>Delayed: {taskStats.delayedTasks}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attention Required Card */}
          <Card className={taskStats.overdueTasks > 0 ? "border-red-200 dark:border-red-900" : ""}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <CircleAlert className="h-5 w-5 text-red-500" />
                Attention Required
              </CardTitle>
              <CardDescription>Tasks needing action</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Overdue Tasks</span>
                  <Badge variant="destructive" className="text-xs">
                    {taskStats.overdueTasks}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Due Soon </span>
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800 text-xs">
                    {taskStats.dueSoonTasks}
                  </Badge>
                </div>

                <Separator className="my-1" />

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs gap-1.5"
                  onClick={() => setActiveTab('allTasks')}
                >
                  <CircleAlert className="h-3.5 w-3.5" />
                  View All Overdue Tasks
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-500" />
                Quick Actions
              </CardTitle>
              <CardDescription>Task management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2 text-sm"
                  onClick={() => setActiveTab('myTasks')}
                >
                  <File className="h-4 w-4" />
                  <span>My Tasks</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2 text-sm"
                  onClick={() => setActiveTab('delegatedTasks')}
                >
                  <ArrowRight className="h-4 w-4" />
                  <span>Delegated Tasks</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2 text-sm"
                  onClick={() => setActiveTab('allTasks')}
                >
                  <Tag className="h-4 w-4" />
                  <span>All Tasks</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <Tabs
        value={activeDashboardTab}
        onValueChange={setActiveDashboardTab}
        className="w-full"
      >
        <div className="flex items-center justify-between mb-4">
          <TabsList className="h-auto justify-start gap-2 bg-transparent">
            {(currentUser?.role === "orgAdmin" || currentUser?.role === "manager") && (
              <>
                <TabsTrigger value="employee-wise">
                  <div className="flex items-center gap-1.5">
                    <User2 className="h-4 w-4" />
                    <span>By Employee</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="category-wise">
                  <div className="flex items-center gap-1.5">
                    <Tag className="h-4 w-4" />
                    <span>By Category</span>
                  </div>
                </TabsTrigger>
              </>
            )}
            <TabsTrigger value="my-report">
              <div className="flex items-center gap-1.5">
                <File className="h-4 w-4" />
                <span>My Report</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="delegatedTasks">
              <div className="flex items-center gap-1.5">
                <ArrowRight className="h-4 w-4" />
                <span>Delegated</span>
              </div>
            </TabsTrigger>
          </TabsList>

          {/* Search Input */}
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={`Search ${activeDashboardTab === 'employee-wise' ? 'Employee' : 'Category'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
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
        <TabsContent value="employee-wise" className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users
              .filter((user) => {
                const query = searchQuery.toLowerCase();
                return (
                  user.firstName.toLowerCase().includes(query) ||
                  user.lastName.toLowerCase().includes(query)
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
                    className="hover:border-primary transition-colors cursor-pointer overflow-hidden group"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.profilePic} alt={`${user.firstName} ${user.lastName}`} />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {`${user?.firstName?.slice(0, 1)}`}
                              {`${user?.lastName?.slice(0, 1)}`}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-sm">
                              {user.firstName} {user.lastName}
                            </CardTitle>
                            <CardDescription className="text-xs truncate ">
                              {`${user.email}`.slice(0, 15)}...
                            </CardDescription>
                          </div>
                        </div>
                        <div style={{ width: 36, height: 36 }}>
                          <CircularProgressbar
                            value={stats.completionRate}
                            text={`${stats.completionRate}%`}
                            styles={buildStyles({
                              textSize: "28px",
                              pathColor: pathColor,
                              textColor: theme === "dark" ? "#ffffff" : "#000000",
                              trailColor: "#6C636E33",
                            })}
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1.5">
                                <CircleAlert className="text-red-500 h-4 w-4" />
                           <span>Overdue: {stats.overdueTasks}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Tasks past their due date</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1.5">
                                <Circle className="text-yellow-500 h-4 w-4" />
                                <span>Pending: {stats.pendingTasks}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Tasks not yet started</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1.5">
                                <IconProgress className="text-orange-500 h-4 w-4" />
                                <span>In Progress: {stats.inProgressTasks}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Tasks currently being worked on</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1.5">
                                <CheckCircle className="text-green-500 h-4 w-4" />
                                <span>Completed: {stats.completedTasks}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Tasks finished</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
          {users.filter(u => {
            const query = searchQuery.toLowerCase();
            return (
              u.firstName.toLowerCase().includes(query) ||
              u.lastName.toLowerCase().includes(query)
            );
          }).length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <User2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No employees found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your search criteria</p>
            </div>
          )}
        </TabsContent>

        {/* Category Tab Content */}
        <TabsContent value="category-wise" className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories
              .filter((category) => {
                const query = searchQuery.toLowerCase();
                return category?.name.toLowerCase().includes(query);
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
                    className="hover:border-primary transition-colors cursor-pointer overflow-hidden group"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
                            <Tag className="h-4 w-4" />
                          </div>
                          <CardTitle className="text-sm">{category.name}</CardTitle>
                        </div>
                        <div style={{ width: 36, height: 36 }}>
                          <CircularProgressbar
                            value={stats.completionRate}
                            text={`${stats.completionRate}%`}
                            styles={buildStyles({
                              textSize: "28px",
                              pathColor: pathColor,
                              textColor: theme === "dark" ? "#ffffff" : "#000000",
                              trailColor: "#6C636E33",
                            })}
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1.5">
                          <CircleAlert className="text-red-500 h-4 w-4" />
                          <span>Overdue: {stats.overdueTasks}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Circle className="text-yellow-500 h-4 w-4" />
                          <span>Pending: {stats.pendingTasks}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <IconProgress className="text-orange-500 h-4 w-4" />
                          <span>In Progress: {stats.inProgressTasks}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle className="text-green-500 h-4 w-4" />
                          <span>Completed: {stats.completedTasks}</span>
                        </div>
                      </div>
                    </CardContent>

                  </Card>
                );
              })}
          </div>
          {categories.filter(c => {
            const query = searchQuery.toLowerCase();
            return c?.name.toLowerCase().includes(query);
          }).length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Tag className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No categories found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your search criteria</p>
            </div>
          )}
        </TabsContent>

        {/* My Report Tab Content */}
        <TabsContent value="my-report" className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories
              .filter((category) => {
                const query = searchQuery.toLowerCase();
                return category?.name.toLowerCase().includes(query);
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
                    className="hover:border-primary transition-colors cursor-pointer overflow-hidden group"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
                            <Tag className="h-4 w-4" />
                          </div>
                          <CardTitle className="text-sm">{category.name}</CardTitle>
                        </div>
                        <Badge variant={stats.overdueTasks > 0 ? "destructive" : "outline"}>
                          {stats.totalTasks} tasks
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                     <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-xs">{stats.completionRate}%</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                          <div className="flex items-center gap-1.5">
                            <CircleAlert className="text-red-500 h-4 w-4" />
                            <span>Overdue: {stats.overdueTasks}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Circle className="text-yellow-500 h-4 w-4" />
                            <span>Pending: {stats.pendingTasks}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <IconProgress className="text-orange-500 h-4 w-4" />
                            <span>In Progress: {stats.inProgressTasks}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CheckCircle className="text-green-500 h-4 w-4" />
                            <span>Completed: {stats.completedTasks}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>

                  </Card>
                );
              })}
          </div>
          {categories.filter(c => {
            const query = searchQuery.toLowerCase();
            return c?.name.toLowerCase().includes(query);
          }).filter((category) => {
            const { overdueTasks, inProgressTasks, pendingTasks } = getCategoryTaskStats(category._id);
            return (overdueTasks > 0 || pendingTasks > 0 || inProgressTasks > 0);
          }).length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <File className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No active tasks found</h3>
              <p className="text-sm text-muted-foreground">You don&apos;t have any pending or in-progress tasks in any category</p>
            </div>
          )}
        </TabsContent>

        {/* Delegated Tasks Tab Content */}
        <TabsContent value="delegatedTasks" className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users
              .filter((user) => {
                const query = searchQuery.toLowerCase();
                return (
                  user.firstName.toLowerCase().includes(query) ||
                  user.lastName.toLowerCase().includes(query)
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
                    className="hover:border-primary transition-colors cursor-pointer overflow-hidden group"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.profilePic} alt={`${user.firstName} ${user.lastName}`} />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {`${user?.firstName?.slice(0, 1)}`}
                              {`${user?.lastName?.slice(0, 1)}`}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-sm">
                              {user.firstName} {user.lastName}
                            </CardTitle>
                            <CardDescription className="text-xs truncate max-w-[180px]">
                              {`${user.email}`.slice(0,15)}...
                            </CardDescription>
                          </div>
                        </div>

                        {stats.overdueTasks > 0 && (
                          <Badge variant="destructive" className="self-start text-[12px]">
                            {stats.overdueTasks} overdue
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Tasks Progress</span>
                          <span className="text-xs">{stats.completionRate}%</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                          <div className="flex items-center gap-1.5">
                            <Circle className="text-yellow-500 h-4 w-4" />
                            <span>Pending: {stats.pendingTasks}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <IconProgress className="text-orange-500 h-4 w-4" />
                            <span>In Progress: {stats.inProgressTasks}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <CheckCircle className="text-green-500 h-4 w-4" />
                            <span>Completed: {stats.completedTasks}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <TrendingUp className="text-blue-500 h-4 w-4" />
                            <span>Total: {stats.totalTasks}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>

                  </Card>
                );
              })}
          </div>
          {users.filter(u => {
            const query = searchQuery.toLowerCase();
            return (
              u.firstName.toLowerCase().includes(query) ||
              u.lastName.toLowerCase().includes(query)
            );
          }).filter((user) => {
            const { overdueTasks, inProgressTasks, pendingTasks } = getUserTaskStats(user._id);
            return (overdueTasks > 0 || pendingTasks > 0 || inProgressTasks > 0);
          }).length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ArrowRight className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No delegated tasks</h3>
              <p className="text-sm text-muted-foreground">You haven&apos;t delegated any active tasks to team members</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

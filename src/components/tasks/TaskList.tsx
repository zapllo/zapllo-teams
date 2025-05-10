import React, { useState, useEffect } from 'react';
import {
  Search, FilterIcon, X, Play, CheckCircle, Repeat, Trash,
  Circle, CircleAlert, Clock, User2, TagIcon, Plus,
  CalendarIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs3 as Tabs, TabsList3 as TabsList, TabsTrigger3 as TabsTrigger } from '@/components/ui/tabs3';
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import TaskDetails from '../globals/taskDetails';
import FilterModal from '../globals/filterModal';
import { IconClock, IconProgressBolt } from "@tabler/icons-react";
import { Badge } from '../ui/badge';
import { DateRange } from "react-day-picker";
import { DateRangePicker } from '@/components/ui/date-range-picker';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface TaskListProps {
  tasks: any[];
  currentUser: any;
  listType: 'myTasks' | 'delegatedTasks' | 'allTasks';
  selectedUserId?: any;
  selectedCategory?: any;
  onTaskDelete: (id: string) => Promise<void>;
  onTaskUpdate: () => Promise<void>;
  setSelectedUserId?: (user: any) => void;
  setSelectedCategory?: (category: any) => void;
  onTaskStatusChange?: (task: any, action: 'progress' | 'complete' | 'reopen') => void;
}
export default function TaskList({
  tasks,
  currentUser,
  listType,
  selectedUserId,
  selectedCategory,
  onTaskDelete,
  onTaskUpdate,
  setSelectedUserId,
  setSelectedCategory,
  onTaskStatusChange
}: TaskListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [assignedByFilter, setAssignedByFilter] = useState<string[]>([]);
  const [frequencyFilter, setFrequencyFilter] = useState<string[]>([]);
  const [priorityFilterModal, setPriorityFilterModal] = useState<string[]>([]);
  const [taskStatusFilter, setTaskStatusFilter] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const savedFilter = localStorage.getItem('initialTaskStatusFilter');
      if (savedFilter) {
        localStorage.removeItem('initialTaskStatusFilter');
        return savedFilter;
      }
    }
    return "pending";
  });

  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [isReopenDialogOpen, setIsReopenDialogOpen] = useState(false);
  const [statusToUpdate, setStatusToUpdate] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activeDateFilter, setActiveDateFilter] = useState<string>("thisWeek");
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>({
    from: customStartDate || undefined,
    to: customEndDate || undefined
  });
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

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
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users/organization");
        const result = await response.json();

        if (response.ok) {
          setUsers(result.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Apply filters
  const applyFilters = (filters: any) => {
    setCategoryFilter(filters.categories);
    setAssignedByFilter(filters.users);
    setFrequencyFilter(filters.frequency);
    setPriorityFilterModal(filters.priority);
  };

  // Date range functions
  const getDateRange = (filter: string) => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    let startDate, endDate;

    switch (filter) {
      case "today":
        startDate = startOfToday;
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 1);
        break;
      case "yesterday":
        startDate = new Date(startOfToday);
        startDate.setDate(startOfToday.getDate() - 1);
        endDate = startOfToday;
        break;
      case "thisWeek":
        startDate = new Date(startOfToday);
        startDate.setDate(startDate.getDate() - startDate.getDay()); // Start of the current week (Sunday)
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 7); // End of the current week (Saturday)
        break;
      case "lastWeek":
        startDate = new Date(startOfToday);
        startDate.setDate(startOfToday.getDate() - startOfToday.getDay() - 7);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 7);
        break;
      case "nextWeek":
        startDate = new Date(startOfToday);
        startDate.setDate(startOfToday.getDate() - startOfToday.getDay() + 7);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 7);
        break;
      case "thisMonth":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        break;
      case "lastMonth":
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case "nextMonth":
        startDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 2, 1);
        break;
      case "thisYear":
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date(today.getFullYear() + 1, 0, 1);
        break;
      case "allTime":
        startDate = new Date(0); // Earliest possible date
        endDate = new Date(8640000000000000); // Far future date (max safe timestamp)
        break;
      case "custom":
        if (customStartDate && customEndDate) {
          startDate = new Date(customStartDate);
          // Set the end date to the end of the day for inclusive filtering
          endDate = new Date(customEndDate);
          endDate.setHours(23, 59, 59, 999);
        } else {
          // Default to current week if no custom dates are set
          startDate = new Date(startOfToday);
          startDate.setDate(startDate.getDate() - startDate.getDay());
          endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 7);
        }
        break;
      default:
        startDate = new Date(0);
        endDate = new Date();
    }

    return { startDate, endDate };
  };

  // Filter tasks by date range
  const filterTasksByDate = (tasks: any[], dateRange: any) => {
    const { startDate, endDate } = dateRange;
    if (!startDate || !endDate) return [];

    return tasks.filter((task) => {
      const taskDueDate = new Date(task.dueDate);
      return taskDueDate >= startDate && taskDueDate < endDate;
    });
  };

  // Filter tasks by active tab
  const filterTasks = (tasks: any[], listType: string): any[] => {
    if (!tasks) return [];

    return tasks.filter((task) => {
      let isFiltered = true;

      // Filter based on list type
      if (listType === "myTasks") {
        isFiltered = task?.assignedUser?._id === currentUser?._id;
      } else if (listType === "delegatedTasks") {
        isFiltered = (task.user?._id === currentUser?._id && task.assignedUser?._id !== currentUser?._id) ||
          task.assignedUser?._id === currentUser?._id;
      }

      // Filter by selected user
      if (isFiltered && selectedUserId && selectedUserId._id) {
        isFiltered = task.assignedUser?._id === selectedUserId._id;
      }

      // Filter by selected category
      if (isFiltered && selectedCategory && selectedCategory._id) {
        isFiltered = task.category?._id === selectedCategory._id;
      }

      // Apply category filter
      if (isFiltered && categoryFilter.length > 0) {
        isFiltered = categoryFilter.includes(task.category?._id);
      }

      // Apply assigned by filter
      if (isFiltered && assignedByFilter.length > 0) {
        isFiltered = assignedByFilter.includes(task.user._id);
      }

      // Apply frequency filter
      if (isFiltered && frequencyFilter.length > 0) {
        isFiltered = frequencyFilter.includes(task.repeatType);
      }

      // Apply priority filter
      if (isFiltered && priorityFilterModal.length > 0) {
        isFiltered = priorityFilterModal.includes(task.priority);
      }

      // Apply search query
      if (isFiltered && searchQuery) {
        const lowerCaseQuery = searchQuery.toLowerCase();
        isFiltered = (
          task.title.toLowerCase().includes(lowerCaseQuery) ||
          task.description.toLowerCase().includes(lowerCaseQuery) ||
          task.user.firstName.toLowerCase().includes(lowerCaseQuery) ||
          task.user.lastName.toLowerCase().includes(lowerCaseQuery) ||
          task.assignedUser.firstName.toLowerCase().includes(lowerCaseQuery) ||
          task.assignedUser.lastName.toLowerCase().includes(lowerCaseQuery) ||
          task.status.toLowerCase().includes(lowerCaseQuery)
        );
      }

      // Apply task status filter
      if (taskStatusFilter) {
        const dueDate = new Date(task.dueDate);
        const completionDate = task.completionDate ? new Date(task.completionDate) : null;
        const now = new Date();

        if (taskStatusFilter === "overdue" && (dueDate >= now || task.status === "Completed")) return false;
        if (taskStatusFilter === "pending" && task.status !== "Pending") return false;
        if (taskStatusFilter === "inProgress" && task.status !== "In Progress") return false;
        if (taskStatusFilter === "completed" && task.status !== "Completed") return false;
        if (taskStatusFilter === "inTime" && (task.status !== "Completed" || (completionDate && completionDate > dueDate))) return false;
        if (taskStatusFilter === "delayed" && (task.status !== "Completed" || (completionDate && completionDate <= dueDate))) return false;
      }

      return isFiltered;
    });
  };

  // Get filtered tasks
  const dateRange = getDateRange(activeDateFilter);
  const filteredByTabTasks = filterTasks(tasks, listType);
  const filteredTasks = filterTasksByDate(filteredByTabTasks, dateRange);

  // Add a console log to debug
  console.log('Filtering with:', {
    selectedUserId: selectedUserId?._id,
    selectedCategory: selectedCategory?._id,
    filteredTasksCount: filteredTasks.length
  });

  // Clear all filters
  const clearFilters = () => {
    setCategoryFilter([]);
    setAssignedByFilter([]);
    setFrequencyFilter([]);
    setPriorityFilterModal([]);
    if (setSelectedUserId) setSelectedUserId(null);
    if (setSelectedCategory) setSelectedCategory(null);
    setTaskStatusFilter("");
  };

  // Check if any filters are applied
  const areFiltersApplied = categoryFilter.length > 0 ||
    assignedByFilter.length > 0 ||
    frequencyFilter.length > 0 ||
    priorityFilterModal.length > 0 ||
    (selectedUserId && selectedUserId._id) ||
    (selectedCategory && selectedCategory._id);

  // Format task date
  const formatTaskDate = (dateInput: string | Date): string => {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

    const optionsDate: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "long",
      day: "numeric",
    };

    const optionsTime: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    return `${date.toLocaleDateString(undefined, optionsDate)} - ${date.toLocaleTimeString(undefined, optionsTime)}`;
  };

  // Get remaining time for task
  const getRemainingTime = (date: Date | string, isCompleted = false): { text: string; isPast: boolean } => {
    const now = new Date();
    const targetDate = new Date(date);
    const diff = targetDate.getTime() - now.getTime();

    const isPast = diff < 0;
    const absDiff = Math.abs(diff);

    const diffInMinutes = Math.floor(absDiff / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (isCompleted) {
      if (diffInDays >= 1) {
        return {
          text: `Completed ${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`,
          isPast: true,
        };
      }

      if (diffInHours >= 1) {
        return {
          text: `Completed ${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`,
          isPast: true,
        };
      }

      return {
        text: `Completed ${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`,
        isPast: true,
      };
    }

    if (diffInDays >= 1) {
      return {
        text: `${isPast ? "Overdue " : ""}${diffInDays} day${diffInDays > 1 ? "s" : ""} ${isPast ? "ago" : "from now"}`,
        isPast,
      };
    }

    if (diffInHours >= 1) {
      return {
        text: `${isPast ? "Overdue " : ""}${diffInHours} hour${diffInHours > 1 ? "s" : ""} ${isPast ? "ago" : "from now"}`,
        isPast,
      };
    }

    return {
      text: `${isPast ? "Overdue " : ""}${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ${isPast ? "ago" : "from now"}`,
      isPast,
    };
  };

  // The date filter buttons
  const dateFilterButtons = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "This Week", value: "thisWeek" },
    { label: "Last Week", value: "lastWeek" },
    { label: "Next Week", value: "nextWeek" },
    { label: "This Month", value: "thisMonth" },
    { label: "Last Month", value: "lastMonth" },
    { label: "This Year", value: "thisYear" },
    { label: "All Time", value: "allTime" }
  ];

  // Handle the selection of date filter
  const handleButtonClick = (filter: string) => {
    setActiveDateFilter(filter);
    if (filter !== "custom") {
      setCustomStartDate(null);
      setCustomEndDate(null);
      setCustomDateRange(undefined);
    }
  };

  // Handle apply custom date range
  const handleApplyCustomRange = () => {
    if (customDateRange?.from) {
      setCustomStartDate(customDateRange.from);
      // If only single date is selected, use the same date as end
      setCustomEndDate(customDateRange.to || customDateRange.from);
      setActiveDateFilter("custom");
    }
    setIsCustomModalOpen(false);
  };

  // Handle delete task
  const handleDeleteClick = (id: string) => {
    setIsDeleteDialogOpen(true);
  };

  // Handle edit task
  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Task List Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {listType === 'myTasks' ? 'My Tasks' :
            listType === 'delegatedTasks' ? 'Delegated Tasks' : 'All Tasks'}
        </h1>
      </div>

      {/* Date Range Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {dateFilterButtons.map(({ label, value }) => (
          <Button
            key={value}
            variant={activeDateFilter === value ? "default" : "outline"}
            size="sm"
            onClick={() => handleButtonClick(value)}
          >
            {label}
          </Button>
        ))}
        {/* Replace the Custom button with an inline DateRangePicker */}
        <div className="flex-shrink-0">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={activeDateFilter === "custom" ? "default" : "outline"}
                size="sm"
                className="flex items-center gap-1"
              >
                <CalendarIcon className="h-3.5 w-3.5" />
                Custom Range
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-2">
                <DateRangePicker
                  value={customDateRange}
                  onChange={setCustomDateRange}
                />
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setCustomDateRange(undefined);
                      setCustomStartDate(null);
                      setCustomEndDate(null);
                      setActiveDateFilter("thisWeek");
                    }}
                  >
                    Reset
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      if (customDateRange?.from) {
                        setCustomStartDate(customDateRange.from);
                        setCustomEndDate(customDateRange.to || customDateRange.from);
                        setActiveDateFilter("custom");
                      }
                    }}
                    disabled={!customDateRange?.from}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Custom Date UI */}
      {activeDateFilter === "custom" && customStartDate && customEndDate && (
        <Badge className="mb-4 flex text-white w-fit bg-primary items-center gap-2 py-1.5 pl-2">
          <span>
            {customStartDate.toLocaleDateString()} - {customEndDate.toLocaleDateString()}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 p-0 ml-1"
            onClick={() => {
              setCustomStartDate(null);
              setCustomEndDate(null);
              setCustomDateRange(undefined);
              setActiveDateFilter("thisWeek");
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}

      {/* Search and Filter */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2"
        >
          <FilterIcon className="h-4 w-4" />
          Filter
        </Button>

        {areFiltersApplied && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="flex items-center gap-2 text-destructive"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Applied Filters Display */}
      {areFiltersApplied && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedUserId && (
            <Badge className="bg-primary flex items-center text-white gap-1">
              User: {selectedUserId.firstName} {selectedUserId.lastName}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0"
                onClick={() => setSelectedUserId && setSelectedUserId(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {selectedCategory && (
            <Badge className="bg-primary flex text-white items-center gap-1">
              Category: {selectedCategory.name}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0"
                onClick={() => setSelectedCategory && setSelectedCategory(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {categoryFilter.length > 0 && (
            <Badge className="bg-muted text-muted-foreground flex items-center gap-1">
              Categories: {categoryFilter.map(id => categories.find(c => c._id === id)?.name).join(', ')}
            </Badge>
          )}

          {assignedByFilter.length > 0 && (
            <Badge className="bg-muted text-muted-foreground flex items-center gap-1">
              Assigned By: {assignedByFilter.map(id => {
                const user = users.find(u => u._id === id);
                return user ? `${user.firstName} ${user.lastName}` : '';
              }).join(', ')}
            </Badge>
          )}

          {frequencyFilter.length > 0 && (
            <Badge className="bg-muted text-muted-foreground flex items-center gap-1">
              Frequency: {frequencyFilter.join(', ')}
            </Badge>
          )}

          {priorityFilterModal.length > 0 && (
            <Badge className="bg-muted text-muted-foreground flex items-center gap-1">
              Priority: {priorityFilterModal.join(', ')}
            </Badge>
          )}
        </div>
      )}

      {/* Task Status Filter */}
      <Tabs
        defaultValue={taskStatusFilter || "pending"}
        onValueChange={setTaskStatusFilter}
        className="mb-6"
      >
        <TabsList className="grid grid-cols-6 w-full md:w-auto">
          <TabsTrigger value="overdue" className="flex items-center gap-1 text-xs">
            <CircleAlert className="h-3 w-3 text-destructive" />
            Overdue
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-1 text-xs">
            <Circle className="h-3 w-3 text-yellow-500" />
            Pending
          </TabsTrigger>
          <TabsTrigger value="inProgress" className="flex items-center gap-1 text-xs">
            <Play className="h-3 w-3 text-orange-500" />
            In Progress
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-1 text-xs">
            <CheckCircle className="h-3 w-3 text-green-500" />
            Completed
          </TabsTrigger>
          <TabsTrigger value="inTime" className="flex items-center gap-1 text-xs">
            <Clock className="h-3 w-3 text-green-500" />
            In Time
          </TabsTrigger>
          <TabsTrigger value="delayed" className="flex items-center gap-1 text-xs">
            <CheckCircle className="h-3 w-3 text-destructive" />
            Delayed
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <Card
              key={task._id}
              className={`p-4 hover:border-primary border transition-colors cursor-pointer ${selectedTask?._id === task._id ? 'border-primary' : ''
                }`}
              onClick={() => setSelectedTask(task)}
            >
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium">{task.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Assigned by <span className="text-primary font-medium">{task?.user?.firstName}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <IconClock className="h-4 w-4" />
                      <span className={`${new Date(task.dueDate) < new Date() ? "text-destructive" : "text-green-500"}`}>
                        {formatTaskDate(task.dueDate)}
                      </span>
                    </div>

                    <span className="text-muted-foreground">|</span>

                    <div className="flex items-center gap-1">
                      <User2 className="h-4 w-4" />
                      <span>{task.assignedUser?.firstName}</span>
                    </div>

                    <span className="text-muted-foreground">|</span>

                    <div className="flex items-center gap-1">
                      <TagIcon className="h-4 w-4" />
                      <span>{task.category?.name}</span>
                    </div>
                    {task.repeat && (
                      <>
                        <span className="text-muted-foreground">|</span>
                        <div className="flex items-center gap-1">
                          <Repeat className="h-4 w-4" />
                          <span>{task.repeatType}</span>
                        </div>
                      </>
                    )}

                    <span className="text-muted-foreground">|</span>

                    <div className="flex items-center gap-1">
                      <IconProgressBolt className="h-4 w-4" />
                      <span>{task.status}</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  <div className="text-right mb-2">
                    {task.completionDate && task.status !== "Pending" ? (
                      <span className="text-xs text-green-500 whitespace-nowrap">
                        {getRemainingTime(task.completionDate, true).text}
                      </span>
                    ) : (
                      <span className={`text-xs whitespace-nowrap ${getRemainingTime(task.dueDate).isPast
                        ? "text-destructive"
                        : "text-green-500"
                        }`}>
                        {getRemainingTime(task.dueDate).text}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 justify-end">
                    {task.status === "Completed" ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onTaskStatusChange?.(task, 'reopen');
                          }}
                          className="flex items-center gap-1"
                        >
                          <Repeat className="h-3.5 w-3.5 text-blue-500" />
                          <span>Reopen</span>
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onTaskDelete?.(task);
                          }}
                          className="flex items-center gap-1 text-destructive hover:text-destructive"
                        >
                          <Trash className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onTaskStatusChange?.(task, 'progress');
                          }}
                          className="flex items-center gap-1"
                        >
                          <Play className="h-3.5 w-3.5 text-orange-500" />
                          <span>In Progress</span>
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onTaskStatusChange?.(task, 'complete');
                          }}
                          className="flex items-center gap-1"
                        >
                          <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                          <span>Completed</span>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <DotLottieReact
              src="/lottie/empty.lottie"
              loop
              className="h-40 mx-auto"
              autoplay
            />
            <h2 className="text-lg font-semibold mt-4">No Tasks Found</h2>
            <p className="text-muted-foreground mt-1">
              {searchQuery
                ? "Try adjusting your search or filters"
                : "The list is currently empty for the selected filters"}
            </p>
          </div>
        )}
      </div>

      {/* Task Details View */}
      {selectedTask && (
        <TaskDetails
          selectedTask={selectedTask}
          formatTaskDate={formatTaskDate}
          // Replace this:
          handleDelete={onTaskDelete}
          // With this:
          handleDeleteClick={(id) => onTaskDelete?.(selectedTask)}
          handleEditClick={handleEditClick}
          onTaskUpdate={onTaskUpdate}
          setSelectedTask={setSelectedTask}
          handleUpdateTaskStatus={() => Promise.resolve()}
          handleCopy={() => { }}
          setIsDialogOpen={setIsDialogOpen}
          setIsCompleteDialogOpen={setIsCompleteDialogOpen}
          setIsReopenDialogOpen={setIsReopenDialogOpen}
          formatDate={() => ""}
          sortedComments={selectedTask.comments?.sort(
            (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )}
          users={users}
          // Replace this (which doesn't match the expected prop name):
          handleDeleteConfirm={() => onTaskDelete(selectedTask._id)}
          // With this:
          // onTaskDelete={() => onTaskDelete(selectedTask._id)}
          categories={categories}
          setIsEditDialogOpen={setIsEditDialogOpen}
          isEditDialogOpen={isEditDialogOpen}
          onClose={() => setSelectedTask(null)}
          setStatusToUpdate={setStatusToUpdate}
          onTaskStatusChange={onTaskStatusChange ?
            (task, action) => Promise.resolve(onTaskStatusChange(task, action)) :
            undefined}
        />
      )}

      {/* Modals */}
      <FilterModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        categories={categories}
        users={users}
        applyFilters={applyFilters}
        initialSelectedCategories={categoryFilter}
        initialSelectedUsers={assignedByFilter}
        initialSelectedFrequency={frequencyFilter}
        initialSelectedPriority={priorityFilterModal}
      />

      {/* Custom Date Range Dialog */}
      <Dialog open={isCustomModalOpen} onOpenChange={setIsCustomModalOpen}>
        <DialogContent className="sm:max-w-[425px] z-[100]">
          <DialogHeader>
            <DialogTitle>Select Date Range</DialogTitle>
          </DialogHeader>
          <div className="py-6 z-[100]">
            <DateRangePicker
              value={customDateRange}
              onChange={setCustomDateRange}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCustomModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApplyCustomRange}
              disabled={!customDateRange?.from}
            >
              Apply Range
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

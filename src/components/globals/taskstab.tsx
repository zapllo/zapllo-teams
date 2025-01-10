import { useEffect, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DashboardAnalytics from "@/components/globals/dashboardAnalytics";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  CheckCheck,
  FileWarning,
  Search,
  Bell,
  User2,
  Clock,
  Repeat,
  Circle,
  CheckCircle,
  Calendar,
  Flag,
  FlagIcon,
  Edit,
  Delete,
  Trash,
  PersonStanding,
  TagIcon,
  FilterIcon,
  CircleAlert,
  Check,
  FileIcon,
  FileCodeIcon,
  FileTextIcon,
  Grid2X2,
  Tag,
  Repeat1Icon,
  RepeatIcon,
  ArrowLeft,
  Plus,
  Link,
  Copy,
  CopyIcon,
  GlobeIcon,
  File,
  Mic,
  TagsIcon,
  Paperclip,
  Image,
  Files,
  X,
  Play,
  ArrowRight,
} from "lucide-react";
import {
  IconBrandTeams,
  IconClock,
  IconCopy,
  IconProgress,
  IconProgressBolt,
  IconProgressCheck,
} from "@tabler/icons-react";
import {
  CrossCircledIcon,
  PersonIcon,
  PlayIcon,
  UpdateIcon,
} from "@radix-ui/react-icons";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import axios from 'axios';
import EditTaskDialog from "./editTask";
import { useRouter } from "next/navigation";
import FilterModal from "./filterModal";
import Home from "../icons/home";
import HomeIcon from "../icons/homeIcon";
import TasksIcon from "../icons/tasksIcon";
import { Tabs2, TabsList2, TabsTrigger2 } from "../ui/tabs2";
import { Tabs3, TabsList3, TabsTrigger3 } from "../ui/tabs3";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { toast, Toaster } from "sonner";
import WaveSurfer from "wavesurfer.js";
import { TaskSummary } from "./taskSummary";
import { MyTasksSummary } from "./myTasksSummary";
import { DelegatedTasksSummary } from "./delegatedTasksSummary";
import TaskDetails from "./taskDetails";
import TaskSidebar from "../sidebar/taskSidebar";
import TaskTabs from "../sidebar/taskSidebar";
import CustomAudioPlayer from "./customAudioPlayer";
import Loader from "../ui/loader";
import DeleteConfirmationDialog from "../modals/deleteConfirmationDialog";
import { BackgroundGradientAnimation } from "../ui/backgroundGradientAnimation";
import CustomDatePicker from "./date-picker";
import { ClearIcon } from "@mui/x-date-pickers/icons";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Task, TasksTabProps, User, Category, DateFilter, DateRange, TaskStatusCounts } from "@/types/tasksTab";
import MainLoader from "../loaders/loader";
import { cn } from "@/lib/utils";

export default function TasksTab({
  tasks,
  currentUser,
  onTaskUpdate,
}: TasksTabProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageOrVideo, setImageOrVideo] = useState<File | null>(null);
  const [otherFile, setOtherFile] = useState<File | null>(null);
  const [profilePic, setProfilePic] = useState("");

  const [activeDateFilter, setActiveDateFilter] = useState<string | undefined>(
    "thisWeek"
  );
  const [activeDashboardTab, setActiveDashboardTab] =
    useState<string>("employee-wise");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  // State to control which date picker is open: 'start', 'end', or null
  const [datePickerType, setDatePickerType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchEmployeeQuery, setSearchEmployeeQuery] = useState<string>("");
  // State variables for filters
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [repeatFilter, setRepeatFilter] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [userLoading, setUserLoading] = useState<boolean | null>(false);
  const [isPro, setIsPro] = useState<boolean | null>(null);
  const [assignedUserFilter, setAssignedUserFilter] = useState<string | null>(
    null
  );
  const [dueDateFilter, setDueDateFilter] = useState<Date | null>(null);
  // State variables for modal
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [isReopenDialogOpen, setIsReopenDialogOpen] = useState(false);
  const [statusToUpdate, setStatusToUpdate] = useState<string | null>(null);
  const [comment, setComment] = useState<string>(" ");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const router = useRouter();
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [assignedByFilter, setAssignedByFilter] = useState<string[]>([]);
  const [assignedToFilter, setAssignedToFilter] = useState<string>(""); // New state for "Assigned To"
  const [frequencyFilter, setFrequencyFilter] = useState<string[]>([]);
  const [priorityFilterModal, setPriorityFilterModal] = useState<string[]>([]);
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [selectedTaskCategory, setSelectedTaskCategory] =
    useState<Category | null>(null);
  const [copied, setCopied] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState("");
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioURLRef = useRef<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteEntryId, setDeleteEntryId] = useState<string | null>(null);
  // Add this state to the component
  const [taskStatusFilter, setTaskStatusFilter] = useState<string>("pending");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [selectedUserId, setSelectedUserId] = useState<User | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Handlers to open date pickers
  const openStartDatePicker = () => setDatePickerType("start");
  const openEndDatePicker = () => setDatePickerType("end");

  // Handler to close date pickers
  const closeDatePicker = () => setDatePickerType(null);

  const handleClearSelection = () => {
    setSelectedUserId(null);
  };
  const handleClearCategory = () => {
    setSelectedCategory(null);
  };

  const handleCustomApply = () => {
    if (customStartDate && customEndDate) {
      setActiveDateFilter("custom");
      setIsCustomModalOpen(false);
    } else {
      alert("Please select both start and end dates");
    }
  };
  // Handler to set selected dates
  const handleDateChange = (date: Date) => {
    if (datePickerType === "start") {
      setCustomStartDate(date);
    } else if (datePickerType === "end") {
      setCustomEndDate(date);
    }
    closeDatePicker();
  };

  const handleDeleteClick = (id: string) => {
    setDeleteEntryId(id);
    setIsDeleteDialogOpen(true);
  };

  const clearFilters = () => {
    toast.success("All Filters Cleared")
    setCategoryFilter([]); // Reset category filter
    setAssignedByFilter([]); // Reset assigned by filter
    setFrequencyFilter([]); // Reset frequency filter
    setPriorityFilterModal([]); // Reset priority filter
    setSelectedUserId(null); // Reset assigned user
    setTaskStatusFilter(""); // Reset task status filter
  };

  // Render clear button based on the presence of any applied filters
  const areFiltersApplied =
    categoryFilter.length > 0 ||
    assignedByFilter.length > 0 ||
    frequencyFilter.length > 0 ||
    priorityFilterModal.length > 0;

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete("/api/tasks/delete", {
        data: { id: selectedTask?._id },
      });
      setSelectedTask(null);
      setIsDeleteDialogOpen(false);
      await onTaskUpdate();
      // Optionally, handle success (e.g., show a message, update state)
      console.log("Task deleted successfully");
    } catch (error: any) {
      // Handle error (e.g., show an error message)
      console.error("Failed to delete task:", error.message);
    }
  };

  useEffect(() => {
    if (audioBlob) {
      const audioURL = URL.createObjectURL(audioBlob);
      setAudioURL(audioURL);
    }
  }, [audioBlob]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const AudioContext =
        window.AudioContext || (window as any).webkitAudioContext; // Type assertion
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 2048;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current = analyser;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          const blob = new Blob([event.data], { type: "audio/wav" });
          setAudioBlob(blob);
          const audioURL = URL.createObjectURL(blob);
          audioURLRef.current = audioURL;
        }
      };

      mediaRecorder.onstop = () => {
        setRecording(false);
      };

      mediaRecorder.start();
      setRecording(true);

      // Real-time waveform visualization
      const canvas = canvasRef.current;
      if (canvas) {
        const canvasCtx = canvas.getContext("2d");
        if (canvasCtx) {
          const drawWaveform = () => {
            if (analyserRef.current) {
              requestAnimationFrame(drawWaveform);
              analyserRef.current.getByteTimeDomainData(dataArray);
              canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
              canvasCtx.lineWidth = 2;
              canvasCtx.strokeStyle = "green";
              canvasCtx.beginPath();

              const sliceWidth = (canvas.width * 1.0) / bufferLength;
              let x = 0;

              for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0; // Convert to 0.0 to 1.0
                const y = (v * canvas.height) / 2; // Convert to canvas height

                if (i === 0) {
                  canvasCtx.moveTo(x, y);
                } else {
                  canvasCtx.lineTo(x, y);
                }

                x += sliceWidth;
              }

              canvasCtx.lineTo(canvas.width, canvas.height / 2);
              canvasCtx.stroke();
            }
          };

          drawWaveform();
        }
      }

      mediaRecorderRef.current = mediaRecorder;
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const applyFilters = (filters: any) => {
    setCategoryFilter(filters.categories);
    setAssignedByFilter(filters.users);
    setAssignedToFilter(filters.assignedTo); // Set "Assigned To" filter
    setFrequencyFilter(filters.frequency);
    setPriorityFilterModal(filters.priority);
  };

  useEffect(() => {
    const fetchCategoryOfSelectedTask = async (selectedTaskCategoryId: any) => {
      try {
        const response = await fetch("/api/category/getById", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ categoryId: selectedTaskCategoryId }),
        });
        const result = await response.json();

        if (response.ok) {
          setSelectedTaskCategory(result.data);
        } else {
          console.error(result.error);
        }
      } catch (error: any) {
        console.error("Failed to fetch category:", error.message);
      }
    };

    if (selectedTask && selectedTask.category) {
      fetchCategoryOfSelectedTask(selectedTask.category);
    }
  }, [selectedTask]);

  const handleButtonClick = (filter: DateFilter) => {
    setCustomStartDate(null);
    setCustomEndDate(null);
    setIsCustomModalOpen(false);
    setActiveDateFilter(filter);
  };



  const getDateRange = (filter: DateFilter) => {
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
          startDate = customStartDate;
          endDate = customEndDate;
        } else {
          console.error("Custom dates are not defined");
          startDate = new Date();
          endDate = new Date();
        }
        break;
      default:
        startDate = new Date(0);
        endDate = new Date();
    }

    return { startDate, endDate };
  };

  const filterTasksByDate = (tasks: Task[], dateRange: DateRange) => {
    const { startDate, endDate } = dateRange;
    if (!startDate || !endDate) {
      // Handle cases where dates are undefined
      return [];
    }

    return tasks.filter((task) => {
      const taskDueDate = new Date(task.dueDate);
      return taskDueDate >= startDate && taskDueDate < endDate;
    });
  };

  const dateRange = getDateRange(
    (activeDateFilter || "thisWeek") as DateFilter
  ); // Cast to DateFilter

  const filteredTasks = tasks?.filter((task) => {
    // let isFiltered = true;
    const dueDate = new Date(task.dueDate);
    const completionDate = task.completionDate
      ? new Date(task.completionDate)
      : null;
    const now = new Date();

    // Filter by selected user if applied
    if (selectedUserId && selectedUserId._id) {
      if (task.assignedUser?._id !== selectedUserId._id) return false;
    }
    // Filter by selected user if applied
    if (selectedCategory && selectedCategory._id) {
      if (task.category?._id !== selectedCategory._id) return false;
    }

    // Apply "Assigned To" filter
    if (assignedToFilter && task.assignedUser?._id !== assignedToFilter) return false;
    // Apply category filter
    if (categoryFilter.length > 0 && !categoryFilter.includes(task.category?._id)) return false;

    // Apply "Assigned By" filter
    if (assignedByFilter.length > 0 && !assignedByFilter.includes(task.user._id)) return false;

    // Apply frequency filter
    if (frequencyFilter.length > 0 && !frequencyFilter.includes(task.repeatType)) return false;

    // Apply priority filter
    if (priorityFilterModal.length > 0 && !priorityFilterModal.includes(task.priority)) return false;

    // Apply date range filter
    if (dateRange && dateRange.startDate && dateRange.endDate) {
      const taskDueDate = new Date(task.dueDate);
      if (taskDueDate < dateRange.startDate || taskDueDate > dateRange.endDate) return false;
    }

    // Apply status filter
    if (taskStatusFilter) {
      if (taskStatusFilter === "overdue" && (dueDate >= now || task.status === "Completed")) return false;
      if (taskStatusFilter === "pending" && task.status !== "Pending") return false;
      if (taskStatusFilter === "inProgress" && task.status !== "In Progress") return false;
      if (taskStatusFilter === "completed" && task.status !== "Completed") return false;
      if (taskStatusFilter === "inTime" && (task.status !== "Completed" || (completionDate && completionDate > dueDate))) return false;
      if (taskStatusFilter === "delayed" && (task.status !== "Completed" || (completionDate && completionDate <= dueDate))) return false;
    }

    // Apply active tab filter
    if (activeTab === "myTasks") {
      if (task.assignedUser?._id !== currentUser?._id) return false;
    } else if (activeTab === "delegatedTasks") {
      // Only include tasks where the logged-in user is the creator
      if (task.user._id !== currentUser?._id) return false;
    } else if (activeTab === "allTasks") {
      // All tasks are included
      return true;
    }

    // Apply search query filter
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      if (
        !(
          task.title.toLowerCase().includes(lowerCaseQuery) ||
          task.description.toLowerCase().includes(lowerCaseQuery) ||
          task.user.firstName.toLowerCase().includes(lowerCaseQuery) ||
          task.user.lastName.toLowerCase().includes(lowerCaseQuery) ||
          task.assignedUser.firstName.toLowerCase().includes(lowerCaseQuery) ||
          task.assignedUser.lastName.toLowerCase().includes(lowerCaseQuery) ||
          task.status.toLowerCase().includes(lowerCaseQuery)
        )
      ) {
        return false;
      }
    }

    // If all filters pass, include the task
    return true;
  });

  console.log(tasks, "tasks to check if category.name is present");

  const filterTasks = (tasks: Task[], activeTab: string): Task[] => {
    return tasks?.filter((task) => {
      let isFiltered = true;

      // Filter based on active tab
      if (activeTab === "myTasks") {
        isFiltered = task?.assignedUser?._id === currentUser?._id;
      } else if (activeTab === "delegatedTasks") {
        isFiltered =
          (task.user?._id === currentUser?._id &&
            task.assignedUser?._id !== currentUser?._id) ||
          task.assignedUser?._id === currentUser?._id;
      } else if (activeTab === "allTasks") {
        return tasks;
      }

      // Apply the other filters (this can be factored out or reused from the `filteredTasks` logic)
      if (isFiltered && categoryFilter.length > 0) {
        isFiltered = categoryFilter.includes(task.category?._id);
      }
      if (isFiltered && assignedByFilter.length > 0) {
        isFiltered = assignedByFilter.includes(task.user._id);
      }
      if (isFiltered && frequencyFilter.length > 0) {
        isFiltered = frequencyFilter.includes(task.repeatType);
      }
      if (isFiltered && priorityFilterModal.length > 0) {
        isFiltered = priorityFilterModal.includes(task.priority);
      }

      return isFiltered;
    });
  };


  // Applying the filters
  const myTasks = filterTasks(tasks || [], "myTasks");
  const delegatedTasks = filterTasks(tasks || [], "delegatedTasks");
  const allTasks = filterTasks(tasks || [], "allTasks");

  // Applying date range filtering after active tab filtering
  const myTasksByDate = filterTasksByDate(myTasks, dateRange);
  const delegatedTasksByDate = filterTasksByDate(delegatedTasks, dateRange);
  const allTasksByDate = filterTasksByDate(allTasks, dateRange);

  const countStatuses = (tasks: Task[]): TaskStatusCounts => {
    return tasks.reduce<TaskStatusCounts>((counts, task) => {
      const dueDate = new Date(task.dueDate);
      const completionDate = task.completionDate
        ? new Date(task.completionDate)
        : null;
      const now = new Date();

      // Count overdue tasks
      if (dueDate < now && task.status !== "Completed") {
        counts["Overdue"] = (counts["Overdue"] || 0) + 1;
      }

      // Count completed tasks as either "In Time" or "Delayed"
      if (task.status === "Completed" && completionDate) {
        if (completionDate <= dueDate) {
          counts["In Time"] = (counts["In Time"] || 0) + 1;
        } else {
          counts["Delayed"] = (counts["Delayed"] || 0) + 1;
        }
      }

      // Count task status
      counts[task.status] = (counts[task.status] || 0) + 1;

      return counts;
    }, {} as TaskStatusCounts);
  };


  // Count statuses for my tasks
  const myTasksCounts = countStatuses(myTasksByDate);
  const myTasksPendingCount = myTasksCounts["Pending"] || 0;
  const myTasksInProgressCount = myTasksCounts["In Progress"] || 0;
  const myTasksCompletedCount = myTasksCounts["Completed"] || 0;
  const myTasksOverdueCount = myTasksCounts["Overdue"] || 0;
  const myTasksInTimeCount = myTasksCounts["In Time"] || 0;
  const myTasksDelayedCount = myTasksCounts["Delayed"] || 0;

  // Count statuses for delegated tasks
  const delegatedTasksCounts = countStatuses(delegatedTasksByDate);
  const delegatedTasksPendingCount = delegatedTasksCounts["Pending"] || 0;
  const delegatedTasksInProgressCount =
    delegatedTasksCounts["In Progress"] || 0;
  const delegatedTasksCompletedCount = delegatedTasksCounts["Completed"] || 0;
  const delegatedTasksOverdueCount = delegatedTasksCounts["Overdue"] || 0;
  const delegatedTasksInTimeCount = delegatedTasksCounts["In Time"] || 0;
  const delegatedTasksDelayedCount = delegatedTasksCounts["Delayed"] || 0;

  // Count statuses for all tasks
  const allTasksCounts = countStatuses(allTasksByDate);
  console.log(allTasksCounts, 'all count')
  const allTasksPendingCount = allTasksCounts["Pending"] || 0;
  const allTasksInProgressCount = allTasksCounts["In Progress"] || 0;
  const allTasksCompletedCount = allTasksCounts["Completed"] || 0;
  const allTasksOverdueCount = allTasksCounts["Overdue"] || 0;
  const allTasksInTimeCount = allTasksCounts["In Time"] || 0;
  const allTasksDelayedCount = allTasksCounts["Delayed"] || 0;

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        setUserLoading(true);
        const userRes = await axios.get("/api/users/me");
        setProfilePic(userRes.data.data.profilePic);
        const userData = userRes.data.data;
        setUserDetails(userData);
        // Set the default active tab based on the user's role
        if (userData.role === "member") {
          setActiveDashboardTab("my-report");
        }
        setUserLoading(false);
      } catch (error) {
        console.error("Error fetching user details ", error);
      }
    };

    getUserDetails();
  }, []);

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

  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch categories from the server
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/category/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
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

  useEffect(() => {
    fetchCategories();
  }, []);


  console.log(categories, 'categories?')

  const handleUpdateTaskStatus = async () => {
    setIsSubmitted(true);
    if (!comment.trim()) {
      setErrorMessage("Please add a comment before updating the task.");
      return; // Exit the function if the comment is not provided
    }


    let fileUrl = [];
    if (files && files.length > 0) {
      // Upload files to S3 and get the URLs
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      try {
        setLoading(true);

        const s3Response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (s3Response.ok) {
          const s3Data = await s3Response.json();
          console.log("S3 Data:", s3Data); // Log the response from S3
          fileUrl = s3Data.fileUrls;
        } else {
          console.error("Failed to upload files to S3");
          return;
        }
      } catch (error) {
        console.error("Error uploading files:", error);
        return;
      }
    }
    // Prepare the request body with URLs obtained from the uploads
    const requestBody = {
      id: selectedTask?._id,
      status: statusToUpdate,
      comment,
      fileUrl, // URL of the uploaded file
      userName: `${currentUser.firstName} `,
    };
    console.log(requestBody, 'req body update task')
    try {
      const response = await fetch("/api/tasks/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (response.ok) {
        onTaskUpdate(); // Call the callback function to update the task
        setSelectedTask(null);

        toast(<div className=" w-full mb-6 gap-2 m-auto  ">
          <div className="w-full flex  justify-center">
            <DotLottieReact
              src="/lottie/tick.lottie"
              loop
              autoplay
            />
          </div>
          <h1 className="text-black text-center font-medium text-lg">Task Updated successfully</h1>
        </div>);
        setFiles([]); // Reset files
        setIsSubmitted(false);
        setFilePreviews([]); // Reset file previews
        setIsDialogOpen(false);
        setIsCompleteDialogOpen(false);
        setIsReopenDialogOpen(false);
        setSelectedTask(null);
        setComment("");
        setLoading(false);
      } else {
        console.error("Error updating task:", result.error);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  if (tasks === null) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Skeleton className="h-12  w-full rounded-md" />
        <Skeleton className="h-12 w-full rounded-md mt-4" />
        <Skeleton className="h-12 w-full rounded-md mt-4" />
      </div>
    );
  }

  const formatDate = (dateTimeString: string) => {
    const dateTime = new Date(dateTimeString);
    const now = new Date();

    // Calculate difference in milliseconds
    const diffMs = now.getTime() - dateTime.getTime();
    const diffMinutes = Math.round(diffMs / (1000 * 60));

    // Display "a moment ago" if less than 1 minute ago
    if (diffMinutes < 1) {
      return "a moment ago";
    }

    // Display "today" if within the same day
    if (
      dateTime.getDate() === now.getDate() &&
      dateTime.getMonth() === now.getMonth() &&
      dateTime.getFullYear() === now.getFullYear()
    ) {
      const hours = ("0" + dateTime.getHours()).slice(-2);
      const minutes = ("0" + dateTime.getMinutes()).slice(-2);
      return `Today at ${hours}:${minutes}`;
    }

    // Display date if older than today
    const day = ("0" + dateTime.getDate()).slice(-2);
    const month = ("0" + (dateTime.getMonth() + 1)).slice(-2);
    const year = dateTime.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleDelete = async (taskId: string) => {

  };

  const handleEditClick = () => {
    setTaskToEdit(selectedTask);
    setIsEditDialogOpen(true);
  };

  const handleTaskUpdate = (updatedTask: any) => {
    setSelectedTask(updatedTask);
    onTaskUpdate();
  };

  const getUserTaskStats = (userId: any) => {
    const userTasks = tasks.filter((task) => task.assignedUser?._id === userId);
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

    return { overdueTasks, completedTasks, inProgressTasks, pendingTasks };
  };

  const getCategoryTaskStats = (categoryId: string) => {
    // Filter tasks where the category._id matches the given categoryId
    const categoryTasks = tasks.filter(
      (task) => task?.category?._id === categoryId
    );

    // Calculate task stats
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

    return { overdueTasks, completedTasks, inProgressTasks, pendingTasks };
  };

  const getTotalTaskStats = () => {
    const overdueTasks = tasks.filter(
      (task) =>
        new Date(task.dueDate) < new Date() && task.status !== "Completed"
    ).length;
    const completedTasks = tasks.filter(
      (task) => task.status === "Completed"
    ).length;
    const inProgressTasks = tasks.filter(
      (task) => task.status === "In Progress"
    ).length;
    const pendingTasks = tasks.filter(
      (task) => task.status === "Pending"
    ).length;
    const delayedTasks = tasks.filter(
      (task) =>
        task.status === "Completed" &&
        new Date(task.completionDate) > new Date(task.dueDate)
    ).length;
    const inTimeTasks = tasks.filter(
      (task) =>
        task.status === "Completed" &&
        new Date(task.completionDate) <= new Date(task.dueDate)
    ).length;

    return {
      overdueTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      delayedTasks,
      inTimeTasks,
    };
  };

  {
    /**Task Summary */
  }

  const {
    overdueTasks,
    completedTasks,
    inProgressTasks,
    pendingTasks,
    delayedTasks,
    inTimeTasks,
  } = getTotalTaskStats();


  const formatTaskDate = (dateInput: string | Date): string => {
    // Convert the input to a Date object if it's a string
    const date =
      typeof dateInput === "string" ? new Date(dateInput) : dateInput;

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

    return `${date.toLocaleDateString(
      undefined,
      optionsDate
    )} - ${date.toLocaleTimeString(undefined, optionsTime)}`;
  };

  const handleCopy = (link: string) => {
    setCopied(true);
    toast.success("Link copied!"); // Optional: Show a notification
  };

  const sortedComments = selectedTask?.comments?.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          const img = document.createElement("img");
          img.src = result;
          img.style.maxWidth = "100%";
          if (editorRef.current) {
            editorRef.current.appendChild(img);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = (index: number) => {
    // Remove the file and preview at the given index
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviews = filePreviews.filter((_, i) => i !== index);

    setFiles(updatedFiles);
    setFilePreviews(updatedPreviews);

    // Revoke the object URL to free up memory
    URL.revokeObjectURL(filePreviews[index]);
  };

  const handleImageOrVideoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = event.target.files;

    if (selectedFiles && selectedFiles.length > 0) {
      const validFiles: File[] = [];
      const previews: string[] = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        validFiles.push(file);

        // Generate preview URL for the file
        const fileUrl = URL.createObjectURL(file);
        previews.push(fileUrl);
      }

      if (validFiles.length > 0) {
        setFiles(validFiles); // Update state with valid files
        setFilePreviews(previews); // Update state with file previews
      }
    }
  };

  const handleOtherFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      setOtherFile(selectedFile); // Update state with the selected file

      // Upload file to S3 and get the URL
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const s3Response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (s3Response.ok) {
          const s3Data = await s3Response.json();
          console.log("S3 File Data:", s3Data);
          const fileUrl = s3Data.fileUrl;

          // Do something with the file URL, e.g., set it in state
        } else {
          console.error("Failed to upload file to S3");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const triggerImageOrVideoUpload = () => {
    imageInputRef.current?.click();
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImageOrVideo = () => {
    setImageOrVideo(null);
  };

  const handleRemoveOtherFile = () => {
    setOtherFile(null);
  };

  const handleFileRemove = (file: File) => {
    setImageOrVideo(null);
  };

  const getRemainingTime = (
    date: Date | string,
    isCompleted = false
  ): { text: string; isPast: boolean } => {
    const now = new Date();
    const targetDate = new Date(date);
    const diff = targetDate.getTime() - now.getTime();

    const isPast = diff < 0;
    const absDiff = Math.abs(diff);

    const diffInMinutes = Math.floor(absDiff / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (isCompleted) {
      // Logic for completed tasks
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

    // Logic for pending or overdue tasks
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





  return (
    <div className="flex  overflow-x-hidden w-screen ">
      <div>
        {userLoading && (
          <MainLoader />
        )}
      </div>
      <div className=" w-44    fixed   ">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-[180px] mt-12 "
        >
          <TabsList className="flex gap-y-6 mt-4 h-24  text-center">
            <TabsTrigger value="all" className="flex justify-start gap-2">
              <div className="flex justify-start ml-4 w-full gap-2">
                <HomeIcon />
                <h1 className="mt-auto text-xs">Dashboard</h1>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="myTasks"
              className="flex justify-start w-full gap-2"
            >
              <div className="flex justify-start ml-4 w-full gap-2">
                <TasksIcon />
                <h1 className="mt-auto text-xs">My Tasks</h1>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="delegatedTasks"
              className="flex justify-start w-full gap-2"
            >
              <div className="flex justify-start w-full ml-4 gap-2">
                <img
                  src="/icons/delegated.png"
                  className="h-[16px] mt-1"
                  alt="Delegated Tasks Icon"
                />
                <h1 className="text-xs mt-1">Delegated Tasks</h1>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="allTasks"
              className="flex justify-start w-full gap-2 "
            >
              <div className="flex justify-start w-full gap-2 ml-4">
                <img
                  src="/icons/all.png"
                  className="h-5 mt-0.5"
                  alt="All Tasks Icon"
                />
                <h1 className="text-xs mt-1">All Tasks</h1>
              </div>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="flex-1 h-screen overflow-y-scroll overflow-x-hidden scrollbar-hide  border ml-44  p-4">
        <div className="w-screen overflow-x-hidden max-w-6xl mx-auto">
          <div className="gap-2 flex mb-6 w-full">
            <div className="-mt-2">
              <div className="p-4">
                <div className="w-full max-w-8xl ">
                  {/* <Toaster /> */}
                  <div className=" w-full ml-2  justify-start">
                    <div className=" scrollbar-hide  mt-6">
                      <div className="flex scale-90  w-full justify-center ">
                        <div className="justify-center -ml-12 w-full flex gap-4">
                          {[
                            { label: "Today", value: "today" },
                            { label: "Yesterday", value: "yesterday" },
                            { label: "This Week", value: "thisWeek" },
                            { label: "Last Week", value: "lastWeek" },
                            { label: "Next Week", value: "nextWeek" },
                            { label: "This Month", value: "thisMonth" },
                            { label: "Last Month", value: "lastMonth" },
                            { label: "Next Month", value: "nextMonth" },
                            { label: "This Year", value: "thisYear" },
                            { label: "All Time", value: "allTime" },
                          ].map(({ label, value }) => (
                            <button
                              key={value}
                              onClick={() => handleButtonClick(value as DateFilter)}
                              className={`text-xs h-7 px-3 whitespace-nowrap  border py-1 rounded ${activeDateFilter === value ? "bg-[#815BF5] text-white" : "bg-"
                                }`}
                            >
                              {label}
                            </button>
                          ))}

                          <button
                            onClick={() => setIsCustomModalOpen(true)}
                            className={`text-xs h-7 px-3 border py-1 rounded ${activeDateFilter === "custom" ? "bg-[#815BF5] text-white" : "-200"
                              }`}
                          >
                            Custom
                          </button>

                          {isCustomModalOpen && (
                            <Dialog open={isCustomModalOpen} onOpenChange={() => setIsCustomModalOpen(false)}>
                              <DialogContent className="w-96 p-6 ml-12 z-[100] bg-[#0B0D29]">
                                <div className="flex justify-between">
                                  <DialogTitle className="text-md  font-medium text-white">
                                    Select Custom Date Range
                                  </DialogTitle>
                                  <DialogClose>
                                    {" "}
                                    <CrossCircledIcon className="scale-150  hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]" />
                                    {/* <X className="cursor-pointer border -mt-4 rounded-full border-white h-6 hover:bg-white hover:text-black w-6" /> */}
                                  </DialogClose>
                                </div>
                                {/* Start and End Date Buttons */}
                                <div className="flex justify-between gap-2">
                                  <div className="w-full">
                                    <button
                                      type="button"
                                      onClick={() => setDatePickerType("start")}
                                      className="text-start text-xs text-gray-400 w-full border p-2 rounded"
                                    >
                                      <div className="flex gap-1">
                                        <Calendar className="h-4" />
                                        {customStartDate
                                          ? new Date(customStartDate).toLocaleDateString()
                                          : "Start Date"}
                                      </div>
                                    </button>
                                  </div>

                                  <div className="w-full">
                                    <button
                                      type="button"
                                      onClick={() => setDatePickerType("end")}
                                      className="text-start text-xs text-gray-400 w-full border p-2 rounded"
                                    >
                                      <div className="flex gap-1">
                                        <Calendar className="h-4" />
                                        {customEndDate
                                          ? new Date(customEndDate).toLocaleDateString()
                                          : "End Date"}
                                      </div>
                                    </button>
                                  </div>
                                </div>

                                {/* Apply Button */}
                                <div className="flex justify-end gap-4 mt-4">
                                  <button
                                    onClick={handleCustomApply}
                                    className="bg-[#815BF5] text-white py-2 px-4 rounded w-full text-xs"
                                  >
                                    Apply
                                  </button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}

                          {/* Date Picker Dialog */}
                          {datePickerType && (
                            <Dialog open={Boolean(datePickerType)} onOpenChange={() => setDatePickerType(null)}>
                              <DialogContent className=" z-[100] scale-90  flex justify-center ">
                                <div className=" z-[20] rounded-lg  scale-[80%] max-w-4xl flex justify-center items-center w-full relative">
                                  <div className="w-full flex mb-4 justify-between">
                                    <CustomDatePicker
                                      selectedDate={datePickerType === "start" ? customStartDate : customEndDate}
                                      onDateChange={(date) => {
                                        if (datePickerType === "start") {
                                          setCustomStartDate(date);
                                        } else if (datePickerType === "end") {
                                          setCustomEndDate(date);
                                        }
                                        setDatePickerType(null); // Close the dialog after selection
                                      }}
                                      onCloseDialog={() => setDatePickerType(null)}
                                    />
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}

                        </div>
                      </div>
                      <div>
                        {activeTab === "all" ? (
                          <div className="flex mt-8 -ml-48 flex-col ">
                            <div className=" ml-20 w-full flex justify-center text-xs gap-4">
                              {/* <TaskSummary completedTasks={completedTasks} inProgressTasks={inProgressTasks} overdueTasks={overdueTasks} pendingTasks={pendingTasks} delayedTasks={delayedTasks} inTimeTasks={inTimeTasks} />
                               */}
                              <TaskSummary
                                overdueTasks={allTasksOverdueCount}
                                completedTasks={allTasksCompletedCount}
                                inProgressTasks={allTasksInProgressCount}
                                pendingTasks={allTasksPendingCount}
                                delayedTasks={allTasksDelayedCount}
                                inTimeTasks={allTasksInTimeCount}
                              />
                            </div>
                            {/* <DashboardAnalytics /> */}
                            <div className="flex gap-4 ml-20   w-full justify-center">
                              <div className="w-fit px-6 border-b-2 ">
                                <Tabs2
                                  value={activeDashboardTab}
                                  onValueChange={setActiveDashboardTab}
                                  className="gap-4"
                                >
                                  <TabsList2 className="flex gap-4">
                                    {(userDetails?.role === "orgAdmin" || userDetails?.role === "manager") && (
                                      <>
                                        <TabsTrigger2
                                          className="flex gap-1 text-xs tabs-trigger"
                                          value="employee-wise"
                                        >
                                          <User2 className="h-4" /> Employee
                                          Wise
                                        </TabsTrigger2>
                                        <TabsTrigger2
                                          value="category-wise"
                                          className="flex gap-1 text-xs"
                                        >
                                          <Tag className="h-4" /> Category Wise
                                        </TabsTrigger2>
                                      </>
                                    )}
                                    <TabsTrigger2
                                      value="my-report"
                                      className="text-xs flex gap-1"
                                    >
                                      <File className="h-4" /> My Report{" "}
                                    </TabsTrigger2>
                                    <TabsTrigger2
                                      value="delegatedTasks"
                                      className="tabs-trigger flex gap-1 text-xs"
                                    >
                                      <ArrowRight className="h-4" />
                                      Delegated
                                    </TabsTrigger2>
                                  </TabsList2>
                                </Tabs2>
                              </div>
                            </div>
                            {activeDashboardTab === "employee-wise" && (
                              <div className="">
                                <div className="flex p-2 m-2 justify-center">
                                  {/* <h1 className="font-medium ">Employee-wise </h1> */}
                                  <input
                                    type="text"
                                    placeholder="Search Employee"
                                    value={searchQuery}
                                    onChange={(e) =>
                                      setSearchQuery(e.target.value)
                                    }
                                    className="px-3 py-2 border text-xs focus-within:border-[#815BF5] outline-none text-[#8A8A8A] ml-32 bg-transparent rounded-md "
                                  />
                                </div>
                                <div className="grid w-[75%] ml-56 gap-4">
                                  {users
                                    .filter((user) => {
                                      const query = searchQuery.toLowerCase();
                                      return (
                                        user.firstName.toLowerCase().includes(query) ||
                                        user.lastName.toLowerCase().includes(query)
                                      );
                                    })
                                    .filter((user) => {
                                      if (userDetails?.role === 'manager') {
                                        // Include only users who report to the manager or the manager himself
                                        return (
                                          (user.reportingManager && user.reportingManager === userDetails._id) ||
                                          user._id === userDetails._id
                                        );
                                      } else {
                                        // For other roles, include all users
                                        return true;
                                      }
                                    })
                                    .map((user) => {
                                      const {
                                        overdueTasks = 0,
                                        completedTasks = 0,
                                        inProgressTasks = 0,
                                        pendingTasks = 0,
                                      } = getUserTaskStats(user._id) || {};

                                      const totalTasks =
                                        overdueTasks +
                                        completedTasks +
                                        inProgressTasks +
                                        pendingTasks;

                                      const getCompletionPercentage = (
                                        completedTasks: any,
                                        totalTasks: any
                                      ) => {
                                        return totalTasks === 0
                                          ? 0
                                          : (completedTasks / totalTasks) * 100;
                                      };

                                      const completionPercentage =
                                        getCompletionPercentage(
                                          completedTasks,
                                          totalTasks
                                        );

                                      // Determine the color based on the traffic light logic
                                      let pathColor;
                                      if (totalTasks === 0) {
                                        pathColor = "#6C636E"; // Grey color for users with no tasks
                                      } else if (completionPercentage < 50) {
                                        pathColor = "#FF0000"; // Red for less than 50%
                                      } else if (
                                        completionPercentage >= 50 &&
                                        completionPercentage < 80
                                      ) {
                                        pathColor = "#FFA500"; // Orange for 50%-79%
                                      } else {
                                        pathColor = "#008000"; // Green for 80% and above
                                      }

                                      return (
                                        <Card
                                          onClick={() => {
                                            setActiveTab("allTasks"); // Switch to the "All Tasks" tab
                                            setSelectedUserId(user); // Set the selected user ID
                                          }}
                                          key={user._id}
                                          className="p-4 flex bg-[#] hover:border-[#815BF5]  cursor-pointer flex-col gap-2"
                                        >
                                          <div className="flex gap-2 justify-start">
                                            <div className="h-7 w-7 rounded-full bg-[#815BF5] -400">
                                              {user.profilePic ? (
                                                <img
                                                  src={user.profilePic}
                                                  alt={`${user.firstName} ${user.lastName}`}
                                                  className="h-full w-full rounded-full object-cover"
                                                />
                                              ) : (

                                                <h1 className="text-center text-sm mt-1 uppercase">
                                                  {`${user?.firstName?.slice(
                                                    0,
                                                    1
                                                  )}`}
                                                  {`${user?.lastName?.slice(
                                                    0,
                                                    1
                                                  )}`}
                                                </h1>
                                              )}
                                            </div>
                                            <h2 className="text-sm mt-1 font-medium">
                                              {user.firstName} {user.lastName}
                                            </h2>
                                          </div>

                                          {/* <p className="text-xs"> {user.email}</p> */}
                                          <div className="flex gap-2 ] text-xs mt-1">
                                            <div className="flex font-medium ">
                                              <CircleAlert className="text-red-500 h-4" />
                                              <p className="text-xs">
                                                Overdue: {overdueTasks}
                                              </p>
                                            </div>
                                            <h1 className="text-[#6C636E] text-xs">
                                              |
                                            </h1>

                                            <div className="flex gap-2  font-medium">
                                              <Circle className="text-red-400 h-4" />
                                              <p className="text-xs">
                                                Pending: {pendingTasks}
                                              </p>
                                            </div>
                                            <h1 className="text-[#6C636E] text-xs">
                                              |
                                            </h1>

                                            <div className="flex gap-2 font-medium">
                                              <IconProgress className="text-orange-600 h-4" />
                                              <p className="text-xs">
                                                In Progress: {inProgressTasks}
                                              </p>
                                            </div>
                                            <h1 className="text-[#6C636E] text-xs">
                                              |
                                            </h1>

                                            <div className="flex gap-2 font-medium">
                                              <CheckCircle className="text-green-600 h-4" />
                                              <p className="text-xs">
                                                Completed: {completedTasks}
                                              </p>
                                            </div>
                                          </div>
                                          <div
                                            className="ml-auto  -mt-12"
                                            style={{ width: 40, height: 40 }}
                                          >
                                            <div className="">
                                              <CircularProgressbar
                                                value={completionPercentage}
                                                text={`${Math.round(
                                                  completionPercentage
                                                )}%`}
                                                styles={buildStyles({
                                                  textSize: "24px",
                                                  pathColor: pathColor, // Dynamic path color
                                                  textColor: "#ffffff",
                                                  trailColor: "#6C636E", // Trail color should be lighter for better contrast
                                                  backgroundColor: "#3e98c7",
                                                })}
                                              />
                                            </div>
                                          </div>
                                        </Card>
                                      );
                                    })}
                                </div>
                              </div>
                            )}
                            {activeDashboardTab === "category-wise" && (
                              <div className="">
                                <div className="flex p-2 m-2 justify-center">
                                  <input
                                    type="text"
                                    placeholder="Search Category"
                                    value={searchQuery}
                                    onChange={(e) =>
                                      setSearchQuery(e.target.value)
                                    }
                                    className="px-3 py-2 text-xs ml-32 border focus-within:border-[#815BF5] outline-none text-[#8A8A8A]  bg-transparent rounded-md "
                                  />
                                </div>
                                <div className="grid gap-4 ml-56 w-[75%]">
                                  {categories
                                    .filter((category) => {
                                      const query = searchQuery.toLowerCase();
                                      return category?.name
                                        .toLowerCase()
                                        .includes(query);
                                    })
                                    .map((category) => {
                                      const {
                                        overdueTasks,
                                        completedTasks,
                                        inProgressTasks,
                                        pendingTasks,
                                      } = getCategoryTaskStats(category._id);
                                      return (
                                        <Card
                                          key={category._id}
                                          onClick={() => {
                                            setActiveTab("allTasks");
                                            setSelectedCategory(category);
                                          }}
                                          className="p-4 flex hover:border-[#815BF5] cursor-pointer bg-transparent flex-col gap-2"
                                        >
                                          <div className="flex gap-2">
                                            <TagsIcon className="h-5" />
                                            <h2 className="text-sm font-medium">
                                              {category?.name}
                                            </h2>
                                          </div>
                                          <div className="flex gap-4 mt-2">
                                            <div className="flex gap-1 font-">
                                              <CircleAlert className="text-red-500 h-4" />
                                              <p className="text-xs">
                                                Overdue: {overdueTasks}
                                              </p>
                                            </div>
                                            <div className="flex gap-1 font-">
                                              <Circle className="text-red-400 h-4" />
                                              <p className="text-xs">
                                                Pending: {pendingTasks}
                                              </p>
                                            </div>
                                            <div className="flex gap-1 font-">
                                              <IconProgress className="text-orange-600 h-4" />
                                              <p className="text-xs">
                                                In Progress: {inProgressTasks}
                                              </p>
                                            </div>
                                            <div className="flex gap-1 font-">
                                              <CheckCircle className="text-green-600 h-4" />
                                              <p className="text-xs">
                                                Completed: {completedTasks}
                                              </p>
                                            </div>
                                          </div>
                                        </Card>
                                      );
                                    })}
                                </div>
                              </div>
                            )}

                            {activeDashboardTab === "my-report" &&
                              userDetails && (
                                <div className="">
                                  <div className="flex p-2 m-2 justify-center">
                                    <input
                                      type="text"
                                      placeholder="Search Category"
                                      value={searchQuery}
                                      onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                      }
                                      className="px-3 py-2 text-xs focus-within:border-[#815BF5] ml-32 border outline-none text-[#8A8A8A] bg-transparent rounded-md"
                                    />
                                  </div>
                                  <div className="grid gap-4 ml-56 w-[75%]">
                                    {categories
                                      .filter((category) => {
                                        const query = searchQuery.toLowerCase();
                                        return category?.name
                                          .toLowerCase()
                                          .includes(query);
                                      })
                                      .filter((category) => {
                                        // Fetch task stats for the category
                                        const {
                                          overdueTasks,
                                          inProgressTasks,
                                          pendingTasks,
                                        } = getCategoryTaskStats(category._id);

                                        // Only include categories with at least one relevant task count
                                        return (
                                          overdueTasks > 0 ||
                                          pendingTasks > 0 ||
                                          inProgressTasks > 0
                                        );
                                      })
                                      .map((category) => {
                                        const {
                                          overdueTasks,
                                          completedTasks,
                                          inProgressTasks,
                                          pendingTasks,
                                        } = getCategoryTaskStats(category._id);

                                        return (
                                          <Card
                                            key={category._id}
                                            onClick={() => {
                                              setActiveTab("allTasks");
                                              setSelectedCategory(category);
                                            }}
                                            className="p-4 cursor-pointer hover:border-[#815BF5] flex bg-transparent flex-col gap-2"
                                          >
                                            <div className="flex gap-2">
                                              <TagsIcon className="h-5" />
                                              <h2 className="text-sm font-medium">
                                                {category?.name}
                                              </h2>
                                            </div>
                                            <div className="flex gap-4 mt-2">
                                              <div className="flex gap-1 font-medium">
                                                <CircleAlert className="text-red-500 h-4" />
                                                <p className="text-xs">
                                                  Overdue: {overdueTasks}
                                                </p>
                                              </div>
                                              <div className="flex gap-1 font-medium">
                                                <Circle className="text-red-400 h-4" />
                                                <p className="text-xs">
                                                  Pending: {pendingTasks}
                                                </p>
                                              </div>
                                              <div className="flex gap-1 font-medium">
                                                <IconProgress className="text-orange-600 h-4" />
                                                <p className="text-xs">
                                                  In Progress: {inProgressTasks}
                                                </p>
                                              </div>
                                              <div className="flex gap-1 font-medium">
                                                <CheckCircle className="text-green-600 h-4" />
                                                <p className="text-xs">
                                                  Completed: {completedTasks}
                                                </p>
                                              </div>
                                            </div>
                                          </Card>
                                        );
                                      })}
                                  </div>
                                </div>
                              )}

                            {activeDashboardTab === "delegatedTasks" && (
                              <div className="">
                                <div className="flex p-2 m-2 justify-center">
                                  {/* <h1 className="font-medium ">Employee-wise </h1> */}
                                  <input
                                    type="text"
                                    placeholder="Search Employee"
                                    value={searchQuery}
                                    onChange={(e) =>
                                      setSearchQuery(e.target.value)
                                    }
                                    className="px-3 py-2 border text-xs outline-none focus-within:border-[#815BF5] text-[#8A8A8A] ml-32 bg-transparent rounded-md "
                                  />
                                  {/* // Add this block below the search input in MyTasks, DelegatedTasks, and AllTasks */}
                                </div>
                                <div className="grid w-[75%] ml-56 gap-4">
                                  {users
                                    .filter((user) => {
                                      const query = searchQuery.toLowerCase();
                                      return (
                                        user.firstName
                                          .toLowerCase()
                                          .includes(query) ||
                                        user.lastName
                                          .toLowerCase()
                                          .includes(query)
                                      );
                                    })
                                    .filter((user) => {
                                      // Fetch task stats for the user
                                      const {
                                        overdueTasks,
                                        inProgressTasks,
                                        pendingTasks,
                                      } = getUserTaskStats(user._id);

                                      // Only include users with at least one relevant task count
                                      return (
                                        overdueTasks > 0 ||
                                        pendingTasks > 0 ||
                                        inProgressTasks > 0
                                      );
                                    })
                                    .map((user) => {
                                      const {
                                        overdueTasks,
                                        completedTasks,
                                        inProgressTasks,
                                        pendingTasks,
                                      } = getUserTaskStats(user._id);

                                      const totalTasks =
                                        overdueTasks +
                                        completedTasks +
                                        inProgressTasks +
                                        pendingTasks;
                                      const getCompletionPercentage = (
                                        completedTasks: any,
                                        totalTasks: any
                                      ) => {
                                        return totalTasks === 0
                                          ? 0
                                          : (completedTasks / totalTasks) * 100;
                                      };
                                      const completionPercentage =
                                        getCompletionPercentage(
                                          completedTasks,
                                          totalTasks
                                        );

                                      // Determine the color based on the traffic light logic
                                      let pathColor;
                                      if (completionPercentage < 50) {
                                        pathColor = "#FF0000"; // Red for less than 50%
                                      } else if (
                                        completionPercentage >= 50 &&
                                        completionPercentage < 80
                                      ) {
                                        pathColor = "#FFA500"; // Orange for 50%-79%
                                      } else {
                                        pathColor = "#008000"; // Green for 80% and above
                                      }

                                      return (
                                        <Card
                                          key={user._id}
                                          onClick={() => {
                                            setActiveTab("allTasks"); // Switch to the "All Tasks" tab
                                            setSelectedUserId(user); // Set the selected user ID
                                          }}
                                          className="p-4 cursor-pointer hover:border-[#815BF5] flex bg-[#] flex-col  gap-2"
                                        >
                                          <div className="flex gap-2 justify-start">
                                            <div className="h-7 w-7 rounded-full bg-[#815BF5] -400">
                                              <h1 className="text-center text-sm mt-1 uppercase">
                                                {`${user?.firstName?.slice(
                                                  0,
                                                  1
                                                )}`}
                                                {`${user?.lastName?.slice(
                                                  0,
                                                  1
                                                )}`}
                                              </h1>
                                            </div>
                                            <h2 className="text-sm mt-1 font-medium">
                                              {user.firstName} {user.lastName}
                                            </h2>
                                          </div>

                                          {/* <p className="text-xs"> {user.email}</p> */}
                                          <div className="flex gap-2 ] text-xs mt-1">
                                            <div className="flex font-medium ">
                                              <CircleAlert className="text-red-500 h-4" />
                                              <p className="text-xs">
                                                Overdue: {overdueTasks}
                                              </p>
                                            </div>
                                            <h1 className="text-[#6C636E] text-xs">
                                              |
                                            </h1>

                                            <div className="flex gap-2  font-medium">
                                              <Circle className="text-red-400 h-4" />
                                              <p className="text-xs">
                                                Pending: {pendingTasks}
                                              </p>
                                            </div>
                                            <h1 className="text-[#6C636E] text-xs">
                                              |
                                            </h1>

                                            <div className="flex gap-2 font-medium">
                                              <IconProgress className="text-orange-600 h-4" />
                                              <p className="text-xs">
                                                In Progress: {inProgressTasks}
                                              </p>
                                            </div>
                                            <h1 className="text-[#6C636E] text-xs">
                                              |
                                            </h1>

                                            <div className="flex gap-2 font-medium">
                                              <CheckCircle className="text-green-600 h-4" />
                                              <p className="text-xs">
                                                Completed: {completedTasks}
                                              </p>
                                            </div>
                                          </div>
                                          <div
                                            className="ml-auto  -mt-12"
                                            style={{ width: 40, height: 40 }}
                                          >
                                            <div className="">
                                              <CircularProgressbar
                                                value={completionPercentage}
                                                text={`${Math.round(
                                                  completionPercentage
                                                )}%`}
                                                styles={buildStyles({
                                                  textSize: "24px",
                                                  pathColor: pathColor, // Dynamic path color
                                                  textColor: "#ffffff",
                                                  trailColor: "#6C636E", // Trail color should be lighter for better contrast
                                                  backgroundColor: "#3e98c7",
                                                })}
                                              />
                                            </div>
                                          </div>
                                        </Card>
                                      );
                                    })}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : activeTab === "myTasks" ? (
                          <div>
                            <div>
                              <div className="flex  flex-col ">
                                {customStartDate && customEndDate && (
                                  <div className="flex gap-8 p-2  mt-2 justify-center w-full">
                                    <h1 className="text-xs  text-center text-white">
                                      Start Date:{" "}
                                      {customStartDate.toLocaleDateString()}
                                    </h1>
                                    <h1 className="text-xs text-center text-white">
                                      End Date:{" "}
                                      {customEndDate.toLocaleDateString()}
                                    </h1>
                                  </div>
                                )}
                                <div className="flex -ml-52 mt-4 flex-col ">
                                  {/* <div className=" ml-[125px]  w-full flex justify-center text-xs gap-4">
                                    <MyTasksSummary myTasksCompletedCount={myTasksCompletedCount} myTasksInProgressCount={myTasksInProgressCount} myTasksOverdueCount={myTasksOverdueCount} myTasksPendingCount={myTasksPendingCount} myTasksDelayedCount={myTasksDelayedCount} myTasksInTimeCount={myTasksInTimeCount} />
                                  </div> */}
                                </div>
                              </div>

                              <div className="flex px-4  -mt-2 w-[100%]    space-x-2 justify-center ">
                                <div className="space-x-2 flex">
                                  <div className=" flex px-4 mt-2  space-x-2 justify-center mb-2">
                                    <input
                                      type="text"
                                      placeholder="Search Task"
                                      value={searchQuery}
                                      onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                      }
                                      className="px-3 mt-2 py-2 text-xs border focus-within:border-[#815BF5] outline-none text-[#8A8A8A] ml-auto bg-transparent rounded-md w-"
                                    />
                                  </div>
                                  <Button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-[#007A5A] mt-4 hover:bg-green-800 h-8  text-sm"
                                  >
                                    <FilterIcon className="h-4" /> Filter
                                  </Button>
                                </div>
                                {areFiltersApplied && (
                                  <Button
                                    onClick={clearFilters}
                                    className="bg-transparent border hover:bg-red-500 gap-2 mt-4 h-8"
                                  >
                                    <img src='/icons/clear.png' className="h-3" />  Clear
                                  </Button>
                                )}
                              </div>
                              <div className="applied-filters gap-2 mb-2 -ml-2 text-xs flex w-full justify-center">
                                {categoryFilter.length > 0 && (
                                  <div className="flex border px-2 py-1 gap-2">
                                    <h3>Categories:</h3>
                                    <ul className="flex gap-2 ">
                                      {categoryFilter.map((id) => (
                                        <li className="flex gap-2" key={id}>
                                          {
                                            categories.find(
                                              (category) => category._id === id
                                            )?.name
                                          }{" "}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {assignedByFilter.length > 0 && (
                                  <div className="flex px-2 py-1 border gap-2">
                                    <h3>Assigned By:</h3>
                                    <ul>
                                      {assignedByFilter.map((id) => (
                                        <li key={id}>
                                          {
                                            users.find(
                                              (user) => user._id === id
                                            )?.firstName
                                          }{" "}
                                          {
                                            users.find(
                                              (user) => user._id === id
                                            )?.lastName
                                          }
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {frequencyFilter.length > 0 && (
                                  <div className="flex px-2 py-1 border gap-2">
                                    <h3>Frequency:</h3>
                                    <ul className="flex gap-2">
                                      {frequencyFilter.map((freq) => (
                                        <li key={freq}>{freq}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {priorityFilterModal.length > 0 && (
                                  <div className="flex gap-2 border py-1 px-2">
                                    <h3>Priority:</h3>
                                    <ul>
                                      {priorityFilterModal.map((priority) => (
                                        <li key={priority}>{priority}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-4  mb-4    w-full justify-center">
                                <div className="w-fit  border-b-2 ">
                                  {/* Overdue Filter */}
                                  <Tabs2
                                    defaultValue={taskStatusFilter}
                                    onValueChange={setTaskStatusFilter}
                                    className="gap-2"
                                  >
                                    <TabsList2 className="flex gap-2 justify-center mt-2">
                                      {/* Overdue Filter */}
                                      <TabsTrigger2
                                        value="overdue"
                                        className={`h-6 w-fit flex gap-1 text-xs ${taskStatusFilter === "overdue"
                                          ? "bg-[#] hover:bg-[#]  borde]"
                                          : "bg-[#] hover:bg-[#] "
                                          }`}
                                      >
                                        <CircleAlert className="text-red-500 h-4" />
                                        Overdue
                                      </TabsTrigger2>

                                      {/* Pending Filter */}
                                      <TabsTrigger2
                                        value="pending"
                                        className={`h-6 w-fit flex gap-1 text-xs ${taskStatusFilter === "pending"
                                          ? ""
                                          : ""
                                          }`}
                                      >
                                        <Circle className="text-red-400 h-4" />
                                        Pending
                                      </TabsTrigger2>

                                      {/* In Progress Filter */}
                                      <TabsTrigger2
                                        value="inProgress"
                                        className={`h-6 w-fit flex gap-1 text-xs ${taskStatusFilter === "inProgress"
                                          ? ""
                                          : ""
                                          }`}
                                      >
                                        <IconProgress className="text-orange-500 h-4" />
                                        In Progress
                                      </TabsTrigger2>

                                      {/* Completed Filter */}
                                      <TabsTrigger2
                                        value="completed"
                                        className={`h-6 w-fit flex gap-1 text-xs ${taskStatusFilter === "completed"
                                          ? ""
                                          : ""
                                          }`}
                                      >
                                        <CheckCircle className="text-green-500 h-4" />
                                        Completed
                                      </TabsTrigger2>

                                      {/* In Time Filter */}
                                      <TabsTrigger2
                                        value="inTime"
                                        className={`h-6 w-fit flex gap-1 text-xs ${taskStatusFilter === "inTime"
                                          ? ""
                                          : ""
                                          }`}
                                      >
                                        <Clock className="text-green-500 h-4" />
                                        In Time
                                      </TabsTrigger2>

                                      {/* Delayed Filter */}
                                      <TabsTrigger2
                                        value="delayed"
                                        className={`h-6 w-fit flex gap-1 text-xs ${taskStatusFilter === "delayed"
                                          ? ""
                                          : ""
                                          }`}
                                      >
                                        <CheckCircle className="text-red-500 h-4" />
                                        Delayed
                                      </TabsTrigger2>
                                    </TabsList2>
                                  </Tabs2>

                                </div>
                              </div>
                              {filteredTasks && filteredTasks.length > 0 ? (
                                filteredTasks?.map((task) => (
                                  <div key={task._id} className="">
                                    <Card
                                      className="flex  w-[95%] ml- mb-2   border-[0.5px] rounded hover:border-[#815BF5] shadow-sm items-center bg-[#] justify-between cursor-pointer px-4 py-1"
                                      onClick={() => setSelectedTask(task)}
                                    >
                                      <div className=" items-center gap-4">
                                        <div>
                                          <p className="font-medium text-sm text-white">
                                            {task.title}
                                          </p>
                                          <p className="text-[#E0E0E0] text-xs">
                                            Assigned by{" "}
                                            <span className="text-[#007A5A] font-bold">
                                              {task?.user?.firstName}
                                            </span>
                                          </p>
                                        </div>
                                        <div className="flex gap-2">
                                          <div className="flex -ml-1  text-xs mt-2">
                                            <IconClock className="h-5" />
                                            <h1
                                              className={`mt-[1.5px]  ${new Date(task.dueDate) < new Date()
                                                ? "text-red-500"
                                                : "text-green-500"
                                                }`}
                                            >
                                              {formatTaskDate(task.dueDate)}
                                            </h1>
                                          </div>
                                          <h1 className="mt-auto  text-[#E0E0E066] ">
                                            |
                                          </h1>
                                          <div className="flex text-xs mt-[10px]">
                                            <User2 className="h-4" />
                                            {task.assignedUser.firstName}
                                          </div>
                                          <h1 className="mt-auto text-[#E0E0E066] ">
                                            |
                                          </h1>

                                          <div className="flex text-xs mt-[11px]">
                                            <TagIcon className="h-4" />
                                            {task.category?.name}
                                          </div>

                                          {task.repeat ? (
                                            <div className="flex items-center">
                                              <h1 className="mt-auto text-[#E0E0E066] mx-2">
                                                |
                                              </h1>

                                              {task.repeatType && (
                                                <h1 className="flex mt-[11px] text-xs">
                                                  <Repeat className="h-4 " />{" "}
                                                  {task.repeatType}
                                                </h1>
                                              )}
                                            </div>
                                          ) : null}

                                          {/* <div className="flex mt-auto">
                        <TagIcon className="h-5" />
                      </div> */}
                                          <h1 className="mt-auto text-[#E0E0E066] ">
                                            |
                                          </h1>

                                          <div className="flex text-xs">
                                            <div className="mt-[11px]">
                                              <IconProgressBolt className="h-4  " />
                                            </div>
                                            <h1 className="mt-auto">
                                              {task.status}
                                            </h1>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="">
                                        <div className="flex ">
                                          <div className="relative">
                                            {(() => {
                                              if (task.completionDate && task.status !== "Pending") {
                                                // Use `getRemainingTime` with `isCompleted` for completed tasks
                                                const { text } = getRemainingTime(task.completionDate, true);
                                                return (
                                                  <p className="text-[10px] text-green-500 whitespace-nowrap mt-2 flex absolute ml-14">
                                                    {text}
                                                  </p>
                                                );
                                              } else {
                                                // Use default logic for due dates
                                                const { text, isPast } = getRemainingTime(task.dueDate);
                                                return (
                                                  <p
                                                    className={`text-[10px] whitespace-nowrap mt-2 flex absolute ${isPast ? "text-red-500 ml-28" : "text-green-500 ml-32"
                                                      }`}
                                                  >
                                                    {text}
                                                  </p>
                                                );
                                              }
                                            })()}
                                          </div>


                                          <div className="gap-2 w-1/2 mt-4 mb-4 flex">
                                            {task.status === "Completed" ? (
                                              <>
                                                {/* Reopen Button */}
                                                <Button
                                                  onClick={() => {

                                                    setStatusToUpdate("Reopen");
                                                    setIsReopenDialogOpen(true);
                                                  }}
                                                  className="gap-2 border mt-4 h-6 py-3 px-2 bg-transparent hover:border-blue-500 hover:bg-transparent rounded border-gray-600 w-fit"
                                                >
                                                  <Repeat className="h-4 w-4 text-blue-400" />
                                                  <h1 className="text-xs">
                                                    Reopen
                                                  </h1>
                                                </Button>
                                                {/* Delete Button */}
                                                <Button
                                                  onClick={(e) => {

                                                    handleDeleteClick(task._id);
                                                  }}
                                                  className="border mt-4 px-2 hover:bg-transparent py-3 bg-transparent h-6 rounded hover:border-red-500 border-gray-600 w-fit"
                                                >
                                                  <Trash className="h-4 rounded-full text-red-500" />
                                                  <h1 className="text-xs">
                                                    Delete
                                                  </h1>
                                                </Button>
                                              </>
                                            ) : (
                                              <>
                                                {/* In Progress Button */}
                                                <Button
                                                  onClick={() => {

                                                    setStatusToUpdate("In Progress");
                                                    setIsDialogOpen(true);
                                                  }}
                                                  className="gap-2 border mt-4 h-6 py-3 px-2 bg-transparent hover:bg-transparent hover:border-orange-400 rounded border-gray-600 w-fit"
                                                >
                                                  <Play className="h-4 w-4 text-orange-400" />
                                                  <h1 className="text-xs">
                                                    In Progress
                                                  </h1>
                                                </Button>
                                                {/* Completed Button */}
                                                <Button
                                                  onClick={() => {

                                                    setStatusToUpdate("Completed");
                                                    setIsCompleteDialogOpen(true);
                                                  }}
                                                  className="border mt-4 px-2 py-3 bg-transparent hover:bg-transparent h-6 rounded hover:border-[#007A5A] border-gray-600 w-fit"
                                                >
                                                  <CheckCircle className="h-4 rounded-full text-green-400" />
                                                  <h1 className="text-xs">
                                                    Completed
                                                  </h1>
                                                </Button>
                                              </>
                                            )}
                                          </div>
                                        </div>

                                        <div className="flex justify-end mt-4"></div>
                                      </div>
                                    </Card>

                                    {selectedTask &&
                                      selectedTask._id === task._id && (
                                        <TaskDetails
                                          setIsReopenDialogOpen={
                                            setIsReopenDialogOpen
                                          }
                                          selectedTask={selectedTask}
                                          formatTaskDate={formatTaskDate}
                                          handleDelete={handleDelete}
                                          handleEditClick={handleEditClick}
                                          onTaskUpdate={onTaskUpdate}
                                          setSelectedTask={setSelectedTask}
                                          handleUpdateTaskStatus={
                                            handleUpdateTaskStatus
                                          }
                                          handleCopy={handleCopy}
                                          setIsDialogOpen={setIsDialogOpen}
                                          setIsCompleteDialogOpen={
                                            setIsCompleteDialogOpen
                                          }
                                          formatDate={formatDate}
                                          sortedComments={sortedComments}
                                          users={users}
                                          handleDeleteClick={handleDeleteClick}
                                          handleDeleteConfirm={
                                            handleDeleteConfirm
                                          }
                                          categories={categories}
                                          setIsEditDialogOpen={
                                            setIsEditDialogOpen
                                          }
                                          isEditDialogOpen={isEditDialogOpen}
                                          onClose={() => setSelectedTask(null)}
                                          setStatusToUpdate={setStatusToUpdate}
                                        />
                                      )}
                                  </div>
                                ))
                              ) : (
                                // <Card
                                //   className="flex w-[80%] ml-56 justify-center   items-center rounded-lg bg-[#]  cursor-pointer p-6"

                                // >
                                <div>
                                  <div className="flex w-full justify-center -ml-4">
                                    <div className="mt-2">
                                      <DotLottieReact
                                        src="/lottie/empty.lottie"
                                        loop
                                        className="h-56"
                                        autoplay
                                      />
                                      <h1 className="text-center font-bold text-md  -ml-4">
                                        No Tasks Found
                                      </h1>
                                      <p className="text-center text-sm -ml-4 p-2">
                                        The list is currently empty for the selected filters
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                // {/* <img src="/logo.png" className="w-[52.5%] h-[100%] opacity-0" /> */}

                                // </Card>
                              )}
                              <FilterModal
                                isOpen={isModalOpen}
                                closeModal={() => setIsModalOpen(false)}
                                categories={categories}
                                users={users}
                                applyFilters={applyFilters}
                                initialSelectedCategories={categoryFilter} // Pass the currently selected categories
                                initialSelectedUsers={assignedByFilter} // Pass the currently selected users
                                initialSelectedFrequency={frequencyFilter} // Pass the currently selected frequency
                                initialSelectedPriority={priorityFilterModal} // Pass the currently selected priority
                              />
                            </div>
                          </div>
                        ) : activeTab === "delegatedTasks" ? (
                          <div className="flex    flex-col ">
                            {customStartDate && customEndDate && (
                              <div className="flex gap-8 p-2 justify-center w-full">
                                <h1 className="text-xs  text-center text-white">
                                  Start Date:{" "}
                                  {customStartDate.toLocaleDateString()}
                                </h1>
                                <h1 className="text-xs text-center text-white">
                                  End Date:{" "}
                                  {customStartDate.toLocaleDateString()}
                                </h1>
                              </div>
                            )}
                            <div className="flex mt-4 -ml-52 flex-col ">
                              <div className=" ml-[125px]  w-full flex justify-center text-xs gap-4">
                                {/* <DelegatedTasksSummary delegatedTasksCompletedCount={delegatedTasksCompletedCount} delegatedTasksInProgressCount={delegatedTasksInProgressCount} delegatedTasksOverdueCount={delegatedTasksOverdueCount} delegatedTasksPendingCount={delegatedTasksPendingCount} delegatedTasksDelayedCount={delegatedTasksDelayedCount} delegatedTasksInTimeCount={delegatedTasksInTimeCount} /> */}
                              </div>

                              <div className="flex px-4 -mt-2 w-[100%]  space-x-2 justify-center ">
                                <div className="space-x-2 flex">
                                  <div className=" flex px-4 mt-4 ml-52 space-x-2 justify-center mb-2">
                                    <input
                                      type="text"
                                      placeholder="Search Task"
                                      value={searchQuery}
                                      onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                      }
                                      className="px-3 py-2 text-xs border focus-within:border-[#815BF5] outline-none text-[#8A8A8A] ml-auto bg-transparent rounded-md w-"
                                    />
                                  </div>
                                  <Button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-[#007A5A] hover:bg-green-800 mt-4 h-8"
                                  >
                                    <FilterIcon className="h-4" /> Filter
                                  </Button>
                                  {areFiltersApplied && (
                                    <Button
                                      type="button"
                                      className="bg-transparent hover:bg-red-500 mt-4 h-8 gap-2 flex border"
                                      onClick={clearFilters}
                                    >
                                      <img
                                        src="/icons/clear.png"
                                        className="h-3"
                                      />{" "}
                                      Clear
                                    </Button>
                                  )}
                                </div>
                              </div>
                              <div className="applied-filters gap-2 mb-2 text-xs flex w-full ml-24 justify-center">
                                {categoryFilter.length > 0 && (
                                  <div className="flex border px-2 py-1 gap-2">
                                    <h3>Categories:</h3>
                                    <ul className="flex gap-2 ">
                                      {categoryFilter.map((id) => (
                                        <li className="flex gap-2" key={id}>
                                          {
                                            categories.find(
                                              (category) => category._id === id
                                            )?.name
                                          }{" "}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {assignedByFilter.length > 0 && (
                                  <div className="flex px-2 py-1 border gap-2">
                                    <h3>Assigned By:</h3>
                                    <ul>
                                      {assignedByFilter.map((id) => (
                                        <li key={id}>
                                          {
                                            users.find(
                                              (user) => user._id === id
                                            )?.firstName
                                          }{" "}
                                          {
                                            users.find(
                                              (user) => user._id === id
                                            )?.lastName
                                          }
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {frequencyFilter.length > 0 && (
                                  <div className="flex px-2 py-1 border gap-2">
                                    <h3>Frequency:</h3>
                                    <ul className="flex gap-2">
                                      {frequencyFilter.map((freq) => (
                                        <li key={freq}>{freq}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {priorityFilterModal.length > 0 && (
                                  <div className="flex gap-2 border py-1 px-2">
                                    <h3>Priority:</h3>
                                    <ul>
                                      {priorityFilterModal.map((priority) => (
                                        <li key={priority}>{priority}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-4  mb-4 ml-24    w-full justify-center">
                                <div className="w-fit ml-4  border-b-2 ">
                                  {/* Overdue Filter */}
                                  <Tabs2
                                    defaultValue={taskStatusFilter}
                                    onValueChange={setTaskStatusFilter}
                                    className="gap-2"
                                  >
                                    <TabsList2 className="flex gap-2 justify-center mt-2">
                                      {/* Overdue Filter */}
                                      <TabsTrigger2
                                        value="overdue"
                                        className={`h-6 w-fit flex gap-1 text-xs ${taskStatusFilter === "overdue"
                                          ? "bg-[#] hover:bg-[#]  borde]"
                                          : "bg-[#] hover:bg-[#] "
                                          }`}
                                      >
                                        <CircleAlert className="text-red-500 h-4" />
                                        Overdue
                                      </TabsTrigger2>

                                      {/* Pending Filter */}
                                      <TabsTrigger2
                                        value="pending"
                                        className={`h-6 w-fit flex gap-1 text-xs ${taskStatusFilter === "pending"
                                          ? ""
                                          : ""
                                          }`}
                                      >
                                        <Circle className="text-red-400 h-4" />
                                        Pending
                                      </TabsTrigger2>

                                      {/* In Progress Filter */}
                                      <TabsTrigger2
                                        value="inProgress"
                                        className={`h-6 w-fit flex gap-1 text-xs ${taskStatusFilter === "inProgress"
                                          ? ""
                                          : ""
                                          }`}
                                      >
                                        <IconProgress className="text-orange-500 h-4" />
                                        In Progress
                                      </TabsTrigger2>

                                      {/* Completed Filter */}
                                      <TabsTrigger2
                                        value="completed"
                                        className={`h-6 w-fit flex gap-1 text-xs ${taskStatusFilter === "completed"
                                          ? ""
                                          : ""
                                          }`}
                                      >
                                        <CheckCircle className="text-green-500 h-4" />
                                        Completed
                                      </TabsTrigger2>

                                      {/* In Time Filter */}
                                      <TabsTrigger2
                                        value="inTime"
                                        className={`h-6 w-fit flex gap-1 text-xs ${taskStatusFilter === "inTime"
                                          ? ""
                                          : ""
                                          }`}
                                      >
                                        <Clock className="text-green-500 h-4" />
                                        In Time
                                      </TabsTrigger2>

                                      {/* Delayed Filter */}
                                      <TabsTrigger2
                                        value="delayed"
                                        className={`h-6 w-fit flex gap-1 text-xs ${taskStatusFilter === "delayed"
                                          ? ""
                                          : ""
                                          }`}
                                      >
                                        <CheckCircle className="text-red-500 h-4" />
                                        Delayed
                                      </TabsTrigger2>
                                    </TabsList2>
                                  </Tabs2>

                                </div>
                              </div>
                              {filteredTasks!.length > 0 ? (
                                filteredTasks!.map((task) => (
                                  <div key={task._id} className="">
                                    <Card
                                      className="flex  w-[78.5%] ml-52 mb-2 border-[0.5px] rounded hover:border-[#815BF5] shadow-sm items-center bg-[#] justify-between cursor-pointer px-4 py-1"
                                      onClick={() => setSelectedTask(task)}
                                    >
                                      <div className=" items-center gap-4">
                                        <div>
                                          <p className="font-medium text-sm text-white">
                                            {task.title}
                                          </p>
                                          <p className="text-[#E0E0E0] text-xs">
                                            Assigned by{" "}
                                            <span className="text-[#007A5A] font-bold">
                                              {task.user.firstName}
                                            </span>
                                          </p>
                                        </div>
                                        <div className="flex gap-2">
                                          <div className="flex -ml-1  text-xs mt-2">
                                            <IconClock className="h-5" />
                                            <h1
                                              className={`mt-[1.5px] ${new Date(task.dueDate) < new Date()
                                                ? "text-red-500"
                                                : "text-green-500"
                                                }`}
                                            >
                                              {formatTaskDate(task.dueDate)}
                                            </h1>
                                          </div>
                                          <h1 className="mt-auto  text-[#E0E0E066] ">
                                            |
                                          </h1>
                                          <div className="flex text-xs mt-[10px]">
                                            <User2 className="h-4" />
                                            {task?.assignedUser?.firstName}
                                          </div>
                                          <h1 className="mt-auto text-[#E0E0E066] ">
                                            |
                                          </h1>

                                          <div className="flex text-xs mt-[11px]">
                                            <TagIcon className="h-4" />
                                            {task?.category?.name}
                                          </div>

                                          {task.repeat ? (
                                            <div className="flex items-center">
                                              <h1 className="mt-auto text-[#E0E0E066] mx-2">
                                                |
                                              </h1>

                                              {task.repeatType && (
                                                <h1 className="flex mt-[11px] text-xs">
                                                  <Repeat className="h-4 " />{" "}
                                                  {task.repeatType}
                                                </h1>
                                              )}
                                            </div>
                                          ) : null}

                                          {/* <div className="flex mt-auto">
                      <TagIcon className="h-5" />
                    </div> */}
                                          <h1 className="mt-auto text-[#E0E0E066] ">
                                            |
                                          </h1>

                                          <div className="flex text-xs">
                                            <div className="mt-[11px]">
                                              <IconProgressBolt className="h-4  " />
                                            </div>
                                            <h1 className="mt-auto">
                                              {task.status}
                                            </h1>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="">
                                        <div className="flex ">
                                          <div className="relative">
                                            {(() => {
                                              if (task.completionDate && task.status !== "Pending") {
                                                // Use `getRemainingTime` with `isCompleted` for completed tasks
                                                const { text } = getRemainingTime(task.completionDate, true);
                                                return (
                                                  <p className="text-[10px] text-green-500 whitespace-nowrap mt-2 flex absolute ml-14">
                                                    {text}
                                                  </p>
                                                );
                                              } else {
                                                // Use default logic for due dates
                                                const { text, isPast } = getRemainingTime(task.dueDate);
                                                return (
                                                  <p
                                                    className={`text-[10px] whitespace-nowrap mt-2 flex absolute ${isPast ? "text-red-500 ml-28" : "text-green-500 ml-32"
                                                      }`}
                                                  >
                                                    {text}
                                                  </p>
                                                );
                                              }
                                            })()}
                                          </div>

                                          <div className="gap-2 w-1/2 mt-4 mb-4 flex">
                                            {task.status === "Completed" ? (
                                              <>
                                                {/* Reopen Button */}
                                                <Button
                                                  onClick={() => {

                                                    setStatusToUpdate("Reopen");
                                                    setIsReopenDialogOpen(true);
                                                  }}
                                                  className="gap-2 border mt-4 h-6 py-3 px-2 bg-transparent hover:border-blue-500 hover:bg-transparent rounded border-gray-600 w-fit"
                                                >
                                                  <Repeat className="h-4 w-4 text-blue-400" />
                                                  <h1 className="text-xs">
                                                    Reopen
                                                  </h1>
                                                </Button>
                                                {/* Delete Button */}
                                                <Button
                                                  onClick={(e) => {
                                                    handleDeleteClick(task._id)
                                                  }}
                                                  className="border mt-4 px-2 py-3 bg-transparent h-6 rounded hover:border-red-500 hover:bg-transparent border-gray-600 w-fit"
                                                >
                                                  <Trash className="h-4 rounded-full text-red-500" />
                                                  <h1 className="text-xs">
                                                    Delete
                                                  </h1>
                                                </Button>
                                              </>
                                            ) : (
                                              <>
                                                {/* In Progress Button */}
                                                <Button
                                                  onClick={() => {

                                                    setStatusToUpdate(
                                                      "In Progress"
                                                    );
                                                    setIsDialogOpen(true);
                                                  }}
                                                  className="gap-2 border mt-4 h-6 py-3 px-2 hover:bg-transparent bg-transparent hover:border-orange-400 rounded border-gray-600 w-fit"
                                                >
                                                  <Play className="h-4 w-4 text-orange-400" />
                                                  <h1 className="text-xs">
                                                    In Progress
                                                  </h1>
                                                </Button>
                                                {/* Completed Button */}
                                                <Button
                                                  onClick={() => {

                                                    setStatusToUpdate(
                                                      "Completed"
                                                    );
                                                    setIsCompleteDialogOpen(
                                                      true
                                                    );
                                                  }}
                                                  className="border mt-4 px-2 py-3 hover:bg-transparent bg-transparent h-6 rounded hover:border-[#007A5A] border-gray-600 w-fit"
                                                >
                                                  <CheckCircle className="h-4 rounded-full text-green-400" />
                                                  <h1 className="text-xs">
                                                    Completed
                                                  </h1>
                                                </Button>
                                              </>
                                            )}
                                          </div>
                                        </div>

                                        <div className="flex justify-end mt-4"></div>
                                      </div>
                                    </Card>

                                    {selectedTask &&
                                      selectedTask._id === task._id && (
                                        <TaskDetails
                                          setIsReopenDialogOpen={
                                            setIsReopenDialogOpen
                                          }
                                          selectedTask={selectedTask}
                                          formatTaskDate={formatTaskDate}
                                          handleDelete={handleDelete}
                                          handleEditClick={handleEditClick}
                                          onTaskUpdate={onTaskUpdate}
                                          setSelectedTask={setSelectedTask}
                                          handleUpdateTaskStatus={
                                            handleUpdateTaskStatus
                                          }
                                          handleCopy={handleCopy}
                                          setIsDialogOpen={setIsDialogOpen}
                                          setIsCompleteDialogOpen={
                                            setIsCompleteDialogOpen
                                          }
                                          formatDate={formatDate}
                                          sortedComments={sortedComments}
                                          users={users}
                                          handleDeleteClick={handleDeleteClick}
                                          handleDeleteConfirm={
                                            handleDeleteConfirm
                                          }
                                          categories={categories}
                                          setIsEditDialogOpen={
                                            setIsEditDialogOpen
                                          }
                                          isEditDialogOpen={isEditDialogOpen}
                                          onClose={() => setSelectedTask(null)}
                                          setStatusToUpdate={setStatusToUpdate}
                                        />
                                      )}
                                  </div>
                                ))
                              ) : (
                                <div className="mt-4 ml-36">
                                  <DotLottieReact
                                    src="/lottie/empty.lottie"
                                    loop
                                    className="h-56"
                                    autoplay
                                  />
                                  <h1 className="text-center font-bold text-md  ml-4">
                                    No Tasks Found
                                  </h1>
                                  <p className="text-center text-sm p-2 ml-4">
                                    The list is currently empty for the selected filters
                                  </p>
                                </div>
                              )}
                              <FilterModal
                                isOpen={isModalOpen}
                                closeModal={() => setIsModalOpen(false)}
                                categories={categories}
                                users={users}
                                applyFilters={applyFilters}
                                initialSelectedCategories={categoryFilter} // Pass the currently selected categories
                                initialSelectedUsers={assignedByFilter} // Pass the currently selected users
                                initialSelectedFrequency={frequencyFilter} // Pass the currently selected frequency
                                initialSelectedPriority={priorityFilterModal} // Pass the currently selected priority
                              />
                            </div>
                          </div>
                        ) : activeTab === "allTasks" ? (
                          <div className="flex    flex-col ">
                            {customStartDate && customEndDate && (
                              <div className="flex gap-8 p-2 justify-center w-full">
                                <h1 className="text-xs  text-center text-white">
                                  Start Date:{" "}
                                  {customStartDate.toLocaleDateString()}
                                </h1>
                                <h1 className="text-xs text-center text-white">
                                  End Date:{" "}
                                  {customStartDate.toLocaleDateString()}
                                </h1>
                              </div>
                            )}
                            <div className="flex -ml-52  mt-4 flex-col ">
                              {/* <div className=" ml-[125px]  w-full flex justify-center text-xs gap-4"> */}
                              {/* <TaskSummary
                                  overdueTasks={allTasksOverdueCount}
                                  completedTasks={allTasksCompletedCount}
                                  inProgressTasks={allTasksInProgressCount}
                                  pendingTasks={allTasksPendingCount}
                                  delayedTasks={allTasksDelayedCount}
                                  inTimeTasks={allTasksInTimeCount}
                                /> */}
                              {/* </div> */}
                              <div className="flex px-4 -mt-2 w-[100%]  space-x-2 justify-center ">
                                <div className="space-x-2 flex">
                                  <div className=" flex px-4 ml-52 mt-4 space-x-2 justify-center mb-2">
                                    <input
                                      type="text"
                                      placeholder="Search Task"
                                      value={searchQuery}
                                      onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                      }
                                      className="px-3 py-2 border text-xs focus-within:border-[#815BF5] outline-none text-[#8A8A8A] ml-auto bg-transparent rounded-md w-"
                                    />
                                  </div>

                                  <Button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-[#007A5A] hover:bg-green-800 mt-4 h-8"
                                  >
                                    <FilterIcon className="h-4" /> Filter
                                  </Button>
                                  {areFiltersApplied && (
                                    <Button
                                      onClick={clearFilters}
                                      className="bg-transparent hover:bg-transparent border hover:bg-red-500 mt-4 gap-2 h-8"
                                    >
                                      <img src='/icons/clear.png' className="h-3" />  Clear
                                    </Button>
                                  )}
                                </div>
                              </div>
                              {/* Display applied filters */}
                              <div className="applied-filters gap-2 mb-2 text-xs flex w-full ml-24 justify-center">
                                <div>
                                  {selectedUserId && (
                                    <div className="flex border px-2 py-1 gap-2">
                                      <h1>
                                        Assigned To: {selectedUserId.firstName}{" "}
                                        {selectedUserId.lastName}
                                      </h1>
                                      <button
                                        onClick={handleClearSelection}
                                        className="text-red-500 hover:text-red-700  "
                                        aria-label="Clear Selection"
                                      >
                                        <X className="h-4" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                                <div>
                                  {selectedCategory && (
                                    <div className="flex border px-2 py-1 gap-2">
                                      <h1>
                                        Category: {" "}
                                        <span className="ml-1">{selectedCategory.name}</span>
                                      </h1>
                                      <button
                                        onClick={handleClearCategory}
                                        className="text-red-500 hover:text-red-700  "
                                        aria-label="Clear Selection"
                                      >
                                        <X className="h-4" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                                {categoryFilter.length > 0 && (
                                  <div className="flex border px-2 py-1 gap-2">
                                    <h3>Categories:</h3>
                                    <ul className="flex gap-2 ">
                                      {categoryFilter.map((id) => (
                                        <li className="flex gap-2" key={id}>
                                          {
                                            categories.find(
                                              (category) => category._id === id
                                            )?.name
                                          }{" "}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {assignedByFilter.length > 0 && (
                                  <div className="flex px-2 py-1 border gap-2">
                                    <h3>Assigned By:</h3>
                                    <ul>
                                      {assignedByFilter.map((id) => (
                                        <li key={id}>
                                          {
                                            users.find(
                                              (user) => user._id === id
                                            )?.firstName
                                          }{" "}
                                          {
                                            users.find(
                                              (user) => user._id === id
                                            )?.lastName
                                          }
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {frequencyFilter.length > 0 && (
                                  <div className="flex px-2 py-1 border gap-2">
                                    <h3>Frequency:</h3>
                                    <ul className="flex gap-2">
                                      {frequencyFilter.map((freq) => (
                                        <li key={freq}>{freq}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {priorityFilterModal.length > 0 && (
                                  <div className="flex gap-2 border py-1 px-2">
                                    <h3>Priority:</h3>
                                    <ul>
                                      {priorityFilterModal.map((priority) => (
                                        <li key={priority}>{priority}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-4  mb-4 ml-24   w-full justify-center">
                                <div className="w-fit ml-4  border-b-2 ">
                                  {/* Overdue Filter */}
                                  <Tabs2
                                    defaultValue={taskStatusFilter}
                                    onValueChange={setTaskStatusFilter}
                                    className="gap-2"
                                  >
                                    <TabsList2 className="flex gap-2 justify-center mt-2">
                                      {/* Overdue Filter */}
                                      <TabsTrigger2
                                        value="overdue"
                                        className={`h-6 w-fit flex gap-1 text-xs ${taskStatusFilter === "overdue"
                                          ? "bg-[#] hover:bg-[#]  borde]"
                                          : "bg-[#] hover:bg-[#] "
                                          }`}
                                      >
                                        <CircleAlert className="text-red-500 h-4" />
                                        Overdue
                                      </TabsTrigger2>

                                      {/* Pending Filter */}
                                      <TabsTrigger2
                                        value="pending"
                                        className={`h-6 w-fit flex gap-1 text-xs ${taskStatusFilter === "pending"
                                          ? ""
                                          : ""
                                          }`}
                                      >
                                        <Circle className="text-red-400 h-4" />
                                        Pending
                                      </TabsTrigger2>

                                      {/* In Progress Filter */}
                                      <TabsTrigger2
                                        value="inProgress"
                                        className={`h-6 w-fit flex gap-1 text-xs ${taskStatusFilter === "inProgress"
                                          ? ""
                                          : ""
                                          }`}
                                      >
                                        <IconProgress className="text-orange-500 h-4" />
                                        In Progress
                                      </TabsTrigger2>

                                      {/* Completed Filter */}
                                      <TabsTrigger2
                                        value="completed"
                                        className={`h-6 w-fit flex gap-1 text-xs ${taskStatusFilter === "completed"
                                          ? ""
                                          : ""
                                          }`}
                                      >
                                        <CheckCircle className="text-green-500 h-4" />
                                        Completed
                                      </TabsTrigger2>

                                      {/* In Time Filter */}
                                      <TabsTrigger2
                                        value="inTime"
                                        className={`h-6 w-fit flex gap-1 text-xs ${taskStatusFilter === "inTime"
                                          ? ""
                                          : ""
                                          }`}
                                      >
                                        <Clock className="text-green-500 h-4" />
                                        In Time
                                      </TabsTrigger2>

                                      {/* Delayed Filter */}
                                      <TabsTrigger2
                                        value="delayed"
                                        className={`h-6 w-fit flex gap-1 text-xs ${taskStatusFilter === "delayed"
                                          ? ""
                                          : ""
                                          }`}
                                      >
                                        <CheckCircle className="text-red-500 h-4" />
                                        Delayed
                                      </TabsTrigger2>
                                    </TabsList2>
                                  </Tabs2>

                                </div>
                              </div>
                              {filteredTasks!.length > 0 ? (
                                filteredTasks!.map((task) => (
                                  <div key={task._id} className="">
                                    <Card
                                      className="flex  w-[78.5%] ml-52 mb-2 border-[0.5px] rounded hover:border-[#815BF5] shadow-sm items-center bg-[#] justify-between cursor-pointer px-4 py-1"
                                      onClick={() => setSelectedTask(task)}
                                    >
                                      <div className=" items-center gap-4">
                                        <div>
                                          <p className="font-medium text-sm text-white">
                                            {task?.title}
                                          </p>
                                          <p className="text-[#E0E0E0] text-xs">
                                            Assigned by{" "}
                                            <span className="text-[#007A5A] font-bold">
                                              {task?.user?.firstName}
                                            </span>
                                          </p>
                                        </div>
                                        <div className="flex gap-2">
                                          <div className="flex -ml-1  text-xs mt-2">
                                            <IconClock className="h-5" />
                                            <h1
                                              className={`mt-[1.5px] ${new Date(task.dueDate) < new Date()
                                                ? "text-red-500"
                                                : "text-green-500"
                                                }`}
                                            >
                                              {formatTaskDate(task?.dueDate)}
                                            </h1>
                                          </div>
                                          <h1 className="mt-auto  text-[#E0E0E066] ">
                                            |
                                          </h1>
                                          <div className="flex text-xs mt-[10px]">
                                            <User2 className="h-4" />
                                            {task?.assignedUser?.firstName}
                                          </div>
                                          <h1 className="mt-auto text-[#E0E0E066] ">
                                            |
                                          </h1>

                                          <div className="flex text-xs mt-[11px]">
                                            <TagIcon className="h-4" />
                                            {task?.category?.name}
                                          </div>

                                          {task.repeat ? (
                                            <div className="flex items-center">
                                              <h1 className="mt-auto text-[#E0E0E066] mx-2">
                                                |
                                              </h1>

                                              {task?.repeatType && (
                                                <h1 className="flex mt-[11px] text-xs">
                                                  <Repeat className="h-4 " />{" "}
                                                  {task?.repeatType}
                                                </h1>
                                              )}
                                            </div>
                                          ) : null}

                                          {/* <div className="flex mt-auto">
                      <TagIcon className="h-5" />
                    </div> */}
                                          <h1 className="mt-auto text-[#E0E0E066] ">
                                            |
                                          </h1>

                                          <div className="flex text-xs">
                                            <div className="mt-[11px]">
                                              <IconProgressBolt className="h-4  " />
                                            </div>
                                            <h1 className="mt-auto">
                                              {task?.status}
                                            </h1>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="">
                                        <div className="flex ">
                                          <div className="relative">
                                            {(() => {
                                              if (task.completionDate && task.status !== "Pending") {
                                                // Use `getRemainingTime` with `isCompleted` for completed tasks
                                                const { text } = getRemainingTime(task.completionDate, true);
                                                return (
                                                  <p className="text-[10px] text-green-500 whitespace-nowrap mt-2 flex absolute ml-14">
                                                    {text}
                                                  </p>
                                                );
                                              } else {
                                                // Use default logic for due dates
                                                const { text, isPast } = getRemainingTime(task.dueDate);
                                                return (
                                                  <p
                                                    className={`text-[10px] whitespace-nowrap mt-2 flex absolute ${isPast ? "text-red-500 ml-28" : "text-green-500 ml-32"
                                                      }`}
                                                  >
                                                    {text}
                                                  </p>
                                                );
                                              }
                                            })()}
                                          </div>

                                          <div className="gap-2 w-1/2 mt-4 mb-4 flex">
                                            {task.status === "Completed" ? (
                                              <>
                                                {/* Reopen Button */}
                                                <Button
                                                  onClick={() => {

                                                    setStatusToUpdate("Reopen");
                                                    setIsReopenDialogOpen(true);
                                                  }}
                                                  className="gap-2 border mt-4 h-6 py-3 px-2 bg-transparent hover:border-blue-500 hover:bg-transparent rounded border-gray-600 w-fit"
                                                >
                                                  <Repeat className="h-4 w-4 text-blue-400" />
                                                  <h1 className="text-xs">
                                                    Reopen
                                                  </h1>
                                                </Button>
                                                {/* Delete Button */}
                                                <Button
                                                  onClick={() => {

                                                    handleDeleteClick(task._id);
                                                  }}
                                                  className="border mt-4 px-2 py-3 bg-transparent h-6 rounded hover:border-red-500 hover:bg-transparent border-gray-600 w-fit"
                                                >
                                                  <Trash className="h-4 rounded-full text-red-500" />
                                                  <h1 className="text-xs">
                                                    Delete
                                                  </h1>
                                                </Button>
                                              </>
                                            ) : (
                                              <>
                                                {/* In Progress Button */}
                                                <Button
                                                  onClick={() => {

                                                    setStatusToUpdate(
                                                      "In Progress"
                                                    );
                                                    setIsDialogOpen(true);
                                                  }}
                                                  className="gap-2 border mt-4 h-6 py-3 px-2 hover:bg-transparent bg-transparent hover:border-orange-400 rounded border-gray-600 w-fit"
                                                >
                                                  <Play className="h-4 w-4 text-orange-400" />
                                                  <h1 className="text-xs">
                                                    In Progress
                                                  </h1>
                                                </Button>
                                                {/* Completed Button */}
                                                <Button
                                                  onClick={() => {

                                                    setStatusToUpdate(
                                                      "Completed"
                                                    );
                                                    setIsCompleteDialogOpen(
                                                      true
                                                    );
                                                  }}
                                                  className="border mt-4 px-2 py-3 hover:bg-transparent bg-transparent h-6 rounded hover:border-[#017a5b] border-gray-600 w-fit"
                                                >
                                                  <CheckCircle className="h-4 rounded-full text-green-400" />
                                                  <h1 className="text-xs">
                                                    Completed
                                                  </h1>
                                                </Button>
                                              </>
                                            )}
                                          </div>
                                        </div>

                                        <div className="flex justify-end mt-4"></div>
                                      </div>
                                    </Card>
                                    {selectedTask &&
                                      selectedTask._id === task._id && (
                                        <TaskDetails
                                          setIsReopenDialogOpen={
                                            setIsReopenDialogOpen
                                          }
                                          selectedTask={selectedTask}
                                          formatTaskDate={formatTaskDate}
                                          handleDelete={handleDelete}
                                          handleEditClick={handleEditClick}
                                          onTaskUpdate={onTaskUpdate}
                                          setSelectedTask={setSelectedTask}
                                          handleUpdateTaskStatus={
                                            handleUpdateTaskStatus
                                          }
                                          handleCopy={handleCopy}
                                          setIsDialogOpen={setIsDialogOpen}
                                          setIsCompleteDialogOpen={
                                            setIsCompleteDialogOpen
                                          }
                                          formatDate={formatDate}
                                          sortedComments={sortedComments}
                                          users={users}
                                          categories={categories}
                                          handleDeleteClick={handleDeleteClick}
                                          handleDeleteConfirm={
                                            handleDeleteConfirm
                                          }
                                          setIsEditDialogOpen={
                                            setIsEditDialogOpen
                                          }
                                          isEditDialogOpen={isEditDialogOpen}
                                          onClose={() => setSelectedTask(null)}
                                          setStatusToUpdate={setStatusToUpdate}
                                        />
                                      )}
                                  </div>
                                ))
                              ) : (
                                <div className="mt-4 ml-36">
                                  <DotLottieReact
                                    src="/lottie/empty.lottie"
                                    loop
                                    className="h-56"
                                    autoplay
                                  />
                                  <h1 className="text-center font-bold text-md  ml-4">
                                    No Tasks Found
                                  </h1>
                                  <p className="text-center text-sm p-2 ml-4">
                                    The list is currently empty for the selected filters
                                  </p>
                                </div>
                              )}
                              <FilterModal
                                isOpen={isModalOpen}
                                closeModal={() => setIsModalOpen(false)}
                                categories={categories}
                                users={users}
                                applyFilters={applyFilters}
                                initialSelectedCategories={categoryFilter} // Pass the currently selected categories
                                initialSelectedUsers={assignedByFilter} // Pass the currently selected users
                                initialSelectedFrequency={frequencyFilter} // Pass the currently selected frequency
                                initialSelectedPriority={priorityFilterModal} // Pass the currently selected priority
                              />
                            </div>
                          </div>
                        ) : (
                          <h1>Oops Wrong Tab Selected!</h1>
                        )}
                      </div>

                      {/** Completed Modal */}

                      {isCompleteDialogOpen && (
                        <Dialog open={isCompleteDialogOpen}>
                          <DialogContent className=" z-[100] rounded-lg p-6 mx-auto max-w-2xl">
                            <div className="flex justify-between w-full">
                              <DialogTitle className="">
                                Task Update
                              </DialogTitle>
                              <DialogClose
                                onClick={() => {
                                  setIsCompleteDialogOpen(false);
                                  setIsSubmitted(false); // Reset isSubmitted to false
                                }}
                              >
                                <CrossCircledIcon className="scale-150  hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]" />

                              </DialogClose>
                            </div>
                            <p className="text-sm -mt-2">
                              Please add a note before marking the task as
                              completed
                            </p>
                            <div className="mt-2">
                              <div className="relative">
                                <Label className="absolute bg-[#0b0d29] !text-muted-foreground ml-2 text-xs -mt-2 px-1">Comment</Label>
                                <textarea
                                  value={comment}
                                  onChange={(e) => {
                                    setComment(e.target.value);
                                    if (e.target.value.trim() !== "") {
                                      setErrorMessage(""); // Clear the error message if comment is not empty
                                    }
                                    if (e.target.value.trim() == "") {
                                      setErrorMessage("Please add a commment before updating the task ")
                                    }
                                  }}
                                  className={`py-2 px-2 h-24 w-full focus-within:border-[#815BF5] text-xs bg-transparent border rounded outline-none ${isSubmitted && !comment.trim() ? "border-red-500" : ""
                                    }`}
                                />
                                <h1 className="text-xs text-red-500">{errorMessage}</h1>
                              </div>
                              <div className="flex mb-4  mt-4 gap-4">
                                <div
                                  className="h-8 w-8 rounded-full items-center text-center border cursor-pointer hover:shadow-white shadow-sm bg-[#282D32]"
                                  onClick={triggerImageOrVideoUpload}
                                >
                                  <Files className="h-5 text-center m-auto mt-1" />
                                </div>
                                <h1 className="text-xs mt-2">
                                  Attach a File (All File Types Accepted)
                                </h1>

                                <input
                                  ref={imageInputRef}
                                  type="file"
                                  style={{ display: "none" }}
                                  onChange={handleImageOrVideoUpload}
                                />
                              </div>
                              <div className="file-previews">
                                {filePreviews.map((preview, index) => (
                                  <div
                                    key={index}
                                    className="file-preview-item relative inline-block"
                                  >
                                    {files[index].type.startsWith("image/") ? (
                                      <img
                                        src={preview}
                                        alt={`Preview ${index}`}
                                        className="w-28 h-28 object-cover rounded-lg"
                                      />
                                    ) : (
                                      <div className="file-info p-2 w-56 text-sm text-gray-700 bg-gray-200 rounded-lg">
                                        {files[index].name}
                                      </div>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveFile(index)}
                                      className="absolute top-2 right-1 bg-red-600 text-white rounded-full p-1"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="mt-4 flex justify-end space-x-2">
                              <Button
                                onClick={!loading ? handleUpdateTaskStatus : undefined} // Prevent multiple clicks
                                className={cn(
                                  "w-full text-white bg-[#007A5A]",
                                  !loading ? "hover:bg-[#007A5A]" : "opacity-50 cursor-not-allowed"
                                )}
                                disabled={loading} // Disable button when loading
                              >
                                {loading ? <Loader /> : "Update Task"}
                              </Button>

                            </div>
                          </DialogContent>
                        </Dialog>
                      )}

                      <DeleteConfirmationDialog
                        isOpen={isDeleteDialogOpen}
                        onClose={() => setIsDeleteDialogOpen(false)}
                        onConfirm={handleDeleteConfirm}
                        title="Delete Task"
                        description="Are you sure you want to delete this task? This action cannot be undone."
                      />
                      {/** In Progress Modal */}

                      {isDialogOpen && (
                        <Dialog open={isDialogOpen}>
                          {/* <DialogOverlay className="fixed inset-0 z-[100] bg-black bg-opacity-50" /> */}
                          <DialogContent className=" rounded-lg z-[100] p-6 mx-auto  max-w-2xl ">
                            <div className="flex justify-between w-full">
                              <DialogTitle className="">
                                Task Update
                              </DialogTitle>
                              <DialogClose
                                onClick={() => {
                                  setIsDialogOpen(false);
                                  setIsSubmitted(false); // Reset isSubmitted to false
                                }}
                              >
                                <CrossCircledIcon className="scale-150  hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]" />
                              </DialogClose>
                            </div>
                            <p className="text-sm -mt-2">
                              Please add a note before marking the task as in
                              progress
                            </p>
                            <div className="mt-2">
                              <div className="relative">
                                <Label className="absolute bg-[#0b0d29] !text-muted-foreground ml-2 text-xs -mt-2 px-1">Comment</Label>
                                <textarea
                                  value={comment}
                                  onChange={(e) => {
                                    setComment(e.target.value);
                                    if (e.target.value.trim() !== "") {
                                      setErrorMessage(""); // Clear the error message if comment is not empty
                                    }
                                    if (e.target.value.trim() == "") {
                                      setErrorMessage("Please add a commment before updating the task ")
                                    }
                                  }}
                                  className={`py-2 px-2 h-24 w-full focus-within:border-[#815BF5] text-xs bg-transparent border rounded outline-none ${isSubmitted && !comment.trim() ? "border-red-500" : ""
                                    }`}
                                />
                                <h1 className="text-xs text-red-500">{errorMessage}</h1>
                              </div>
                              <div className="flex mb-4  mt-4 gap-4">
                                <div
                                  className="h-8 w-8 rounded-full items-center text-center border cursor-pointer hover:shadow-white shadow-sm bg-[#282D32]"
                                  onClick={triggerImageOrVideoUpload}
                                >
                                  <Files className="h-5 text-center m-auto mt-1" />
                                </div>
                                <h1 className="text-xs mt-2">
                                  Attach a File (All File Types Accepted)
                                </h1>

                                <input
                                  ref={imageInputRef}
                                  type="file"
                                  style={{ display: "none" }}
                                  onChange={handleImageOrVideoUpload}
                                />
                              </div>
                              <div className="file-previews">
                                {filePreviews.map((preview, index) => (
                                  <div
                                    key={index}
                                    className="file-preview-item relative inline-block"
                                  >
                                    {files[index].type.startsWith("image/") ? (
                                      <img
                                        src={preview}
                                        alt={`Preview ${index}`}
                                        className="w-28 h-28 object-cover rounded-lg"
                                      />
                                    ) : (
                                      <div className="file-info p-2 w-56 text-sm text-gray-700 bg-gray-200 rounded-lg">
                                        {files[index].name}
                                      </div>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveFile(index)}
                                      className="absolute top-2 right-1 bg-red-600 text-white rounded-full p-1"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="file-previews">
                              {filePreviews.map((preview, index) => (
                                <div
                                  key={index}
                                  className="file-preview-item relative inline-block"
                                >
                                  {files[index].type.startsWith("image/") ? (
                                    <img
                                      src={preview}
                                      alt={`Preview ${index}`}
                                      className="w-28 h-28 object-cover rounded-lg"
                                    />
                                  ) : (
                                    <div className="file-info p-2 w-56 text-sm text-gray-700 bg-gray-200 rounded-lg">
                                      {files[index].name}
                                    </div>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveFile(index)}
                                    className="absolute top-2 right-1 bg-red-600 text-white rounded-full p-1"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                            <div className="mt-4 flex justify-end space-x-2">
                              <Button
                                onClick={!loading ? handleUpdateTaskStatus : undefined} // Prevent multiple clicks
                                className={cn(
                                  "w-full text-white bg-[#007A5A]",
                                  !loading ? "hover:bg-[#007A5A]" : "opacity-50 cursor-not-allowed"
                                )}
                                disabled={loading} // Disable button when loading
                              >
                                {loading ? <Loader /> : "Update Task"}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}

                      {/** Reopen Modal */}

                      {isReopenDialogOpen && (
                        <Dialog open={isReopenDialogOpen}>
                          {/* <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50" /> */}
                          <DialogContent className="  rounded-lg z-[100] p-6 mx-auto  max-w-2xl ">
                            <div className="flex justify-between w-full">
                              <DialogTitle className="">
                                Task Update
                              </DialogTitle>
                              <DialogClose
                                onClick={() => {
                                  setIsReopenDialogOpen(false);
                                  setIsSubmitted(false); // Reset isSubmitted to false
                                }}
                              >
                                <CrossCircledIcon className="scale-150  hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]" />
                              </DialogClose>
                            </div>
                            <p className="text-sm -mt-2">
                              Please add a note before marking the task as
                              Reopen
                            </p>
                            <div className="mt-2">
                              <div className="relative">
                                <Label className="absolute bg-[#0b0d29] !text-muted-foreground ml-2 text-xs -mt-2 px-1">Comment</Label>
                                <textarea
                                  value={comment}
                                  onChange={(e) => {
                                    setComment(e.target.value);
                                    if (e.target.value.trim() !== "") {
                                      setErrorMessage(""); // Clear the error message if comment is not empty
                                    }
                                    if (e.target.value.trim() == "" && isSubmitted) {
                                      setErrorMessage("Please add a commment before updating the task ")
                                    }
                                  }}
                                  className={`py-2 px-2 h-24 w-full focus-within:border-[#815BF5] text-xs bg-transparent border rounded outline-none ${isSubmitted && !comment.trim() ? "border-red-500" : ""
                                    }`}
                                />
                                <h1 className="text-xs text-red-500">{errorMessage}</h1>
                              </div>
                              <div className="flex mb-4  mt-4 gap-4">
                                <div
                                  className="h-8 w-8 rounded-full items-center text-center border cursor-pointer hover:shadow-white shadow-sm bg-[#282D32]"
                                  onClick={triggerImageOrVideoUpload}
                                >
                                  <Files className="h-5 text-center m-auto mt-1" />
                                </div>
                                <h1 className="text-xs mt-2">
                                  Attach a File (All File Types Accepted)
                                </h1>

                                <input
                                  ref={imageInputRef}
                                  type="file"
                                  style={{ display: "none" }}
                                  onChange={handleImageOrVideoUpload}
                                />
                              </div>
                              <div className="file-previews">
                                {filePreviews.map((preview, index) => (
                                  <div
                                    key={index}
                                    className="file-preview-item relative inline-block"
                                  >
                                    {files[index].type.startsWith("image/") ? (
                                      <img
                                        src={preview}
                                        alt={`Preview ${index}`}
                                        className="w-28 h-28 object-cover rounded-lg"
                                      />
                                    ) : (
                                      <div className="file-info p-2 w-56 text-sm text-gray-700 bg-gray-200 rounded-lg">
                                        {files[index].name}
                                      </div>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveFile(index)}
                                      className="absolute top-2 right-1 bg-red-600 text-white rounded-full p-1"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="mt-4 flex justify-end space-x-2">
                              <Button
                                onClick={!loading ? handleUpdateTaskStatus : undefined} // Prevent multiple clicks
                                className={cn(
                                  "w-full text-white bg-[#007A5A]",
                                  !loading ? "hover:bg-[#007A5A]" : "opacity-50 cursor-not-allowed"
                                )}
                                disabled={loading} // Disable button when loading
                              >
                                {loading ? <Loader /> : "Update Task"}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

import { Dispatch, SetStateAction } from "react";

export type DateFilter =
  | "today"
  | "yesterday"
  | "thisWeek"
  | "lastWeek"
  | "nextWeek"
  | "thisMonth"
  | "lastMonth"
  | "nextMonth"
  | "thisYear"
  | "allTime"
  | "custom";

// Define the User interface
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  organization: string;
  email: string;
  role: string;
  profilePic: string;
  reportingManager: string;
}

export interface Reminder {
  notificationType: 'email' | 'whatsapp';
  type: 'minutes' | 'hours' | 'days' | 'specific';
  value?: number;  // Optional based on type
  date?: Date;     // Optional for specific reminders
  sent?: boolean;
}

// Define the Task interface
export interface Task {
  _id: string;
  title: string;
  user: User;
  description: string;
  assignedUser: User;
  category: { _id: string; name: string }; // Update category type here
  priority: string;
  repeatType: string;
  repeat: boolean;
  days?: string[];
  audioUrl?: string;
  dates?: number[];
  categories?: string[];
  dueDate: Date;
  completionDate: string;
  attachment?: string[];
  links?: string[];
  reminders: Reminder[];
  status: string;
  comments: Comment[];
  createdAt: string;
}


export interface DateRange {
  startDate?: Date;
  endDate?: Date;
}

export interface Comment {
  _id: string;
  userId: string; // Assuming a user ID for the commenter
  userName: string; // Name of the commenter
  comment: string;
  createdAt: string; // Date/time when the comment was added
  status: string;
  fileUrl?: string[]; // Optional array of URLs
  tag?: "In Progress" | "Completed" | "Reopen"; // Optional tag with specific values
}

export interface Category {
  _id: string;
  name: string; // Assuming a user ID for the commenter
  organization: string; // Name of the commenter
  imgSrc: string;
}

export type TaskUpdateCallback = () => void;

export interface TasksTabProps {
  tasks: Task[] | null;
  currentUser: User;
  onTaskUpdate: TaskUpdateCallback;
  onTaskDelete: (taskId: string) => void;
}

export interface TaskStatusCounts {
  [key: string]: number;
}


export interface TaskDetailsProps {
    selectedTask: Task;
    onTaskUpdate: (updatedTask: Task) => void;
    onClose: () => void;
    handleUpdateTaskStatus: () => Promise<void>;
    handleDelete: (taskId: string) => Promise<void>;
    handleEditClick: () => void;
    handleDeleteClick: (taskId: string) => void;
    handleDeleteConfirm: () => void;
    handleCopy: (link: string) => void;
    setSelectedTask: (task: Task | null) => void;
    setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
    setIsReopenDialogOpen: Dispatch<SetStateAction<boolean>>;
    isEditDialogOpen: boolean;
    setIsEditDialogOpen: Dispatch<SetStateAction<boolean>>;
    setIsCompleteDialogOpen: Dispatch<SetStateAction<boolean>>;
    setStatusToUpdate: Dispatch<SetStateAction<string | null>>; // Update the type here
    formatTaskDate: (dateTimeString: string | Date) => string;
    users: User[];
    sortedComments?: Comment[];
    categories: Category[];
    formatDate: (dateTimeString: string) => string;
}


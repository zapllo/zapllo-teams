"use client";

import React, {
  useState,
  useEffect,
  ChangeEvent,
  MouseEvent,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";
import axios from "axios";
import {
  Calendar,
  Clock,
  Link,
  Paperclip,
  Plus,
  Repeat,
  Tag,
  X,
  User,
  AlarmClock,
  Trash2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { FaUpload } from "react-icons/fa";
import { Label } from "../ui/label";
import DaysSelectModal from "../modals/DaysSelect";
import { Toggle } from "../ui/toggle";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import CustomTimePicker from "./time-picker";
import CustomDatePicker from "./date-picker";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { CaretDownIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import Loader from "../ui/loader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { format, parse } from "date-fns";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import { Tabs3, TabsList3, TabsTrigger3 } from "../ui/tabs3";

interface Reminder {
  notificationType: 'email' | 'whatsapp';
  type: 'minutes' | 'hours' | 'days' | 'specific';
  value?: number;  // Optional based on type
  date?: Date;     // Optional for specific reminders
  sent?: boolean;
}

// Define the Task interface
interface Task {
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
  repeatInterval: number;
  dueDate: Date;
  completionDate: string;
  attachment?: string[];
  links?: string[];
  reminders: Reminder[];
  status: string;
  comments: Comment[];
  createdAt: string;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  organization: string;
  email: string;
  role: string;
  profilePic: string;
  reportingManager: string;
}

interface Category {
  _id: string;
  name: string;
}

interface EditTaskDialogProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  onTaskUpdate: (task: Task) => void;
  users: User[];
  categories: Category[];
}

interface Comment {
  _id: string;
  userId: string; // Assuming a user ID for the commenter
  userName: string; // Name of the commenter
  comment: string;
  createdAt: string; // Date/time when the comment was added
  status: string;
}

const EditTaskDialog: React.FC<EditTaskDialogProps> = ({
  open,
  onClose,
  task,
  onTaskUpdate,
  users,
  categories,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    category: "",
    categoryName: "",
    assignedUser: "",
    assignedUserFirstName: "",
    repeat: false,
    repeatType: "Daily",
    dueDate: new Date(),
    days: [] as string[],
    dates: [] as number[],
    repeatInterval: 0,
    attachment: [] as string[],
    links: [] as string[],
    status: "Pending",
    reminders: [] as Reminder[], // Add reminders field with Reminder[] type
  });

  const [links, setLinks] = useState<string[]>([""]);
  const [files, setFiles] = useState<File[]>([]); // Updated to handle array of files
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isDateTimeModalOpen, setIsDateTimeModalOpen] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(true);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [dueTime, setDueTime] = useState<string>("");
  const [days, setDays] = useState<string[]>([]);
  const [category, setCategory] = useState<string>("");
  const [dates, setDates] = useState<number[]>([]);
  const [popoverInputValue, setPopoverInputValue] = useState<string>(""); // State for input value in popover
  const [openUser, setOpenUser] = useState<boolean>(false); // State for popover open/close
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryOpen, setCategoryOpen] = useState<boolean>(false); // State for popover open/close
  const [newCategory, setNewCategory] = useState("");
  const [searchCategoryQuery, setSearchCategoryQuery] = useState<string>(""); // State for search query
  const [isMonthlyDaysModalOpen, setIsMonthlyDaysModalOpen] = useState(false);
  const [linkInputs, setLinkInputs] = useState<string[]>([]);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false); // For Date picker modal
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false); // For Time picker modal
  const [deletedReminders, setDeletedReminders] = useState<Reminder[]>([]);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    assignedUser: "",
    category: "",
  });

  // Focus states for dynamic labels
  const [focusedInput, setFocusedInput] = useState({
    title: false,
    description: false,
    dueDate: false,
    dueTime: false,
    assignedUser: false,
    category: false,
  });

  const [popoverCategoryInputValue, setPopoverCategoryInputValue] =
    useState<string>(""); // State for input value in popover

  const handleOpen = () => setOpenUser(true);
  const controls = useAnimation();
  const handleCategoryOpen = () => setCategoryOpen(true);

  // Open date picker
  const handleOpenDatePicker = () => {
    setIsDatePickerOpen(true);
    setIsTimePickerOpen(false); // Close time picker if open
  };

  // Handle date selection
  const handleDateChange = (date: Date) => {
    setDueDate(date);
    setIsDatePickerOpen(false); // Close date picker
    setIsTimePickerOpen(true); // Open time picker
  };

  const handleCategoryClose = (selectedValue: any) => {
    setPopoverCategoryInputValue(selectedValue);
    setCategoryOpen(false);
  };

  const handleCloseCategoryPopup = () => {
    setCategoryOpen(false);
  };

  useEffect(() => {
    if (isLinkModalOpen) {
      setLinkInputs([...formData.links]); // Clone the current links into linkInputs
    }
  }, [isLinkModalOpen]);

  const handleUpdateDateTime = () => {
    if (dueDate && dueTime) {
      const [hours, minutes] = dueTime.split(":").map(Number);
      const updatedDate = new Date(dueDate);
      updatedDate.setHours(hours, minutes);
      setFormData({ ...formData, dueDate: updatedDate }); // Keep date as Date object
    }
    setIsTimePickerOpen(false);
  };

  // Working On Add  Reminder
  // Reminder state and handlers
  const [reminders, setReminders] = useState<Reminder[]>(task?.reminders || []);

  const [tempReminders, setTempReminders] = useState<Reminder[]>([]);
  // States for input controls
  const [reminderType, setReminderType] = useState<"email" | "whatsapp">("email");
  const [reminderValue, setReminderValue] = useState<number>(0);
  const [timeUnit, setTimeUnit] = useState<"minutes" | "hours" | "days">("minutes");

  // Add Reminder
  const addReminder = () => {
    if (tempReminders.length >= 5) {
      toast.error("You can only add up to 5 reminders");
      return;
    }

    const newReminder = {
      notificationType: reminderType,
      value: reminderValue,
      type: timeUnit,
    };

    // Check for duplicate reminders
    const duplicateReminder = tempReminders.some(
      (r) =>
        r.notificationType === newReminder.notificationType &&
        r.value === newReminder.value &&
        r.type === newReminder.type
    );

    if (duplicateReminder) {
      toast.error("Duplicate reminders are not allowed");
      return;
    }

    setTempReminders((prevReminders) => [...prevReminders, newReminder]);
  };

  const removeReminder = (index: number) => {
    const reminderToDelete = tempReminders[index];
    setTempReminders((prevReminders) =>
      prevReminders.filter((_, i) => i !== index)
    );
    setDeletedReminders((prevDeleted) => [...prevDeleted, reminderToDelete]);
  };

  // Handle Save Reminders
  const handleSaveReminders = () => {
    setReminders(tempReminders); // Save temporary reminders to main state
    setDeletedReminders([]); // Reset deleted reminders after saving
    toast.success("Reminders saved successfully!");
    setIsReminderModalOpen(false);
  };

  // Open reminder modal and set up tempReminders
  const openReminderModal = (isOpen: boolean) => {
    if (isOpen) {
      setTempReminders([...reminders]); // Load existing reminders into temporary state for editing
    } else {
      setReminderType("email");
      setReminderValue(0);
      setTimeUnit("minutes");
    }
    setIsReminderModalOpen(isOpen);
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      y: "100%",
    },
    visible: {
      opacity: 1,
      y: "0%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 40,
      },
    },
  };

  const handleCloseUserPopup = () => setOpenUser(false);
  const handleUserClose = (selectedUserName: string) => {
    setPopoverInputValue(selectedUserName);
    setOpenUser(false);
  };

  const setAssignedUser = (userId: string) => {
    setFormData({ ...formData, assignedUser: userId });
  };

  useEffect(() => {
    if (task) {
      // Directly assign the reminders array if it exists in task
      const loadedReminders = (task.reminders || []) as Reminder[];

      setReminders(loadedReminders); // Set main reminders
      setTempReminders(loadedReminders); // Prefill tempReminders to be shown in modal

      // Set due date and time
      const dueDate = new Date(task.dueDate);
      setDueDate(dueDate);

      // Extract time from the date
      const hours = dueDate.getHours().toString().padStart(2, '0');
      const minutes = dueDate.getMinutes().toString().padStart(2, '0');
      setDueTime(`${hours}:${minutes}`);

      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "Medium",
        category: task.category?._id || "",
        categoryName: task.category?.name,
        assignedUser: task.assignedUser?._id || "",
        assignedUserFirstName: task.assignedUser?.firstName,
        repeat: task.repeat || false,
        repeatType: task.repeatType || "Daily",
        dueDate: task.dueDate ? new Date(task.dueDate) : new Date(),
        days: task.days || [],
        dates: task.dates || [],
        repeatInterval: task.repeatInterval || 0,
        attachment: task.attachment || [],
        links: task.links || [],
        status: task.status || "Pending",
        reminders: loadedReminders,
      });
    }
  }, [task]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" })); // Clear error on input change
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      // Handle checkbox change
      const input = e.target as HTMLInputElement;
      setFormData((prevState) => ({
        ...prevState,
        [name]: input.checked,
      }));
    } else {
      // Handle other input types
      const input = e.target as
        | HTMLInputElement
        | HTMLSelectElement
        | HTMLTextAreaElement;
      setFormData((prevState) => ({
        ...prevState,
        [name]: input.value,
      }));

      // Trigger modal when `repeatType` changes to "Monthly"
      if (name === "repeatType" && input.value === "Monthly") {
        setIsMonthlyDaysModalOpen(true);
      }
    }
  };

  // Helper function to format the date
  function formatDate(date: any) {
    if (!(date instanceof Date)) return "";

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    // Convert hours to 12-hour format
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Adjust for 12-hour format, 0 becomes 12

    // Function to get the ordinal suffix for the day
    function getOrdinalSuffix(n: number) {
      const s = ["th", "st", "nd", "rd"],
        v = n % 100;
      return s[(v - 20) % 10] || s[v] || s[0];
    }

    const dayWithSuffix = day + getOrdinalSuffix(day);

    // Format time with leading zeros and AM/PM
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")} ${ampm}`;

    return `${month} ${dayWithSuffix}, ${year} ${formattedTime}`;
  }

  const handleDaysChange = (day: string, pressed: boolean) => {
    setFormData((prevFormData) => {
      const updatedDays = pressed
        ? [...prevFormData.days, day] // Add the day if pressed is true
        : prevFormData.days.filter((d) => d !== day); // Remove the day if pressed is false

      return {
        ...prevFormData,
        days: updatedDays,
      };
    });
  };

  const handleLinkChange = (index: number, value: string) => {
    const updatedLinks = [...formData.links];
    updatedLinks[index] = value;
    setFormData((prevState) => ({
      ...prevState,
      links: updatedLinks,
    }));
  };

  const addLink = () => {
    setFormData((prevState) => ({
      ...prevState,
      links: [...prevState.links, ""],
    }));
  };

  const removeLink = (index: number) => {
    const updatedLinks = formData.links.filter((_, i) => i !== index);
    setFormData((prevState) => ({
      ...prevState,
      links: updatedLinks,
    }));
  };

  // Validation function
  const validateInputs = () => {
    const newErrors = {
      title: "",
      description: "",
      assignedUser: "",
      category: "",
    };
    let isValid = true;

    if (!formData.title) {
      newErrors.title = "Task title is required";
      isValid = false;
    }
    if (!formData.description) {
      newErrors.description = "Task description is required";
      isValid = false;
    }
    if (!formData.assignedUser) {
      newErrors.assignedUser = "User assignment is required";
      isValid = false;
    }
    if (!formData.category) {
      newErrors.category = "Task category is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;

    try {
      setLoading(true);
      const response = await axios.patch("/api/tasks/edit", {
        id: task?._id,
        ...formData,
        reminders: reminders.filter(
          (reminder) => !deletedReminders.includes(reminder)
        ), // Exclude deleted reminders
      });

      if (response.status === 200) {
        onTaskUpdate(response.data.data);
        setLoading(false);
        toast.success("Task updated successfully!");
        onClose(); // Close the dialog on success
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task. Please try again.");
      setLoading(false);
    }
  };

  // Handle time selection
  const handleTimeChange = (time: string) => {
    setDueTime(time);
    setIsTimePickerOpen(false); // Close time picker
  };

  // Handle closing the time picker without saving (Cancel)
  const handleCancel = () => {
    setIsTimePickerOpen(false); // Simply close the time picker modal
    setIsDatePickerOpen(true);
  };

  // Handle saving the selected time and closing the time picker (OK)
  const handleAccept = () => {
    setIsTimePickerOpen(false); // Close the time picker modal after saving
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = event.target.files;

    if (selectedFiles && selectedFiles.length > 0) {
      const validFiles: File[] = [];
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        validFiles.push(file);
      }

      if (validFiles.length > 0) {
        try {
          // Prepare the form data with the selected files for upload
          const formData = new FormData();
          validFiles.forEach((file) => formData.append("files", file));

          // Upload the files to S3
          const s3Response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (s3Response.ok) {
            const s3Data = await s3Response.json();
            const fileUrls = s3Data.fileUrls || [];

            // Update the formData state with the file URLs from S3
            setFormData((prevState) => ({
              ...prevState,
              attachment: [...prevState.attachment, ...fileUrls],
            }));
          } else {
            console.error("Failed to upload files to S3");
          }
        } catch (error) {
          console.error("Error uploading files:", error);
        }
      }
    }
  };

  const handleRemoveFile = (fileUrl: string) => {
    // Remove the URL from formData state
    setFormData((prevState) => ({
      ...prevState,
      attachment: prevState.attachment.filter((url) => url !== fileUrl),
    }));
  };

  const handleLinkInputChange = (index: number, value: string) => {
    const updatedLinks = [...linkInputs];
    updatedLinks[index] = value;
    setLinkInputs(updatedLinks);
  };

  const removeLinkInputField = (index: number) => {
    const updatedLinks = linkInputs.filter((_, i) => i !== index);
    setLinkInputs(updatedLinks);
  };

  const addLinkInputField = () => {
    setLinkInputs([...linkInputs, ""]);
  };

  const handleSaveLinks = () => {
    setFormData((prevState) => ({
      ...prevState,
      links: linkInputs,
    }));
    setIsLinkModalOpen(false);
  };

  const nonEmptyLinksCount = formData.links.filter(
    (link) => link.trim() !== ""
  ).length;

  // Trigger animation when component mounts
  useEffect(() => {
    if (open) {
      controls.start("visible");
    }
  }, [controls, open]);

  if (!open) return null; // Render nothing if the dialog is not open

  return (
    <div className="fixed inset-0 z-[1000] w-full h-full bg-black/70 backdrop-blur-sm flex items-center justify-center">
    <motion.div
      className="dark:bg-[#0B0D29] bg-white z-[1001] h-fit m-auto overflow-y-auto scrollbar-hide text-[#000000] border dark:text-[#D0D3D3] w-[50%] max-h-[90vh] rounded-lg"
      variants={modalVariants}
      initial="hidden"
      animate={controls}
      >
        <div className="flex justify-between items-center px-8 py-3 border-b w-full">
          <h2 className="dark:text-lg dark:font-bold">Edit Task</h2>
          <CrossCircledIcon
            onClick={onClose}
            className="scale-150 cursor-pointer hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]"
          />
        </div>

        <div className="text-sm space-y-2 overflow-y-scroll px-8 py-4 scrollbar-hide h-full max-h-4xl">
          <div className="grid grid-cols-1 gap-2">
            <div className="">
              <h1 className="block absolute dark:bg-[#0B0D29] bg-white text-gray-500 px-1 ml-2 -mt-1 bg- dark:text-muted-foreground dark:text-gray-300 text-xs dark:font-semibold">Task Title</h1>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                onFocus={() => setFocusedInput({ ...focusedInput, title: true })}
                onBlur={() => setFocusedInput({ ...focusedInput, title: false })}
                className={cn(errors.title ? "border-red-500" : "", "w-full text-xs outline-none focus-within:border-[#815BF5] bg-transparent border dark:border-gray-500 dark:border-border mt-1 rounded px-3 py-2")}
              />
            </div>
            <div className="mt-1">
              <h1 className="block absolute dark:bg-[#0B0D29] bg-white text-gray-500 px-1 ml-2 -mt-1 bg- dark:text-muted-foreground dark:text-gray-300 text-xs dark:font-semibold">Description</h1>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                onFocus={() => setFocusedInput({ ...focusedInput, description: true })}
                onBlur={() => setFocusedInput({ ...focusedInput, description: false })}
                className={cn(errors.description ? "border-red-500" : "", "text-xs w-full focus-within:border-[#815BF5] outline-none bg-transparent dark:border-gray-500 border dark:border-border mt-1 rounded px-3 py-3")}
              ></textarea>
            </div>
          </div>

          <div className="grid-cols-2 gap-4 grid">
            <div>
              <button
                type="button"
                className="p-2 flex text-xs justify-between dark:border-border border bg-transparent w-full text-start rounded"
                onClick={handleOpen}
              >
                {formData.assignedUserFirstName ? (
                  formData.assignedUserFirstName
                ) : (
                  <h1 className="flex gap-2">
                    <User className="h-4" /> Select User{" "}
                  </h1>
                )}
                <CaretDownIcon />
              </button>
            </div>

            {openUser && (
              <UserSelectPopup
                users={users}
                assignedUser={formData.assignedUser}
                setAssignedUser={setAssignedUser}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onClose={handleCloseUserPopup}
                closeOnSelectUser={handleUserClose}
              />
            )}

            <div className="mb-2">
              <button
                type="button"
                className="p-2 text-xs flex border items-center dark:border-border bg-transparent justify-between w-full text-start rounded"
                onClick={handleCategoryOpen}
              >
                {formData.categoryName ? (
                  formData.categoryName
                ) : (
                  <h1 className="flex gap-2">
                    <Tag className="h-4" /> Select Category{" "}
                  </h1>
                )}
                <CaretDownIcon />
              </button>
            </div>

            {categoryOpen && (
              <CategorySelectPopup
                categories={categories}
                category={formData.category}
                setCategory={setCategory}
                newCategory={newCategory}
                setNewCategory={setNewCategory}
                searchCategoryQuery={searchCategoryQuery}
                setSearchCategoryQuery={setSearchCategoryQuery}
                onClose={handleCloseCategoryPopup}
                closeOnSelect={handleCategoryClose}
              />
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="mb-2 justify-between border dark:border-border rounded-md h-14 items-center flex gap-4 w-full">
              <div className="gap-2 flex justify-between h-fit items-center p-4 w-full">
                <div className="flex text-xs dark:text-white dark:font-bold">
                  Priority
                </div>
                <div className="rounded-lg w-full">
                  <Tabs3 className="" value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                    <TabsList3 className="rounded-lg text- flex dark:border-border border w-fit">
                      {["High", "Medium", "Low"].map((level) => (
                        <TabsTrigger3 className="text-xs" key={level} value={level}>
                          {level}
                        </TabsTrigger3>
                      ))}
                    </TabsList3>
                  </Tabs3>
                </div>
              </div>
            </div>
          </div>

          <div className="flex mb-2 py-2 items-center">
            <div className="px-2 w-1/2 flex">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="repeat"
                    checked={formData.repeat}
                    onCheckedChange={(checked) => setFormData({ ...formData, repeat: Boolean(checked) })}
                    className="mr-2"
                  />
                  <Label htmlFor="repeat" className="dark:font-semibold dark:text-white text-xs">
                    Repeat
                  </Label>
                </div>
              </div>

              {formData.repeat && (
                <div className="ml-4">
                  <div className="bg-transparent">
                    <Select
                      value={formData.repeatType}
                      onValueChange={(value) => {
                        setFormData({ ...formData, repeatType: value });
                        if (value === "Monthly") {
                          setIsMonthlyDaysModalOpen(true);
                        }
                      }}
                    >
                      <SelectTrigger className="w-48 dark:bg-[#292d33] border text-xs h-fit outline-none rounded px-3">
                        <SelectValue placeholder="Select Repeat Type" />
                      </SelectTrigger>
                      <SelectContent className="z-[100] text-xs">
                        <SelectItem value="Daily">Daily</SelectItem>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="Yearly">Yearly</SelectItem>
                        <SelectItem value="Periodically">Periodically</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {formData.repeat && formData.repeatType === "Periodically" && (
                <div className="">
                  <input
                    type="number"
                    id="repeatInterval"
                    value={formData.repeatInterval}
                    onChange={(e) => setFormData({ ...formData, repeatInterval: Number(e.target.value) })}
                    className="w-44 ml-4 dark:bg-[#292d33] border text-xs outline-none rounded px-3 py-2"
                    placeholder="Enter interval in days"
                    min={1}
                  />
                </div>
              )}
            </div>
          </div>

          {formData.repeatType === "Weekly" && formData.repeat && (
            <div className="mb-4 p-2">
              <Label className="block dark:font-semibold mb-2">Select Days</Label>
              <div className="grid grid-cols-7 p-2 rounded">
                {[
                  "Monday",
                  "Tuesday",
"Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <div
                    key={day}
                    className="flex gap-2 cursor-pointer items-center"
                  >
                    <Toggle
                      variant="outline"
                      aria-label={`${day}`}
                      pressed={formData.days.includes(day)}
                      onPressedChange={(pressed) => handleDaysChange(day, pressed)}
                      className={
                        formData.days.includes(day)
                          ? "text-white cursor-pointer"
                          : "dark:text-black text-white cursor-pointer"
                      }
                    >
                      <Label
                        htmlFor={day}
                        className="dark:font-semibold cursor-pointer"
                      >
                        {day.slice(0, 1)}
                      </Label>
                    </Toggle>
                  </div>
                ))}
              </div>
            </div>
          )}

          {formData.repeatType === "Monthly" && formData.repeat && (
            <div>
              <DaysSelectModal
                isOpen={isMonthlyDaysModalOpen}
                onOpenChange={setIsMonthlyDaysModalOpen}
                selectedDays={formData.dates}
                setSelectedDays={(update) =>
                  setFormData((prev) => ({
                    ...prev,
                    dates:
                      typeof update === "function"
                        ? update(prev.dates)
                        : update,
                  }))
                }
              />
            </div>
          )}

          <div className="mb-4 flex justify-between">
            <Button
              type="button"
              onClick={handleOpenDatePicker}
              className="border dark:border-border bg-background
              text-black dark:text-white rounded dark:bg-[#282D32] hover:bg-transparent px-3 flex gap-1 py-2"
            >
              <Calendar className="h-5 text-sm" />
              {dueDate && dueTime ? (
                <h1>
                  {format(dueDate, "PPP")}
                  <span className="ml-2">{format(parse(dueTime, "HH:mm", new Date()), "hh:mm a")}</span>
                </h1>
              ) : (
                <h1 className="text-xs">Select Date & Time</h1>
              )}
            </Button>

            {formData.repeatType === "Monthly" && formData.repeat && (
              <div className="sticky right-0">
                <h1 className="ml-">Selected Days: {formData.dates.join(", ")}</h1>
              </div>
            )}

            {isDatePickerOpen && (
              <Dialog
                open={isDatePickerOpen}
                onOpenChange={setIsDatePickerOpen}
              >
                <DialogContent className="z-[100] scale-90 pb-4 flex justify-center">
                  <CustomDatePicker
                    selectedDate={dueDate ?? new Date()}
                    onDateChange={handleDateChange}
                    onCloseDialog={() => setIsDatePickerOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            )}

            {isTimePickerOpen && (
              <Dialog
                open={isTimePickerOpen}
                onOpenChange={setIsTimePickerOpen}
              >
                <DialogContent className="z-[100] scale-90 flex justify-center">
                  <CustomTimePicker
                    selectedTime={dueTime}
                    onTimeChange={handleTimeChange}
                    onCancel={handleCancel}
                    onAccept={handleUpdateDateTime}
                    onBackToDatePicker={() => {
                      setIsTimePickerOpen(false);
                      setIsDatePickerOpen(true);
                    }}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex mt-4 mb-2 gap-2">
              <div
                onClick={() => {
                  setIsLinkModalOpen(true);
                }}
                className={`h-8 w-8 rounded-full items-center text-center border cursor-pointer hover:shadow-white shadow-sm bg-primary dark:bg-[#282D32] ${
                  nonEmptyLinksCount > 0 ? "border-[#815BF5]" : ""
                }`}
              >
                <Link className="h-5 text-center text-white m-auto mt-1" />
              </div>
              {nonEmptyLinksCount > 0 && (
                <span className="text-xs mt-2 text">
                  {nonEmptyLinksCount} Links
                </span>
              )}
            </div>

            <div className="flex mt-4 gap-2">
              <div
                onClick={() => {
                  setIsAttachmentModalOpen(true);
                }}
                className={`h-8 w-8 rounded-full items-center text-center border cursor-pointer hover:shadow-white shadow-sm bg-primary dark:bg-[#282D32] ${
                  formData.attachment.length > 0 ? "border-[#815BF5]" : ""
                }`}
              >
                <Paperclip className="h-5 text-white text-center m-auto mt-1" />
              </div>
              {formData.attachment.length > 0 && (
                <span className="text-xs mt-2 text">
                  {formData.attachment.length} Attachments
                </span>
              )}
            </div>

            <div className="flex gap-4">
              <div className="flex mt-4 mb-2 gap-2">
                <div
                  onClick={() => {
                    setIsReminderModalOpen(true);
                  }}
                  className={`h-8 w-8 rounded-full items-center text-center border cursor-pointer hover:shadow-white shadow-sm bg-primary dark:bg-[#282D32] ${
                    reminders.length > 0 ? "border-[#815BF5]" : ""
                  }`}
                >
                  <Clock className="h-5 text-white text-center m-auto mt-1" />
                </div>
                {reminders.length > 0 && (
                  <span className="text-xs mt-2">
                    {reminders.length} Reminders
                  </span>
                )}
              </div>
            </div>
          </div>

          <Dialog open={isLinkModalOpen} onOpenChange={setIsLinkModalOpen}>
            <DialogContent className="z-[100] p-6">
              <div className="flex justify-between">
                <DialogTitle>Add Links</DialogTitle>
                <DialogClose>
                  <CrossCircledIcon
                    className="scale-150 cursor-pointer hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]"
                  />
                </DialogClose>
              </div>
              <DialogDescription>Attach Links to the Task.</DialogDescription>
              <div className="mb-4">
                {linkInputs.map((link, index) => (
                  <div key={index} className="flex gap-2 items-center mb-2">
                    <input
                      type="text"
                      value={link}
                      onChange={(e) => handleLinkInputChange(index, e.target.value)}
                      className="w-full outline-none focus-within:border-[#815BF5] border-[#505356] bg-transparent border rounded px-3 py-2 mr-2"
                    />
                    <Button
                      type="button"
                      onClick={() => removeLinkInputField(index)}
                      className="text-white bg-transparent hover:bg-transparent rounded"
                    >
                      <Trash2 className="text-red-500 hover:text-red-800" />
                    </Button>
                  </div>
                ))}

                <div className="w-full flex justify-between mt-6">
                  <Button
                    type="button"
                    onClick={addLinkInputField}
                    className="bg-transparent border border-[#505356] dark:text-white text-black hover:text-white hover:bg-[#815BF5] px-4 py-2 flex gap-2 rounded"
                  >
                    Add Link
                    <Plus />
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSaveLinks}
                    className="bg-[#017a5b] text-white hover:bg-[#15624f] px-4 py-2 rounded"
                  >
                    Save Links
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isAttachmentModalOpen}
            onOpenChange={setIsAttachmentModalOpen}
          >
            <DialogContent className="z-[100] p-6">
              <div className="flex w-full justify-between">
                <DialogTitle>Add an Attachment</DialogTitle>
                <DialogClose>
                  <CrossCircledIcon
                    className="scale-150 cursor-pointer hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]"
                  />
                </DialogClose>
              </div>
              <DialogDescription>Add Attachments to the Task.</DialogDescription>
              <div className="flex items-center space-x-2">
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />

                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex items-center space-x-2"
                >
                  <FaUpload className="h-5 w-5" />
                  <span>Attach Files</span>
                </label>
              </div>

              {/* Display selected file names */}
              <div>
                {formData.attachment.length > 0 && (
                  <ul className="list-disc list-inside">
                    <div className="grid grid-cols-2 gap-3">
                      {formData.attachment.map((fileUrl, index) => {
                        // Determine if the fileUrl is an image based on its extension
                        const isImage = /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(fileUrl);

                        return (
                          <li key={index} className="flex items-center space-x-2">
                            {isImage ? (
                              <img
                                src={fileUrl}
                                alt={`Attachment ${index}`}
                                className="h-12 w-12 rounded-full object-cover"
                              />
                            ) : (
                              <span>{fileUrl.split("/").pop()}</span>
                            )}

                            <button
                              className="text-red-500"
                              onClick={() => handleRemoveFile(fileUrl)}
                            >
                              Remove
                            </button>
                          </li>
                        );
                      })}
                    </div>
                  </ul>
                )}
              </div>

              <Button
                className="bg-[#017a5b] hover:bg-[#15624f]"
                onClick={() => setIsAttachmentModalOpen(false)}
              >
                Save Attachments
              </Button>
            </DialogContent>
          </Dialog>

          <motion.div
            className="bg-[#0B0D29] z-60 overflow-y-scroll scrollbar-hide max-h-screen text-[#D0D3D3] w-[50%] rounded-lg"
            variants={modalVariants}
            initial="hidden"
            animate={controls}
          >
            <Dialog open={isReminderModalOpen} onOpenChange={openReminderModal}>
              <DialogContent className="max-w-lg mx-auto z-[100] p-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <AlarmClock className="h-6 w-6" />
                    <DialogTitle>Add Task Reminders</DialogTitle>
                  </div>
                  <DialogClose>
                    <CrossCircledIcon
                      className="scale-150 cursor-pointer hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]"
                    />
                  </DialogClose>
                </div>
                <Separator className="" />
                <div className="">
                  {/* Input fields for adding reminders */}
                  <div className="flex justify-center w-full gap-2 items-center mb-4">
                    <select
                      value={reminderType}
                      onChange={(e) => setReminderType(e.target.value as "email" | "whatsapp")}
                      className="border bg-transparent outline-none p-2 bg-[#1A1C20] rounded h-full"
                    >
                      <option className="bg-[#1A1C20]" value="email">Email</option>
                      <option className="bg-[#1A1C20]" value="whatsapp">WhatsApp</option>
                    </select>

                    <input
                      type="number"
                      value={reminderValue}
                      onChange={(e) => setReminderValue(Number(e.target.value))}
                      className="p-2 w-24 border bg-transparent outline-none bg-[#1A1C20] rounded h-full"
                      placeholder="Enter value"
                    />

                    <select
                      value={timeUnit}
                      onChange={(e) => setTimeUnit(e.target.value as "minutes" | "hours" | "days")}
                      className="p-2 outline-none bg-[#1A1C20] border bg-transparent rounded h-full"
                    >
                      <option className="bg-[#1A1C20]" value="minutes">minutes</option>
                      <option className="bg-[#1A1C20]" value="hours">hours</option>
                      <option className="bg-[#1A1C20]" value="days">days</option>
                    </select>

                    <button
                      onClick={addReminder}
                      className="bg-[#017A5B] hover:bg-[#15624f] rounded-full h-10 w-10 flex items-center justify-center"
                    >
                      <Plus className="text-white" />
                    </button>
                  </div>

                  <Separator className="my-2" />
                  {/* Display added reminders */}
                  <ul className="gap-2 mx-6 pl-12 items-center">
                    {tempReminders.map((reminder, index) => (
                      <React.Fragment key={index}>
                        {/* Editable Notification Type Select */}
                        <div className="flex gap-4 my-2">
                          <select
                            value={reminder.notificationType}
                            onChange={(e) => {
                              const updatedType = e.target.value as "email" | "whatsapp";
                              // Check for duplicate before updating
                              const isDuplicate = reminders.some(
                                (r, i) =>
                                  i !== index &&
                                  r.notificationType === updatedType &&
                                  r.value === reminder.value &&
                                  r.type === reminder.type
                              );

                              if (isDuplicate) {
                                toast.error("Duplicate reminders are not allowed");
                                return;
                              }

                              // Update if no duplicate is found
                              const updatedReminders = reminders.map((r, i) =>
                                i === index ? { ...r, notificationType: updatedType } : r
                              );
                              setReminders(updatedReminders as Reminder[]);
                            }}
                            className="border outline-none p-2 rounded bg-transparent bg-[#1A1C20] h-full flex"
                          >
                            <option className="bg-[#1A1C20]" value="email">Email</option>
                            <option className="bg-[#1A1C20]" value="whatsapp">WhatsApp</option>
                          </select>

                          {/* Reminder Value (Styled as Text) */}
                          <li className="p-2 w-12 border rounded h-full flex items-center">
                            <span>{reminder.value}</span>
                          </li>

                          {/* Editable Time Unit Select */}
                          <select
                            value={reminder.type}
                            onChange={(e) => {
                              const updatedType = e.target.value as "minutes" | "hours" | "days";

                              // Check for duplicate before updating
                              const isDuplicate = reminders.some(
                                (r, i) =>
                                  i !== index &&
                                  r.notificationType === reminder.notificationType &&
                                  r.value === reminder.value &&
                                  r.type === updatedType
                              );

                              if (isDuplicate) {
                                toast.error("Duplicate reminders are not allowed");
                                return;
                              }

                              // Update if no duplicate is found
                              const updatedReminders = reminders.map((r, i) =>
                                i === index ? { ...r, type: updatedType } : r
                              );
                              setReminders(updatedReminders as Reminder[]);
                            }}
                            className="border rounded p-2 outline-none h-full bg-[#1A1C20] bg-transparent flex items-center"
                          >
                            <option className="bg-[#1A1C20]" value="minutes">minutes</option>
                            <option className="bg-[#1A1C20]" value="hours">hours</option>
                            <option className="bg-[#1A1C20]" value="days">days</option>
                          </select>

                          {/* Delete Button */}
                          <li className="">
                            <button className="p-2" onClick={() => removeReminder(index)}>
                              <X className="cursor-pointer rounded-full text-red-500 flex items-center justify-center" />
                            </button>
                          </li>
                        </div>
                      </React.Fragment>
                    ))}
                  </ul>
                </div>
                {/* Save button */}
                <div className="mt-4 flex justify-center">
                  <Button
                    onClick={handleSaveReminders}
                    className="bg-[#017A5B] hover:bg-[#15624f] text-white"
                  >
                    Save Reminders
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>

          <div className="flex justify-end mt-4">
            <Button
              onClick={handleSubmit}
              className="bg-[#815BF5] hover:bg-[#5f31e9] w-full text-white p-2 rounded"
            >
              {loading ? <Loader /> : "Update Task"}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EditTaskDialog;

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePic: string;
}

interface UserSelectPopupProps {
  users: User[];
  assignedUser: string;
  setAssignedUser: (userId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onClose: () => void;
  closeOnSelectUser: (userName: string) => void;
}

const UserSelectPopup: React.FC<UserSelectPopupProps> = ({
  users,
  assignedUser,
  setAssignedUser,
  searchQuery,
  setSearchQuery,
  onClose,
  closeOnSelectUser,
}) => {
  const handleSelectUser = (selectedUserId: string) => {
    const selectedUser = users.find((user) => user._id === selectedUserId);
    if (selectedUser) {
      setAssignedUser(selectedUser._id);
      closeOnSelectUser(selectedUser.firstName);
    }
  };

  const popupRef = useRef<HTMLDivElement>(null);

  const filteredUsers = users.filter((user) =>
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside as unknown as EventListener
    );
    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside as unknown as EventListener
      );
    };
  }, [onClose]);

  return (
    <div
      ref={popupRef}
      className="absolute dark:bg-[#0B0D29] bg-white dark:text-white border mt-10 dark:border-gray-700 rounded shadow-md p-4 w-[45%] z-50"
    >
      <input
        placeholder="Search user"
        className="h-8 text-xs px-4 focus:border-[#815bf5] dark:text-white w-full dark:bg-[#292d33] gray-600 border border-gray-500 dark:border-border rounded outline-none mb-2"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div>
        {filteredUsers.length === 0 ? (
          <div>No users found.</div>
        ) : (
          <div className="w-full text-sm max-h-40 overflow-y-scroll scrollbar-hide">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="cursor-pointer p-2 flex items-center justify-between mb-1"
                onClick={() => handleSelectUser(user._id)}
              >
                <div className="flex gap-2">
                  <Avatar className="h-8 w-8 rounded-full flex bg-[#815BF5] items-center">
                    {user.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <AvatarFallback className="ml-2">
                        <h1 className="text-sm text-white">
                          {`${user.firstName}`.slice(0, 1)}
                          {`${user.lastName}`.slice(0, 1)}
                        </h1>
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <h1 className="text-sm">
                      {user.firstName} {user.lastName}
                    </h1>
                    <span className="text-xs">{user.email}</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="user"
                  className="bg-primary"
                  checked={assignedUser === user._id}
                  onChange={() => handleSelectUser(user._id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const getCategoryIcon = (categoryName: String) => {
  switch (categoryName) {
    case "Automation":
      return "/icons/intranet.png";
    case "Customer Support":
      return "/icons/support.png";
    case "Marketing":
      return "/icons/marketing.png";
    case "Operations":
      return "/icons/operations.png";
    case "Sales":
      return "/icons/sales.png";
    case "HR":
      return "/icons/attendance.png";
    default:
      return null; // Or a default icon if you prefer
  }
};

interface FallbackImageProps {
  name: string;
}

const FallbackImage: React.FC<FallbackImageProps> = ({ name }) => {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div className="bg-[#282D32] rounded-full h-8 w-8 flex items-center justify-center">
      <span className="text-white font-bold text-sm">{initial}</span>
    </div>
  );
};

interface Category {
  _id: string;
  name: string;
}

interface CategorySelectPopupProps {
  categories: Category[];
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
  searchCategoryQuery: string;
  setSearchCategoryQuery: Dispatch<SetStateAction<string>>;
  newCategory: string;
  setNewCategory: Dispatch<SetStateAction<string>>;
  closeOnSelect: (selectedValue: any) => void;
  onClose: () => void;
}

const CategorySelectPopup: React.FC<CategorySelectPopupProps> = ({
  categories,
  category,
  setCategory,
  searchCategoryQuery,
  newCategory,
  setNewCategory,
  setSearchCategoryQuery,
  onClose,
  closeOnSelect,
}) => {
  const handleSelectCategory = (selectedCategoryId: string) => {
    const selectedCategory = categories.find(
      (category) => category._id === selectedCategoryId
    );
    if (selectedCategory) {
      setCategory(selectedCategory._id);
      closeOnSelect(selectedCategory.name);
    }
  };
  const popupRef = useRef<HTMLDivElement>(null);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchCategoryQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside as unknown as EventListener
    );
    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside as unknown as EventListener
      );
    };
  }, [onClose]);

  return (
    <div
      ref={popupRef}
      className="absolute dark:bg-[#0B0D29] ml-[46%] mt- bg-white text-black dark:border-gray-700 dark:border-border border mt-10 rounded shadow-md p-4 w-[45%] z-50"
    >
      <input
        placeholder="Search Categories"
        className="h-8 text-xs px-4 dark:text-white focus:border-[#815bf5] w-full dark:bg-[#282D32] border-gray-500 dark:border-border border rounded outline-none mb-2"
        value={searchCategoryQuery}
        onChange={(e) => setSearchCategoryQuery(e.target.value)}
      />
      <div>
        {filteredCategories.length === 0 ? (
          <div className="dark:text-white p-2">No categories found</div>
        ) : (
          <div className="w-full text-sm text-white max-h-40 overflow-y-scroll scrollbar-hide">
            {filteredCategories.map((categorys) => (
              <div
                key={categorys._id}
                className="cursor-pointer p-2 flex items-center justify-start mb-1"
                onClick={() => handleSelectCategory(categorys._id)}
              >
                <div className="dark:bg-[#282D32] rounded-full h-8 w-8">
                  {getCategoryIcon(categorys.name) ? (
                    <img
                      src={getCategoryIcon(categorys?.name) as string}
                      alt={categorys.name}
                      className="w-4 h-4 ml-2 mt-2"
                    />
                  ) : (
                    <FallbackImage name={categorys.name} />
                  )}
                </div>
                <span className="px-4 dark:text-white text-black text-xs">{categorys.name}</span>

                {category === categorys._id && (
                  <input
                    type="radio"
                    name="category"
                    className="bg-primary ml-auto"
                    checked={category === categorys._id}
                    onChange={() => handleSelectCategory(categorys._id)}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

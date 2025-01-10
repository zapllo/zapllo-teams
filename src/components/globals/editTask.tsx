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
  MailIcon,
  Paperclip,
  Plus,
  Repeat,
  Tag,
  X,
  User,
  AlarmClock,
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

// interface Reminder {
//   type: "minutes" | "hours" | "days" | "specific"; // Added 'specific'
//   value: number | undefined; // Make value required
//   date: Date | undefined; // Make date required
//   sent: boolean;
// }

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
  const [reminderType, setReminderType] = useState<"email" | "whatsapp">(
    "email"
  );
  const [reminderValue, setReminderValue] = useState<number>(0);
  const [timeUnit, setTimeUnit] = useState<"minutes" | "hours" | "days">(
    "minutes"
  );

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
      // setTempReminders([]); // Clear temporary reminders on close
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
        attachment: task.attachment || [],
        links: task.links || [],
        status: task.status || "Pending",
        reminders: loadedReminders,
      });
    }
  }, [task]);


  console.log(tempReminders, 'temp Reminders  ')


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

  console.log(formData, "form data");

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

  const handleSubmit = async () => {
    console.log(formData, "form data"); // Check that formData contains updated 'days' and 'dates'

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
        onClose(); // Close the dialog on success
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task. Please try again.");
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

  // const handleReminderChange = (
  //   type: "email" | "whatsapp",
  //   field: "type" | "value" | "date",
  //   value: any
  // ) => {
  //   console.log(`Updating ${type} reminder:`, field, value); // Debugging line
  //   setFormData((prevState) => ({
  //     ...prevState,
  //     reminder: {
  //       ...prevState.reminder,
  //       [type]: {
  //         ...prevState.reminder[type],
  //         [field]: value,
  //       },
  //     },
  //   }));
  // };

  // const handleCloseMonthlyDaysModal = (selectedDays: number[]) => {
  //     setFormData(prevState => ({
  //         ...prevState,
  //         dates: selectedDays,
  //     }));
  //     setIsMonthlyDaysModalOpen(false);
  // };

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

  console.log(formData, "formdata");
  if (!open) return null; // Render nothing if the dialog is not open

  return (
    <div className="fixed inset-0 w-full bg-black bg-opacity-50 flex items-center justify-center z-40">
      <div className="bg-[#0B0D29] z-50 border max-h-screen h-fit m-auto overflow-y-scroll scrollbar-hide p-6 text-xs rounded-lg max-w-screen w-[50%] shadow-lg">
        <div className="flex w-full justify-between mb-4">
          <h2 className="text-lg font-medium ">Edit Task</h2>
          <button className="cursor-pointer  text-lg" onClick={onClose}>
            <CrossCircledIcon className="scale-150  cursor-pointer hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]" />

          </button>
        </div>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border bg-transparent outline-none rounded "
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full bg-transparent outline-none p-2 h-12  border rounded mt-2"
          rows={4}
        />

        <div className="grid gap-2 grid-cols-2 mt-2">
          <div className="flex justify-between gap-2 w-full">
            {/* <div className='w-full'>
                            <label className="block mb-2">

                                <select
                                    name="assignedUser"
                                    value={formData.assignedUser}
                                    onChange={handleChange}
                                    className="w-1/2  outline-none p-2 border rounded mt-1"
                                >
                                    {users.map(user => (
                                        <option key={user._id} value={user._id}>
                                            {user.firstName}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div> */}
            <div className="w-full">
              <button
                type="button"
                className="p-2 flex text-xs justify-between border-2  bg-transparent w-full text-start  rounded"
                onClick={handleOpen}
              >
                {formData ? (
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
          </div>
          <div className="w-full">
            <button
              type="button"
              className="p-2 text-xs flex border-2   bg-transparent justify-between w-full text-start  rounded"
              onClick={handleCategoryOpen}
            >
              {formData ? (
                formData.categoryName
              ) : (
                <h1 className="flex gap-2">
                  <Tag className="h-4" /> Select Category{" "}
                </h1>
              )}
              <CaretDownIcon />
            </button>
          </div>

          <div className="   rounded-lg flex gap-2 ml-auto">
            {/* <label className="block mb-2 ">
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full bg-t outline-none p-2 border rounded "
                            >
                                {categories.map(category => (
                                    <option key={category._id} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </label> */}
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
        </div>
        <div className="w-full flex justify-between">
          <div className="block mb-2">
            <div className="flex gap-2 border px-4 py-5 w-full rounded ">
              <h1 className="text-xs font-bold">Priority:</h1>

              <div className="">
                {["High", "Medium", "Low"].map((level) => (
                  <label
                    key={level}
                    className={`px-4 py-1 text-xs border border-[#505356] font-medium cursor-pointer ${formData.priority === level
                      ? "bg-[#815BF5] text-white"
                      : "bg-[#282D32] text-gray-300 hover:bg-gray-600"
                      }`}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value={level}
                      checked={formData.priority === level}
                      onChange={handleChange}
                      className="hidden"
                    />
                    {level}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 ml-40 items-center ">
            <Repeat className="h-4" />
            <Label htmlFor="repeat" className="font-semibold text-xs ">
              Repeat
            </Label>
            <input
              type="checkbox"
              name="repeat"
              checked={formData.repeat}
              onChange={handleChange}
              className="mr-2"
            />
          </div>
        </div>
        {formData.repeat && (
          <div className="flex w-full relative justify-end">
            <label className="block absolute mb-2">
              Repeat Type:
              <select
                name="repeatType"
                value={formData.repeatType}
                onChange={handleChange}
                className="w-full p-2 border outline-none rounded mt-1"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </label>
          </div>
        )}

        {formData.repeatType === "Weekly" && formData.repeat && (
          <div className="mb-4 ml-2 mt-12">
            <Label className="block font-medium mb-2">Select Days</Label>
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
                    pressed={formData.days.includes(day)} // Set pressed state based on inclusion in formData.days
                    onPressedChange={(pressed) =>
                      handleDaysChange(day, pressed)
                    } // Update handler to pass the pressed state
                    className={
                      formData.days.includes(day)
                        ? "text-white cursor-pointer"
                        : "text-black cursor-pointer"
                    }
                  >
                    <Label
                      htmlFor={day}
                      className="font-semibold cursor-pointer"
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
            {isMonthlyDaysModalOpen && (
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
                        : update, // Handles both function and direct state
                  }))
                }
              />
            )}
          </div>
        )}
        <div className="flex gap-2 ">
          <label className="block mb-2">
            <Button
              type="button"
              onClick={handleOpenDatePicker}
              className=" border-2 text-xs rounded bg-[#282D32] hover:bg-transparent px-3 flex gap-1  py-2"
            >
              <Calendar className="h-5 text-sm" />
              {formData.dueDate ? (
                <span>{formatDate(formData.dueDate)}</span>
              ) : (
                <h1 className="text-xs">Select Date & Time</h1>
              )}
            </Button>
            {/* <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            className=" p-2 ml-1 border rounded mt-1"
                        /> */}
          </label>
        </div>

        <div>
          {isDatePickerOpen && (
            <Dialog
              open={isDatePickerOpen}
              onOpenChange={setIsDatePickerOpen}
            >
              <DialogContent className=" z-[100]  scale-90 flex justify-center ">
                <div className=" z-[20] rounded-lg  scale-[80%] max-w-4xl flex justify-center items-center w-full relative">
                  <div className="w-full flex mb-4 justify-between">
                    <CustomDatePicker
                      selectedDate={formData.dueDate ?? new Date()}
                      onDateChange={handleDateChange}
                      onCloseDialog={() => setIsDatePickerOpen(false)}
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {isTimePickerOpen && (
          <Dialog
            open={isTimePickerOpen}
            onOpenChange={setIsTimePickerOpen}
          >
            <DialogContent className="z-[100] scale-90 flex justify-center ">
              <div className="z-[20] rounded-lg  scale-[80%] max-w-4xl flex justify-center items-center w-full relative">
                <div className="w-full flex mb-4 justify-between">
                  <CustomTimePicker
                    selectedTime={dueTime} // Pass the selected time
                    onTimeChange={(newTime) => setDueTime(newTime)} // Update dueTime when time changes
                    onCancel={() => setIsTimePickerOpen(false)}
                    onAccept={handleUpdateDateTime}
                    onBackToDatePicker={() => {
                      setIsTimePickerOpen(false); // Close the time picker
                      setIsDatePickerOpen(true); // Reopen the date picker
                    }}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        <div className="flex    gap-4">
          <div className="flex mt-4 gap-2">
            <div
              onClick={() => {
                setIsLinkModalOpen(true);
              }}
              className={`h-8 w-8 rounded-full items-center text-center border cursor-pointer hover:shadow-white shadow-sm bg-[#282D32] ${nonEmptyLinksCount > 0 ? "border-[#017A5B]" : ""
                }`}
            >
              <Link className="h-5 text-center m-auto mt-1" />
            </div>
            {nonEmptyLinksCount > 0 && (
              <span className="text-xs mt-2">{nonEmptyLinksCount} Links</span>
            )}
          </div>

          <div className="flex mt-4 gap-2">
            <div
              onClick={() => {
                setIsAttachmentModalOpen(true);
              }}
              className={`h-8 w-8 rounded-full items-center text-center border cursor-pointer hover:shadow-white shadow-sm bg-[#282D32] ${formData.attachment.length > 0 ? "border-[#017A5B]" : ""
                }`}
            >
              <Paperclip className="h-5 text-center m-auto mt-1" />
            </div>
            {formData.attachment.length > 0 && (
              <span className="text-xs mt-2 text">
                {formData.attachment.length} Attachments
              </span> // Display the count
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex mt-4 mb-2 gap-2">
              {/* <div
                onClick={() => {
                  setIsReminderModalOpen(true);
                }}
                className="h-8 mt-4 w-8 rounded-full items-center text-center  border cursor-pointer hover:shadow-white shadow-sm  bg-[#282D32] "
              >
                <Clock className="h-5 text-center m-auto mt-1" />
              </div> */}
              <div
                onClick={() => {
                  setIsReminderModalOpen(true);
                }}
                className={`h-8 w-8 rounded-full items-center text-center border cursor-pointer hover:shadow-white shadow-sm bg-[#282D32] ${reminders.length > 0 ? "border-[#815BF5]" : ""
                  }`}
              >
                <Clock className="h-5 text-center m-auto mt-1" />
              </div>
              {reminders.length > 0 && (
                <span className="text-xs mt-2">
                  {reminders.length} Reminders
                </span> // Display the count of reminders
              )}
            </div>
          </div>
          {/* <div onClick={() => { setIsRecordingModalOpen(true) }} className='h-8 w-8 rounded-full items-center text-center  border cursor-pointer hover:shadow-white shadow-sm  bg-[#282D32] '>
                            <Mic className='h-5 text-center m-auto mt-1' />
                        </div> */}
          {/* {recording ? (
                        <div onClick={stopRecording} className='h-8 mt-4 w-8 rounded-full items-center text-center  border cursor-pointer hover:shadow-white shadow-sm   bg-red-500'>
                            <Mic className='h-5 text-center m-auto mt-1' />
                        </div>
                    ) : (
                        <div onClick={startRecording} className='h-8 mt-4 w-8 rounded-full items-center text-center  border cursor-pointer hover:shadow-white shadow-sm  bg-[#282D32]'>
                            <Mic className='h-5 text-center m-auto mt-1' />
                        </div>
                    )} */}
        </div>
        <Dialog open={isLinkModalOpen} onOpenChange={setIsLinkModalOpen}>
          <DialogContent className="z-[100] p-6">
            <div className="flex justify-between">
              <DialogTitle>Add Links</DialogTitle>
              <DialogClose>
                <CrossCircledIcon className="scale-150  cursor-pointer hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]" />
              </DialogClose>
            </div>
            <DialogDescription>Attach Links to the Task.</DialogDescription>
            <div className="mb-4">
              <Label className="block font-semibold mb-2">Links</Label>
              {/* {links.map((link, index) => (
                                <div key={index} className="flex gap-2 items-center mb-2">
                                    <input type="text" value={link} onChange={(e) => handleLinkChange(index, e.target.value)} className="w-full outline-none border-[#505356]  bg-transparent border rounded px-3 py-2 mr-2" />
                                    <Button type="button" onClick={() => removeLinkField(index)} className="bg-red-500 hover:bg-red-500 text-white rounded">Remove</Button>
                                </div>
                            ))} */}
              {linkInputs.map((link, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={link}
                    onChange={(e) =>
                      handleLinkInputChange(index, e.target.value)
                    }
                    className="w-full p-2 border outline-none rounded mr-2"
                  />
                  <button
                    onClick={() => removeLinkInputField(index)}
                    className="bg-red-500 text-white p-2 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <div className="w-full flex justify-between mt-6">
                <Button
                  type="button"
                  onClick={addLinkInputField}
                  className="bg-transparent border border-[#505356] text-white hover:bg-[#017A5B] px-4 py-2 flex gap-2 rounded"
                >
                  Add Link
                  <Plus />
                </Button>
                <Button
                  type="button"
                  onClick={handleSaveLinks}
                  className="bg-[#017A5B] text-white hover:bg-[#017A5B] px-4 py-2 rounded"
                >
                  Save Links
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        {isAttachmentModalOpen && (
          <div className="fixed inset-0 w-full bg-black bg-opacity-50 flex items-center justify-center z-0">
          </div>
        )}

        <Dialog
          open={isAttachmentModalOpen}
          onOpenChange={setIsAttachmentModalOpen}
        >

          <DialogContent className="z-[100] p-6">

            <div className="flex w-full justify-between">
              <DialogTitle>Add an Attachment</DialogTitle>
              <DialogClose>
                <CrossCircledIcon className="scale-150  cursor-pointer hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]" />
              </DialogClose>
            </div>
            <DialogDescription>Add Attachments to the Task.</DialogDescription>
            <div className="flex items-center space-x-2">
              <input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileUpload}
                style={{ display: "none" }} // Hide the file input
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
                      // Determine if the fileUrl is an image based on its extension or content type
                      const isImage = /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(
                        fileUrl
                      );

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
              className="bg-[#017A5B] hover:bg-[#017A5B]"
              onClick={() => setIsAttachmentModalOpen(false)}
            >
              Save Attachments
            </Button>
          </DialogContent>

        </Dialog>


        <motion.div
          className="bg-[#0B0D29] z-60  overflow-y-scroll scrollbar-hide max-h-screen text-[#D0D3D3] w-[50%] rounded-lg "
          variants={modalVariants}
          initial="hidden"
          animate={controls}
        >
          <Dialog open={isReminderModalOpen} onOpenChange={openReminderModal}>
            <DialogContent className="max-w-lg mx-auto z-[100] p-6">
              <div className="flex justify-between items-center ">
                <div className="flex items-center gap-2">
                  <AlarmClock className="h-6 w-6" />
                  <DialogTitle>Add Task Reminders</DialogTitle>
                </div>
                <DialogClose>
                  <CrossCircledIcon className="scale-150  cursor-pointer hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]" />
                </DialogClose>
              </div>
              <Separator className="" />
              <div className=" ">
                {/* Input fields for adding reminders */}
                <div className="flex  justify-center w-full gap-2 items-center  mb-4">
                  <select
                    value={reminderType}
                    onChange={(e) =>
                      setReminderType(e.target.value as "email" | "whatsapp")
                    }
                    className=" border bg-transparent outline-none p-2 bg-[#1A1C20]  rounded h-full"
                  >
                    <option className="bg-[#1A1C20]" value="email">
                      Email
                    </option>
                    <option className="bg-[#1A1C20]" value="whatsapp">
                      WhatsApp
                    </option>
                  </select>

                  <input
                    type="number"
                    value={reminderValue}
                    onChange={(e) => setReminderValue(Number(e.target.value))}
                    className=" p-2 w-24 border bg-transparent outline-none  bg-[#1A1C20] rounded h-full"
                    placeholder="Enter value"
                  />

                  <select
                    value={timeUnit}
                    onChange={(e) =>
                      setTimeUnit(
                        e.target.value as "minutes" | "hours" | "days"
                      )
                    }
                    className=" p-2 outline-none bg-[#1A1C20] border bg-transparent rounded h-full"
                  >
                    <option className="bg-[#1A1C20]" value="minutes">
                      minutes
                    </option>
                    <option className="bg-[#1A1C20]" value="hours">
                      hours
                    </option>
                    <option className="bg-[#1A1C20]" value="days">
                      days
                    </option>
                  </select>
                  <button
                    onClick={addReminder}
                    // className="bg-green-500 rounded-full flex items-center justify-center h-full"
                    className="bg-[#017A5B] hover:bg-[#017A5B] rounded-full h-10 w-10 flex items-center justify-center"
                  >
                    <Plus className="text-white" />
                  </button>
                </div>

                <Separator className="my-2" />
                {/* Display added reminders */}

                <ul className=" gap-2 mx-6 pl-12 items-center">
                  {tempReminders.map((reminder, index) => (
                    <React.Fragment key={index}>
                      {/* Editable Notification Type Select */}
                      <div className="flex gap-4 my-2">
                        <select
                          value={reminder.notificationType}
                          onChange={(e) => {
                            const updatedType = e.target.value as
                              | "email"
                              | "whatsapp";
                            // Check for duplicate before updating
                            const isDuplicate = reminders.some(
                              (r, i) =>
                                i !== index &&
                                r.notificationType === updatedType &&
                                r.value === reminder.value &&
                                r.type === reminder.type
                            );

                            if (isDuplicate) {
                              toast.error(
                                "Duplicate reminders are not allowed"
                              );
                              return;
                            }

                            // Update if no duplicate is found
                            const updatedReminders = reminders.map((r, i) =>
                              i === index
                                ? { ...r, notificationType: updatedType }
                                : r
                            );
                            setReminders(updatedReminders as Reminder[]);
                          }}
                          className="border outline-none p-2 rounded bg-transparent bg-[#1A1C20] h-full flex"
                        >
                          <option className="bg-[#1A1C20]" value="email">
                            Email
                          </option>
                          <option className="bg-[#1A1C20]" value="whatsapp">
                            WhatsApp
                          </option>
                        </select>

                        {/* Reminder Value (Styled as Text) */}
                        <li className="p-2 w-12 border rounded h-full flex items-center">
                          <span>{reminder.value}</span>
                        </li>
                        {/* Editable Time Unit Select */}
                        <select
                          value={reminder.type}
                          onChange={(e) => {
                            const updatedType = e.target.value as
                              | "minutes"
                              | "hours"
                              | "days";

                            // Check for duplicate before updating
                            const isDuplicate = reminders.some(
                              (r, i) =>
                                i !== index &&
                                r.notificationType ===
                                reminder.notificationType &&
                                r.value === reminder.value &&
                                r.type === updatedType
                            );

                            if (isDuplicate) {
                              toast.error(
                                "Duplicate reminders are not allowed"
                              );
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
                          <option className="bg-[#1A1C20]" value="minutes">
                            minutes
                          </option>
                          <option className="bg-[#1A1C20]" value="hours">
                            hours
                          </option>
                          <option className="bg-[#1A1C20]" value="days">
                            days
                          </option>
                        </select>
                        {/* Delete Button */}
                        <li className="">
                          <button
                            className="p-2"
                            onClick={() => removeReminder(index)}
                          >
                            <X className="cursor-pointer  rounded-full text-red-500 flex items-center justify-center" />
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
                  className="bg-[#017A5B]  hover:bg-[#017A5B] text-white"
                >
                  Save Reminders
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmit}
            className="bg-[#815BF5]  w-full text-white p-2 rounded"
          >
            {loading ? <Loader /> : "Update Task"}
          </button>
        </div>
      </div>
    </div >
  );
};

export default EditTaskDialog;

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
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
      className="absolute bg-[#0B0D29] text-white border mt-10 border-gray-700 rounded shadow-md p-4 w-[22%] z-50"
    >
      <input
        placeholder="Search user"
        className="h-8 text-xs px-4 text-white w-full bg-[#292d33] gray-600 border rounded outline-none mb-2"
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
                      <AvatarFallback className=" w-8 h-8 ">

                        <h1 className="text-sm ">
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
    </div >
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
  name: string; // Define the type of 'name'
}

const FallbackImage: React.FC<FallbackImageProps> = ({ name }) => {
  const initial = name.charAt(0).toUpperCase(); // Get the first letter of the category name
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

  // const handleCreateCategory = async () => {
  //     if (!newCategory) return;
  //     try {
  //         const response = await axios.post('/api/category/create', {name: newCategory });
  //         if (response.status === 200) {
  //             // Add the new category to the categories list
  //             setCategories([...categories, response.data.data]);
  //             // Clear the new category input
  //             setNewCategory('');
  //             toast.success("Category Created Successfully!")
  //         } else {
  //             console.error('Error creating category:', response.data.error);
  //         }
  //     } catch (error) {
  //         console.error('Error creating category:', error);
  //     }
  // };

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

    // Add event listener
    document.addEventListener(
      "mousedown",
      handleClickOutside as unknown as EventListener
    );

    // Cleanup event listener
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
      className="absolute bg-[#0B0D29] ml-4 text-black border -mt-4 rounded shadow-md p-4 w-[22%] z-50"
    >
      <input
        placeholder=" Search Categories..."
        className="h-8 text-xs px-4 text-white w-full bg-[#282D32] -800 border rounded outline-none mb-2"
        value={searchCategoryQuery}
        onChange={(e) => setSearchCategoryQuery(e.target.value)}
      />
      <div>
        {categories.length === 0 ? (
          <div>No categories found.</div>
        ) : (
          <div className="w-full text-sm text-white max-h-40 overflow-y-scroll scrollbar-hide">
            {filteredCategories.map((categorys) => (
              <div
                key={categorys._id}
                className="cursor-pointer p-2 flex items-center justify-start  mb-1"
                onClick={() => handleSelectCategory(categorys._id)}
              >
                <div className="bg-[#282D32] rounded-full h-8  w-8">
                  {getCategoryIcon(categorys.name) ? (
                    <img
                      src={getCategoryIcon(categorys?.name) as string} // Type assertion
                      alt={categorys.name}
                      className="w-4 h-4 ml-2 mt-2"
                    />
                  ) : (
                    <FallbackImage name={categorys.name} />
                  )}
                </div>
                <span className="px-4 text-xs">{categorys.name}</span>

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

"use client";

// Import statements corrected for paths and dependencies
import React, {
  Dispatch,
  ReactEventHandler,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
// import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CaretDownIcon,
  CaretSortIcon,
  CheckIcon,
  CrossCircledIcon,
  StopIcon,
} from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Calendar,
  CalendarIcon,
  ClipboardIcon,
  Clock,
  FlagIcon,
  Link,
  Mail,
  MailIcon,
  Mic,
  Paperclip,
  Plus,
  PlusCircleIcon,
  Repeat,
  Tag,
  User,
  X,
  AlarmClock,
  Bell,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { format, parse } from "date-fns";
import CustomDatePicker from "./date-picker";
import CustomTimePicker from "./time-picker";
import { Separator } from "../ui/separator";
import { toast } from "sonner";
import Loader from "../ui/loader";
import { Toggle } from "../ui/toggle";
import Select, { StylesConfig } from "react-select";
import { Switch } from "../ui/switch";
import { FaTimes, FaUpload } from "react-icons/fa";
import CustomAudioPlayer from "./customAudioPlayer";
import DaysSelectModal from "../modals/DaysSelect";
import { Avatar } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

import axios from "axios";

interface TaskModalProps {
  closeModal: () => void;
}
interface Reminder {
  type: "minutes" | "hours" | "days";
  value: number;
  notificationType: "email" | "whatsapp";
}
interface Category {
  _id: string;
  name: string;
  organization: string;
}

interface Reminder {
  type: "minutes" | "hours" | "days";
  value: number;
  notificationType: "email" | "whatsapp";
}

const TaskModal: React.FC<TaskModalProps> = ({ closeModal }) => {
  // State variables for form inputs
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [assignedUser, setAssignedUser] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [priority, setPriority] = useState<string>("High");
  const [repeat, setRepeat] = useState<boolean>(false);
  const [repeatType, setRepeatType] = useState<string>("");
  const [days, setDays] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [dueTime, setDueTime] = useState<string>("");
  const [attachment, setAttachment] = useState<string>("");
  const [links, setLinks] = useState<string[]>([""]);
  const [users, setUsers] = useState<any[]>([]); // State to store users
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]); // State for filtered users
  const [filteredCategories, setFilteredCategories] = useState<any[]>([]); // State for filtered users
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query
  const [searchCategoryQuery, setSearchCategoryQuery] = useState<string>(""); // State for search query
  const [searchDateQuery, setSearchDateQuery] = useState<string>(""); // State for search query
  const [open, setOpen] = useState<boolean>(false); // State for popover open/close
  const [categoryOpen, setCategoryOpen] = useState<boolean>(false); // State for popover open/close
  const [daysSelectModalOpen, setDaysSelectModalOpen] =
    useState<boolean>(false); // State for popover open/close
  const [popoverInputValue, setPopoverInputValue] = useState<string>(""); // State for input value in popover
  const [popoverCategoryInputValue, setPopoverCategoryInputValue] =
    useState<string>(""); // State for input value in popover
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isDateTimeModalOpen, setIsDateTimeModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(true);
  const [date, setDate] = React.useState<Date>();
  const [repeatMonthlyDay, setRepeatMonthlyDay] = useState(""); // New state for monthly day
  const [repeatMonthlyDays, setRepeatMonthlyDays] = useState<number[]>([]);
  const [assignMoreTasks, setAssignMoreTasks] = useState(false); // State for switch
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [audioURL, setAudioURL] = useState("");
  const audioURLRef = useRef<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [files, setFiles] = useState<File[]>([]); // Updated to handle array of files
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false); // For Date picker modal
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false); // For Time picker modal
  const [linkInputs, setLinkInputs] = useState<string[]>([]);

  // States for reminder settings
  const [emailReminderType, setEmailReminderType] = useState("minutes");
  const [emailReminderValue, setEmailReminderValue] = useState(0);
  const [whatsappReminderType, setWhatsappReminderType] = useState("minutes");
  const [whatsappReminderValue, setWhatsappReminderValue] = useState(0);
  const [reminderDate, setReminderDate] = useState<Date | null>(null); // Explicitly typed as Date or null
  const intervalRef = useRef<number | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const controls = useAnimation();


  // Working On Field Validations
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    dueDate: "",
    dueTime: "",
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


  // Reminder state and handlers
  const [reminders, setReminders] = useState<Reminder[]>([]); // State to store reminders
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

  // Remove Reminder
  const removeReminder = (index: number) => {
    setTempReminders((prevReminders) =>
      prevReminders.filter((_, i) => i !== index)
    );
  };

  // Handle Save Reminders
  const handleSaveReminders = () => {
    setReminders(tempReminders); // Save the reminders
    toast.success("Reminders saved successfully")
    // setTempReminders([]); // Clear the temporary reminders
    setIsReminderModalOpen(false);
  };

  const openReminderModal = (isOpen: boolean) => {
    if (isOpen) {
      setTempReminders([...reminders]); // Load existing reminders into temporary state
    } else {
      // Clear temporary reminders and reset the input values if dialog is closed without saving
      // Clear tempReminders and reset input fields only if there are no existing reminders
      if (reminders.length === 0) {
        setTempReminders([]);
      }
      setReminderType("email"); // Default value
      setReminderValue(0); // Reset to default or empty value
      setTimeUnit("minutes"); // Default value
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

  // Trigger the animation when the component mounts
  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  useEffect(() => {
    if (isLinkModalOpen) {
      setLinkInputs([...links]); // Clone the current links into linkInputs
    }
  }, [isLinkModalOpen]);

  const handleLinkInputChange = (index: number, value: string) => {
    const updatedLinkInputs = [...linkInputs];
    updatedLinkInputs[index] = value;
    setLinkInputs(updatedLinkInputs);
  };

  const removeLinkInputField = (index: number) => {
    const updatedLinkInputs = [...linkInputs];
    updatedLinkInputs.splice(index, 1);
    setLinkInputs(updatedLinkInputs);
  };

  const handleSaveLinks = () => {
    setLinks([...linkInputs]); // Update the main links state
    setIsLinkModalOpen(false); // Close the modal
  };

  useEffect(() => {
    if (audioBlob) {
      const audioURL = URL.createObjectURL(audioBlob);
      setAudioURL(audioURL);
      // Cleanup URL to avoid memory leaks
      return () => URL.revokeObjectURL(audioURL);
    }
  }, [audioBlob]);

  // Handle audio recording logic
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
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current); // Clear the timer
          intervalRef.current = null; // Reset the ref
        }
        setRecordingTime(0); // Reset timer
      };

      mediaRecorder.start();
      setRecording(true);

      // Start timer
      intervalRef.current = window.setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);

      // Real-time waveform visualization
      // Real-time waveform visualization (Bars Version)
      const canvas = canvasRef.current;
      console.log(canvas);
      if (canvas) {
        const canvasCtx = canvas.getContext("2d");
        if (canvasCtx) {
          const drawWaveform = () => {
            if (analyserRef.current) {
              requestAnimationFrame(drawWaveform);
              analyserRef.current.getByteFrequencyData(dataArray);

              // Clear the canvas before rendering bars
              canvasCtx.fillStyle = "rgb(0, 0, 0)";
              canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

              const bars = 40;
              const barWidth = 2;
              const totalBarWidth = bars * barWidth;
              const gapWidth = (canvas.width - totalBarWidth) / (bars - 1);
              const step = Math.floor(bufferLength / bars); // Number of bars to draw

              for (let i = 0; i < bars; i++) {
                const barHeight =
                  (dataArray[i * step] / 255) * canvas.height * 0.8; // Normalizing bar height
                const x = i * (barWidth + gapWidth);
                const y = (canvas.height - barHeight) / 2; // Center the bars vertically

                // Draw each bar
                canvasCtx.fillStyle = "rgb(99, 102, 241)"; // Bar color
                canvasCtx.fillRect(x, y, barWidth, barHeight);
              }
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
    // Stop all tracks of the media stream to release the microphone
    if (mediaRecorderRef.current?.stream) {
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  useEffect(() => {
    if (repeatType === "Monthly" && repeat) {
      setDaysSelectModalOpen(true);
    }
  }, [repeatType, repeat]);

  useEffect(() => {
    const getUserDetails = async () => {
      const res = await axios.get("/api/users/me");
      const user = res.data.data;
      setRole(user.role);
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
          setFilteredUsers(result.data); // Initialize filtered users with all users
        } else {
          console.error("Error fetching users:", result.error);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  console.log(users, 'users', filteredUsers, 'filtered')
  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) =>
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  // Filter users based on search query
  useEffect(() => {
    if (searchCategoryQuery.trim() === "") {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchCategoryQuery, categories]);

  // Handle selecting a user from popover
  const handleSelectUser = (selectedUserId: string) => {
    const selectedUser = users.find((user) => user._id === selectedUserId);
    if (selectedUser) {
      setAssignedUser(selectedUser._id);
      setPopoverInputValue(selectedUser.firstName); // Set popover input value with user's first name
      setOpen(false);
    }
  };

  const handleSelectCategory = (selectedCategoryId: string) => {
    const selectedCategory = categories.find(
      (category) => category._id === selectedCategoryId
    );
    if (selectedCategory) {
      setCategory(selectedCategory._id);
      setPopoverCategoryInputValue(selectedCategory.name); // Set popover input value with user's first name
      setCategoryOpen(false);
    }
  };

  // Function to handle link changes
  const handleLinkChange = (index: number, value: string) => {
    const updatedLinks = [...links];
    updatedLinks[index] = value;
    setLinks(updatedLinks);
  };

  // Function to add a link field
  const addLinkField = () => {
    setLinkInputs([...linkInputs, ""]);
  };

  // Function to remove a link field
  const removeLinkField = (index: number) => {
    const updatedLinks = links.filter((_, i) => i !== index);
    setLinks(updatedLinks);
  };

  // Handle change for days checkboxes
  const handleDaysChange = (day: string) => {
    setDays((prevDays) => {
      if (prevDays.includes(day)) {
        return prevDays.filter((d) => d !== day);
      } else {
        return [...prevDays, day];
      }
    });
  };

  console.log(days, "days!!");

  useEffect(() => {
    // Fetch categories from the server
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/category/get");
        const result = await response.json();
        if (response.ok) {
          setCategories(result.data);
        } else {
          console.error("Error fetching categories:", result.error);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCreateCategory = async () => {
    if (!newCategory) return;
    try {
      const response = await fetch("/api/category/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCategory }),
      });

      const result = await response.json();

      if (response.ok) {
        // Add the new category to the categories list
        setCategories([...categories, result.data]);
        // Clear the new category input
        setNewCategory("");
        // Switch back to selection mode
        setCreatingCategory(false);
        // Set the newly created category as selected
        setCategory(result.data._id);
      } else {
        console.error("Error creating category:", result.error);
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  // Format the selected due date and due time into a single Date object
  const getCombinedDateTime = () => {
    if (!dueDate || !dueTime) return null;

    // Parse due time and set hours and minutes on dueDate
    const [hours, minutes] = dueTime.split(":").map(Number);
    const combinedDate = new Date(dueDate);
    combinedDate.setHours(hours, minutes, 0, 0); // Set time on the selected date
    return combinedDate;
  };

  // Validation function
  const validateInputs = () => {
    const newErrors = {
      title: "",
      description: "",
      dueDate: "",
      dueTime: "",
      assignedUser: "",
      category: "",
    };
    let isValid = true;

    if (!title) {
      newErrors.title = "Task title is required";
      isValid = false;
    }
    if (!description) {
      newErrors.description = "Task description is required";
      isValid = false;
    }
    if (!dueDate) {
      newErrors.dueDate = "Due date is required";
      isValid = false;
    }
    if (!dueTime) {
      newErrors.dueTime = "Due time is required";
      isValid = false;
    }
    if (!assignedUser) {
      newErrors.assignedUser = "User assignment is required";
      isValid = false;
    }
    if (!category) {
      newErrors.category = "Task category is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Input change handler
  const handleInputChange = (field: string, value: string) => {
    if (field === "title") setTitle(value);
    if (field === "description") setDescription(value);
    if (field === "dueDate") setDueDate(value as unknown as Date);
    if (field === "dueTime") setDueTime(value);
    if (field === "assignedUser") setAssignedUser(value);
    if (field === "category") setCategory(value);

    setErrors((prev) => ({ ...prev, [field]: "" })); // Clear error on input change
  };


  const handleAssignTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;
    if (!dueDate || !dueTime) {
      toast.error("Due date and time are required.");
      return;
    }
    setLoading(true);

    // Generate the combined date and time
    const combinedDueDateTime = getCombinedDateTime();
    if (!combinedDueDateTime) {
      setLoading(false);
      return;
    }

    let fileUrls: string[] = [];
    let audioUrl: string | null = null;

    // Upload files and audio to S3 if there are any files or audio selected
    if ((files && files.length > 0) || audioBlob) {
      const formData = new FormData();

      if (files) {
        files.forEach((file) => formData.append("files", file));
      }

      if (audioBlob) {
        formData.append("audio", audioBlob, "audio.wav"); // Attach the audio blob to the formData
      }

      try {
        const s3Response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (s3Response.ok) {
          const s3Data = await s3Response.json();
          fileUrls = s3Data.fileUrls || []; // Assuming this is an array of file URLs
          audioUrl = s3Data.audioUrl || null; // Assuming the API returns the audio URL
        } else {
          console.error("Failed to upload files to S3");
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("Error uploading files:", error);
        setLoading(false);
        return;
      }
    }

    // Format reminders as an array of objects
    const reminders = [];
    if (emailReminderType && emailReminderValue) {
      reminders.push({
        notificationType: "email",
        type: emailReminderType,
        value: emailReminderValue,
      });
    }

    if (whatsappReminderType && whatsappReminderValue) {
      reminders.push({
        notificationType: "whatsapp",
        type: whatsappReminderType,
        value: whatsappReminderValue,
      });
    }

    // Add specific reminder if provided
    if (reminderDate) {
      reminders.push({
        notificationType: "specific",
        type: "specific",
        date: reminderDate.toISOString(),
      });
    }

    const taskData = {
      title,
      description,
      assignedUser,
      category,
      priority,
      repeat,
      repeatType: repeat ? repeatType : "", // Only include repeatType if repeat is true
      days: repeat ? days : [], // Only include days if repeat is true
      dates: repeatMonthlyDays,
      dueDate: combinedDueDateTime, // Use the combined date and tim
      attachment: fileUrls, // Use the URLs from S3 upload
      audioUrl, // Add the audio URL here
      links,
      reminders: tempReminders, // Include the formatted reminders array
    };
    // Log taskData before sending to ensure reminders are included
    console.log("Task data being sent:", taskData);

    try {
      const response = await fetch("/api/tasks/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      const result = await response.json();

      if (assignMoreTasks) {
        clearFormFields();
      } else {
        closeModal();
      }

      if (response.ok) {
        console.log("Task Assigned:", result);
        setLoading(false);
        toast(<div className=" w-full mb-6 gap-2 m-auto  ">
          <div className="w-full flex   justify-center">
            <DotLottieReact
              src="/lottie/tick.lottie"
              loop
              autoplay
            />
          </div>
          <h1 className="text-black text-center font-medium text-lg">Task created successfully</h1>
        </div>);
      } else {
        console.error("Error assigning task:", result.error);
        toast(<div className=" w-full mb-6 gap-2 m-auto  ">
          <div className="w-full flex   justify-center">
            <DotLottieReact
              src="/lottie/error.lottie"
              loop
              autoplay
            />
          </div>
          <h1 className="text-black text-center font-medium text-lg">Task creation Failed</h1>
        </div>);
      }
    } catch (error: any) {
      console.error("Error assigning task:", error);
      toast.error(error.message);
    }
  };

  console.log(tempReminders, 'reminders')

  const clearFormFields = () => {
    setTitle("");
    setDescription("");
    setAssignedUser("");
    setCategory("");
    setPopoverCategoryInputValue("");
    setPopoverInputValue("");
    setPriority("");
    setRepeat(false);
    setRepeatType("");
    setDays([]);
    setDueDate(null);
    setDueTime("");
    setCategory("");
    setFiles([]); // Clear the uploaded files
    setLinks([]);
    setEmailReminderType("minutes");
    setEmailReminderValue(0);
    setWhatsappReminderType("minutes");
    setWhatsappReminderValue(0);
    setAudioBlob(null);
    setAudioURL("");
    setReminderDate(null);
  };

  const handleOpen = () => setOpen(true);
  const handleCategoryOpen = () => setCategoryOpen(true);

  const handleClose = (selectedValue: any) => {
    setPopoverInputValue(selectedValue);
    setOpen(false);
  };

  const handleCategoryClose = (selectedValue: any) => {
    setPopoverCategoryInputValue(selectedValue);
    setCategoryOpen(false);
  };

  const handleUserClose = (selectedValue: any) => {
    setPopoverInputValue(selectedValue);
    setOpen(false);
  };

  const handleCloseCategoryPopup = () => {
    setCategoryOpen(false);
  };

  const handleCloseUserPopup = () => {
    setOpen(false);
  };

  const handleCheckboxChange = (checked: any) => {
    setAssignMoreTasks(checked);
  };

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



  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;

    if (selectedFiles && selectedFiles.length > 0) {
      const validFiles: File[] = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        validFiles.push(file);
      }

      if (validFiles.length > 0) {
        setFiles(validFiles); // Update state with all selected files
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index)); // Remove the file at the specified index
  };

  return (
    <div className="absolute overflow-y-scroll scrollbar-hide z-[100] h-screen max-h-screen inset-0 bg-black backdrop-blur-sm -900  bg-opacity-50 rounded-xl flex justify-center items-center">


      <motion.div
        className="bg-[#0B0D29] z-[100] h-fit m-auto   scrollbar-hide  text-[#D0D3D3] w-[50%] rounded-lg "
        variants={modalVariants}
        initial="hidden"
        animate={controls}
      >
        <div className="flex justify-between   items-center  px-8 py-3 border-b w-full">
          <h2 className="text-lg font-bold   ">Assign New Task</h2>

          <CrossCircledIcon
            onClick={closeModal}
            className="scale-150  cursor-pointer hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]"
          />
        </div>

        <form className="text-sm space-y-2 overflow-y-scroll px-8 py-4 scrollbar-hide h-full max-h-4xl">
          <div className="grid grid-cols-1 gap-2">
            <div className="">
              <h1 className="block absolute bg-[#0B0D29] px-1 ml-2 -mt-1 bg- text-muted-foreground text-xs font-semibold">Task Title</h1>
              <input
                type="text"
                // placeholder="Task Title"
                id="title"
                value={title}
                onFocus={() => setFocusedInput({ ...focusedInput, title: true })}
                onBlur={() => setFocusedInput({ ...focusedInput, title: false })}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className={cn(errors.title ? "border-red-500" : "", "w-full text-xs  outline-none focus-within:border-[#815BF5] bg-transparent border mt-1 rounded px-3 py-2")}
              />
            </div>
            <div className="mt-1">
              <h1 className="block absolute bg-[#0B0D29] px-1 ml-2 -mt-1 bg- text-muted-foreground text-xs font-semibold"> Description</h1>
              <textarea
                id="description"
                // placeholder="Task Description"
                value={description}
                onFocus={() => setFocusedInput({ ...focusedInput, description: true })}
                onBlur={() => setFocusedInput({ ...focusedInput, description: false })}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className={cn(errors.description ? "border-red-500" : "", "text-xs w-full focus-within:border-[#815BF5]  outline-none  bg-transparent border    mt-1 rounded px-3 py-3")}
              ></textarea>
            </div>
          </div>
          <div className="grid-cols-2 gap-4 grid ">
            <div>
              <button
                type="button"
                className="p-2 flex text-xs justify-between border-2  bg-transparent w-full text-start  rounded"
                onClick={handleOpen}
              >
                {popoverInputValue ? (
                  popoverInputValue
                ) : (
                  <h1 className="flex gap-2">
                    <User className="h-4" /> Select User{" "}
                  </h1>
                )}
                <CaretDownIcon />
              </button>
            </div>

            {open && (
              <UserSelectPopup
                users={users}
                assignedUser={assignedUser}
                setAssignedUser={setAssignedUser}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onClose={handleCloseUserPopup}
                closeOnSelectUser={handleUserClose}
              />
            )}

            <div className="mb-2">
              <div>
                <button
                  type="button"
                  className="p-2 text-xs flex border-2   bg-transparent justify-between w-full text-start  rounded"
                  onClick={handleCategoryOpen}
                >
                  {popoverCategoryInputValue ? (
                    popoverCategoryInputValue
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
                  category={category}
                  setCategory={setCategory}
                  newCategory={newCategory}
                  setCategories={setCategories}
                  setNewCategory={setNewCategory}
                  searchCategoryQuery={searchCategoryQuery}
                  setSearchCategoryQuery={setSearchCategoryQuery}
                  onClose={handleCloseCategoryPopup}
                  closeOnSelect={handleCategoryClose}
                  role={role}
                />
              )}
            </div>
          </div>
          <div className=" flex justify-between">
            <div className="mb-2  justify-between  rounded-md  flex gap-4 mta">
              <div className=" gap-2 flex justify-between h-fit border-2 p-4 w-full ">
                <div className="flex gap-2   text-xs text-white font-bold">
                  {/* <FlagIcon className='h-5' /> */}
                  Priority
                </div>
                <div className=" rounded-lg  ">
                  {["High", "Medium", "Low"].map((level) => (
                    <label
                      key={level}
                      className={`px-4 py-1 text-xs   border border-[#505356]   font-semibold cursor-pointer ${priority === level
                        ? "bg-[#815BF5]  text-white"
                        : "bg-[#282D32] text-gray-300 hover:bg-gray-600"
                        }`}
                    >
                      <input
                        type="radio"
                        name="priority"
                        value={level}
                        checked={priority === level}
                        onChange={() => setPriority(level)}
                        className="hidden"
                      />
                      {level}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="- px-2 sticky right-0 w-1/2  justify-between">
              <div className="flex gap-2 ml-40 items-center ">
                <Repeat className="h-4" />
                <Label htmlFor="repeat" className="font-semibold text-xs ">
                  Repeat
                </Label>
                <input
                  type="checkbox"
                  className="custom-checkbox mr-2 h-10"
                  id="repeat"
                  checked={repeat}
                  onChange={(e) => setRepeat(e.target.checked)}
                />
              </div>
              <div></div>
              {repeat && (
                <div>
                  <div className="bg-transparent">
                    {/* <Label htmlFor="repeatType" className="block font-semibold">Repeat Type</Label> */}
                    <select
                      id="repeatType"
                      value={repeatType}
                      onChange={(e) => setRepeatType(e.target.value)}
                      className="w-48 ml-20 bg-[#292d33] border text-xs outline-none rounded px-3 py-2"
                    >
                      <option value="bg-[#292D33]">Select Repeat Type</option>
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {repeatType === "Weekly" && repeat && (
            <div className="mb-4 ">
              <Label className="block font-semibold mb-2">Select Days</Label>
              <div className="grid grid-cols-7  p-2 rounded ">
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
                      onClick={() => handleDaysChange(day)}
                      className={
                        days.includes(day)
                          ? " text-white cursor-pointer"
                          : "text-black cursor-pointer"
                      }
                    >
                      <Label
                        htmlFor={day}
                        className="font-semibold cursor-pointer "
                      >
                        {day.slice(0, 1)}
                      </Label>
                    </Toggle>
                  </div>
                ))}
              </div>
            </div>
          )}

          {repeatType === "Monthly" && repeat && (
            <div>
              <DaysSelectModal
                isOpen={daysSelectModalOpen}
                onOpenChange={setDaysSelectModalOpen}
                selectedDays={repeatMonthlyDays}
                setSelectedDays={setRepeatMonthlyDays}
              />
            </div>
          )}
          {/* <Label htmlFor="dueDate" className="block font-semibold text-xs mb-2">Due Date</Label> */}

          <div className="mb-4 flex justify-between">
            <Button
              type="button"
              onClick={handleOpenDatePicker}
              className=" border-2 rounded bg-[#282D32] hover:bg-transparent px-3 flex gap-1  py-2"
            >
              <Calendar className="h-5 text-sm" />
              {dueDate && dueTime ? (
                <h1> {format(dueDate, "PPP")}
                  <span className="ml-2">{format(parse(dueTime, "HH:mm", new Date()), "hh:mm a")}
                  </span>
                </h1>
              ) : (
                <h1 className="text-xs">Select Date & Time</h1>
              )}
            </Button>

            {repeatType === "Monthly" && repeat && (
              <div className="sticky   right-0 ">
                <h1 className="  ml- ">
                  Selected Days: {repeatMonthlyDays.join(", ")}
                </h1>
              </div>
            )}
            {isDatePickerOpen && (
              <Dialog
                open={isDatePickerOpen}
                onOpenChange={setIsDatePickerOpen}
              >

                <DialogContent className=" z-[100]  scale-90 flex justify-center ">
                  <div className=" z-[20] rounded-lg  scale-[80%] max-w-4xl flex justify-center items-center w-full relative">
                    <div className="w-full flex mb-4 justify-between">
                      <CustomDatePicker
                        selectedDate={dueDate ?? new Date()}
                        onDateChange={handleDateChange}
                        onCloseDialog={() => setIsDatePickerOpen(false)}
                      />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {/* Time Picker Modal */}
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
                        onTimeChange={handleTimeChange} // Update the time state when changed
                        onCancel={handleCancel} // Close the modal without saving (Cancel button)
                        onAccept={handleAccept} // Save and close the modal (OK button)
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
          </div>

          <div className="flex    gap-4">
            <div className="flex mt-4 mb-2  gap-2">
              <div
                onClick={() => {
                  setIsLinkModalOpen(true);
                }}
                className={`h-8 w-8 rounded-full items-center text-center  border cursor-pointer hover:shadow-white shadow-sm  bg-[#282D32] ${links.filter((link) => link).length > 0
                  ? "border-[#815BF5]"
                  : ""
                  }`}
              >
                <Link className="h-5 text-center m-auto mt-1" />
              </div>
              {links.filter((link) => link).length > 0 && (
                <span className="text-xs mt-2 text">
                  {links.filter((link) => link).length} Links
                </span> // Display the count of non-empty links
              )}
            </div>

            <div className="flex mt-4 gap-2">
              <div
                onClick={() => {
                  setIsAttachmentModalOpen(true);
                }}
                className={`h-8 w-8 rounded-full items-center text-center border cursor-pointer hover:shadow-white shadow-sm bg-[#282D32] ${files.length > 0 ? "border-[#815BF5]" : ""
                  }`}
              >
                <Paperclip className="h-5 text-center m-auto mt-1" />
              </div>
              {files.length > 0 && (
                <span className="text-xs mt-2 text">
                  {files.length} Attachments
                </span> // Display the count
              )}
            </div>

            <div className="flex gap-4">
              <div className="flex mt-4 mb-2 gap-2">
                <div
                  onClick={() => {
                    setIsReminderModalOpen(true);
                  }}
                  className={`h-8 w-8 rounded-full items-center text-center border cursor-pointer hover:shadow-white shadow-sm bg-[#282D32] ${reminders.length > 0 ? "border-[#815BF5]" : ""}`}
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
            {recording ? (
              <div
                onClick={stopRecording}
                className="h-8 mt-4 w-8 rounded-full items-center text-center  border cursor-pointer hover:shadow-white shadow-sm   bg-red-500"
              >
                <Mic className="h-5 text-center  m-auto mt-1" />
              </div>
            ) : (
              <div
                onClick={startRecording}
                className="h-8 mt-4 w-8 rounded-full items-center text-center  border cursor-pointer hover:shadow-white shadow-sm  bg-[#282D32]"
              >
                <Mic className="h-5 text-center m-auto mt-1" />
              </div>
            )}
          </div>
          <div
            className={` ${recording ? `w-full ` : "hidden"
              } border rounded border-dashed border-[#815BF5] px-4 py-2  bg-black flex justify-center`}
          >
            <canvas
              ref={canvasRef}
              className={` ${recording ? `w-full h-12` : "hidden"} `}
            ></canvas>
            {recording && (
              <div className="flex justify-center items-center">
                <Button
                  type="button"
                  onClick={stopRecording} // Call the stopRecording function when clicked
                  className="bg- flex gap-2 border hover:bg-gray-400 bg-gray-300 text-black px-4 py-2 rounded ml-4"
                >
                  <StopIcon className=" bg-red-500 text-red-500 h-3 w-3" /> Stop
                </Button>
              </div>
            )}
          </div>
          <div className="mb-2">
            {audioBlob && (
              <CustomAudioPlayer
                audioBlob={audioBlob}
                setAudioBlob={setAudioBlob}
              />
            )}
          </div>
          <div className=""></div>
          <div className="flex items-center   justify-end space-x-4">
            <Switch
              id="assign-more-tasks"
              className="scale-125  "
              checked={assignMoreTasks}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="assign-more-tasks ">Assign More Tasks</Label>
          </div>
          <Dialog open={isLinkModalOpen} onOpenChange={setIsLinkModalOpen}>
            <DialogContent className="z-[100] p-6">
              <div className="flex justify-between">
                <DialogTitle>Add Links</DialogTitle>
                <DialogClose>
                  <CrossCircledIcon
                    className="scale-150  cursor-pointer hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]"
                  />
                </DialogClose>
              </div>
              <DialogDescription>Attach Links to the Task.</DialogDescription>
              <div className="mb-4">
                {/* <Label className="block font-semibold mb-2">Links</Label> */}
                {linkInputs.map((link, index) => (
                  <div key={index} className="flex gap-2 items-center mb-2">
                    <input
                      type="text"
                      value={link}
                      onChange={(e) =>
                        handleLinkInputChange(index, e.target.value)
                      }
                      className="w-full outline-none focus-within:border-[#815BF5] border-[#505356] bg-transparent border rounded px-3 py-2 mr-2"
                    />
                    <Button
                      type="button"
                      onClick={() => removeLinkInputField(index)}
                      className=" text-white bg-transparent hover:bg-transparent rounded"
                    >
                      <Trash2 className="text-red-500 hover:text-red-800" />
                    </Button>
                  </div>
                ))}

                <div className="w-full flex justify-between mt-6">
                  <Button
                    type="button"
                    onClick={addLinkField}
                    className="bg-transparent border border-[#505356] text-white hover:bg-[#815BF5] px-4 py-2 flex gap-2 rounded"
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
                    className="scale-150  cursor-pointer hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]"
                  />
                </DialogClose>
              </div>
              <DialogDescription>
                Add Attachments to the Task.
              </DialogDescription>
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
                {files.length > 0 && (
                  <ul className="list-disc list-inside">
                    {files.map((file, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center"
                      >
                        {file.name}
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-500 ml-2 focus:outline-none"
                        >
                          <FaTimes className="h-4 w-4" /> {/* Cross icon */}
                        </button>
                      </li>
                    ))}
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

          {/* Add Reminder Module  */}

          <motion.div
            className="bg-[#0B0D29] z-[100]  overflow-y-scroll scrollbar-hide max-h-screen text-[#D0D3D3] w-[50%] rounded-lg "
            variants={modalVariants}
            initial="hidden"
            animate={controls}
          >
            <Dialog
              open={isReminderModalOpen}
              onOpenChange={openReminderModal}
            >
              <DialogContent className="max-w-lg mx-auto z-[100] p-6">
                <div className="flex justify-between items-center ">
                  <div className="flex items-center gap-2">
                    <AlarmClock className="h-6 w-6" />
                    <DialogTitle>Add Task Reminders</DialogTitle>
                  </div>
                  <DialogClose>
                    <CrossCircledIcon
                      className="scale-150  cursor-pointer hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]"
                    />
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
                      className=" p-2 w-24 focus-within:border-[#815BF5] border bg-transparent outline-none  bg-[#1A1C20] rounded h-full"
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
                      className="bg-[#017A5B] hover:bg-[#15624f] rounded-full h-10 w-10 flex items-center justify-center"
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
                            <button className="p-2" onClick={() => removeReminder(index)}>
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
                    className="bg-[#017A5B]  hover:bg-[#15624f] text-white"
                  >
                    Save Reminders
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>

          <Dialog
            open={isRecordingModalOpen}
            onOpenChange={setIsRecordingModalOpen}
          >
            <DialogContent className="z-[100]">
              <div className="flex justify-between w-full">
                <DialogTitle>Attach a Recording</DialogTitle>
                <DialogClose>

                </DialogClose>
              </div>
              <DialogDescription>Add Recordings to the Task.</DialogDescription>

              {/* <div className="mb-4">
                                <Label className="block font-semibold mb-2">Attachments</Label>
                                <Input type='file' />
                                <Button type="button" className="bg-blue-500 mt-2 text-white px-4 py-2 rounded">Add Link</Button>
                            </div> */}
            </DialogContent>
          </Dialog>
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleAssignTask}
              className="bg-[#815BF5] hover:bg-[#5f31e9]  selection:-500 text-white px-4 py-2 w-full mt-2 mb-2 rounded"
            >
              {" "}
              {loading ? <Loader /> : "Assign Task "}
            </Button>
            {/* <Button type="button" onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded ml-2">Cancel</Button> */}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default TaskModal;

interface CustomDaysSelectProps {
  options: number[];
  selectedOptions: number[];
  setSelectedOptions: (selectedOptions: number[]) => void;
}
const CustomDaysSelect: React.FC<CustomDaysSelectProps> = ({
  options,
  selectedOptions,
  setSelectedOptions,
}) => {
  const handleChange = (selected: any) => {
    setSelectedOptions(
      selected ? selected.map((option: any) => option.value) : []
    );
  };

  const formattedOptions = options.map((option) => ({
    value: option,
    label: option,
  }));

  const customStyles: StylesConfig = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#282D32", // Custom background color for the control
      color: "white", // Custom text color
      border: 0,
      boxShadow: "none", // Remove focus outline
      ":hover": {
        borderColor: "#815BF5", // Custom border color on hover
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#282D32", // Custom background color for the menu
      color: "white", // Custom text color
      border: 0,
      outline: "none",
      boxShadow: "none", // Remove focus outline
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#FC8929"
        : state.isFocused
          ? "#815BF5"
          : "#282D32", // Custom background color for options
      color: "white", // Custom text color
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#815BF5", // Custom background color for selected values
      color: "white", // Custom text color
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "white", // Custom text color for selected values
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "white", // Custom text color for remove icon
      ":hover": {
        backgroundColor: "#815BF5", // Custom background color for remove icon hover state
        color: "white",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "white", // Custom text color for placeholder
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white", // Custom text color for single value
    }),
  };

  return (
    <Select
      isMulti
      options={formattedOptions}
      value={formattedOptions.filter((option) =>
        selectedOptions.includes(option.value)
      )}
      onChange={handleChange}
      placeholder="Select Days"
      className="w-full border rounded"
      styles={customStyles} // Apply custom styles
    />
  );
};

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  profilePic: string;
  email: string;
}

interface UserSelectPopupProps {
  users: User[];
  assignedUser: string;
  setAssignedUser: (userId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  closeOnSelectUser: (userName: string) => void;
  onClose: () => void;
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={popupRef}
      className="absolute bg-[#0B0D29]  text-white border mt-10 border-gray-700 rounded shadow-md p-4 w-[45%] z-50"
    >
      <input
        placeholder="Search user"
        className="h-8 text-xs px-4 focus:border-[#815bf5] text-white w-full bg-[#292d33] gray-600 border rounded outline-none mb-2"
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

                        <h1 className="text-sm">
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
  setCategories: Dispatch<SetStateAction<Category[]>>;
  closeOnSelect: (selectedValue: any) => void;
  onClose: () => void;
  role: string;
}

const CategorySelectPopup: React.FC<CategorySelectPopupProps> = ({
  categories,
  category,
  setCategory,
  searchCategoryQuery,
  newCategory,
  setNewCategory,
  setCategories,
  setSearchCategoryQuery,
  onClose,
  closeOnSelect,
  role,
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

  const handleCreateCategory = async () => {
    if (!newCategory) return;
    try {
      const response = await axios.post("/api/category/create", {
        name: newCategory,
      });
      if (response.status === 200) {
        // Add the new category to the categories list
        setCategories([...categories, response.data.data]);
        // Clear the new category input
        setNewCategory("");
        toast.success("Category Created Successfully!");
      } else {
        console.error("Error creating category:", response.data.error);
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={popupRef}
      className="absolute bg-[#0B0D29] text-black border mt-2 rounded shadow-md p-4 w-[45%] z-50"
    >
      <input
        placeholder=" Search Categories"
        className="h-8 text-xs px-4 text-white focus:border-[#815bf5] w-full bg-[#282D32] -800 border rounded outline-none mb-2"
        value={searchCategoryQuery}
        onChange={(e) => setSearchCategoryQuery(e.target.value)}
      />
      <div>
        {categories.length === 0 ? (
          <div className="text-white p-2">No categories found</div>
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
        {role === "orgAdmin" && (
          <div className="flex justify-center mt-4">
            {/* <Label>Add a New Category</Label> */}
            {/* <Input
                                type="text"
                                placeholder="New Category"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className="w-full text-black border rounded px-3 py-2"
                            /> */}

            <div className="mt-4 flex justify-between">
              <input
                placeholder="Create Category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="px-4 outline-none focus:border-[#815bf5] py-2 border text-white rounded w-full"
              />

              <div
                onClick={handleCreateCategory}
                className="bg-[#007A5A] hover:bg-[#15624f] p-2  cursor-pointer rounded-full ml-4"
              >
                <Plus className="text-white" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

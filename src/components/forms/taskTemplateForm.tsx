"use client";

import React, { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import { motion, useAnimation } from "framer-motion";
import { CrossCircledIcon, StopIcon } from "@radix-ui/react-icons";
import { FaTimes, FaUpload } from "react-icons/fa";
import { parse, format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import {
  Paperclip,
  Link as LinkIcon,
  Mic,
  Clock,
  User,
  Tag,
  Calendar,
  Plus,
  X,
  Trash2,
} from "lucide-react";

import Select from "react-select";
// shadcn/ui examples
import {
  Select as ShadcnSelect,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";



import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import CustomDatePicker from "../globals/date-picker";
import CustomTimePicker from "../globals/time-picker";
import { toast } from "sonner";
import DaysSelectModal from "../modals/DaysSelect";
import CustomAudioPlayer from "../globals/customAudioPlayer";
import { StylesConfig } from "react-select";
import { Avatar, AvatarFallback } from "../ui/avatar";
import axios from "axios";
import { Tabs3, TabsList3, TabsTrigger3 } from "../ui/tabs3";

interface Template {
  _id: string;
  title?: string;
  description?: string;
  category?: { _id: string; name: string };
  priority?: string;
  repeat?: boolean;
  repeatType?: string;
  days?: string[];
}


// Example variants for the motion container
const modalVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  profilePic: string;
  email: string;
}

interface Category {
  _id: string;
  name: string;
}

interface ITaskTemplateDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  existingTemplate?: Template | null;
  onSuccess?: () => void;  // <-- new callback
}

/**
 * A dialog nearly identical to your “Assign New Task” form,
 * but will create a Task Template instead of a Task.
 */
export default function TaskTemplateDialog({ open, setOpen, existingTemplate, onSuccess }: ITaskTemplateDialogProps) {
  const controls = useAnimation();

  // Are we editing an existing template?
  const isEditMode = !!existingTemplate?._id;

  // -------------------------
  // All state hooks mirroring your existing fields:
  // -------------------------
  const [title, setTitle] = useState(existingTemplate?.title || "");
  const [description, setDescription] = useState(existingTemplate?.description || "");
  const [assignedUser, setAssignedUser] = useState<string>("");

  const [priority, setPriority] = useState<"High" | "Medium" | "Low">(
    (existingTemplate?.priority as "High" | "Medium" | "Low") || "Low"
  );


  const [repeat, setRepeat] = useState(false);
  const [repeatType, setRepeatType] = useState("");
  const [repeatInterval, setRepeatInterval] = useState<number>(1);
  const [days, setDays] = useState<string[]>([]);
  const [repeatMonthlyDays, setRepeatMonthlyDays] = useState<number[]>([]);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [dueTime, setDueTime] = useState<string>("");

  // S3-related states
  const [files, setFiles] = useState<File[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  // Link states
  const [links, setLinks] = useState<string[]>([]);
  const [linkInputs, setLinkInputs] = useState<string[]>([]);

  // Reminders
  const [reminders, setReminders] = useState<any[]>([]);
  const [tempReminders, setTempReminders] = useState<any[]>([]);
  const [reminderType, setReminderType] = useState<"email" | "whatsapp">("email");
  const [reminderValue, setReminderValue] = useState<number>(0);
  const [timeUnit, setTimeUnit] = useState<"minutes" | "hours" | "days">("minutes");

  // Toggles/Popups
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

  // Additional UI states
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // For "create more templates" toggle
  const [createMoreTemplates, setCreateMoreTemplates] = useState(false);

  const [category, setCategory] = useState<string>(
    typeof existingTemplate?.category === "string" ? existingTemplate.category : ""
  );
  const [categories, setCategories] = useState<Category[]>([]);

  // Users
  const [users, setUsers] = useState<User[]>([]);

  // Searching states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategoryQuery, setSearchCategoryQuery] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [role, setRole] = useState("orgAdmin"); // or whatever role from your context

  // If using popups for user/category
  const [openUserSelect, setOpenUserSelect] = useState(false);
  const [openCategorySelect, setOpenCategorySelect] = useState(false);

  const [popoverCategoryInputValue, setPopoverCategoryInputValue] =
    useState<string>(""); // State for input value in popover

    // Add these references at the top of your functional component
const analyserRef = useRef<AnalyserNode | null>(null);
const mediaRecorderRef = useRef<MediaRecorder | null>(null);
const intervalRef = useRef<number | null>(null);
const [recordingTime, setRecordingTime] = useState(0);
const [audioURL, setAudioURL] = useState("");

// Update the startRecording function to include waveform visualization
async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
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
        setAudioURL(audioURL);
      }
    };

    mediaRecorder.onstop = () => {
      setRecording(false);
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setRecordingTime(0);
    };

    mediaRecorder.start();
    setRecording(true);

    // Start timer
    intervalRef.current = window.setInterval(() => {
      setRecordingTime((prevTime) => prevTime + 1);
    }, 1000);

    // Real-time waveform visualization
    const canvas = canvasRef.current;
    if (canvas) {
      const canvasCtx = canvas.getContext('2d');
      if (canvasCtx) {
        const drawWaveform = () => {
          if (analyserRef.current) {
            requestAnimationFrame(drawWaveform);
            analyserRef.current.getByteFrequencyData(dataArray);

            // Clear the canvas before rendering bars
            canvasCtx.fillStyle = "rgb(255, 255, 255)";
            canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

            const bars = 40;
            const barWidth = 2;
            const totalBarWidth = bars * barWidth;
            const gapWidth = (canvas.width - totalBarWidth) / (bars - 1);
            const step = Math.floor(bufferLength / bars);

            for (let i = 0; i < bars; i++) {
              const barHeight = (dataArray[i * step] / 255) * canvas.height * 0.8;
              const x = i * (barWidth + gapWidth);
              const y = (canvas.height - barHeight) / 2;

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
}

// Update the stopRecording function
function stopRecording() {
  if (mediaRecorderRef.current) {
    mediaRecorderRef.current.stop();
    // Stop all tracks of the media stream to release the microphone
    if (mediaRecorderRef.current.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  }
  setRecording(false);
}

  // WATCH FOR CHANGES TO existingTemplate
  useEffect(() => {
    if (existingTemplate) {
      // Edit mode => prefill
      setTitle(existingTemplate.title || "");
      setDescription(existingTemplate.description || "");
      setPriority((existingTemplate.priority as "High" | "Medium" | "Low") || "Low");

      if (typeof existingTemplate.category === "string") {
        setCategory(existingTemplate.category);
      } else if (existingTemplate.category?._id) {
        setCategory(existingTemplate.category._id);
      }
      // etc. for all other fields
    } else {
      // Create mode => clear
      setTitle("");
      setDescription("");
      setPriority("Low");
      setCategory("");
      // etc...
    }
  }, [existingTemplate]);

  // -------------------------
  // Fetch Users & Categories from the server
  // -------------------------
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

  useEffect(() => {
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

  // For user popup
  function handleOpenUserSelect() {
    setOpenUserSelect(true);
  }
  function handleCloseUserSelect() {
    setOpenUserSelect(false);
  }

  // For category popup
  function handleOpenCategorySelect() {
    setOpenCategorySelect(true);
  }
  function handleCloseCategorySelect() {
    setOpenCategorySelect(false);
  }

  const handleCategoryClose = (selectedValue: any) => {
    setPopoverCategoryInputValue(selectedValue);
    setOpenCategorySelect(false);
  };


  function handleCheckboxChange(checked: boolean) {
    setCreateMoreTemplates(checked);
  }

  // -------------------------
  // Priority Selection via Buttons
  // -------------------------
  function handlePrioritySelect(value: "High" | "Medium" | "Low") {
    setPriority(value);
  }

  // -------------------------
  // Repeat logic (days, monthly, etc.)
  // -------------------------
  function handleDaysChange(day: string) {
    if (days.includes(day)) {
      setDays(days.filter((d) => d !== day));
    } else {
      setDays([...days, day]);
    }
  }

  // -------------------------
  // Date/Time pickers
  // -------------------------
  function handleOpenDatePicker() {
    setIsDatePickerOpen(true);
  }
  function handleDateChange(selected: Date) {
    setDueDate(selected);
    // Close date picker and open time picker
    setIsDatePickerOpen(false);
    setIsTimePickerOpen(true);
  }
  function handleTimeChange(timeString: string) {
    setDueTime(timeString);
  }
  function handleCancel() {
    setIsTimePickerOpen(false);
  }
  function handleAccept() {
    setIsTimePickerOpen(false);
  }

  // -------------------------
  // File Attachments
  // -------------------------
  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  }
  function removeFile(index: number) {
    setFiles(files.filter((_, i) => i !== index));
  }

  // -------------------------
  // Link Management
  // -------------------------
  function addLinkField() {
    setLinkInputs([...linkInputs, ""]);
  }
  function handleLinkInputChange(index: number, value: string) {
    const newLinks = [...linkInputs];
    newLinks[index] = value;
    setLinkInputs(newLinks);
  }
  function removeLinkInputField(index: number) {
    setLinkInputs(linkInputs.filter((_, i) => i !== index));
  }
  function handleSaveLinks() {
    const filteredLinks = linkInputs.filter((link) => link.trim() !== "");
    setLinks([...links, ...filteredLinks]);
    setLinkInputs([]);
    setIsLinkModalOpen(false);
  }

  // -------------------------
  // Reminders
  // -------------------------
  function addReminder() {
    if (reminderValue === 0) {
      toast.error("Reminder value must be greater than 0");
      return;
    }
    const newReminder = {
      notificationType: reminderType,
      type: timeUnit,
      value: reminderValue,
    };
    // Check duplicates
    const isDuplicate = tempReminders.some(
      (r) =>
        r.notificationType === newReminder.notificationType &&
        r.type === newReminder.type &&
        r.value === newReminder.value
    );
    if (isDuplicate) {
      toast.error("Duplicate reminders are not allowed");
      return;
    }
    setTempReminders([...tempReminders, newReminder]);
  }
  function removeReminder(index: number) {
    const updatedReminders = [...tempReminders];
    updatedReminders.splice(index, 1);
    setTempReminders(updatedReminders);
  }
  function handleSaveReminders() {
    setReminders(tempReminders);
    setIsReminderModalOpen(false);
  }
  function openReminderModal(open: boolean) {
    setIsReminderModalOpen(open);
  }

  // -------------------------
  // Audio Recording
  // -------------------------
  // async function startRecording() {
  //   setRecording(true);
  // }
  // function stopRecording() {
  //   setRecording(false);
  // }

  // -------------------------
  // CREATE TEMPLATE
  // -------------------------
  async function handleCreateOrEditTemplate(e: React.FormEvent) {
    e.preventDefault();


    setLoading(true);

    let fileUrls: string[] = [];
    let uploadedAudioUrl: string | null = null;

    // Upload to S3 if needed
    if ((files && files.length > 0) || audioBlob) {
      const formData = new FormData();
      if (files) {
        files.forEach((file) => formData.append("files", file));
      }
      if (audioBlob) {
        formData.append("audio", audioBlob, "audio.wav");
      }

      try {
        const s3Response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (s3Response.ok) {
          const s3Data = await s3Response.json();
          fileUrls = s3Data.fileUrls || [];
          uploadedAudioUrl = s3Data.audioUrl || null;
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

    // Build the template data object
    const templateData = {
      title,
      description,
      assignedUser,
      category,
      priority,
      repeat,
      repeatType: repeat ? repeatType : undefined,
      repeatInterval,
      days: repeat ? days : [],
      dates: repeatMonthlyDays,
      dueDate: dueDate ? dueDate.toISOString() : null,
      attachment: fileUrls,
      audioUrl: uploadedAudioUrl,
      links,
      reminders,
    };

    try {
      if (isEditMode && existingTemplate?._id) {
        // If we are editing an existing template
        const res = await fetch(`/api/taskTemplates/${existingTemplate._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(templateData),
        });
        const result = await res.json();
        if (!res.ok) {
          toast.error(result.error || "Failed to update template");
          return;
        }
        toast.success("Template updated successfully!");
      } else {
        // Create new
        const res = await fetch("/api/taskTemplates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(templateData),
        });
        const result = await res.json();
        if (!res.ok) {
          toast.error(result.error || "Failed to create template");
          return;
        }
        toast.success("Template created successfully!");
      }

      setOpen(false);
      // 1) Trigger the parent’s fetch
      if (onSuccess) {
        onSuccess();
      }
      // Optional: refresh or clear states
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "An error occurred");
    }
  }
  // -------------------------
  // Helper to clear form
  // -------------------------
  function clearFormFields() {
    setTitle("");
    setDescription("");
    setAssignedUser("");
    setCategory("");
    setPriority("Low");
    setRepeat(false);
    setRepeatType("");
    setDays([]);
    setRepeatMonthlyDays([]);
    setDueDate(null);
    setDueTime("");
    setFiles([]);
    setAudioBlob(null);
    setLinks([]);
    setReminders([]);
    setTempReminders([]);
  }

  // Animate in/out
  useEffect(() => {
    if (open) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [open, controls]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="dark:bg-[#0B0D29] bg-white z-[100] h-fit  max-h-screen overflow-y-scroll m-auto scrollbar-hide text-[#000000] border dark:text-[#D0D3D3] rounded-lg">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-3 border-b w-full">
          <h2 className=" dark:font-bold">
            {isEditMode ? "Edit Template" : "Create New Template"}
          </h2>
          <CrossCircledIcon
            onClick={() => setOpen(false)}
            className="scale-150 cursor-pointer hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]"
          />
        </div>

        <form
          onSubmit={handleCreateOrEditTemplate}
          className="text-sm space-y-2  px-8 pb-4  scrollbar-hide h-fit"
        >
          {/* Title */}
          <div className="grid grid-cols-1 gap-2">
            <div className="relative">
              <h1 className="block absolute dark:bg-[#0B0D29] bg-white text-gray-500 px-1 ml-2 -mt-1 dark:text-muted-foreground text-[12px] ">
                Title
              </h1>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs outline-none focus-within:border-[#815BF5] bg-transparent border  dark:border-border mt-1 rounded px-3 py-2"
              />
            </div>
            {/* Description */}
            <div className="mt-1 relative">
              <h1 className="block absolute dark:bg-[#0B0D29] bg-white text-gray-500 px-1 ml-2 -mt-1 dark:text-muted-foreground text-[12px] ">
                Description
              </h1>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-xs w-full focus-within:border-[#815BF5] outline-none bg-transparent border dark:border-border mt-1 rounded px-3 py-3"
              />
            </div>
          </div>

          {/* Assigned User */}
          <div className="grid grid-cols-1 gap-4">
            {/* Category */}
            <div className="mb-2">
              <button
                type="button"
                className="p-2 text-xs flex border items-center dark:border-border bg-transparent justify-between w-full text-start rounded"
                onClick={handleOpenCategorySelect}
              >
                {popoverCategoryInputValue ? (
                  popoverCategoryInputValue
                ) : (
                  <h1 className="flex gap-2">
                    <Tag className="h-4" /> Select Category
                  </h1>
                )}
              </button>

              {openCategorySelect && (
                <CategorySelectPopup
                  categories={categories}
                  category={category}
                  setCategory={setCategory}
                  newCategory={newCategory}
                  setCategories={setCategories}
                  setNewCategory={setNewCategory}
                  searchCategoryQuery={searchCategoryQuery}
                  setSearchCategoryQuery={setSearchCategoryQuery}
                  onClose={handleCloseCategorySelect}
                  closeOnSelect={handleCategoryClose}
                  role={role}
                />
              )}
            </div>
          </div>

          {/* Priority - now as button group */}
          <div className=" flex itrc justify-between">
            <div className="mb-2  justify-between border dark:border-border  rounded-md h-14 items-center flex gap-4 mta w-full">
              <div className=" gap-6 flex justify-between h-fit  items-center p-4 w-full ">
                <div className="flex g   text-xs dark:text-white dark:font-bold">
                  {/* <FlagIcon className='h-5' /> */}
                  Priority
                </div>
                <div className=" rounded-lg w-full ">
                  <Tabs3 value={priority} onValueChange={(val) => setPriority(val as "High" | "Medium" | "Low")}>
                    <TabsList3 className="rounded-lg text- flex  dark:border-border border w-fit">

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


          {/* Repeat */}
          <div className="flex mb-2 py-2 items-center">
            <div className="w-1/2 flex">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="repeat"
                  checked={repeat}
                  onCheckedChange={(checked) => setRepeat(Boolean(checked))}
                  className="mr-2"
                />
                <Label
                  htmlFor="repeat"
                  className=" dark:text-white text-xs"
                >
                  Repeat
                </Label>
              </div>

              {repeat && (
                <div className="ml-4">
                  {/* The repeat type select */}
                  <ShadcnSelect value={repeatType} onValueChange={setRepeatType}>
                    <SelectTrigger className="w-48 dark:bg-[#292d33] border text-xs rounded px-3 py-1 outline-none">
                      <SelectValue placeholder="Select Repeat Type" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-[#292d33] z-[100] text-xs border">
                      <SelectItem className="hover:bg-accent" value="Daily">Daily</SelectItem>
                      <SelectItem className="hover:bg-accent" value="Weekly">Weekly</SelectItem>
                      <SelectItem className="hover:bg-accent" value="Monthly">Monthly</SelectItem>
                      <SelectItem className="hover:bg-accent" value="Yearly">Yearly</SelectItem>
                      <SelectItem className="hover:bg-accent" value="Periodically">Periodically</SelectItem>
                    </SelectContent>
                  </ShadcnSelect>
                </div>
              )}

              {repeat && repeatType === "Periodically" && (
                <div className="ml-4">
                  <input
                    type="number"
                    id="repeatInterval"
                    value={repeatInterval}
                    onChange={(e) => setRepeatInterval(Number(e.target.value))}
                    className="w-32 dark:bg-[#292d33]  border text-xs outline-none rounded px-3 py-2"
                    placeholder="Enter interval in days"
                    min={1}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Weekly Repeat */}
          {repeat && repeatType === "Weekly" && (
            <div className="mb-4 p-2">
              <Label className="block dark:font-semibold mb-2">Select Days</Label>
              <div className="grid grid-cols-7 p-2 rounded">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                  (day) => (
                    <div key={day} className="flex gap-2 cursor-pointer items-center">
                      <button
                        type="button"
                        onClick={() => handleDaysChange(day)}
                        className={`px-2 py-1 rounded
                          ${days.includes(day)
                            ? "bg-[#815BF5] text-white"
                            : "bg-transparent border border-gray-400 text-xs text-gray-600 dark:text-white"
                          }`}
                      >
                        {day.slice(0, 1)}
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Monthly Repeat */}
          {repeat && repeatType === "Monthly" && (
            <DaysSelectModal
              isOpen={false} // your own state if needed
              onOpenChange={() => null}
              selectedDays={repeatMonthlyDays}
              setSelectedDays={setRepeatMonthlyDays}
            />
          )}

          {/* Due Date/Time */}


          {/* Attachments, Links, Reminders, Recording */}
          <div className="flex gap-4">
            {/* Links */}
            <div className="flex mt-4 mb-2 gap-2">
              <div
                onClick={() => setIsLinkModalOpen(true)}
                className={`h-8 w-8 rounded-full items-center text-center border cursor-pointer hover:shadow-white shadow-sm bg-primary dark:bg-[#282D32] ${links.filter((link) => link).length > 0 ? "border-[#815BF5]" : ""
                  }`}
              >
                <LinkIcon className="h-5 text-center text-white m-auto mt-1" />
              </div>
              {links.filter((link) => link).length > 0 && (
                <span className="text-xs mt-2">{links.length} Links</span>
              )}
            </div>

            {/* Attachments */}
            <div className="flex mt-4 gap-2">
              <div
                onClick={() => setIsAttachmentModalOpen(true)}
                className={`h-8 w-8 rounded-full items-center text-center border cursor-pointer hover:shadow-white shadow-sm bg-primary dark:bg-[#282D32] ${files.length > 0 ? "border-[#815BF5]" : ""
                  }`}
              >
                <Paperclip className="h-5 text-white text-center m-auto mt-1" />
              </div>
              {files.length > 0 && (
                <span className="text-xs mt-2">{files.length} Attachments</span>
              )}
            </div>

            {/* Reminders */}
            <div className="flex gap-4">
              <div className="flex mt-4 mb-2 gap-2">
                <div
                  onClick={() => setIsReminderModalOpen(true)}
                  className={`h-8 w-8 rounded-full items-center text-center border cursor-pointer hover:shadow-white shadow-sm bg-primary dark:bg-[#282D32] ${reminders.length > 0 ? "border-[#815BF5]" : ""
                    }`}
                >
                  <Clock className="h-5 text-white text-center m-auto mt-1" />
                </div>
                {reminders.length > 0 && (
                  <span className="text-xs mt-2">{reminders.length} Reminders</span>
                )}
              </div>
            </div>

            {/* Recording */}
            {recording ? (
              <div
                onClick={stopRecording}
                className="h-8 mt-4 w-8 rounded-full items-center text-center border cursor-pointer hover:shadow-white shadow-sm bg-red-500"
              >
                <Mic className="h-5 text-white text-center m-auto mt-1" />
              </div>
            ) : (
              <div
                onClick={startRecording}
                className="h-8 mt-4 w-8 rounded-full items-center text-center border cursor-pointer hover:shadow-white shadow-sm bg-primary dark:bg-[#282D32]"
              >
                <Mic className="h-5 text-center text-white m-auto mt-1" />
              </div>
            )}
          </div>

          {/* Canvas for recording visualization */}
          <div
            className={`${recording ? `w-full` : "hidden"
              } border rounded border-dashed border-[#815BF5] px-4 py-2 bg-white dark:bg-white flex justify-center`}
          >
            <canvas
              ref={canvasRef}
              className={`${recording ? `w-full h-12` : "hidden"}`}
            ></canvas>
            {recording && (
              <div className="flex justify-center items-center">
                <Button
                  type="button"
                  onClick={stopRecording}
                  className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded ml-4 flex gap-2 border"
                >
                  <StopIcon className="bg-red-500 text-red-500 h-3 w-3" />
                  Stop
                </Button>
              </div>
            )}
          </div>

          {/* Audio Playback */}
          <div className="mb-2">
            {audioBlob && (
              <CustomAudioPlayer audioBlob={audioBlob} setAudioBlob={setAudioBlob} />
            )}
          </div>

          {/* "Create More Templates" toggle */}
          {/* <div className="flex items-center justify-end space-x-4">
            <Switch
              id="create-more-templates"
              className="scale-125"
              checked={createMoreTemplates}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="create-more-templates" className="dark:text-white">
              Create More Templates
            </Label>
          </div> */}

          {/* Link Modal */}
          <Dialog open={isLinkModalOpen} onOpenChange={setIsLinkModalOpen}>
            <DialogContent className="z-[100] p-6">
              <div className="flex justify-between">
                <DialogTitle>Add Links</DialogTitle>
                <DialogClose>
                  <CrossCircledIcon className="scale-150 cursor-pointer hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]" />
                </DialogClose>
              </div>
              <DialogDescription>Attach Links to the Template.</DialogDescription>
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
                    onClick={addLinkField}
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

          {/* Attachment Modal */}
          <Dialog
            open={isAttachmentModalOpen}
            onOpenChange={setIsAttachmentModalOpen}
          >
            <DialogContent className="z-[100] p-6">
              <div className="flex w-full justify-between">
                <DialogTitle>Add an Attachment</DialogTitle>
                <DialogClose>
                  <CrossCircledIcon className="scale-150 cursor-pointer hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]" />
                </DialogClose>
              </div>
              <DialogDescription>Add Attachments to the Template.</DialogDescription>
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
                          <FaTimes className="h-4 w-4" />
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

          {/* Reminders Modal */}
          <Dialog open={isReminderModalOpen} onOpenChange={openReminderModal}>
            <DialogContent className="max-w-lg mx-auto z-[100] p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock className="h-6 w-6" />
                  <DialogTitle>Add Template Reminders</DialogTitle>
                </div>
                <DialogClose>
                  <CrossCircledIcon className="scale-150 cursor-pointer hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]" />
                </DialogClose>
              </div>
              <Separator />
              <div>
                {/* Input fields for new reminder */}
                <div className="flex justify-center w-full gap-2 items-center mb-4">
                  <select
                    value={reminderType}
                    onChange={(e) =>
                      setReminderType(e.target.value as "email" | "whatsapp")
                    }
                    className="border bg-transparent outline-none p-2 dark:bg-[#1A1C20] rounded h-full"
                  >
                    <option className="dark:bg-[#1A1C20] " value="email">
                      Email
                    </option>
                    <option className="dark:bg-[#1A1C20] b" value="whatsapp">
                      WhatsApp
                    </option>
                  </select>

                  <input
                    type="number"
                    value={reminderValue}
                    onChange={(e) => setReminderValue(Number(e.target.value))}
                    className="p-2 w-24 focus-within:border-[#815BF5] border bg-transparent outline-none bg-[#1A1C20] rounded h-full"
                    placeholder="Enter value"
                  />

                  <select
                    value={timeUnit}
                    onChange={(e) =>
                      setTimeUnit(e.target.value as "minutes" | "hours" | "days")
                    }
                    className="p-2 outline-none dark:bg-[#1A1C20] bg-[#0a0c29] border bg-transparent rounded h-full"
                  >
                    <option className="dark:bg-[#1A1C20] bg-[#0a0c29]" value="minutes">
                      minutes
                    </option>
                    <option className="dark:bg-[#1A1C20] bg-[#0a0c29]" value="hours">
                      hours
                    </option>
                    <option className="dark:bg-[#1A1C20] bg-[#0a0c29]" value="days">
                      days
                    </option>
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
                      <div className="flex gap-4 my-2">
                        {/* Notification type */}
                        <select
                          value={reminder.notificationType}
                          onChange={(e) => {
                            const updatedType = e.target.value as
                              | "email"
                              | "whatsapp";
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
                            const updatedReminders = reminders.map((r, i) =>
                              i === index
                                ? { ...r, notificationType: updatedType }
                                : r
                            );
                            setReminders(updatedReminders);
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

                        {/* Reminder Value */}
                        <li className="p-2 w-12 border rounded h-full flex items-center">
                          <span>{reminder.value}</span>
                        </li>

                        {/* Time Unit */}
                        <select
                          value={reminder.type}
                          onChange={(e) => {
                            const updatedType = e.target.value as
                              | "minutes"
                              | "hours"
                              | "days";
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
                            const updatedReminders = reminders.map((r, i) =>
                              i === index ? { ...r, type: updatedType } : r
                            );
                            setReminders(updatedReminders);
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
                        <li>
                          <button
                            className="p-2"
                            onClick={() => removeReminder(index)}
                          >
                            <X className="cursor-pointer rounded-full text-red-500 flex items-center justify-center" />
                          </button>
                        </li>
                      </div>
                    </React.Fragment>
                  ))}
                </ul>
              </div>
              {/* Save Reminders */}
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

          {/* Create Template Button */}
          <div className="flex justify-end pb-2">
            <Button
              type="submit"
              className="bg-[#815BF5] hover:bg-[#5f31e9] text-white px-4 py-2 w-full mt-2 mb-2 rounded"
            >
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/*
  Below are your "popup" components for selecting users & categories.
  The only difference is: we pass in the `users` and `categories`
  that we fetched in useEffect above.
*/
interface UserSelectPopupProps {
  users: User[];
  assignedUser: string;
  setAssignedUser: (userId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  closeOnSelectUser: (userName: string) => void;
  onClose: () => void;
}

// ...
// (Keep your existing `UserSelectPopup` code as-is, just ensure
//  you pass in the `users` array from the parent.)

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

// ...
// (Keep your existing `CategorySelectPopup` code as-is, just ensure
//  you're using the `categories` from the parent.)




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
      className="absolute dark:bg-[#0B0D29] bg-white dark:text-white border mt-10 dark:border-gray-700 rounded shadow-md p-4 w-[45%] z-[100]"
    >
      <input
        placeholder="Search user"
        className="h-8 text-xs px-4 focus:border-[#815bf5] dark:text-white w-full dark:bg-[#292d33] gray-600 border border-gray-500 dark:border-border  rounded outline-none mb-2"
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
      className="absolute dark:bg-[#0B0D29] bg-white text-black dark:border-gray-700 dark:border-border border mt-2 rounded shadow-md p-4 w-[88%] z-[100]"
    >
      <input
        placeholder=" Search Categories"
        className="h-8 text-xs px-4  dark:text-white focus:border-[#815bf5] w-full dark:bg-[#282D32] -800 border-gray-500 dark:border-border  border rounded outline-none mb-2"
        value={searchCategoryQuery}
        onChange={(e) => setSearchCategoryQuery(e.target.value)}
      />
      <div>
        {categories.length === 0 ? (
          <div className="dark:text-white p-2">No categories found</div>
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
                <span className="px-4 dark:text-white text-black text-xs">{categorys.name}</span>

                {category === categorys._id && (
                  <input
                    type="radio"
                    name="category"
                    className="bg-primary w-full ml-64  "
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
                className="px-4 outline-none focus:border-[#815bf5] py-2 border dark:text-white rounded w-full"
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

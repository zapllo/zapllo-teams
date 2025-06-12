"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Calendar,
  FileText,
  Mic,
  Calendar as CalendarIcon,
  X,
  Info,
  PauseCircle,
  UploadCloud,
  Clock
} from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { useAnimation, motion } from "framer-motion";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

import CustomDatePicker from "../globals/date-picker";
import CustomAudioPlayer from "../globals/customAudioPlayer";
import Loader from "../ui/loader";

interface LeaveFormProps {
  leaveTypes: any[]; // Leave types passed as prop
  onClose: () => void; // Prop to close the modal
}

interface LeaveDay {
  date: string;
  unit:
  | "Full Day"
  | "1st Half"
  | "2nd Half"
  | "1st Quarter"
  | "2nd Quarter"
  | "3rd Quarter"
  | "4th Quarter";
}

interface LeaveFormData {
  leaveType: string;
  fromDate: string;
  toDate: string;
  leaveReason: string;
  leaveDays: LeaveDay[];
}

const unitMapping: Record<LeaveDay["unit"], number> = {
  "Full Day": 1,
  "1st Half": 0.5,
  "2nd Half": 0.5,
  "1st Quarter": 0.25,
  "2nd Quarter": 0.25,
  "3rd Quarter": 0.25,
  "4th Quarter": 0.25,
};

const MyLeaveForm: React.FC<LeaveFormProps> = ({ leaveTypes, onClose }) => {
  const [formData, setFormData] = useState<LeaveFormData>({
    leaveType: "",
    fromDate: "",
    toDate: "",
    leaveReason: "",
    leaveDays: [],
  });

  const [availableUnits, setAvailableUnits] = useState<LeaveDay["unit"][]>([]);
  const [allotedLeaves, setAllotedLeaves] = useState<number | null>(null);
  const [userLeaveBalance, setUserLeaveBalance] = useState<number | null>(null);
  const [userLeaveBalances, setUserLeaveBalances] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const audioURLRef = useRef<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [totalAppliedDays, setTotalAppliedDays] = useState<number>(0);
  const [isFromDatePickerOpen, setIsFromDatePickerOpen] = useState(false);
  const [isToDatePickerOpen, setIsToDatePickerOpen] = useState(false);
  const controls = useAnimation();
  const intervalRef = useRef<number | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showDateControls, setShowDateControls] = useState(false);

  useEffect(() => {
    controls.start("visible");

    // Fetch user data when component mounts
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/users/me");
        const user = response.data.data;
        if (user) {
          setUserLeaveBalances(user.leaveBalances);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [controls]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "leaveType" && value) {
      const selectedLeaveType = leaveTypes.find((type) => type._id === value);
      if (selectedLeaveType) {
        const selectedUnits = [];
        if (selectedLeaveType.unit.includes("Full Day"))
          selectedUnits.push("Full Day");
        if (selectedLeaveType.unit.includes("Half Day")) {
          selectedUnits.push("1st Half", "2nd Half");
        }
        if (selectedLeaveType.unit.includes("Short Leave")) {
          selectedUnits.push(
            "1st Quarter",
            "2nd Quarter",
            "3rd Quarter",
            "4th Quarter"
          );
        }
        setAvailableUnits(selectedUnits as LeaveDay["unit"][]);
        setAllotedLeaves(selectedLeaveType.allotedLeaves);

        const userLeaveBalanceForType = userLeaveBalances.find(
          (balance) => balance.leaveType === value
        );
        setUserLeaveBalance(
          userLeaveBalanceForType ? userLeaveBalanceForType.balance : null
        );

        // Show date controls after selecting leave type
        setShowDateControls(true);
      }
    }
  };

  const handleSelectChange = (value: string) => {
    handleInputChange({
      target: { name: "leaveType", value }
    } as React.ChangeEvent<HTMLSelectElement>);
  };

  const handleUnitChange = (date: string, newUnit: LeaveDay["unit"]) => {
    const updatedLeaveDays = formData.leaveDays.map((day) =>
      day.date === date ? { ...day, unit: newUnit } : day
    );
    setFormData((prevData) => ({ ...prevData, leaveDays: updatedLeaveDays }));
  };

  const calculateRequestedDays = () => {
    const { fromDate, toDate } = formData;
    if (fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  // Adjust the submit handler to match the original implementation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // First check for required fields and errors
    if (!formData.leaveType || formData.leaveDays.length === 0 || error) {
      return;
    }

    setLoading(true);

    // First, upload files (including audio) to /api/upload
    let fileUrls: string[] = [];
    let audioUrl: string | null = null;

    // Prepare the FormData object to hold the files and audio for upload
    const formDataToUpload = new FormData();

    if (files.length > 0) {
      files.forEach((file) => formDataToUpload.append("files", file)); // Add each file to the FormData
    }

    if (audioBlob) {
      formDataToUpload.append("audio", audioBlob, "audio.wav"); // Add the audio to the FormData
    }

    // If there are files or audio, make the API call to upload them
    if (files.length > 0 || audioBlob) {
      try {
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formDataToUpload,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          fileUrls = uploadData.fileUrls || []; // Array of uploaded file URLs
          audioUrl = uploadData.audioUrl || null; // Audio URL if present
        } else {
          console.error("Failed to upload files.");
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("Error uploading files:", error);
        setLoading(false);
        return;
      }
    }

    // Now that we have the file and audio URLs, submit the leave request to the database
    const leaveRequestData = {
      leaveType: formData.leaveType,
      fromDate: formData.fromDate,
      toDate: formData.toDate,
      leaveReason: formData.leaveReason,
      attachment: fileUrls, // List of file URLs
      audioUrl: audioUrl, // Audio URL (if available)
      leaveDays: formData.leaveDays,
    };

    try {
      const response = await fetch("/api/leaves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leaveRequestData),
      });

      if (response.ok) {
        const data = await response.json();
        toast(
          <div className="w-full mb-6 gap-2 m-auto">
            <div className="w-full flex justify-center">
              <DotLottieReact src="/lottie/tick.lottie" loop autoplay />
            </div>
            <h1 className="text-black dark:text-white text-center font-medium text-lg">
              Leave request submitted successfully
            </h1>
          </div>
        );
        console.log("Leave request submitted successfully:", data);
        onClose(); // Close the modal on successful submission
      } else {
        const errorData = await response.json();
        console.error("Failed to submit leave request:", errorData);
        toast.error(errorData.message || "Failed to submit leave request");
      }
    } catch (error) {
      console.error("Error submitting leave request:", error);
      toast.error("Error submitting leave request");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (formData.fromDate && formData.toDate) {
      const start = new Date(formData.fromDate);
      const end = new Date(formData.toDate);
      const dateArray: LeaveDay[] = [];

      while (start <= end) {
        const formattedDate = start.toISOString().split("T")[0];
        dateArray.push({ date: formattedDate, unit: "Full Day" });
        start.setDate(start.getDate() + 1);
      }

      setFormData((prevData) => ({ ...prevData, leaveDays: dateArray }));
    }
  }, [formData.fromDate, formData.toDate]);

  useEffect(() => {
    // Calculate and update total applied days whenever leaveDays change
    const totalDays = calculateTotalAppliedDays();
    setTotalAppliedDays(totalDays);

    // Check if the requested leave days exceed the user's balance
    if (userLeaveBalance !== null && totalDays > userLeaveBalance) {
      const exceededDays = totalDays - userLeaveBalance;
      setError(`Leave request exceeds balance by ${exceededDays} day(s)`);
    } else {
      setError(null);
    }
  }, [formData.leaveDays, userLeaveBalance]);

  // Handle file upload logic
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;

    if (selectedFiles && selectedFiles.length > 0) {
      const validFiles: File[] = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        validFiles.push(file);
      }

      if (validFiles.length > 0) {
        setFiles((prevFiles) => [...prevFiles, ...validFiles]);
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Handle audio recording logic
  const startRecording = async () => {
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
          audioURLRef.current = audioURL;
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
        const canvasCtx = canvas.getContext("2d");
        if (canvasCtx) {
          const drawWaveform = () => {
            if (analyserRef.current) {
              requestAnimationFrame(drawWaveform);
              analyserRef.current.getByteFrequencyData(dataArray);

              canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
              canvasCtx.fillStyle = "rgba(255, 255, 255, 0.1)";
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

                canvasCtx.fillStyle = "rgb(129, 91, 245)";
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
      toast.error("Could not access microphone");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    if (mediaRecorderRef.current?.stream) {
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  const calculateTotalAppliedDays = () => {
    let totalDays = 0;
    for (const leaveDay of formData.leaveDays) {
      totalDays += unitMapping[leaveDay.unit];
    }
    return totalDays;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getLeaveTypeName = (id: string) => {
    const leaveType = leaveTypes.find(type => type._id === id);
    return leaveType ? leaveType.leaveType : 'Select Leave Type';
  };

  return (
    <DialogContent className="p-6 h-fit max-h-screen  overflow-y-scroll">
      <DialogHeader>
        <DialogTitle className="text-xl flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Apply for Leave
        </DialogTitle>
        <DialogDescription>
          Fill out the form below to submit your leave request
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-5 mt-2 ">
        {/* Leave Type Selection */}
        <div className="space-y-2">
          <Label htmlFor="leaveType">Leave Type</Label>
          <Select
            value={formData.leaveType}
            onValueChange={handleSelectChange}
          >
            <SelectTrigger id="leaveType" className="w-full">
              <SelectValue placeholder="Select Leave Type" />
            </SelectTrigger>
            <SelectContent className="z-[100]">
              <SelectGroup>
                <SelectLabel>Available Leave Types</SelectLabel>
                {leaveTypes.map((type) => (
                  <SelectItem key={type._id} value={type._id}>
                    {type.leaveType}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Leave Balance Info */}
        {allotedLeaves !== null && userLeaveBalance !== null && (
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Leave Balance</span>
                <Badge variant="outline">
                  {getLeaveTypeName(formData.leaveType)}
                </Badge>
              </div>

              {/* <div className="h-2 mb-4">
                <Progress
                  value={(userLeaveBalance / allotedLeaves) * 100}
                  className="h-2"
                />
              </div> */}

              <div className="flex justify-between text-sm">
                <span>Used: {allotedLeaves - userLeaveBalance} / {allotedLeaves}</span>
                <span className="font-medium">
                  Available: {userLeaveBalance} days
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Date Selection */}
        {showDateControls && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fromDate">Start Date</Label>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start text-left font-normal"
                onClick={() => setIsFromDatePickerOpen(true)}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.fromDate ? (
                  format(new Date(formData.fromDate), "PPP")
                ) : (
                  "Select start date"
                )}
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="toDate">End Date</Label>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start text-left font-normal"
                onClick={() => setIsToDatePickerOpen(true)}
                disabled={!formData.fromDate}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.toDate ? (
                  format(new Date(formData.toDate), "PPP")
                ) : (
                  "Select end date"
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Leave Days Configuration */}
        {formData.leaveDays.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Leave Days Configuration</Label>
              <Badge variant={error ? "destructive" : "outline"}>
                {totalAppliedDays} day(s)
              </Badge>
            </div>

            <ScrollArea className="h-[200px] rounded-md border p-2">
              <div className="space-y-2">
                {formData.leaveDays.map((day, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                  >
                    <span className="text-sm">
                      {format(parseISO(day.date), "EEE, dd MMM yyyy")}
                    </span>

                    <Select
                      value={day.unit}
                      onValueChange={(value) =>
                        handleUnitChange(day.date, value as LeaveDay["unit"])
                      }
                    >
                      <SelectTrigger className="w-[140px] h-8">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent className="z-[100]">
                        {availableUnits.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {error && (
              <div className="text-sm text-destructive flex items-center gap-2">
                <Info className="h-4 w-4" />
                {error}
              </div>
            )}
          </div>
        )}

        {/* Leave Reason */}
        <div className="space-y-2">
          <Label htmlFor="leaveReason">Reason for Leave</Label>
          <Textarea
            id="leaveReason"
            name="leaveReason"
            value={formData.leaveReason}
            onChange={handleInputChange}
            placeholder="Please provide details about your leave request"
            className="resize-none min-h-[100px]"
          />
        </div>

        {/* Attachments and Recording */}
        <div className="space-y-3">
          <Label>Attachments</Label>
          <div className="flex flex-wrap gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant={recording ? "destructive" : "secondary"}
                    onClick={recording ? stopRecording : startRecording}
                  >
                    {recording ? <PauseCircle className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {recording ? "Stop recording" : "Record voice note"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <UploadCloud className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Upload files
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              className="hidden"
              multiple
              onChange={handleFileUpload}
            />

            {recording && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3 animate-pulse text-red-500" />
                Recording: {formatTime(recordingTime)}
              </Badge>
            )}
          </div>

          {/* Audio Visualization */}
          {recording && (
            <div className="border rounded-md border-dashed border-primary p-2 bg-primary/5">
              <canvas
                ref={canvasRef}
                className="w-full h-12"
              ></canvas>

              <Button
                type="button"
                onClick={stopRecording}
                variant="destructive"
                size="sm"
                className="mt-2 w-full"
              >
                Stop Recording
              </Button>
            </div>
          )}

          {/* Display selected files */}
          {files.length > 0 && (
            <div className="border rounded-md p-2">
              <div className="text-sm font-medium mb-2">Attachments ({files.length})</div>
              <div className="space-y-1">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm p-1 rounded-sm bg-muted"
                  >
                    <div className="flex items-center">
                      <FileText className="h-3 w-3 mr-2" />
                      <span className="truncate max-w-[150px]">{file.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audio Player */}
          {audioBlob && (
            <div className="border rounded-md p-2">
              <CustomAudioPlayer
                audioBlob={audioBlob}
                setAudioBlob={setAudioBlob}
              />
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={
              !formData.leaveType ||
              formData.leaveDays.length === 0 ||
              error !== null ||
              loading
            }
          >
            {loading ? <Loader /> : "Submit Leave Request"}
          </Button>
        </DialogFooter>
      </form>

      {/* Date pickers in dialogs */}
      <Dialog open={isFromDatePickerOpen} onOpenChange={setIsFromDatePickerOpen}>
        <DialogContent className="p-0 scale-90 bg-transparent border-none shadow-none max-w-full">

          <CustomDatePicker
            selectedDate={formData.fromDate ? new Date(formData.fromDate) : null}
            onDateChange={(date) => {
              const newDate = new Date(date);
              // Ensure we don't select a date before today
              if (newDate < new Date()) {
                newDate.setHours(0, 0, 0, 0);
              }
              setFormData({
                ...formData,
                fromDate: date.toISOString().split("T")[0],
                // Reset toDate if it's before the new fromDate
                toDate: formData.toDate && new Date(formData.toDate) < date
                  ? date.toISOString().split("T")[0]
                  : formData.toDate
              });
              setIsFromDatePickerOpen(false);
            }}
            onCloseDialog={() => setIsFromDatePickerOpen(false)}
          />

        </DialogContent>
      </Dialog>

      <Dialog open={isToDatePickerOpen} onOpenChange={setIsToDatePickerOpen}>
        <DialogContent className="p-0 scale-90 bg-transparent border-none shadow-none max-w-full">

          <CustomDatePicker
            selectedDate={formData.toDate ? new Date(formData.toDate) : null}
            onDateChange={(date) => {
              setFormData({
                ...formData,
                toDate: date.toISOString().split("T")[0],
              });
              setIsToDatePickerOpen(false);
            }}
            onCloseDialog={() => setIsToDatePickerOpen(false)}
          />

        </DialogContent>
      </Dialog>
    </DialogContent>
  );
};

export default MyLeaveForm;

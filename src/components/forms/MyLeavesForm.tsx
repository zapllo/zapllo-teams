"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Paperclip, Mic, Calendar } from "lucide-react";
import { FaTimes, FaUpload } from "react-icons/fa";
import CustomAudioPlayer from "../globals/customAudioPlayer";
import Loader from "../ui/loader";
import { toast, Toaster } from "sonner";
import CustomDatePicker from "../globals/date-picker";
import { useAnimation, motion } from "framer-motion";
import { Separator } from "../ui/separator";
import { CrossCircledIcon, StopIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogTitle } from "../ui/dialog";
import { format, parseISO } from "date-fns";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

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
  const [userLeaveBalances, setUserLeaveBalances] = useState<any[]>([]); // Store user leave balances
  const [error, setError] = useState<string | null>(null); // Error message state
  const audioURLRef = useRef<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [files, setFiles] = useState<File[]>([]); // State to manage file uploads
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [totalAppliedDays, setTotalAppliedDays] = useState<number>(0); // State to store total applied days
  const [isFromDatePickerOpen, setIsFromDatePickerOpen] = useState(false); // Manage From Date Picker
  const [isToDatePickerOpen, setIsToDatePickerOpen] = useState(false); // Manage To Date Picker
  const controls = useAnimation();
  const intervalRef = useRef<number | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

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
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/users/me"); // Adjust API endpoint as needed
        const user = response.data.data;

        if (user) {
          // Set the user's leave balances
          setUserLeaveBalances(user.leaveBalances);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

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

        // Set allotted leaves and user balance
        setAllotedLeaves(selectedLeaveType.allotedLeaves);
        // Find the user's leave balance for the selected leave type
        const userLeaveBalanceForType = userLeaveBalances.find(
          (balance) => balance.leaveType === value
        );

        // Set the leave balance for the selected leave type
        setUserLeaveBalance(
          userLeaveBalanceForType ? userLeaveBalanceForType.balance : null
        );
      }
    }
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
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end date
      return diffDays;
    }
    return 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
          return;
        }
      } catch (error) {
        console.error("Error uploading files:", error);
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
      setLoading(true);
      const response = await fetch("/api/leaves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leaveRequestData),
      });

      if (response.ok) {
        const data = await response.json();
        toast(<div className=" w-full mb-6 gap-2 m-auto  ">
          <div className="w-full flex  justify-center">
            <DotLottieReact
              src="/lottie/tick.lottie"
              loop
              autoplay
            />
          </div>
          <h1 className="text-black text-center font-medium text-lg">Leave request submitted successfully</h1>
        </div>);
        console.log("Leave request submitted successfully:", data);
        onClose(); // Close the modal on successful submission
      } else {
        console.error("Failed to submit leave request.");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error submitting leave request:", error);
    }
    setLoading(false);
    onClose();
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
    // Check if the requested leave days exceed the user's balance
    const requestedDays = calculateRequestedDays();
    if (userLeaveBalance !== null && requestedDays > userLeaveBalance) {
      setError("Exceeded leave request balance");
    } else {
      setError(null);
    }
  }, [formData.fromDate, formData.toDate, userLeaveBalance]);

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
        setFiles(validFiles); // Update state with all selected files
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index)); // Remove the file at the specified index
  };

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

  const calculateTotalAppliedDays = () => {
    let totalDays = 0;

    for (const leaveDay of formData.leaveDays) {
      totalDays += unitMapping[leaveDay.unit]; // Use the unit mapping to calculate total days
    }

    return totalDays;
  };

  useEffect(() => {
    // Calculate and update total applied days whenever leaveDays change
    const totalDays = calculateTotalAppliedDays();
    setTotalAppliedDays(totalDays);
  }, [formData.leaveDays]);


  useEffect(() => {
    const requestedDays = calculateTotalAppliedDays(); // Calculate requested days based on leaveDays
    if (userLeaveBalance !== null && requestedDays > userLeaveBalance) {
      const exceededDays = requestedDays - userLeaveBalance; // Calculate exceeded days
      setError(`Leave request exceeds balance by ${exceededDays} day(s), please apply them under any other leave type`);
    } else {
      setError(null);
    }
  }, [formData.leaveDays, userLeaveBalance]);


  return (
    <Dialog open onOpenChange={onClose}>
      {/* <Toaster /> */}
      <DialogContent className="z-[100]  overflow-y-scroll h-full max-h-screen m-auto flex w-full max-w-lg  ">
        <div className="bg-[#0b0d29] scrollbar-hide    shadow-lg w-full   max-w-lg  rounded-lg">
          <div className="flex border-b py-2  w-full justify-between ">
            <DialogTitle className="text-md   px-6 py-2 font-medium">
              Submit Leave Request
            </DialogTitle>
            <DialogClose className=" px-6 py-2">
              <CrossCircledIcon className="scale-150 mt-1 hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]" />
            </DialogClose>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-6 h-full">
            <div className="relative">
              <label className="absolute bg-[#0b0d29] ml-2 text-xs text-[#787CA5] -mt-2 px-1">
                Leave Type
              </label>
              <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleInputChange}
                className="w-full text-xs p-2 bg-[#1A1C20] outline-none border rounded bg-transparent"
              >
                <option className="bg-[#1A1C20]" value="">
                  Select Leave Type
                </option>
                {leaveTypes.map((type) => (
                  <option
                    key={type._id}
                    className="bg-[#1A1C20]"
                    value={type._id}
                  >
                    {type.leaveType}
                  </option>
                ))}
              </select>
            </div>

            {/* Display Allotted Leaves and Balance */}
            {allotedLeaves !== null && userLeaveBalance !== null && (
              <div className="mt-2 flex justify-between text-xs text-white bg-[#252738] p-3 rounded">
                <p>Total Allotted Leaves: {allotedLeaves}</p>
                <p>Remaining Balance: {userLeaveBalance}</p>
              </div>
            )}

            <div className="flex justify-between space-x-4">
              <div className="relative w-full">
                <button
                  type="button"
                  onClick={() => setIsFromDatePickerOpen(true)}
                  className="w-full text-sm p-2 outline-none border rounded bg-[#] flex gap-1 mt-auto text-gray-300"
                  disabled={!formData.leaveType}
                >
                  <Calendar className="h-5" />{" "}
                  {formData.fromDate ? (
                    new Date(formData.fromDate).toLocaleDateString("en-GB")
                  ) : (
                    <h1 className="text-[#787CA5]">Start Date</h1>
                  )}
                </button>
                {/* {isFromDatePickerOpen && (
                    <div className="fixed inset-0  bg-black/50 opacity- z-[10]">
                      <div className="bg-[#1A1C20] ml-80 mt-32 scale-75   absolute z-[50] h-[510px] max-h-screen text-[#D0D3D3] w-1/2 rounded-lg p-8">
                        <CustomDatePicker
                          selectedDate={
                            formData.fromDate
                              ? new Date(formData.fromDate)
                              : null
                          }
                          onDateChange={(date) => {
                            setFormData({
                              ...formData,
                              fromDate: date.toISOString().split("T")[0],
                            });
                            setIsFromDatePickerOpen(false);
                          }}
                          onCloseDialog={() => setIsFromDatePickerOpen(false)}
                        />
                      </div>
                    </div>
                  )} */}
                {isFromDatePickerOpen && (
                  <Dialog
                    open={isFromDatePickerOpen}
                    onOpenChange={setIsFromDatePickerOpen}
                  >
                    <DialogContent className=" z-[100] scale-90  flex justify-center ">
                      <div className=" z-[20] rounded-lg  scale-[80%] max-w-4xl flex justify-center items-center w-full relative">
                        <div className="w-full flex mb-4 justify-between">
                          <CustomDatePicker
                            selectedDate={
                              formData.fromDate
                                ? new Date(formData.fromDate)
                                : null
                            }
                            onDateChange={(date) => {
                              setFormData({
                                ...formData,
                                fromDate: date.toISOString().split("T")[0],
                              });
                              setIsFromDatePickerOpen(false);
                            }}
                            onCloseDialog={() =>
                              setIsFromDatePickerOpen(false)
                            }
                          />
                        </div>
                      </div>
                    </DialogContent>

                  </Dialog>
                )}
              </div>
              <div className="relative w-full">
                <button
                  type="button"
                  onClick={() => setIsToDatePickerOpen(true)}
                  className="w-full text-sm flex gap-1 p-2 outline-none border rounded bg-[#] text-gray-300"
                  disabled={!formData.leaveType}
                >
                  <Calendar className="h-5" />{" "}
                  {formData.toDate ? (
                    new Date(formData.toDate).toLocaleDateString("en-GB")
                  ) : (
                    <h1 className="text-[#787CA5]">End Date</h1>
                  )}
                </button>
                {/* {isToDatePickerOpen && (
                    <div className="fixed inset-0  bg-black/50 opacity- z-[10]">
                      <div className="bg-[#1A1C20] ml-80 mt-32 scale-75   absolute z-[50] h-[510px] max-h-screen text-[#D0D3D3] w-1/2 rounded-lg p-8">
                        <CustomDatePicker
                          selectedDate={
                            formData.toDate ? new Date(formData.toDate) : null
                          }
                          onDateChange={(date) => {
                            setFormData({
                              ...formData,
                              toDate: date.toISOString().split("T")[0],
                            });
                            setIsToDatePickerOpen(false);
                          }}
                          onCloseDialog={() => setIsToDatePickerOpen(false)}
                        />
                      </div>
                    </div>
                  )} */}

                {isToDatePickerOpen && (
                  <Dialog
                    open={isToDatePickerOpen}
                    onOpenChange={setIsToDatePickerOpen}
                  >
                    <DialogPortal>

                      <DialogContent className=" z-[100]  scale-90 flex justify-center ">
                        <div className=" z-[20] rounded-lg  scale-[80%] max-w-4xl flex justify-center items-center w-full relative">
                          <div className="w-full flex mb-4 justify-between">
                            <CustomDatePicker
                              selectedDate={
                                formData.toDate
                                  ? new Date(formData.toDate)
                                  : null
                              }
                              onDateChange={(date) => {
                                setFormData({
                                  ...formData,
                                  toDate: date.toISOString().split("T")[0],
                                });
                                setIsToDatePickerOpen(false);
                              }}
                              onCloseDialog={() =>
                                setIsToDatePickerOpen(false)
                              }
                            />
                          </div>
                        </div>
                      </DialogContent>
                    </DialogPortal>
                  </Dialog>
                )}
              </div>
            </div>

            {/* Dynamically generated leave days with unit selection */}
            <div>
              {formData.toDate &&
                formData.fromDate &&
                formData.leaveDays.map((day, index) => (
                  <div
                    key={index}
                    className="mb-2 flex border p-2 justify-between"
                  >
                    <span className="text-sm mt-2">
                      {format(parseISO(day.date), "dd-MM-yyyy")}
                    </span>
                    <select
                      value={day.unit}
                      onChange={(e) =>
                        handleUnitChange(
                          day.date,
                          e.target.value as LeaveDay["unit"]
                        )
                      }
                      className="ml-2 p-2 border bg-transparent outline-none rounded text-sm"
                    >
                      {availableUnits.map((unit) => (
                        <option
                          key={unit}
                          className="bg-[#1A1C20]"
                          value={unit}
                        >
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
            </div>
            <div className="mt-2  text-xs text-white bg-[#252738] p-3 rounded">
              <p className="text-right">Leave Application for : {totalAppliedDays} day(s)</p>
              <div>
              {error && <p className="text-[#787CA5] text-xs">{error}</p>}
              </div>
            </div>
            <div>
              <div className="relative">
                <label className="absolute bg-[#0b0d29] text-[#787CA5] ml-2 text-xs -mt-2 px-1">
                  Leave Reason
                </label>
              </div>
              <textarea
                name="leaveReason"
                value={formData.leaveReason}
                onChange={handleInputChange}
                className="w-full focus-within:border-[#815BF5] text-sm p-2 border bg-transparent outline-none rounded"
              />
            </div>


            {/* Audio Recording and File Attachment */}
            <div className="flex gap-4">
              {/* <div  className={`h-8 w-8 rounded-full items-center text-center  border cursor-pointer hover:shadow-white shadow-sm  bg-[#282D32]`}> */}
              {recording ? (
                <div
                  onClick={stopRecording}
                  className="h-8  w-8 rounded-full items-center text-center  border cursor-pointer hover:shadow-white shadow-sm   bg-red-500"
                >
                  <Mic className="h-5 text-center m-auto mt-1" />
                </div>
              ) : (
                <div
                  onClick={startRecording}
                  className="h-8  w-8 rounded-full items-center text-center  border cursor-pointer hover:shadow-white shadow-sm  bg-[#815BF5]"
                >
                  <Mic className="h-5 text-center m-auto mt-1" />
                </div>
              )}
              {/* </div> */}
              <input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                className=""
                multiple
                onChange={handleFileUpload}
                style={{ display: "none" }} // Hide the file input
              />
              <label htmlFor="file-upload" className=" ">
                <img
                  className="h-8 text-center cursor-pointer "
                  src="/icons/imagee.png"
                />
                {/* <span>Attach Files</span> */}
              </label>
              {/* <canvas
                  ref={canvasRef}
                  className={` ${recording ? `w-1/2 ml-auto h-12` : "hidden"} `}
                ></canvas> */}
            </div>

            {/* Audio Wave  */}

            <div
              className={` ${recording ? `w-full  ` : "hidden"
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
                    <StopIcon className=" bg-red-500 text-red-500 h-3 w-3" />{" "}
                    Stop
                  </Button>
                </div>
              )}
            </div>

            {/* Display selected files */}
            {files.length > 0 && (
              <ul className="list-disc list-inside">
                {files.map((file, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center"
                  >
                    {file.name.slice(0, 7)}....
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500 ml-2"
                    >
                      <FaTimes className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {audioBlob && (
              <CustomAudioPlayer
                audioBlob={audioBlob}
                setAudioBlob={setAudioBlob}
              />
            )}

            <div className="flex justify-end ">
              <button
                type="submit"
                className="bg-[#815BF5] w-full text-sm cursor-pointer  text-white px-4 mt-6  py-2 rounded"
                disabled={
                  !formData.leaveType ||
                  formData.leaveDays.length === 0 ||
                  error !== null
                }
              >
                {loading ? <Loader /> : "Submit Now"}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MyLeaveForm;

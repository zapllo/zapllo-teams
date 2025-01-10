"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, X } from "lucide-react";

interface CustomAudioPlayerProps {
  audioBlob?: Blob | null;
  audioUrl?: string | null;
  setAudioBlob?: React.Dispatch<React.SetStateAction<Blob | null>>;
}

export default function CustomAudioPlayer({
  audioBlob,
  audioUrl,
  setAudioBlob,
}: CustomAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const audioSrc = audioBlob ? URL.createObjectURL(audioBlob) : audioUrl || "";
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  function getAudioDuration(audioBlob: Blob): Promise<number> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();

      audio.onloadedmetadata = () => {
        resolve(audio.duration);
      };

      audio.onerror = (error) => {
        reject(error);
      };

      audio.src = URL.createObjectURL(audioBlob);
    });
  }

  // Ensure duration and other metadata are loaded properly
  useEffect(() => {
    if (audioRef.current && audioSrc) {
      audioRef.current.src = audioSrc;
      audioRef.current.load();
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [audioBlob, audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    console.log(audio?.duration);
    console.log(audioRef.current?.duration);
    if (audio) {
      const handleTimeUpdate = () => {
        if (!isDragging) {
          setCurrentTime(audio.currentTime);
        }
      };

      const handleLoadedMetadata = async () => {
        // if (audio.duration !== Infinity && !isNaN(audio.duration)) {
        //   setDuration(audio.duration);
        // }
        const audioDuration = audioBlob ? await getAudioDuration(audioBlob) : 0;
        setDuration(audioDuration);
      };

      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      audio.addEventListener("ended", handleEnded);

      return () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audio.removeEventListener("ended", handleEnded);
      };
    }
  }, [isDragging]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleClear = () => {
    if (setAudioBlob) {
      setAudioBlob(null);
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = progressRef.current;
    const audio = audioRef.current;
    if (progressBar && audio) {
      const bounds = progressBar.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      const newTime = percentage * audio.duration;
      setDuration(audio.duration);
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="bg-[#] border-dashed border border-[#815BF5] rounded-lg shadow-md  p-2 mb-2 w-full">
      {audioSrc && (
        <div className="space-y-2 px-4 mb-2 ">
          <div className="flex  justify-between items-center">
            <div>
              <h2 className="text-md font-semibold">Voice Note</h2>
              <p className="text-sm text-gray-500">{formatTime(currentTime)}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePlayPause}
                type="button"
                className="bg-[#017a5b] text-white rounded-full p-3 hover:bg-[#017a5b] transition-colors"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>
              {setAudioBlob && (
                <div className="flex items-center">
                  <button
                    onClick={handleClear}
                    className="bg- text-white border bg-red-700 px-2 py-1 text-xs rounded-md hover:bg-red-600 transition-colors flex items-center space-x-1"
                  >
                    <X className="w-4 h-4" />
                    <span>Clear</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          <div
            ref={progressRef}
            className="relative w-full h-2   bg-[#282d32] rounded cursor-pointer"
            onClick={handleSeek}
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
          >
            <div
              className="absolute top-0 left-0 h-full bg-green-500 rounded"
              style={{
                width: `${(currentTime / duration) * 100}%`,
              }}
            ></div>
          </div>

          <audio ref={audioRef} className="hidden" />
        </div>
      )}
    </div>
  );
}

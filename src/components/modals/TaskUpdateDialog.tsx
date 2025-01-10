'use client'

import React, { useRef } from 'react';
import { Dialog, DialogOverlay, DialogContent, DialogTitle, DialogClose } from '@radix-ui/react-dialog';
import { Button } from '../ui/button';
import { Mic, Paperclip } from 'lucide-react';

interface TaskUpdateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateTaskStatus: () => void;
  setComment: (comment: string) => void;
  recording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
}

const TaskUpdateDialog: React.FC<TaskUpdateDialogProps> = ({
  isOpen,
  onClose,
  onUpdateTaskStatus,
  setComment,
  recording,
  startRecording,
  stopRecording,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  return (
    <Dialog open={isOpen}>
      <DialogOverlay className="fixed s inset-0 bg-black bg-opacity-50" />
      <DialogContent className="bg-[#1A1D21] rounded-lg p-6 mx-auto max-w-xl">
        <div className="flex justify-between w-full">
          <DialogTitle className="text-sm">Task Update</DialogTitle>
          <DialogClose onClick={onClose}>X</DialogClose>
        </div>

        <p className="text-xs -mt-2">Please add a note before marking the task as in progress</p>
        <div className="mt-2">
          <label className="text-sm">Comment</label>
          <div
            ref={editorRef}
            contentEditable
            className="border-gray-600 border rounded-lg outline-none px-2 py-6 w-full mt-2"
            onInput={(e) => {
              const target = e.target as HTMLDivElement;
              setComment(target.innerHTML);
            }}
          ></div>

          <div className="flex mt-4 gap-4">
            {recording ? (
              <div
                onClick={stopRecording}
                className="h-8 w-8 rounded-full items-center text-center border cursor-pointer hover:shadow-white shadow-sm bg-red-500"
              >
                <Mic className="h-5 text-center m-auto mt-1" />
              </div>
            ) : (
              <div
                onClick={startRecording}
                className="h-8 w-8 rounded-full items-center text-center border cursor-pointer hover:shadow-white shadow-sm bg-[#282D32]"
              >
                <Mic className="h-5 text-center m-auto mt-1" />
              </div>
            )}
            <div className="h-8 w-8 rounded-full items-center text-center border cursor-pointer hover:shadow-white shadow-sm bg-[#282D32]">
              <Paperclip className="h-5 text-center m-auto mt-1" />
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button onClick={onUpdateTaskStatus} className="w-full text-white bg-[#007A5A]">
            Update Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskUpdateDialog;

'use client'

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

// UI Components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  deleteButtonText?: string;
  cancelButtonText?: string;
  destructive?: boolean;
}

/**
 * A reusable delete confirmation dialog component
 */
const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Delete",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  deleteButtonText = "Delete",
  cancelButtonText = "Cancel",
  destructive = true
}) => {
  const handleConfirm = () => {
    onConfirm();
    // We don't call onClose here because typically onConfirm will handle this
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <div className="flex items-start gap-3">
            {destructive && (
              <div className="mt-1 rounded-full bg-red-100 p-1.5 dark:bg-red-900/20">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            )}
            <div>
              <AlertDialogTitle>{title}</AlertDialogTitle>
              <AlertDialogDescription className="mt-2">
                {description}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 sm:justify-start">
          <div className="flex w-full justify-end gap-2">
            <AlertDialogCancel asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
              >
                {cancelButtonText}
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant={destructive ? "destructive" : "default"}
                size="sm"
                onClick={handleConfirm}
              >
                {deleteButtonText}
              </Button>
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationDialog;

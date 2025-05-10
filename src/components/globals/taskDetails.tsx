'use client'
import React, { useState, useEffect } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Separator } from '../ui/separator';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    AlertCircle,
    ArrowLeft,
    Calendar,
    CheckCircle,
    Circle,
    Clock,
    Edit,
    FileTextIcon,
    Flag,
    GlobeIcon,
    Link2,
    Loader2,
    MessageSquare,
    PlayCircle,
    Tag,
    Trash2,
    ExternalLink,
    Paperclip,
    Bell,
    LinkIcon
} from 'lucide-react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { IconCopy, IconProgress } from '@tabler/icons-react';
import CustomAudioPlayer from './customAudioPlayer';
import { toast } from 'sonner';
import axios from 'axios';
import { formatDistanceToNow, intervalToDuration } from 'date-fns';
import { usePathname, useRouter } from 'next/navigation';
import { Task, TaskDetailsProps } from '@/types/tasksTab';
import EditTaskDialog from './editTask';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const TaskDetails: React.FC<TaskDetailsProps> = ({
    selectedTask,
    onTaskUpdate,
    onClose,
    handleUpdateTaskStatus,
    handleDeleteClick,
    handleEditClick,
    setSelectedTask,
    handleCopy,
    setStatusToUpdate,
    setIsDialogOpen,
    setIsReopenDialogOpen,
    setIsCompleteDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    users,
    handleDeleteConfirm,
    sortedComments,
    formatDate,
    categories,
    formatTaskDate,
    onTaskStatusChange
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(true);
    const [isTrialExpired, setIsTrialExpired] = useState(false);
    const [trialExpires, setTrialExpires] = useState<Date | null>(null);
    const [timeMessage, setTimeMessage] = useState("");
    const [userLoading, setUserLoading] = useState<boolean | null>(false);

    // Status dialog state
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [reopenDialogOpen, setReopenDialogOpen] = useState(false);
    const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentAction, setCurrentAction] = useState<'progress' | 'complete' | 'reopen' | null>(null);

    // Get status badge styling
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Pending':
                return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-300">Pending</Badge>;
            case 'In Progress':
                return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-300">In Progress</Badge>;
            case 'Completed':
                return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-300">Completed</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    // Get priority badge styling
    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'High':
                return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-300">High</Badge>;
            case 'Medium':
                return <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 border-orange-300">Medium</Badge>;
            case 'Low':
                return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-300">Low</Badge>;
            default:
                return <Badge variant="outline">{priority}</Badge>;
        }
    };

    // Determine file type icon
    const getFileIcon = (fileName: string) => {
        if (fileName.match(/\.(jpeg|jpg|gif|png)$/i)) {
            return <img src="/icons/image-file.svg" alt="Image" className="h-5 w-5" />;
        } else if (fileName.match(/\.(pdf)$/i)) {
            return <img src="/icons/pdf-file.svg" alt="PDF" className="h-5 w-5" />;
        } else if (fileName.match(/\.(doc|docx)$/i)) {
            return <img src="/icons/word-file.svg" alt="Word" className="h-5 w-5" />;
        } else if (fileName.match(/\.(xls|xlsx)$/i)) {
            return <img src="/icons/excel-file.svg" alt="Excel" className="h-5 w-5" />;
        } else {
            return <Paperclip className="h-5 w-5" />;
        }
    };

    // Handle status update
    const handleStatusUpdate = (action: 'progress' | 'complete' | 'reopen') => {
        // Instead of opening dialogs directly, call the parent component's handler
        if (onTaskStatusChange && selectedTask) {
            onTaskStatusChange(selectedTask, action);
        }
    };
    // Submit status update
    const submitStatusUpdate = async () => {
        if (!commentText.trim()) {
            toast.error('Please add a comment before updating the task');
            return;
        }

        if (!currentAction || !selectedTask) return;

        setIsSubmitting(true);

        try {
            // Call the passed-in handler function
            if (onTaskStatusChange) {
                await onTaskStatusChange(selectedTask, currentAction);
            }

            // Reset states
            setStatusDialogOpen(false);
            setCompleteDialogOpen(false);
            setReopenDialogOpen(false);

            // Reset the parent component's dialog states
            setIsDialogOpen(false);
            setIsCompleteDialogOpen(false);
            setIsReopenDialogOpen(false);

            // Refresh data
            if (onTaskUpdate) {
                await onTaskUpdate();
            }

            const statusText =
                currentAction === 'progress' ? 'In Progress' :
                    currentAction === 'complete' ? 'Completed' : 'Reopened';

            toast.success(`Task marked as ${statusText} successfully`);
        } catch (error: any) {
            console.error('Error updating task status:', error);
            toast.error(error.message || 'An error occurred while updating the task');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Get comment for task update
    const getCommentForTaskUpdate = () => {
        return commentText;
    };

    // Handle task deletion confirmation
    const handleDeleteConfirmation = async () => {
        setIsSubmitting(true);
        try {
            if (selectedTask && handleDeleteConfirm) {
                await handleDeleteConfirm();
                setDeleteDialogOpen(false);
                setSelectedTask(null);
                toast.success('Task deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            toast.error('Failed to delete task');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const getUserDetails = async () => {
            try {
                setUserLoading(true);
                const userRes = await axios.get("/api/users/me");
                const response = await axios.get("/api/organization/getById");

                const organization = response.data.data;
                const trialEnd = new Date(organization.trialExpires);
                const expired = trialEnd <= new Date();

                setTrialExpires(trialEnd);
                setIsTrialExpired(expired);
                setUserLoading(false);
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        getUserDetails();
    }, []);

    useEffect(() => {
        if (trialExpires) {
            const updateTimeMessage = () => {
                const now = new Date();
                const trialEnd = new Date(trialExpires);

                if (isTrialExpired) {
                    // Calculate elapsed time since expiration
                    const duration = intervalToDuration({ start: trialEnd, end: now });
                    const message =
                        (duration.days || 0) > 0
                            ? `${duration.days} days ago`
                            : `${duration.hours || 0}h ${duration.minutes || 0}m since trial expired`;
                    setTimeMessage(message);
                } else {
                    // Calculate remaining time until expiration
                    const remaining = formatDistanceToNow(trialEnd, { addSuffix: true });
                    setTimeMessage(remaining);
                }
            };

            updateTimeMessage(); // Initial call
            const intervalId = setInterval(updateTimeMessage, 1000 * 60); // Update every minute

            return () => clearInterval(intervalId); // Cleanup on unmount
        }
    }, [isTrialExpired, trialExpires]);

    return (
        <Sheet open={!!selectedTask} onOpenChange={(open) => {
            if (!open) setSelectedTask(null);
        }}>
            <SheetContent className="max-w-5xl z-[100] w-[95vw] p-0 overflow-y-auto scrollbar-hide">
                {/* Header with back button and title */}
                <SheetHeader className="sticky top-0 z- bg-background border-b p-4 flex flex-row items-center z-[0] justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedTask(null)}
                            className="h-8 w-8 rounded-full"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <SheetTitle className="text-lg">{selectedTask?.title}</SheetTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        {selectedTask && getStatusBadge(selectedTask.status)}
                        {selectedTask && getPriorityBadge(selectedTask.priority)}
                    </div>
                </SheetHeader>

                <div className="p-6 space-y-6 max-h-[calc(100vh-160px)] overflow-y-auto">
                    {/* Assigned people section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    Assigned To
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {selectedTask?.assignedUser?.firstName ? (
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage
                                                src={selectedTask?.assignedUser?.profilePic}
                                                alt={`${selectedTask?.assignedUser?.firstName} ${selectedTask?.assignedUser?.lastName}`}
                                            />
                                            <AvatarFallback className="bg-primary text-primary-foreground">
                                                {selectedTask?.assignedUser?.firstName?.slice(0, 1)}
                                                {selectedTask?.assignedUser?.lastName?.slice(0, 1)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">
                                                {`${selectedTask?.assignedUser?.firstName} ${selectedTask?.assignedUser?.lastName}`}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {selectedTask?.assignedUser?.email}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-sm text-muted-foreground">No user assigned</div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    Created By
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {selectedTask?.user?.firstName ? (
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage
                                                src={selectedTask?.user?.profilePic}
                                                alt={`${selectedTask?.user?.firstName} ${selectedTask?.user?.lastName}`}
                                            />
                                            <AvatarFallback className="bg-primary text-primary-foreground">
                                                {selectedTask?.user?.firstName?.slice(0, 1)}
                                                {selectedTask?.user?.lastName?.slice(0, 1)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">
                                                {`${selectedTask?.user?.firstName} ${selectedTask?.user?.lastName}`}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {selectedTask?.user?.email}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-sm text-muted-foreground">Unknown</div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Dates and category section */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Schedule Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                                        <Calendar className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium">Created Date</div>
                                        <div className="text-xs text-muted-foreground">{selectedTask?.createdAt ? formatTaskDate(selectedTask.createdAt) : 'N/A'}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                                        <Clock className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium">Due Date</div>
                                        <div className="text-xs text-muted-foreground">{selectedTask?.dueDate ? formatTaskDate(selectedTask.dueDate) : 'N/A'}</div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                                        <Tag className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium">Category</div>
                                        <div className="text-xs text-muted-foreground">
                                            {selectedTask?.category?.name || "Uncategorized"}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                                        <Bell className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium">Frequency</div>
                                        <div className="text-xs text-muted-foreground flex flex-wrap gap-1">
                                            {selectedTask?.repeatType ? selectedTask?.repeatType : "Once"}
                                            {selectedTask?.days && selectedTask?.days.length > 0 && (
                                                <span>({selectedTask?.days.join(', ')})</span>
                                            )}
                                            {selectedTask?.dates && selectedTask?.dates.length > 0 && (
                                                <span>({selectedTask?.dates.join(', ')})</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Description section */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <FileTextIcon className="h-4 w-4" />
                                Description
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm whitespace-pre-wrap">
                                {selectedTask?.description || "No description provided."}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Links section */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <LinkIcon className="h-4 w-4" />
                                Links
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {selectedTask?.links && selectedTask?.links.filter(link => link.trim() !== "").length > 0 ? (
                                <div className="space-y-2">
                                    {selectedTask?.links.map((link, index) => (
                                        <div key={index} className="group flex items-center justify-between p-2 rounded-md border hover:bg-accent/50 transition-colors">
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <LinkIcon className="h-4 w-4 flex-shrink-0 text-blue-500" />
                                                <div className="truncate text-sm text-blue-600 dark:text-blue-400">
                                                    <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                        {link}
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopy && handleCopy(link)}>
                                                                <IconCopy className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Copy link</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>

                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                                asChild
                                                            >
                                                                <a href={link} target="_blank" rel="noopener noreferrer">
                                                                    <ExternalLink className="h-4 w-4" />
                                                                </a>
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Open link</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-sm text-muted-foreground py-2">No links attached.</div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Attachments section */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Paperclip className="h-4 w-4" />
                                Attachments
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {selectedTask?.attachment && selectedTask?.attachment.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {selectedTask?.attachment.map((url: string, index: number) => {
                                        const fileName = url.split('/').pop()?.split('-').pop() || 'Unknown file';
                                        const isImage = fileName.match(/\.(jpeg|jpg|gif|png)$/i);

                                        return (
                                            <a
                                                key={index}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 p-2 rounded-md border hover:bg-accent/50 transition-colors group"
                                                download={fileName}
                                            >
                                                {isImage ? (
                                                    <div className="h-12 w-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                                                        <img src={url} alt={fileName} className="h-full w-full object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                        {getFileIcon(fileName)}
                                                    </div>
                                                )}
                                                <div className="overflow-hidden">
                                                    <div className="text-sm font-medium truncate">{fileName}</div>
                                                    <div className="text-xs text-muted-foreground">Click to download</div>
                                                </div>
                                                <ExternalLink className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </a>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-sm text-muted-foreground py-2">No files attached.</div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Reminders section */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Bell className="h-4 w-4" />
                                Reminders
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {selectedTask?.reminders && selectedTask?.reminders.length > 0 ? (
                                <div className="space-y-2">
                                    {selectedTask?.reminders.map((reminder, index) => (
                                        <div key={index} className="flex items-center gap-3 p-2 rounded-md border bg-accent/50">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                                {reminder.notificationType === 'email' ? (
                                                    <Bell className="h-4 w-4 text-primary" />
                                                ) : (
                                                    <img src="/whatsapp.png" className="h-5 w-5" alt="WhatsApp Icon" />
                                                )}
                                            </div>
                                            <div className="text-sm">
                                                {reminder.type === 'specific' && reminder.date ? (
                                                    <span>
                                                        {new Date(reminder.date).toLocaleString()} (Specific Date)
                                                    </span>
                                                ) : (
                                                    <span>
                                                        {reminder.value} {reminder.type} {reminder.notificationType === 'email' ? 'via Email' : 'via WhatsApp'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-sm text-muted-foreground py-2">No reminders set.</div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Audio section (if present) */}
                    {selectedTask?.audioUrl && (
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <PlayCircle className="h-4 w-4" />
                                    Voice Note
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CustomAudioPlayer audioUrl={selectedTask.audioUrl} />
                            </CardContent>
                        </Card>
                    )}

                    {/* Task updates/comments section */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Task Updates
                            </CardTitle>
                            <CardDescription>
                                History of actions and comments on this task
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {sortedComments && sortedComments.length > 0 ? (
                                    sortedComments.map((commentObj, index) => (
                                        <div key={index} className="relative border rounded-lg p-4 space-y-2">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                                        {commentObj.userName.slice(0, 1)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium text-sm">{commentObj.userName}</div>
                                                    <div className="text-xs text-muted-foreground">{formatDate && formatDate(commentObj.createdAt)}</div>
                                                </div>
                                                {commentObj.tag && (
                                                    <Badge
                                                        variant="outline"
                                                        className={cn(
                                                            "ml-auto",
                                                            commentObj.tag === 'In Progress' && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-300",
                                                            commentObj.tag === 'Completed' && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-300",
                                                            commentObj.tag === 'Reopen' && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-300"
                                                        )}
                                                    >
                                                        {commentObj.tag}
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="text-sm ml-11">{commentObj.comment}</div>

                                            {/* Render fileUrl if it exists */}
                                            {commentObj.fileUrl && commentObj.fileUrl.length > 0 && (
                                                <div className="ml-11 mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                                    {commentObj.fileUrl.map((url, fileIndex) => (
                                                        <div key={fileIndex}>
                                                            {url.match(/\.(jpeg|jpg|gif|png)$/) != null ? (
                                                                <a
                                                                    href={url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="block overflow-hidden rounded-lg border hover:opacity-90 transition-opacity"
                                                                >
                                                                    <img
                                                                        src={url}
                                                                        alt={`Attachment ${fileIndex}`}
                                                                        className="h-20 w-full object-cover"
                                                                    />
                                                                </a>
                                                            ) : (
                                                                <a
                                                                    href={url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-2 p-2 rounded-md border hover:bg-accent/50 transition-colors"
                                                                >
                                                                    <Paperclip className="h-4 w-4" />
                                                                    <span className="text-blue-500 text-xs truncate">
                                                                        Attachment {fileIndex + 1}
                                                                    </span>
                                                                    <ExternalLink className="h-4 w-4 ml-auto" />
                                                                </a>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-40" />
                                        <h3 className="text-lg font-medium">No Activity</h3>
                                        <p className="text-sm text-muted-foreground">
                                            There&apos;s no activity for this task yet.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Fixed action bar at bottom */}
                <div className="sticky bottom-0 w-full bg-background border-t p-4 flex flex-wrap gap-2 justify-center sm:justify-end">
                    {selectedTask?.status === "Completed" ? (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => handleStatusUpdate('reopen')}
                                className="gap-2"
                            >
                                <PlayCircle className="h-4 w-4 text-yellow-500" />
                                Reopen Task
                            </Button>

                            <Button
                                variant="outline"
                                onClick={handleEditClick}
                                className="gap-2"
                            >
                                <Edit className="h-4 w-4 text-blue-500" />
                                Edit Task
                            </Button>

                            <Button
                                variant="destructive"
                                onClick={() => {
                                    if (selectedTask && handleDeleteClick) {
                                        handleDeleteClick(selectedTask._id);
                                    }
                                }}
                                className="gap-2"
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete Task
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => handleStatusUpdate('progress')}
                                className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:hover:bg-blue-950 dark:border-blue-800 dark:text-blue-400"
                            >
                                <IconProgress className="h-4 w-4" />
                                Mark as In Progress
                            </Button>

                            <Button
                                variant="outline"
                                onClick={() => handleStatusUpdate('complete')}
                                className="gap-2 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 dark:hover:bg-green-950 dark:border-green-800 dark:text-green-400"
                            >
                                <CheckCircle className="h-4 w-4" />
                                Mark as Completed
                            </Button>

                            <Button
                                variant="outline"
                                onClick={handleEditClick}
                                className="gap-2"
                            >
                                <Edit className="h-4 w-4" />
                                Edit Task
                            </Button>

                            <Button
                                variant="destructive"
                                onClick={() => {
                                    if (selectedTask && handleDeleteClick) {
                                        handleDeleteClick(selectedTask._id);
                                    }
                                }}
                                className="gap-2"
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete Task
                            </Button>
                        </>
                    )}

                    {/* Edit Task Dialog */}
                    <EditTaskDialog
                        open={isEditDialogOpen}
                        onClose={() => setIsEditDialogOpen(false)}
                        task={selectedTask}
                        users={users}
                        categories={categories}
                        onTaskUpdate={onTaskUpdate}
                    />
                </div>
            </SheetContent>


        </Sheet>
    );
};

export default TaskDetails;

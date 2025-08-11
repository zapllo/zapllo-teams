'use client'
import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Loader2, Plus, Sparkles, User, X, FileText, Zap, MoreHorizontal, FolderOpen, Mic, MicOff, Volume2 } from 'lucide-react';
import TaskModal from '@/components/globals/taskModal';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import TaskDashboard from '@/components/tasks/TaskDashboard';
import TaskSidebar from '@/components/tasks/TaskSidebar';
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserType {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePic?: string;
}

export default function TaskManagement() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAiPromptOpen, setIsAiPromptOpen] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [isProcessingAi, setIsProcessingAi] = useState(false);
    const [aiTaskData, setAiTaskData] = useState<any>(null);
    const [tasks, setTasks] = useState([]);
    const [currentUser, setCurrentUser] = useState<any>();
    const [isPlanEligible, setIsPlanEligible] = useState(false);
    const [isTrialExpired, setIsTrialExpired] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<string>("all");
    const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);

    // User mention related states
    const [users, setUsers] = useState<UserType[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
    const [showUserPopover, setShowUserPopover] = useState(false);
    const [userSearch, setUserSearch] = useState('');
    const [cursorPosition, setCursorPosition] = useState(0);
    const [mentionStartPosition, setMentionStartPosition] = useState(-1);
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);
    const [aiCredits, setAiCredits] = useState<number>(0);
    // Add voice-related states
    const [isVoiceDialogOpen, setIsVoiceDialogOpen] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [voiceTranscript, setVoiceTranscript] = useState('');
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const router = useRouter();

    useEffect(() => {
        const getUserDetails = async () => {
            try {
                setLoading(true);
                const userRes = await axios.get('/api/users/me');
                const user = userRes.data.data;
                setCurrentUser(user);

                if (!user.isTaskAccess) {
                    router.push('/dashboard');
                    return;
                }
                const creditsRes = await axios.get('/api/organization/ai-credits');
                if (creditsRes.data.success) {
                    setAiCredits(creditsRes.data.aiCredits);
                }
                const trialStatusRes = await axios.get('/api/organization/trial-status');
                setIsTrialExpired(trialStatusRes.data.isExpired);

                // Check plan eligibility
                const orgRes = await axios.get('/api/organization/getById');
                const {
                    trialExpires,
                    subscribedPlan,
                } = orgRes.data.data;

                const trialExpired = trialExpires && new Date(trialExpires) <= new Date();
                setIsTrialExpired(trialExpired);

                const eligiblePlans = ['Money Saver Bundle', 'Zapllo Tasks'];

                if (trialExpired) {
                    const isPlanEligible = eligiblePlans.includes(subscribedPlan);
                    setIsPlanEligible(isPlanEligible);

                    if (!isPlanEligible) {
                        router.push('/dashboard');
                        return;
                    }
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching user details:', error);
                router.push('/dashboard');
            }
        };

        getUserDetails();
    }, [router]);

    // Fetch users for @mentions
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/users/organization');
                if (response.data && response.data.data) {
                    setUsers(response.data.data);
                    setFilteredUsers(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    // Handle @ mentions and filtering users
    useEffect(() => {
        if (mentionStartPosition !== -1) {
            const mentionText = aiPrompt.substring(mentionStartPosition + 1, cursorPosition).toLowerCase();
            const filtered = users.filter(
                user =>
                    user.firstName.toLowerCase().includes(mentionText) ||
                    user.lastName.toLowerCase().includes(mentionText) ||
                    `${user.firstName} ${user.lastName}`.toLowerCase().includes(mentionText)
            );
            setFilteredUsers(filtered);
            setShowUserPopover(filtered.length > 0);
        }
    }, [mentionStartPosition, cursorPosition, aiPrompt, users]);

    // Close popover when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setShowUserPopover(false);
                setMentionStartPosition(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (currentUser?.isTaskAccess === false) {
            router.push('/dashboard');
        }
    }, [currentUser, router]);

    const openModal = (prefillData?: any) => {
        setAiTaskData(prefillData);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setAiTaskData(null);
        fetchTasks();
    };

    const openAiPromptDialog = () => {
        setIsAiPromptOpen(true);
    };

    const closeAiPromptDialog = () => {
        setIsAiPromptOpen(false);
        setAiPrompt('');
        setSelectedUser(null);
        setShowUserPopover(false);
        setMentionStartPosition(-1);
    };

    const toggleQuickActions = () => {
        setIsQuickActionsOpen(!isQuickActionsOpen);
    };
    // Update handleQuickAction function
    const handleQuickAction = (action: string) => {
        setIsQuickActionsOpen(false);

        switch (action) {
            case 'ai-task':
                openAiPromptDialog();
                break;
            case 'voice-task':
                openVoiceDialog();
                break;
            case 'manual-task':
                openModal();
                break;
            case 'templates':
                setActiveTab('taskTemplates');
                break;
            case 'directory':
                setActiveTab('taskDirectory');
                break;
        }
    };

    // Voice dialog functions
    const openVoiceDialog = () => {
        setIsVoiceDialogOpen(true);
        setVoiceTranscript('');
        setAudioBlob(null);
    };

    const closeVoiceDialog = () => {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
        }
        setIsVoiceDialogOpen(false);
        setIsRecording(false);
        setIsTranscribing(false);
        setVoiceTranscript('');
        setAudioBlob(null);
        setMediaRecorder(null);
    };

const startRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks: BlobPart[] = [];

        recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                chunks.push(event.data);
            }
        };

        recorder.onstop = async () => {
            const blob = new Blob(chunks, { type: 'audio/wav' });
            setAudioBlob(blob);
            stream.getTracks().forEach(track => track.stop());
            
            // Automatically process the recording
            await processRecording(blob);
        };

        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
    } catch (error) {
        console.error('Error starting recording:', error);
        toast.error('Failed to start recording. Please check your microphone permissions.');
    }
};

const processRecording = async (audioBlob: Blob) => {
    if (aiCredits <= 0) {
        toast.error("No AI credits remaining. Please contact your administrator.");
        return;
    }

    setIsTranscribing(true);
    try {
        // Create FormData for the audio file
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.wav');

        // Send to our API endpoint for transcription and task processing
        const response = await axios.post('/api/tasks/voice-suggest', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.data.success) {
            if (response.data.creditStatus) {
                setAiCredits(response.data.creditStatus.remaining);
            }

            setVoiceTranscript(response.data.transcript);
            setAiTaskData(response.data.taskData);
            
            // Close voice dialog and open task modal automatically
            closeVoiceDialog();
            openModal(response.data.taskData);
            
            toast.success('Task created from your voice recording!');
        } else {
            if (response.data.creditStatus && response.data.creditStatus.remaining === 0) {
                toast.error("No AI credits remaining. Please contact your administrator.");
            } else {
                toast.error("Failed to process voice: " + response.data.error);
            }
        }
    } catch (error: any) {
        console.error('Error processing voice:', error);
        if (error.response?.data?.creditStatus?.remaining === 0) {
            toast.error("No AI credits remaining. Please contact your administrator.");
        } else {
            toast.error(error.response?.data?.error || "Failed to process voice input");
        }
    } finally {
        setIsTranscribing(false);
    }
};
    const stopRecording = () => {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            setIsRecording(false);
            // The processing will be triggered automatically in the recorder.onstop event
        }
    };

    const transcribeAndProcess = async () => {
        if (!audioBlob) {
            toast.error('No audio recorded');
            return;
        }

        if (aiCredits <= 0) {
            toast.error("No AI credits remaining. Please contact your administrator.");
            return;
        }

        setIsTranscribing(true);
        try {
            // Create FormData for the audio file
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.wav');

            // Send to our API endpoint for transcription and task processing
            const response = await axios.post('/api/tasks/voice-suggest', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                if (response.data.creditStatus) {
                    setAiCredits(response.data.creditStatus.remaining);
                }

                setVoiceTranscript(response.data.transcript);
                setAiTaskData(response.data.taskData);
                closeVoiceDialog();
                openModal(response.data.taskData);
            } else {
                if (response.data.creditStatus && response.data.creditStatus.remaining === 0) {
                    toast.error("No AI credits remaining. Please contact your administrator.");
                } else {
                    toast.error("Failed to process voice: " + response.data.error);
                }
            }
        } catch (error: any) {
            console.error('Error processing voice:', error);
            if (error.response?.data?.creditStatus?.remaining === 0) {
                toast.error("No AI credits remaining. Please contact your administrator.");
            } else {
                toast.error(error.response?.data?.error || "Failed to process voice input");
            }
        } finally {
            setIsTranscribing(false);
        }
    };

    // Update the quickActions array
    const quickActions = [
        {
            id: 'ai-task',
            label: 'AI Task',
            icon: Sparkles,
            description: 'Create with AI',
            gradient: 'from-violet-600 to-purple-600',
            hoverGradient: 'from-violet-500 to-purple-500',
            iconColor: 'text-violet-100',
            credits: aiCredits > 0
        },
        {
            id: 'voice-task',
            label: 'Voice Task',
            icon: Mic,
            description: 'Speak your task',
            gradient: 'from-rose-600 to-pink-600',
            hoverGradient: 'from-rose-500 to-pink-500',
            iconColor: 'text-rose-100',
            credits: aiCredits > 0
        },
        {
            id: 'manual-task',
            label: 'New Task',
            icon: Plus,
            description: 'Create manually',
            gradient: 'from-blue-600 to-indigo-600',
            hoverGradient: 'from-blue-500 to-indigo-500',
            iconColor: 'text-blue-100',
            credits: true
        },
        {
            id: 'templates',
            label: 'Templates',
            icon: FileText,
            description: 'Browse templates',
            gradient: 'from-emerald-600 to-green-600',
            hoverGradient: 'from-emerald-500 to-green-500',
            iconColor: 'text-emerald-100',
            credits: true
        },
        {
            id: 'directory',
            label: 'Directory',
            icon: FolderOpen,
            description: 'Task directory',
            gradient: 'from-orange-600 to-amber-600',
            hoverGradient: 'from-orange-500 to-amber-500',
            iconColor: 'text-orange-100',
            credits: true
        }
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        const cursorPos = e.target.selectionStart || 0;

        setAiPrompt(value);
        setCursorPosition(cursorPos);

        // Check for @ symbol to trigger user mention
        if (value[cursorPos - 1] === '@' && (cursorPos === 1 || value[cursorPos - 2] === ' ' || value[cursorPos - 2] === '\n')) {
            setMentionStartPosition(cursorPos - 1);
            setShowUserPopover(true);
        } else if (mentionStartPosition !== -1) {
            // If we're already in a mention and the cursor moved away or typing stopped
            if (cursorPos <= mentionStartPosition || value[cursorPos - 1] === ' ' || value[cursorPos - 1] === '\n') {
                setShowUserPopover(false);
                setMentionStartPosition(-1);
            }
        }
    };

    const handleSelectUser = (user: UserType) => {
        if (mentionStartPosition !== -1 && textareaRef.current) {
            // Replace the @mention text with the selected user's name
            const beforeMention = aiPrompt.substring(0, mentionStartPosition);
            const afterMention = aiPrompt.substring(cursorPosition);
            const newText = `${beforeMention}@${user.firstName} ${user.lastName}${afterMention}`;

            setAiPrompt(newText);
            setSelectedUser(user);
            setShowUserPopover(false);
            setMentionStartPosition(-1);

            // Set focus back to textarea and position cursor after the inserted name
            const newCursorPos = mentionStartPosition + `@${user.firstName} ${user.lastName}`.length + 1;
            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.focus();
                    textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
                }
            }, 0);
        }
    };

    const processAiPrompt = async () => {
        if (!aiPrompt.trim()) {
            toast.error("Please enter a task description");
            return;
        }

        if (aiCredits <= 0) {
            toast.error("No AI credits remaining. Please contact your administrator.");
            return;
        }

        setIsProcessingAi(true);
        try {
            // Extract assigned user from the prompt if one was selected
            let assignedUserId = null;
            if (selectedUser) {
                assignedUserId = selectedUser._id;
            } else {
                // Try to find any @mentions in the text
                try {
                    const mentionRegex = /@([a-zA-Z]+\s[a-zA-Z]+)/g;
                    const matches = aiPrompt.match(mentionRegex);

                    if (matches && matches.length > 0) {
                        // Extract the name without the @ symbol
                        const mentionedName = matches[0].substring(1).trim();

                        // Find user by name
                        const user = users.find(u =>
                            `${u.firstName} ${u.lastName}`.toLowerCase() === mentionedName.toLowerCase()
                        );

                        if (user) {
                            assignedUserId = user._id;
                            setSelectedUser(user);
                        }
                    }
                } catch (error) {
                    console.error('Error extracting @mentions:', error);
                    // Continue without assigning a user
                }
            }

            const response = await axios.post('/api/tasks/suggest', {
                prompt: aiPrompt,
                assignedUserId
            });

            if (response.data.success) {
                if (response.data.creditStatus) {
                    setAiCredits(response.data.creditStatus.remaining);
                }

                setAiTaskData(response.data.taskData);
                closeAiPromptDialog();
                openModal(response.data.taskData);
            } else {
                // Handle credit errors specifically
                if (response.data.creditStatus && response.data.creditStatus.remaining === 0) {
                    toast.error("No AI credits remaining. Please contact your administrator.");
                } else {
                    toast.error("Failed to generate task from AI: " + response.data.error);
                }
            }
        } catch (error: any) {
            console.error('Error processing AI prompt:', error);
            if (error.response?.data?.creditStatus?.remaining === 0) {
                toast.error("No AI credits remaining. Please contact your administrator.");
            } else {
                toast.error(error.response?.data?.error || "Failed to process AI prompt");
            }
        } finally {
            setIsProcessingAi(false);
        }
    };

    const fetchTasks = async () => {
        try {
            const response = await fetch('/api/tasks/organization');
            const result = await response.json();
            if (response.ok) {
                setTasks(result.data);
            } else {
                console.error('Error fetching tasks:', result.error);
                toast.error('Failed to fetch tasks');
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            toast.error('An error occurred while fetching tasks');
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const deleteTaskAndUpdateList = async (taskId: string): Promise<void> => {
        try {
            await axios.delete('/api/tasks/delete', {
                data: { id: taskId },
            });
            // Update tasks list after deletion
            await fetchTasks();
            toast.success("Task deleted successfully");
        } catch (error: any) {
            console.error('Error deleting task:', error.message);
            toast.error("Failed to delete task");
        }
    };

    const handleTaskUpdate = async (): Promise<void> => {
        try {
            await fetchTasks();
        } catch (error) {
            console.error('Error updating tasks:', error);
            toast.error('Failed to update tasks');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <DotLottieReact
                    src="/lottie/loading.lottie"
                    loop
                    autoplay
                    className="h-36 w-36"
                />
            </div>
        );
    }

    return (
        <div className="flex h-screen mt-12 overflow-hidden bg-background">
            {/* Sidebar */}
            <TaskSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                userRole={currentUser?.role}
            />

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                <TaskDashboard
                    tasks={tasks}
                    currentUser={currentUser}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    onTaskDelete={deleteTaskAndUpdateList}
                    onTaskUpdate={handleTaskUpdate}
                />

                {/* Quick Actions Menu */}
                <div className="fixed bottom-8 right-8 z-50">
                    {/* Backdrop for closing menu */}
                    {isQuickActionsOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
                            onClick={() => setIsQuickActionsOpen(false)}
                        />
                    )}

                    {/* Quick Action Buttons */}
                    <AnimatePresence>
                        {isQuickActionsOpen && (
                            <motion.div
                                className="absolute bottom-20 right-0 space-y-3"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 25,
                                    staggerChildren: 0.1,
                                    delayChildren: 0.1
                                }}
                            >
                                {quickActions.map((action, index) => (
                                    <motion.div
                                        key={action.id}
                                        initial={{ opacity: 0, x: 50, scale: 0.8 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        exit={{ opacity: 0, x: 50, scale: 0.8 }}
                                        transition={{
                                            delay: index * 0.05,
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 20
                                        }}
                                        className="relative group"
                                    >
                                        <button
                                            onClick={() => handleQuickAction(action.id)}
                                            disabled={action.id === 'ai-task' && !action.credits}
                                            className={`
                                                flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg
                                                bg-gradient-to-r ${action.gradient} hover:${action.hoverGradient}
                                                transform transition-all duration-200 hover:scale-105 hover:shadow-xl
                                                backdrop-blur-sm border border-white/10
                                                ${action.id === 'ai-task' && !action.credits
                                                    ? 'opacity-50 cursor-not-allowed'
                                                    : 'hover:-translate-y-1'
                                                }
                                            `}
                                        >
                                            {/* Icon with glow effect */}
                                            <div className="relative">
                                                <action.icon
                                                    size={20}
                                                    className={`${action.iconColor} drop-shadow-sm relative z-10`}
                                                />
                                                {/* Glow effect */}
                                                <div className="absolute inset-0 blur-md opacity-60">
                                                    <action.icon size={20} className={action.iconColor} />
                                                </div>
                                            </div>

                                            {/* Text content */}
                                            <div className="text-left min-w-[100px]">
                                                <div className="text-white font-medium text-sm">
                                                    {action.label}
                                                </div>
                                                <div className="text-white/70 text-xs">
                                                    {action.description}
                                                </div>
                                            </div>

                                            {/* Special indicator for AI task */}
                                            {action.id === 'ai-task' && (
                                                <div className={`
                                                    ml-auto px-2 py-0.5 rounded-full text-xs font-medium
                                                    ${aiCredits > 10 ? 'bg-emerald-500/20 text-emerald-300' :
                                                        aiCredits > 0 ? 'bg-amber-500/20 text-amber-300' :
                                                            'bg-red-500/20 text-red-300'
                                                    }
                                                `}>
                                                    {aiCredits}
                                                </div>
                                            )}

                                            {/* Ripple effect on hover */}
                                            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="absolute inset-0 rounded-2xl bg-white/10 animate-pulse"></div>
                                            </div>
                                        </button>

                                        {/* Tooltip */}
                                        <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                            <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                                {action.description}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Main Toggle Button */}
                    <motion.button
                        onClick={toggleQuickActions}
                        className="group relative w-14 h-14 flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                        {/* Animated background */}
                        <motion.div
                            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-lg"
                            animate={{
                                rotate: isQuickActionsOpen ? 180 : 0,
                            }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        />

                        {/* Inner shadow/highlight */}
                        <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>

                        {/* Icon */}
                        <motion.div
                            animate={{
                                rotate: isQuickActionsOpen ? 45 : 0,
                            }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="relative z-10"
                        >
                            <Plus size={24} className="text-white drop-shadow-sm" />
                        </motion.div>

                        {/* Pulsing ring effect */}
                        <motion.div
                            className="absolute inset-0 rounded-2xl border-2 border-white/30"
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.5, 0, 0.5],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />

                        {/* Glow effect */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                    </motion.button>
                </div>

                {/* AI Prompt Dialog */}
                <Dialog open={isAiPromptOpen} onOpenChange={setIsAiPromptOpen}>
                    <DialogContent className="sm:max-w-[550px] h-fit max-h-screen  p-0 overflow-y-auto m-auto bg-gradient-to-b from-slate-950 to-slate-900 border border-indigo-500/30 shadow-lg shadow-indigo-500/20">
                        {/* Header with futuristic design */}
                        <div className="bg-gradient-to-r from-indigo-900/80 to-purple-900/80 p-5 border-b border-indigo-500/30">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="absolute inset-0 rounded-full bg-cyan-400 blur-md opacity-60 animate-pulse"></div>
                                        <div className="relative bg-indigo-900 rounded-full p-2">
                                            <Sparkles className="h-5 w-5 text-cyan-300" />
                                        </div>
                                    </div>
                                    <div>
                                        <DialogTitle className="text-white text-lg font-medium">AI Task Assistant</DialogTitle>
                                        <DialogDescription className="text-indigo-200 text-sm">
                                            Turn your ideas into structured tasks
                                        </DialogDescription>
                                    </div>
                                </div>

                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${aiCredits > 10 ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/40' :
                                    aiCredits > 0 ? 'bg-amber-900/60 text-amber-300 border border-amber-500/40' :
                                        'bg-red-900/60 text-red-300 border border-red-500/40'
                                    }`}>
                                    {aiCredits <= 5 && <AlertCircle className="h-3.5 w-3.5" />}
                                    <span>{aiCredits} credit{aiCredits !== 1 ? 's' : ''}</span>
                                </div>
                            </div>
                        </div>

                        {/* AI interaction area */}
                        <div className="p-5 space-y-5">
                            {/* Example prompts */}
                            <div className="space-y-2">
                                <h3 className="text-indigo-300 text-xs font-medium flex items-center gap-1.5">
                                    <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
                                    <div className="w-2 h-1 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                                    SUGGESTED PROMPTS
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        "Schedule a team meeting next Thursday",
                                        "Prepare Q4 marketing report",
                                        "Review designs for homepage update",
                                        "Follow up with client about proposal"
                                    ].map((prompt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setAiPrompt(prompt)}
                                            className="text-xs px-3 py-2 bg-indigo-950/50 border border-indigo-500/20 hover:border-indigo-500/40 rounded-md text-indigo-200 text-left transition-colors hover:bg-indigo-900/30 truncate"
                                        >
                                            {prompt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Input area with futuristic styling */}
                            <div className="relative mt-4">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-30"></div>
                                <div className="relative bg-slate-950 rounded-lg border border-indigo-500/30">
                                    <Textarea
                                        ref={textareaRef}
                                        placeholder="Describe your task... (Use @mentions to assign users)"
                                        value={aiPrompt}
                                        onChange={handleInputChange}
                                        className="min-h-[120px] p-4 bg-transparent border-0 focus-visible:ring-1 focus-visible:ring-indigo-500 text-indigo-100 placeholder:text-indigo-400/70 resize-none"
                                    />

                                    {/* Animated elements to make it look AI-like */}
                                    <div className="absolute bottom-3 right-3 flex space-x-1">
                                        <div className={`w-1.5 h-1.5 rounded-full ${aiPrompt ? 'bg-cyan-400' : 'bg-slate-600'} animate-pulse`}></div>
                                        <div className={`w-1.5 h-1.5 rounded-full ${aiPrompt ? 'bg-indigo-400' : 'bg-slate-600'} animate-pulse`} style={{ animationDelay: '0.2s' }}></div>
                                        <div className={`w-1.5 h-1.5 rounded-full ${aiPrompt ? 'bg-purple-400' : 'bg-slate-600'} animate-pulse`} style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>

                            {/* User Mention Popover */}
                            {showUserPopover && mentionStartPosition !== -1 && (
                                <div className='flex justify-center w-full '>
                                    <div
                                        ref={popoverRef}
                                        className="absolute z-50 -ml-96 bg-slate-900 border border-indigo-500/40 rounded-md shadow-lg shadow-indigo-500/20 mt-2 w-[92%] max-h-64 overflow-y-auto"
                                        style={{
                                            top: `${textareaRef.current ? textareaRef.current.getBoundingClientRect().bottom + window.scrollY + 5 : 0}px`,
                                            left: `${textareaRef.current ? textareaRef.current.getBoundingClientRect().left + window.scrollX : 0}px`,
                                        }}
                                    >


                                        <div className="max-h-48 overflow-y-auto py-1">
                                            {filteredUsers.length === 0 ? (
                                                <div className="p-3 text-sm text-indigo-400 text-center">
                                                    No users found
                                                </div>
                                            ) : (
                                                filteredUsers.map((user) => (
                                                    <div
                                                        key={user._id}
                                                        onClick={() => handleSelectUser(user)}
                                                        className="flex items-center gap-2.5 px-3 py-2 cursor-pointer hover:bg-indigo-900/40 transition-colors"
                                                    >
                                                        <Avatar className="h-7 w-7 border border-indigo-500/20">
                                                            {user.profilePic ? (
                                                                <AvatarImage src={user.profilePic} />
                                                            ) : (
                                                                <AvatarFallback className="bg-indigo-900 text-indigo-200 text-xs">
                                                                    {user.firstName[0]}{user.lastName[0]}
                                                                </AvatarFallback>
                                                            )}
                                                        </Avatar>
                                                        <span className="text-sm text-indigo-200">{user.firstName} {user.lastName}</span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Selected user chip */}
                            {selectedUser && (
                                <div className="flex items-center gap-2 mt-2 p-2.5 bg-indigo-900/30 rounded-md border border-indigo-500/30">
                                    <Avatar className="h-6 w-6">
                                        {selectedUser.profilePic ? (
                                            <AvatarImage src={selectedUser.profilePic} />
                                        ) : (
                                            <AvatarFallback className="bg-indigo-700 text-indigo-200 text-xs">
                                                {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    <span className="text-sm text-indigo-200">Assigning to <span className="font-semibold">{selectedUser.firstName} {selectedUser.lastName}</span></span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 w-5 rounded-full ml-auto hover:bg-indigo-800/50 text-indigo-400"
                                        onClick={() => setSelectedUser(null)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            )}

                            {/* AI explainer */}
                            <div className="mt-3 bg-indigo-950/40 border border-indigo-500/20 rounded-md p-3 text-xs text-indigo-300 flex gap-2 items-start">
                                <div className="mt-0.5">
                                    <AlertCircle className="h-4 w-4 text-indigo-400" />
                                </div>
                                <div>
                                    <p>
                                        The AI will analyze your request and create a task with suggested title, description, priority,
                                        category, and due date. You can edit these details before saving.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer/actions area */}
                        <div className="flex justify-between items-center p-4 bg-slate-950 border-t border-indigo-500/30">
                            <span className="text-xs text-indigo-400">
                                Uses 1 credit per generation
                            </span>

                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    onClick={closeAiPromptDialog}
                                    className="border border-indigo-500/20 text-indigo-300 hover:bg-indigo-950 hover:text-indigo-200"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={processAiPrompt}
                                    disabled={isProcessingAi || !aiPrompt.trim() || aiCredits <= 0}
                                    className={`relative group ${aiCredits <= 0 ? 'bg-slate-800 text-slate-400 cursor-not-allowed' :
                                        'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                                        }`}
                                >
                                    {isProcessingAi ? (
                                        <>
                                            <div className="absolute inset-0 rounded bg-indigo-400/10 blur-sm animate-pulse"></div>
                                            <div className="relative flex items-center">
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Processing...
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {aiCredits > 0 && (
                                                <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-400 to-purple-400 rounded opacity-0 group-hover:opacity-50 blur-sm transition-opacity duration-300"></div>
                                            )}
                                            <div className="relative flex items-center">
                                                <Sparkles className="h-4 w-4 mr-2" />
                                                {aiCredits <= 0 ? 'No Credits Left' : 'Generate Task'}
                                            </div>
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
             {/* Voice Dialog - Simplified */}
<Dialog open={isVoiceDialogOpen} onOpenChange={setIsVoiceDialogOpen}>
    <DialogContent className="sm:max-w-[500px] max-h-[90vh] p-0 overflow-hidden bg-white border-0 shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-rose-50 to-pink-50">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 flex items-center justify-center">
                        <Mic className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <DialogTitle className="text-gray-900 text-lg font-semibold">Voice Task Creator</DialogTitle>
                        <DialogDescription className="text-gray-500 text-sm">
                            {isTranscribing ? 'Processing your voice...' : 'Speak your task and we\'ll create it'}
                        </DialogDescription>
                    </div>
                </div>
                
                {/* Credits Badge */}
                <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    aiCredits > 10 ? 'bg-green-100 text-green-700' :
                    aiCredits > 0 ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                }`}>
                    {aiCredits} {aiCredits === 1 ? 'credit' : 'credits'}
                </div>
            </div>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-6">
            {/* Recording Interface */}
            <div className="text-center space-y-6">
                {/* Visual Recording Indicator */}
                <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
                    {isRecording && (
                        <>
                            <div className="absolute inset-0 rounded-full bg-red-100 animate-ping"></div>
                            <div className="absolute inset-2 rounded-full bg-red-200 animate-ping animation-delay-75"></div>
                        </>
                    )}
                    {isTranscribing && (
                        <div className="absolute inset-0 rounded-full bg-blue-100 animate-pulse"></div>
                    )}
                    <div className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isTranscribing 
                            ? 'bg-blue-500 shadow-lg shadow-blue-500/50 scale-110' 
                            : isRecording 
                                ? 'bg-red-500 shadow-lg shadow-red-500/50 scale-110' 
                                : 'bg-gray-200 hover:bg-gray-300'
                    }`}>
                        {isTranscribing ? (
                            <Loader2 className="h-8 w-8 text-white animate-spin" />
                        ) : isRecording ? (
                            <MicOff className="h-8 w-8 text-white animate-pulse" />
                        ) : (
                            <Mic className="h-8 w-8 text-gray-600" />
                        )}
                    </div>
                </div>

                {/* Status Text */}
                <div className="space-y-2">
                    <h3 className="font-medium text-gray-900">
                        {isTranscribing ? 'Creating your task...' :
                         isRecording ? 'Listening... Speak your task' :
                         'Ready to record'}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {isTranscribing ? 'Structuring your Tasks with Zapllo AI' :
                         isRecording ? 'Describe your task with details like due date, assignee, and priority' :
                         'Tap record and speak naturally - the task will be created automatically'}
                    </p>
                </div>

                {/* Recording Controls */}
                <div className="flex justify-center">
                    {!isRecording && !isTranscribing && (
                        <Button
                            onClick={startRecording}
                            disabled={aiCredits <= 0}
                            className={`px-8 py-3 text-base ${
                                aiCredits <= 0 
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white'
                            }`}
                        >
                            <Mic className="h-5 w-5 mr-2" />
                            Start Recording
                        </Button>
                    )}

                    {isRecording && !isTranscribing && (
                        <Button
                            onClick={stopRecording}
                            className="px-8 py-3 text-base bg-red-600 hover:bg-red-700 text-white"
                        >
                            <MicOff className="h-5 w-5 mr-2" />
                            Stop & Create Task
                        </Button>
                    )}

                    {isTranscribing && (
                        <div className="flex items-center gap-2 text-blue-600">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span className="font-medium">Processing...</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Tips - Show only when not recording or processing */}
            {!isRecording && !isTranscribing && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Tips for better results</h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                        <li>• Speak clearly and mention specific details</li>
                        <li>• Include due dates: "next Friday", "January 15th"</li>
                        <li>• Assign tasks: "assign to John" or "for Sarah"</li>
                        <li>• Mention priority: "high priority" or "urgent"</li>
                    </ul>
                </div>
            )}

            {/* Processing indicator */}
            {isTranscribing && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm font-medium text-blue-900">
                            Converting speech to structured task...
                        </span>
                    </div>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">
                {isTranscribing ? 'Processing...' : 'Uses 1 credit per voice recording'}
            </span>

            <Button
                variant="outline"
                onClick={closeVoiceDialog}
                disabled={isRecording || isTranscribing}
                className="text-gray-700 border-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
                {isRecording || isTranscribing ? 'Processing...' : 'Cancel'}
            </Button>
        </div>
    </DialogContent>
</Dialog>

                {/* Task Creation Modal */}
                <AnimatePresence>
                    {isModalOpen && <TaskModal closeModal={closeModal} prefillData={aiTaskData} />}
                </AnimatePresence>
            </div>
        </div>
    );
}
'use client'
import React, { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import TaskModal from '@/components/globals/taskModal';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import TaskDashboard from '@/components/tasks/TaskDashboard';
import TaskSidebar from '@/components/tasks/TaskSidebar';
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { toast } from 'sonner';

export default function TaskManagement() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [currentUser, setCurrentUser] = useState<any>();
    const [isPlanEligible, setIsPlanEligible] = useState(false);
    const [isTrialExpired, setIsTrialExpired] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<string>("all");

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

    useEffect(() => {
        if (currentUser?.isTaskAccess === false) {
            router.push('/dashboard');
        }
    }, [currentUser, router]);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        fetchTasks();
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
                    setActiveTab={setActiveTab} // This is now properly passed down
                    onTaskDelete={deleteTaskAndUpdateList}
                    onTaskUpdate={handleTaskUpdate}
                />

                {/* Floating Action Button */}
                <div className="fixed bottom-8 right-8 z-50">
                    <button
                        className="flex items-center justify-center w-12 h-12 rounded-full text-white bg-primary shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all"
                        onClick={openModal}
                    >
                        <Plus size={24} />
                    </button>
                </div>

                {/* Task Creation Modal */}
                <AnimatePresence>
                    {isModalOpen && <TaskModal closeModal={closeModal} />}
                </AnimatePresence>
            </div>
        </div>
    );
}

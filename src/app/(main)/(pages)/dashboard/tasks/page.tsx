'use client'
import TasksTab from '@/components/globals/taskstab'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, PlusCircleIcon } from 'lucide-react';
import TaskModal from '@/components/globals/taskModal';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


// Define the Task interface
// interface Task {
//     _id: string;
//     title: string;
//     user: User;
//     description: string;
//     assignedUser: User;
//     category: string;
//     priority: string;
//     repeatType?: string;
//     repeat: boolean;
//     days?: string[];
//     categories?: string[];
//     dueDate: string;
//     attachment?: string;
//     links?: string[];
//     status: string;
//     comments: Comment[];
//     createdAt: string;
// }


interface User {
    _id: string;
    firstName: string;
    lastName: string;
    organization: string;
}


export default function TaskManagement() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [currentUser, setCurrentUser] = useState<any>();
    const [isTrialExpired, setIsTrialExpired] = useState(false);
    const [userId, setUserId] = useState("");
    const [progress, setProgress] = useState<boolean[]>([]);
    const [isLeaveAcess, setIsLeaveAccess] = useState<boolean | null>(null); // Track the user's role
    const [isTaskAccess, setIsTaskAccess] = useState<boolean | null>(null); // Track the user's role

    const router = useRouter();

    useEffect(() => {
        const getUserDetails = async () => {
            const res = await axios.get('/api/users/me')
            setCurrentUser(res.data.data);
            const trialStatusRes = await axios.get('/api/organization/trial-status');
            setIsTrialExpired(trialStatusRes.data.isExpired);
        }
        getUserDetails();
    }, [])

    useEffect(() => {
        if (currentUser?.isTaskAccess === false) {
            router.push('/dashboard')
        }
    }, []);


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
                console.log(result.data, 'logging')
                setTasks(result.data);
            } else {
                console.error('Error fetching tasks:', result.error);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    console.log(tasks, 'tasks from organization')

    const deleteTaskAndUpdateList = async (taskId: string) => {
        try {
            await axios.delete('/api/tasks/delete', {
                data: { id: taskId },
            });
            // Update tasks list after deletion
            fetchTasks();
        } catch (error: any) {
            console.error('Error deleting task:', error.message);
            // Handle error as needed
        }
    };


    const handleTaskUpdate = async () => {
        await fetchTasks();
    };


    useEffect(() => {
        const getUserDetails = async () => {
            try {
                // Fetch trial status
                const response = await axios.get('/api/organization/getById');
                console.log(response.data.data); // Log the organization data

                const organization = response.data.data;

                // Check if the trial has expired
                const isExpired = organization.trialExpires && new Date(organization.trialExpires) <= new Date();
                console.log('isExpired:', isExpired);
                console.log('trialExpires:', organization.trialExpires);

                setIsTrialExpired(isExpired); // Set to true if expired, false otherwise
            } catch (error) {
                console.error('Error fetching user details or trial status:', error);
            }
        }
        getUserDetails();
    }, []);


   


    return (
        <div className='p-4  '>
            {/* <h1 className='text-center text-xl font-bold under'>Task Management</h1> */}
            <div className="fixed bottom-8 right-8 z-50">
                <button className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-[#b8631f] text-white bg-[#FC8929]  focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50" onClick={openModal}>
                    <Plus size={24} />
                </button>
            </div>
            <AnimatePresence>
                {isModalOpen && (

                    <TaskModal closeModal={closeModal} />

                )}
            </AnimatePresence>
            <div className='p-2 w-screen overflow-x-hidden  flex h-screen'>
                {/* <div className='p-2 border-r  -mt-24 ml-40'></div> */}
                {/* <h1 className='text-center font-bold text-xl p-4'>Teams</h1> */}
                <TasksTab tasks={tasks} currentUser={currentUser} onTaskDelete={deleteTaskAndUpdateList} onTaskUpdate={handleTaskUpdate} />
            </div>
        </div>
    )
}

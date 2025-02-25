'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Progress } from '@/components/ui/progress';
import ChecklistSidebar from '@/components/sidebar/checklistSidebar';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Confetti from 'react-confetti'; // Import confetti
import { VideoIcon } from 'lucide-react';
import { String } from 'aws-sdk/clients/cloudsearch';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Checkbox } from '@/components/ui/checkbox';

// Define types for ChecklistItem and Progress
interface ChecklistItem {
    _id: string;
    text: string;
    tutorialLink?: string;
}

export default function ChecklistPage({ }) {
    const [progress, setProgress] = useState<String[]>([]);
    const [userId, setUserId] = useState("");
    const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]); // Array of ChecklistItem
    const [showConfetti, setShowConfetti] = useState(false);


    console.log(progress, 'progress')

    useEffect(() => {
        const fetchChecklistItems = async () => {
            try {
                const res = await axios.get("/api/checklist/get");
                setChecklistItems(res.data.checklistItems);
                // Fetch user progress
                const progressRes = await axios.get('/api/get-checklist-progress');
                setProgress(progressRes.data.progress || []);
            } catch (error) {
                console.error("Error fetching checklist items:", error);
            }
        };

        fetchChecklistItems();

    }, []);

    const handleObjectiveChange = async (itemId: string, isCompleted: boolean) => {
        const updatedProgress = isCompleted
            ? [...progress, itemId]
            : progress.filter((id) => id !== itemId);

        setProgress(updatedProgress);

        if (isCompleted) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
        }

        try {
            await axios.patch("/api/update-checklist-progress", {
                checklistItemId: itemId,
                isCompleted,
            });
        } catch (error) {
            console.error("Error updating checklist progress:", error);
        }
    };

    // Calculate the progress percentage
    const calculateProgress = () => {
        if (!checklistItems.length) return 0;
        const completedCount = checklistItems.filter((item) => progress.includes(item._id)).length;
        const progressPercentage = (completedCount / checklistItems.length) * 100;
        return Math.round(progressPercentage);
    };


    const [isTrialExpired, setIsTrialExpired] = useState(false);

    useEffect(() => {
        const getUserDetails = async () => {
            try {
                const response = await axios.get('/api/organization/getById');
                const organization = response.data.data;
                const isExpired = organization.trialExpires && new Date(organization.trialExpires) <= new Date();
                setIsTrialExpired(isExpired);
            } catch (error) {
                console.error('Error fetching user details or trial status:', error);
            }
        }
        getUserDetails();
    }, []);


    return (
        <div className="flex mt-24 ">
            <ChecklistSidebar />
            <div className="flex-1 p-4">
                <div className="ml-48 border-l  -   -mt-32 max-w-8xl mx-auto">
                    <div className="gap-2 flex mb-6 w-full">
                        <div className=" h-full max-h-screen  overflow-y-scroll scrollbar-hide  w-full">
                            <div className="p-4 w-full ">
                                {showConfetti &&
                                    <div className=' flex items-center m-auto h-72 right-0 absolute justify-end  '>
                                        <DotLottieReact
                                            src="/lottie/confetti.lottie"
                                            autoplay

                                        />
                                    </div>
                                } {/* Render confetti if needed */}
                                <div className='border  mt-20  rounded-2xl p-4 w-full'>
                                    <h1 className="text-font-bold mb-4">Checklist Progress</h1>
                                    <Progress value={calculateProgress()} className='mb-4' />
                                </div>
                                <div className="space-y-2 mt-4 w-full border rounded-xl  mb-12 ">
                                    {checklistItems.map((item) => (
                                        <div key={item._id} className="w-full border-b p-2 rounded flex items-center justify-between">
                                            <div className='flex w-full items-center gap-2'>
                                                <Checkbox
                                                    checked={progress.includes(item._id)}
                                                    onCheckedChange={(checked) =>
                                                        handleObjectiveChange(item._id, Boolean(checked))
                                                    }
                                                    className="cursor-pointer"
                                                />
                                                {/* <span>{index + 1}.</span> Add serial number */}

                                                <label className={`text-sm overflow-hidden ${progress.includes(item._id)
                                                    ? 'line-through text-gray-400'
                                                    : 'dark:text-white'
                                                    }`}
                                                >{item.text}
                                                </label>
                                            </div>

                                            {item.tutorialLink && (
                                                <div className='h-8 w-8 rounded-full border text-muted-foreground hover:text-white  cursor-pointer bg-transparent hover:bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929]  flex items-center justify-center  '>
                                                    <a className='hover:text-white' href={item.tutorialLink} target="_blank" rel="noopener noreferrer">
                                                        <VideoIcon className=' hover:text-white h-5 w-5' />
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}




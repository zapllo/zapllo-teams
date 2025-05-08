'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Progress } from '@/components/ui/progress';
import ChecklistSidebar from '@/components/sidebar/checklistSidebar';
import { Button } from '@/components/ui/button';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, CheckCircle, AlertCircle, ListFilter } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { String } from 'aws-sdk/clients/cloudsearch';
import { Skeleton } from '@/components/ui/skeleton';

// Define types for ChecklistItem and Progress
interface ChecklistItem {
    _id: string;
    text: string;
    tutorialLink?: string;
}

export default function ChecklistPage() {
    const [progress, setProgress] = useState<String[]>([]);
    const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isTrialExpired, setIsTrialExpired] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

    useEffect(() => {
        const fetchChecklistItems = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get("/api/checklist/get");
                setChecklistItems(res.data.checklistItems);

                // Fetch user progress
                const progressRes = await axios.get('/api/get-checklist-progress');
                setProgress(progressRes.data.progress || []);
            } catch (error) {
                console.error("Error fetching checklist items:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchChecklistItems();
    }, []);

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

    // Get filtered items based on current filter
    const getFilteredItems = () => {
        switch (filter) {
            case 'completed':
                return checklistItems.filter(item => progress.includes(item._id));
            case 'pending':
                return checklistItems.filter(item => !progress.includes(item._id));
            default:
                return checklistItems;
        }
    };

    const filteredItems = getFilteredItems();
    const completedItems = checklistItems.filter(item => progress.includes(item._id));
    const pendingItems = checklistItems.filter(item => !progress.includes(item._id));
    const progressPercentage = calculateProgress();


if (isLoading) {
  return (
    <div className="flex h-full mt-24">
      <div className="flex-1 px-4 -mt-12 py-6">
        <div className="mx-auto">
          <div className="space-y-8 p-4">
            {/* Progress Card Skeleton */}
            <Card className="mb-4 bg-muted/50 dark:bg-muted/20 pb-4">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                  <Skeleton className="h-7 w-32 rounded-full" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-2 flex items-center justify-between">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-2.5 w-full rounded-full" />
              </CardContent>
            </Card>

            {/* Checklist Header Skeleton */}
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-7 w-40" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-9 w-24 rounded-md" />
              </div>
            </div>

            {/* Checklist Items Skeleton */}
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {[...Array(8)].map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 transition-colors"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-5 w-full max-w-[85%]" />
                      </div>

                      <div className="flex items-center">
                        {index % 3 === 0 && ( // Randomly show the completed indicator for some items
                          <Skeleton className="h-5 w-5 rounded-full mr-2" />
                        )}
                        {index % 2 === 0 && ( // Randomly show the tutorial button for some items
                          <Skeleton className="h-8 w-8 rounded-full" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}



    return (
        <div className="flex h-full mt-24">
            {/* <ChecklistSidebar /> */}
            <div className="flex-1 px-4 -mt-12 py-6">
                <div className=" mx-auto">
                    {showConfetti && (
                        <div className='fixed inset-0 pointer-events-none z-50'>
                            <DotLottieReact src="/lottie/confetti.lottie" autoplay />
                        </div>
                    )}

                    <div className="space-y-8 p-4 h-screen overflow-y-scroll scrollbar-hide">
                        <Card className="mb-4 bg-muted/50 dark:bg-muted/20 pb-4">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-2xl font-bold">Onboarding Progress</CardTitle>
                                        <CardDescription>Complete these tasks to get started</CardDescription>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={`text-lg px-3 py-1 ${progressPercentage === 100 ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : ''}`}
                                    >
                                        {progressPercentage}% Complete
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
                                    <span>{completedItems.length} of {checklistItems.length} tasks completed</span>
                                    <span>{pendingItems.length} remaining</span>
                                </div>
                                <Progress
                                    value={progressPercentage}
                                    className="h-2.5 transition-all duration-500"
                                />
                            </CardContent>
                        </Card>

                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">Checklist Tasks</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                    {filter === 'all'
                                        ? 'Showing all tasks'
                                        : filter === 'completed'
                                            ? 'Showing completed tasks'
                                            : 'Showing pending tasks'
                                    }
                                </span>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <ListFilter className="h-4 w-4" />
                                            Filter
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => setFilter('all')}>
                                            All Tasks ({checklistItems.length})
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setFilter('completed')}>
                                            Completed ({completedItems.length})
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setFilter('pending')}>
                                            Pending ({pendingItems.length})
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        <Card >
                            <CardContent className="p-0 ">
                                {filteredItems.length === 0 ? (
                                    <div className="text-center py-10 text-muted-foreground">
                                        <p>No {filter === 'all' ? '' : filter} tasks available</p>
                                    </div>
                                ) : (
                                    <div className="divide-y pb-16">
                                        {filteredItems.map((item) => (
                                            <div
                                                key={item._id}
                                                className={`flex items-center justify-between p-4 transition-colors ${progress.includes(item._id)
                                                        ? 'bg-muted/30'
                                                        : 'hover:bg-muted/50'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3 w-full">
                                                    <Checkbox
                                                        id={`task-${item._id}`}
                                                        checked={progress.includes(item._id)}
                                                        onCheckedChange={(checked) =>
                                                            handleObjectiveChange(item._id, Boolean(checked))
                                                        }
                                                        className="h-5 w-5 rounded-full border-2 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                                    />
                                                    <label
                                                        htmlFor={`task-${item._id}`}
                                                        className={`text-base flex-1 cursor-pointer ${progress.includes(item._id)
                                                                ? 'text-muted-foreground line-through'
                                                                : ''
                                                            }`}
                                                    >
                                                        {item.text}
                                                    </label>
                                                </div>

                                                <div className="flex items-center">
                                                    {progress.includes(item._id) && (
                                                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                                    )}

                                                    {item.tutorialLink && (
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-8 w-8 rounded-full p-0"
                                                                        onClick={() => window.open(item.tutorialLink, '_blank')}
                                                                    >
                                                                        <PlayCircle className="h-5 w-5 text-primary" />
                                                                        <span className="sr-only">Watch tutorial</span>
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>Watch tutorial</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>


                    </div>
                </div>
            </div>
        </div>
    );
}

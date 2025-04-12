'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { ArrowLeft, Share2, Bookmark, CheckCircle, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { toast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';

export default function TutorialDetails() {
    const { id } = useParams();
    const [tutorial, setTutorial] = useState<any>(null);
    const [relatedTutorials, setRelatedTutorials] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchTutorial = async () => {
            try {
                const response = await axios.get(`/api/tutorials/${id}`);
                setTutorial(response.data.tutorial);

                // Fetch related tutorials
                const allTutorials = await axios.get('/api/tutorials');
                const related = allTutorials.data.tutorials
                    .filter((t: any) =>
                        t.category === response.data.tutorial.category &&
                        t._id !== response.data.tutorial._id)
                    .slice(0, 4);
                setRelatedTutorials(related);
            } catch (err) {
                console.error("Failed to fetch tutorial:", err);
                setError("Failed to load tutorial.");
            } finally {
                setLoading(false);
            }
        };

        fetchTutorial();
    }, [id]);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: tutorial.title,
                url: window.location.href,
            }).catch(err => console.error('Error sharing:', err));
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast({
                title: "Link copied to clipboard",
                description: "You can now share this tutorial with others.",
                action: <ToastAction altText="Close">Close</ToastAction>,
            });
        }
    };

    const handleRelatedTutorialClick = (tutorialId: string) => {
        router.push(`/help/tutorials/${tutorialId}`);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 animate-pulse">
                <div className="flex items-center mb-6 gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-1/3" />
                </div>
                <Skeleton className="w-full h-[500px] rounded-lg mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <Skeleton className="h-8 w-3/4 mb-4" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                    <div>
                        <Skeleton className="h-8 w-1/2 mb-4" />
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-24 w-full rounded-lg" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !tutorial) {
        return (
            <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[70vh]">
                <DotLottieReact
                    src="/lottie/error.lottie"
                    loop
                    autoplay
                    className="h-56"
                />
                <p className="text-red-500 text-lg mt-4">{error || "Tutorial not found"}</p>
                <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => router.push('/help/tutorials')}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tutorials
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 h-fit max-h-screen scrollbar-hide overflow-y-scroll">
            <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        asChild
                    >
                        <Link href="/help/tutorials">
                        <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">{tutorial.title}</h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleShare}>
                        <Share2 className="h-4 w-4 mr-2" /> Share
                    </Button>
                    <Button variant="outline" size="sm">
                        <Bookmark className="h-4 w-4 mr-2" /> Save
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card className="mb-8 overflow-hidden">
                        <div className="aspect-video w-full bg-black">
                            <iframe
                                src={tutorial.link}
                                title={tutorial.title}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </Card>

                    <Tabs defaultValue="overview" className="mb-8">
                        <TabsList className="mb-4">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="transcript">Transcript</TabsTrigger>
                            <TabsTrigger value="resources">Resources</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300">
                                    {tutorial.category}
                                </Badge>
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <Clock className="h-4 w-4 mr-1" />
                                    <span>10 min</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    <span>{new Date(tutorial.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <h2 className="text-xl font-semibold">About this tutorial</h2>
                            <p className="text-gray-700 dark:text-gray-300">
                                This tutorial guides you through using the {tutorial.category} effectively.
                                You'll learn the core features and best practices to maximize your productivity.
                            </p>

                            <h3 className="text-lg font-semibold mt-6">What you'll learn</h3>
                            <ul className="space-y-2">
                                <li className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                    <span>How to navigate the {tutorial.category} interface</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                    <span>Core features and functionality</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                    <span>Tips and tricks for advanced usage</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                    <span>Troubleshooting common issues</span>
                                </li>
                            </ul>
                        </TabsContent>

                        <TabsContent value="transcript">
                            <Card>
                                <CardContent className="p-6">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                                        Transcript is not available for this tutorial yet.
                                    </p>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="resources">
                            <Card>
                                <CardContent className="p-6">
                                    <ul className="space-y-3">
                                        <li>
                                            <a href="#" className="flex items-center text-blue-600 hover:underline">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                </svg>
                                                {tutorial.category} Documentation
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="flex items-center text-blue-600 hover:underline">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                </svg>
                                                Quick Start Guide
                                            </a>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="lg:col-span-1">
                    <h2 className="text-xl font-semibold mb-4">Related Tutorials</h2>
                    {relatedTutorials.length > 0 ? (
                        <div className="space-y-4">
                            {relatedTutorials.map(related => (
                                <Card
                                    key={related._id}
                                    className="cursor-pointer hover:shadow-md transition-shadow"
                                    onClick={() => handleRelatedTutorialClick(related._id)}
                                >
                                    <div className="flex p-2">
                                        <img
                                            src={related.thumbnail}
                                            alt={related.title}
                                            className="w-20 h-20 object-cover rounded-md"
                                        />
                                        <div className="ml-3 flex flex-col justify-center">
                                            <h3 className="font-medium line-clamp-2 text-sm">{related.title}</h3>
                                            <p className="text-xs text-gray-500 mt-1">{related.category}</p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="p-6 text-center">
                                <p className="text-gray-500">No related tutorials found</p>
                            </CardContent>
                        </Card>
                    )}

                    <div className="mt-8">
                        <h2 className="text-xl font-semibold mb-4">Get Help</h2>
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-sm mb-4">
                                    Having trouble following this tutorial or need additional assistance?
                                </p>
                                <Button className="w-full">Contact Support</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaSearch, FaPlay } from "react-icons/fa";
import { Tabs3 as Tabs, TabsContent3 as TabsContent, TabsList3 as TabsList, TabsTrigger3 as TabsTrigger } from "@/components/ui/tabs3";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { FloatingNavbar } from "@/components/globals/navbar";

const categories = [
    "All Tutorials",
    "Task Delegation App",
    "Leave and Attendance App",
    "Zapllo WABA",
    "Zapllo CRM"
];

export default function Tutorials() {
    const [tutorials, setTutorials] = useState<any[]>([]);
    const [filteredTutorials, setFilteredTutorials] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("All Tutorials");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchTutorials = async () => {
            try {
                const response = await axios.get("/api/tutorials");
                setTutorials(response.data.tutorials);
                setFilteredTutorials(response.data.tutorials);
            } catch (err) {
                console.error("Failed to fetch tutorials:", err);
                setError("Failed to load tutorials.");
            } finally {
                setLoading(false);
            }
        };

        fetchTutorials();
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        const filtered = tutorials.filter((tutorial) =>
            tutorial.title.toLowerCase().includes(e.target.value.toLowerCase())
        );
        filterByCategory(selectedCategory, filtered);
    };

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
        filterByCategory(value, tutorials);
    };

    const filterByCategory = (category: string, tutorialList: any[]) => {
        if (category === "All Tutorials") {
            setFilteredTutorials(
                tutorialList.filter((tutorial) =>
                    tutorial.title.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        } else {
            const filtered = tutorialList.filter(
                (tutorial) =>
                    tutorial.category === category &&
                    tutorial.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredTutorials(filtered);
        }
    };

    const handleTutorialClick = (id: string) => {
        router.push(`/tutorials-zapllo/${id}`);
    };


    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 bg-white">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Tutorials</h1>
                    <div className="flex gap-4 w-1/3">
                        <Skeleton className="h-10 w-full bg-gray-200" />
                        <Skeleton className="h-10 w-32 bg-gray-200" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array(8).fill(0).map((_, i) => (
                        <Card key={i} className="overflow-hidden border border-gray-200">
                            <Skeleton className="h-48 w-full bg-gray-200" />
                            <CardContent className="p-4">
                                <Skeleton className="h-6 w-3/4 mt-2 bg-gray-200" />
                                <Skeleton className="h-4 w-1/2 mt-2 bg-gray-200" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] bg-white text-gray-800">
                <DotLottieReact src="/lottie/error.lottie" autoplay loop className="h-40 w-40" />
                <p className="text-center text-red-500 mt-4 text-lg">{error}</p>
            </div>
        );
    }


    return (
        <div className="container mx-auto px-4 py-8 h-fit max-h-screen scrollbar-hide overflow-y-scroll bg-white text-gray-800">
        {/* <FloatingNavbar /> */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Tutorials
            </h1>
            <div className="flex gap-4 w-full md:w-1/2">
                <div className="relative flex-1">
                    <Input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Search tutorials..."
                        className="pl-10 pr-4 py-2 w-full bg-white border-gray-300 text-gray-800"
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
                <Select onValueChange={handleCategoryChange} defaultValue={selectedCategory}>
                    <SelectTrigger className="w-[180px] bg-white border-gray-300 text-gray-800">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-gray-800">
                        {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                                {category}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>

        <Tabs defaultValue="All Tutorials" className="w-full mb-8">
            <TabsList className="mb-6 gap-2 justify-start bg-gray-100">
                {categories.map((category) => (
                    <TabsTrigger
                        key={category}
                        value={category}
                        onClick={() => handleCategoryChange(category)}
                        className="px-4 py-1 text-gray-700 data-[state=active]:bg-white data-[state=active]:text-purple-600"
                    >
                        {category}
                    </TabsTrigger>
                ))}
            </TabsList>

            {categories.map((category) => (
                <TabsContent key={category} value={category} className="mt-0">
                    {filteredTutorials.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredTutorials.map((tutorial, index) => (
                                <motion.div
                                    key={tutorial._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <Card
                                        className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-all duration-300 cursor-pointer group bg-white border border-gray-200"
                                        onClick={() => handleTutorialClick(tutorial._id)}
                                    >
                                        <div className="relative overflow-hidden">
                                            <img
                                                src={tutorial.thumbnail}
                                                alt={tutorial.title}
                                                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <div className="bg-white p-3 rounded-full">
                                                    <FaPlay className="text-purple-600" />
                                                </div>
                                            </div>
                                        </div>
                                        <CardContent className="p-4 flex-grow">
                                            <h3 className="font-medium text-lg line-clamp-2 text-gray-800">{tutorial.title}</h3>
                                        </CardContent>
                                        <CardFooter className="px-4 pb-4 pt-0">
                                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                                {tutorial.category}
                                            </Badge>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                            <DotLottieReact
                                src="/lottie/empty.lottie"
                                loop
                                autoplay
                                className="h-56"
                            />
                            <p className="text-center text-gray-500 mt-4">
                                No tutorials found for this category
                            </p>
                        </div>
                    )}
                </TabsContent>
            ))}
        </Tabs>
    </div>
);
}

"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import { VideoIcon } from "lucide-react";

const categories = [
    "All Tutorials",
    "Task Delegation App",
    "Leave and Attendance App",
    "Zapllo WABA",
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

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value);
        filterByCategory(e.target.value, tutorials);
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
        router.push(`/help/tutorials/${id}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <DotLottieReact
                    src="/lottie/loading.lottie"
                    loop
                    autoplay
                    className="h-56"
                />
            </div>
        );
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    return (
        <div className="h-fit max-h-screen mt-4 scrollbar-hide  overflow-y-scroll">
            <div className="p-4">
                <div className="mb-6 flex flex-wrap justify-center items-center gap-4">
                    {/* Search Bar */}

                    {/* Category Dropdown */}
                    <div className="flex items-center justify-between w-full">
                        <h1 className="ml-24 text-lg font-bold text-center">{selectedCategory}</h1>
                        <div className="flex gap-2">
                        <div className=" flex items-center w-full px-4 focus-within:border-[#815bf5] rounded border py-2 gap-3 bg-[#0B0D29]">
                                <FaSearch className="text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    placeholder="Search Tutorials"
                                    className="text-sm w-full bg-transparent  text-white  focus:outline-none"
                                />
                            </div>
                            <select
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                className="px-4 py-2 border border-gray-700 text-sm bg-[#0B0D29] text-white rounded focus:outline-none"
                            >
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                           
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 mt-12  lg:grid-cols-4 mb-12 2xl:grid-cols-5 ml-24 gap-4">
                    {filteredTutorials.length > 0 ? (
                        filteredTutorials.map((tutorial) => (
                            <div
                                key={tutorial._id}
                                className="border-2 hover:border-[#815BF5] rounded-lg  w-full text-white cursor-pointer hover:shadow-lg transition"
                                onClick={() => handleTutorialClick(tutorial._id)}
                            >
                                <img
                                    src={tutorial.thumbnail}
                                    alt={tutorial.title}
                                    className="w-full h-36 object-cover rounded-lg rounded-b-none"
                                />
                                <div className="flex gap-2  mt-2 p-4 h-fit text-sm rounded-2xl items-center">
                                   
                                    <h3 className="text-md ">{tutorial.title}</h3>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-white -500">
                            <DotLottieReact
                                src="/lottie/empty.lottie"
                                loop
                                className="h-56"
                                autoplay
                            />
                            No Tutorials Found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FloatingNavbar } from "@/components/globals/navbar";
import Footer from "@/components/globals/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs3, TabsList3, TabsTrigger3 } from "@/components/ui/tabs3";
import OtherFooter from "@/components/globals/other-footer";
import { Skeleton } from "@/components/ui/skeleton";

interface Blog {
    readingTime: number;
    _id: string;
    title: string;
    slug: string;
    coverImage?: string;
    categories: string[];
    tags: string[];
}

export default function BlogsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true); // Start loading
            try {
                const res = await fetch("/api/blog");
                const data: Blog[] = await res.json(); // ✅ Type assertion
                if (res.ok) {
                    setBlogs(data);
                    setFilteredBlogs(data);

                    // Extract unique categories
                    const uniqueCategories = Array.from(new Set(data.flatMap((blog) => blog.categories || [])));
                    setCategories(["All", ...uniqueCategories]);
                }
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setLoading(false); // Stop loading
            }
        };
        fetchBlogs();
    }, []);

    // Filter blogs by category or tag
    useEffect(() => {
        let filtered = blogs;

        if (selectedCategory !== "All") {
            filtered = filtered.filter((blog) => blog.categories.includes(selectedCategory));
        }

        if (selectedTag) {
            filtered = filtered.filter((blog) => blog.tags.includes(selectedTag));
        }

        setFilteredBlogs(filtered);
    }, [selectedCategory, selectedTag, blogs]);

    return (
        <>
            <FloatingNavbar />
            <div className="pt-28 bg-[#FEFEFE] text-black pb-12 w-screen px-4 md:px-12">
                {/* Heading */}

                {/* Call-To-Action Section (Similar to Image) */}
                <div className="flex flex-col items-center justify-center text-center mt-12">
                    <h2 className="bg-gradient-to-r mx-4  from-[#815BF5] via-[#FC8929] w- px-4 py-1 to-[#FC8929] text-5xl bg-clip-text font-bold text-transparent">Join The Tribe</h2>
                    <p className="mt-2 text-md md:text-lg text-gray-700">
                        Grow your business <span className="font-bold"> with the power of AI & Automation</span>
                    </p>
                    <Link href="/signup">
                        <Button className="mt-8 mb-4 relative py-7 w-64 text-xl font-semibold bg-primary text-white rounded-full shadow-lg flex items-center ">
                            <p className="-ml-8">    Let’s Get Started!</p>
                            <img src="/icons/rocket.png" className="h-20 absolute right-0" />
                        </Button>
                    </Link>
                </div>
                <div className="mb-8">
                    {/* <div className="flex items-center gap-2 justify-center">
                        <img src="/logoonly.png" className="h-9" />
                        <h1 className="text-4xl text-center font-bold">Blogs</h1>
                    </div> */}
                    <div className="flex justify-center ">
                        <div className='border-muted-foreground border bg-transparent mt-4  p-4 rounded-lg '>
                            <p className="   text-black t leading-relaxed w-full text-xs md:text-sm text-center md:text-md md:max-w-5xl text-muted">
                                With Zapllo Blogs learn how to boost productivity with WhatsApp Reminders, Zapllo sales pipelines, manage leads & task management effectively.
                                <br />
                                Stay ahead with Zapllo Tasks, Zapllo Payroll, Zapllo CRM, and Zapllo AI—your tools for smarter business success. 🚀
                            </p>
                        </div>
                    </div>
                </div>




                {/* Category Tabs using ShadCN UI */}
                <div className="flex justify-center mb-20 md:mb-4">
                    <Tabs3 defaultValue="All" value={selectedCategory} onValueChange={(value) => {
                        setSelectedCategory(value);
                        setSelectedTag(null); // Reset tag selection when changing category
                    }}>
                        <TabsList3 className="flex flex-wrap border-none   h-14 gap-4  justify-center bg-transparent md:border-b border-gray-300">
                            {categories.map((category) => (
                                <TabsTrigger3
                                    key={category}
                                    value={category}
                                    className={`px-4 py-2 md:text-md border shadow-sm border-transparent rounded-xl transition-colors hover:border-primary hover:bg-transparent hover:text-black 
                                        ${selectedCategory === category ? "border-primary text-primary font-bold" : "text-black"}`}
                                >
                                    {category}
                                </TabsTrigger3>
                            ))}
                        </TabsList3>
                    </Tabs3>
                </div>

                {/* Blog List */}
                <Card className="grid grid-cols-1 fade-in-bottom shadow-none md:grid-cols-3 mx-12 bg-transparent border-none gap-6">
                    {loading ? (
                        // **Show Skeleton Loaders when loading**
                        [...Array(6)].map((_, index) => (
                            <Skeleton key={index} className="h-[360px] w-full rounded-xl" />
                        ))
                    ) : filteredBlogs.length === 0 ? (
                        <p className="text-center text-gray-500 py-6">No blogs found.</p>
                    ) : (
                        filteredBlogs.map((blog) => (
                            <Link key={blog._id} href={`/blog/${blog.slug}`}>
                                <Card className="cursor-pointer hover:shadow-lg fade-in-bottom h-[360px] bg-white border-none text-black transition-all duration-500">
                                    {blog.coverImage && (
                                        <img
                                            src={blog.coverImage}
                                            alt={blog.title}
                                            className="rounded-t-lg w-full h-48 object-cover"
                                        />
                                    )}
                                    <CardHeader>
                                        <CardTitle className="font-medium leading-relaxed">{blog.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                                            ⏱ {blog.readingTime} min read
                                        </p>
                                        <p className="mt-2 text-sm text-gray-600">Read more...</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))
                    )}
                </Card>
            </div>
            <OtherFooter />
        </>
    );
}

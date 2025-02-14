"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FloatingNavbar } from "@/components/globals/navbar";
import Footer from "@/components/globals/Footer";

interface Blog {
    _id: string;
    title: string;
    slug: string;
    coverImage?: string;
}

export default function BlogsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            const res = await fetch("/api/blog");
            const data = await res.json();
            if (res.ok) {
                setBlogs(data);
            }
        };
        fetchBlogs();
    }, []);

    return (
        <>
            <FloatingNavbar />
            <div className=" pt-28 bg-[#FEFEFE] text-black  pb-12 w-screen px-4 md:px-12 ">
                <div className="mb-8">
                    <div className="flex items-center gap-2 justify-center">
                        <img src='/logoonly.png' className="h-9" />
                        <h1 className="text-4xl text-center font-bold  "> Blogs</h1>
                    </div>
                    <div className="flex justify-center mt-2">
                        <p className="text-center text-xs  md:text-sm  leading-relaxed w-full md:max-w-5xl text-muted">
                            With Zapllo Blogs learn how to boost productivity with WhatsApp Reminders, automate sales pipelines, manage leads effectively & optimize task management. <br />Stay ahead with Zapllo Tasks, Zapllo Payroll, Zapllo CRM, and Zapllo AI—your tools for smarter business success. 🚀
                        </p>
                    </div>
                </div>

                <Card className="grid grid-cols-1 shadow-none md:grid-cols-3 mx-12 bg-transparent border-none gap-6">
                    {blogs.map((blog) => (
                        <Link key={blog._id} href={`/blog/${blog.slug}`}>
                            <Card className="cursor-pointer hover:shadow-lg bg-white border-muted-foreground text-black">
                                {blog.coverImage && <img src={blog.coverImage} alt={blog.title} className="rounded-t-lg w-full h-48 object-cover" />}
                                <CardHeader>
                                    <CardTitle>{blog.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    Read more...
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </Card>
            </div>
            <Footer />
        </>
    );
}

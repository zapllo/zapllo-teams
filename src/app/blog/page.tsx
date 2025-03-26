"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { FloatingNavbar } from "@/components/globals/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import OtherFooter from "@/components/globals/other-footer";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Search, TrendingUp, Zap, ArrowRight, BookOpen, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Blog {
    readingTime: number;
    _id: string;
    title: string;
    slug: string;
    coverImage?: string;
    categories: string[];
    tags: string[];
    excerpt?: string;
}

export default function BlogsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/blog");
                const data: Blog[] = await res.json();
                if (res.ok) {
                    setBlogs(data);
                    setFilteredBlogs(data);

                    // Set featured blogs (first 3 blogs)
                    setFeaturedBlogs(data.slice(0, 3));

                    // Extract unique categories
                    const uniqueCategories = Array.from(new Set(data.flatMap((blog) => blog.categories || [])));
                    setCategories(["All", ...uniqueCategories]);
                }
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    // Filter blogs by category, tag, or search query
    useEffect(() => {
        let filtered = blogs;

        if (selectedCategory !== "All") {
            filtered = filtered.filter((blog) => blog.categories.includes(selectedCategory));
        }

        if (selectedTag) {
            filtered = filtered.filter((blog) => blog.tags.includes(selectedTag));
        }

        if (searchQuery) {
            filtered = filtered.filter((blog) =>
                blog.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredBlogs(filtered);
    }, [selectedCategory, selectedTag, blogs, searchQuery]);

    // Animation variants for staggered animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <>
            <FloatingNavbar />
            <div className="  text-black min-h-screen w-full overflow-hidden">
                {/* Hero Section with Animated Background */}
                <div className="relative pt-56 overflow-hidden py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-violet-600 to-indigo-800">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -inset-x-40 -inset-y-40 opacity-20">
                            {[...Array(10)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute rounded-full bg-white"
                                    style={{
                                        top: `${Math.random() * 100}%`,
                                        left: `${Math.random() * 100}%`,
                                        width: `${Math.random() * 500 + 50}px`,
                                        height: `${Math.random() * 500 + 50}px`,
                                        opacity: Math.random() * 0.4,
                                        transform: `scale(${Math.random() * 2 + 1})`,
                                        animation: `float ${Math.random() * 15 + 10}s ease-in-out infinite`
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 max-w-6xl mx-auto text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6"
                        >
                            <span className="inline-block bg-gradient-to-r from-amber-200 via-amber-100 to-white bg-clip-text text-transparent">
                                Supercharge Your Business
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="max-w-2xl mx-auto text-lg md:text-xl text-indigo-100 mb-10"
                        >
                            Discover how Zapllo&apos;s AI & automation tools are helping businesses
                            <span className="font-bold"> achieve 10x growth</span> with zero technical knowledge
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Link href="/signup">
                                <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group">
                                    Start Your Free Trial
                                    <Zap className="ml-2 group-hover:rotate-12 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="#featured">
                                <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-6 rounded-full">
                                    Explore Articles
                                    <ArrowRight className="ml-2" />
                                </Button>
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1.5, delay: 0.8 }}
                            className="mt-12 flex flex-wrap justify-center gap-4 text-white/90 text-sm"
                        >
                            <div className="flex items-center">
                                <TrendingUp className="mr-2 h-4 w-4" />
                                <span>Used by 1000+ growing businesses</span>
                            </div>
                            <div className="flex items-center">
                                <Zap className="mr-2 h-4 w-4" />
                                <span>Average 300% productivity boost</span>
                            </div>
                        </motion.div>
                    </div>
                </div>


                {/* Featured Posts Carousel */}
                <section id="featured" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-12 text-center">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Content</h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Handpicked content to help you scale your business with Zapllo&apos;s powerful tools
                            </p>
                        </div>

                        {loading ? (
                            <div className="flex space-x-4 overflow-hidden">
                                {[...Array(3)].map((_, i) => (
                                    <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
                                ))}
                            </div>
                        ) : (
                            <Carousel className="w-full">
                                <CarouselContent>
                                    {featuredBlogs.map((blog) => (
                                        <CarouselItem key={blog._id} className="md:basis-1/2 lg:basis-1/3">
                                            <Link href={`/blog/${blog.slug}`}>
                                                <Card className="h-[400px] overflow-hidden hover:shadow-xl transition-all duration-300 border-none relative group">
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 z-10" />
                                                    {blog.coverImage ? (
                                                        <img
                                                            src={blog.coverImage}
                                                            alt={blog.title}
                                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-700 to-indigo-900" />
                                                    )}
                                                    <div className="relative z-20 flex flex-col justify-end h-full p-6">
                                                        <Badge className="w-fit mb-4 bg-amber-500 hover:bg-amber-600">Featured</Badge>
                                                        <CardTitle className="text-2xl font-bold text-white mb-2">{blog.title}</CardTitle>
                                                        <p className="text-white/80 line-clamp-2 mb-4">{blog.excerpt || "Discover more insights about growing your business with Zapllo."}</p>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center text-white/70 text-sm">
                                                                <Clock className="h-4 w-4 mr-1" />
                                                                <span>{blog.readingTime} min read</span>
                                                            </div>
                                                            <Button variant="ghost" className="text-white hover:bg-white/20 rounded-full p-2 h-auto">
                                                                <ArrowRight className="h-5 w-5" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </Link>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <div className="hidden md:block">
                                    <CarouselPrevious className="left-2" />
                                    <CarouselNext className="right-2" />
                                </div>
                            </Carousel>
                        )}
                    </div>
                </section>

                {/* Social Proof Section */}

                {/* Search & Filter Bar */}
                <div className="sticky bg-white top-16 z-20 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="relative w-full md:w-72">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search articles..."
                                    className="pl-10 pr-4 py-2 placeholder:text-black text-black rounded-full"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-wrap gap-2 justify-center">
                                {categories.map((category) => (
                                    <Badge
                                        key={category}
                                        onClick={() => {
                                            setSelectedCategory(category);
                                            setSelectedTag(null);
                                        }}
                                        variant={selectedCategory === category ? "default" : "outline"}
                                        className={`px-4 py-2 cursor-pointer text-black text-sm rounded-full transition-all ${selectedCategory === category
                                            ? "bg-primary text-white hover:bg-primary/90"
                                            : "hover:bg-gray-100"
                                            }`}
                                    >
                                        {category}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* All Blog Posts with Animation */}
                <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                            Latest Articles <span className="text-primary">& Insights</span>
                        </h2>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[...Array(6)].map((_, index) => (
                                    <Skeleton key={index} className="h-[360px] w-full rounded-xl" />
                                ))}
                            </div>
                        ) : filteredBlogs.length === 0 ? (
                            <div className="text-center py-16">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">No articles found</h3>
                                <p className="text-gray-600 mb-8">Try changing your search or filter criteria</p>
                                <Button
                                    onClick={() => {
                                        setSelectedCategory("All");
                                        setSelectedTag(null);
                                        setSearchQuery("");
                                    }}
                                    variant="outline"
                                >
                                    Reset Filters
                                </Button>
                            </div>
                        ) : (
                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {filteredBlogs.map((blog) => (
                                    <motion.div key={blog._id} variants={itemVariants}>
                                        <Link href={`/blog/${blog.slug}`}>
                                            <Card className="h-full hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100">
                                                <div className="relative h-48 overflow-hidden">
                                                    {blog.coverImage ? (
                                                        <img
                                                            src={blog.coverImage}
                                                            alt={blog.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-r from-violet-400 to-indigo-600" />
                                                    )}
                                                    {blog.categories && blog.categories.length > 0 && (
                                                        <Badge className="absolute top-3 right-3 bg-white/90 text-primary hover:bg-white">
                                                            {blog.categories[0]}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <CardHeader>
                                                    <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                                                        {blog.title}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-gray-600 line-clamp-3 mb-4">
                                                        {blog.excerpt || "Discover more insights about growing your business with Zapllo tools and AI automation."}
                                                    </p>
                                                </CardContent>
                                                <CardFooter className="flex justify-between items-center pt-0">
                                                    <div className="flex items-center text-gray-500 text-sm">
                                                        <Clock className="h-4 w-4 mr-1" />
                                                        <span>{blog.readingTime} min read</span>
                                                    </div>
                                                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary-dark hover:bg-primary/10 p-0 h-8 w-8 rounded-full">
                                                        <ArrowRight className="h-4 w-4" />
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </section>

                {/* Newsletter Section with Animated Gradient */}
                <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-800" />
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                        }}
                    />
                    <div className="relative z-10 max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Get the latest Zapllo updates
                        </h2>
                        <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
                            Be the first to know about new features, case studies, and productivity tips.
                            No spam, ever. Unsubscribe anytime.
                        </p>
                        {/* <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="rounded-full px-6 py-6 bg-white/10 backdrop-blur-sm text-white border-white/20 focus:border-white/50"
                            />
                            <Button size="lg" className="bg-white text-indigo-700 hover:bg-white/90 rounded-full px-8 font-bold">
                                Subscribe
                            </Button>
                        </div> */}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                    Ready to transform your business with Zapllo?
                                </h2>
                                <p className="text-lg text-gray-600 mb-8">
                                    Join thousands of businesses already using our AI & automation tools to save time,
                                    reduce costs, and drive growth—without any technical expertise required.
                                </p>
                                <div className="space-y-6">
                                    {[
                                        "Automate repetitive tasks and save 30+ hours every week",
                                        "Manage your entire business from a single dashboard",
                                        "Get AI-powered insights to make smarter decisions",
                                        "No coding required—set up in minutes, not weeks"
                                    ].map((feature, index) => (
                                        <div key={index} className="flex items-start">
                                            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1">
                                                <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-700">{feature}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-10 space-x-4">
                                    <Link href="/signup">
                                        <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                                            Start Your Free Trial
                                        </Button>
                                    </Link>
                                    <Link href="/demo">
                                        <Button size="lg" variant="outline" className="font-semibold text-white">
                                            Request a Demo
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute -inset-4 bg-gradient-to-r from-violet-100 to-indigo-100 rounded-2xl transform rotate-3 opacity-70" />
                                <img
                                    src="/icons/Big Rocket.webp"
                                    alt="Zapllo Dashboard"
                                    className="relative rounded-xl shadow-xl max-w-full h-auto"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <OtherFooter />

            <style jsx global>{`
                @keyframes float {
                    0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) translateX(20px) rotate(10deg); }
                    100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
                }
            `}</style>
        </>
    );
}
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
import {
    Search,
    TrendingUp,
    Zap,
    ArrowRight,
    Clock,
    ChevronRight,
    BookOpen,
    Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Footer from "@/components/globals/Footer";

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
                    // Sort blogs in descending order (newer blogs first)
                    const sortedBlogs = data.sort((a, b) => {
                        // Sort by _id in descending order (assuming _id contains timestamp)
                        // You can replace this with any other field you want to sort by
                        return b._id.localeCompare(a._id);
                    });

                    setBlogs(sortedBlogs);
                    setFilteredBlogs(sortedBlogs);

                    // Set featured blogs (first 3 blogs)
                    setFeaturedBlogs(sortedBlogs.slice(0, 3));

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

    // ... existing code ...

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

    const resetFilters = () => {
        setSelectedCategory("All");
        setSelectedTag(null);
        setSearchQuery("");
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <FloatingNavbar />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-indigo-800 to-purple-900 py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute rounded-full bg-white"
                                style={{
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    width: `${Math.random() * 300 + 50}px`,
                                    height: `${Math.random() * 300 + 50}px`,
                                    opacity: Math.random() * 0.3,
                                    transform: `scale(${Math.random() * 2 + 1})`,
                                    animation: `float ${Math.random() * 15 + 10}s ease-in-out infinite`
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div className="relative max-w-5xl mx-auto z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <Badge variant="outline" className="bg-white/10 text-white border-white/20 px-4 py-1 text-sm mb-6">
                            Zapllo Blog
                        </Badge>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                            Insights to <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-100">Power Your Growth</span>
                        </h1>

                        <p className="text-lg md:text-xl text-indigo-100 max-w-3xl mx-auto mb-10">
                            Expert advice, industry trends, and actionable strategies to scale your business with Zapllo's AI-powered automation
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="relative max-w-2xl mx-auto"
                    >
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search articles, topics, and guides..."
                            className="pl-12 py-6 rounded-full bg-white/10 backdrop-blur-sm border-white/20 text-white dark:placeholder:text-white /60 focus:border-white/40 focus:ring-2 focus:ring-white/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </motion.div>
                </div>
            </section>

            {/* Featured Section */}
            <section id="featured" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="md:flex justify-between items-center mb-10">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Insights</h2>
                            <p className="text-gray-600 mt-1">Handpicked content to guide your business growth</p>
                        </div>
                        <Link href="#all-articles">
                            <Button variant="ghost" className="text-primary hover:text-primary-dark hover:bg-primary/5">
                                View All Articles <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[...Array(3)].map((_, i) => (
                                <Skeleton key={i} className="h-[420px] rounded-xl" />
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        >
                            {featuredBlogs.map((blog, index) => (
                                <Link key={blog._id} href={`/blog/${blog.slug}`}>
                                    <Card className={`h-full bg-white text-black overflow-hidden hover:shadow-lg transition-all duration-300 border-none group ${index === 0 ? 'md:col-span-2 md:row-span-1' : ''}`}>
                                        <div className="relative h-48 overflow-hidden">
                                            {blog.coverImage ? (
                                                <img
                                                    src={blog.coverImage}
                                                    alt={blog.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-purple-600 to-indigo-700" />
                                            )}
                                            <Badge className="absolute top-3 left-3 bg-primary hover:bg-primary text-white">Featured</Badge>
                                        </div>
                                        <CardHeader className="pb-2">
                                            {blog.categories && blog.categories.length > 0 && (
                                                <div className="flex gap-2 mb-2">
                                                    {blog.categories.slice(0, 2).map((category) => (
                                                        <Badge key={category} variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                                            {category}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                            <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                                                {blog.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pb-2">
                                            <p className="text-gray-600 line-clamp-3">
                                                {blog.excerpt || "Discover more insights about growing your business with Zapllo tools and AI automation."}
                                            </p>
                                        </CardContent>
                                        <CardFooter className="flex justify-between items-center pt-2">
                                            <div className="flex items-center text-gray-500 text-sm">
                                                <Clock className="h-4 w-4 mr-1" />
                                                <span>{blog.readingTime} min read</span>
                                            </div>
                                            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 rounded-full p-1 h-8 w-8">
                                                <ArrowRight className="h-4 w-4" />
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </Link>
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Content Filter Section */}
            <section id="all-articles" className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Browse All Articles</h2>
                            <p className="text-gray-600 mt-1">Explore our comprehensive knowledge base</p>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search articles..."
                                    className="pl-10 rounded-lg text-black placeholder:text-black border-gray-200"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <Filter className="h-4 w-4" />
                                        <span className="hidden sm:inline">Filter</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 p-2">
                                    <div className="font-medium text-sm text-gray-500 px-2 py-1.5">Categories</div>
                                    {categories.map((category) => (
                                        <DropdownMenuItem
                                            key={category}
                                            className={`${selectedCategory === category ? 'bg-primary/10 text-primary' : ''} cursor-pointer`}
                                            onClick={() => setSelectedCategory(category)}
                                        >
                                            {category}
                                        </DropdownMenuItem>
                                    ))}
                                    <div className="border-t my-2"></div>
                                    <DropdownMenuItem onClick={resetFilters}>
                                        Reset Filters
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Blog Cards Section - Improved Design */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <Skeleton key={i} className="h-[380px] rounded-xl" />
                            ))}
                        </div>
                    ) : filteredBlogs.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">No articles found</h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                We couldn't find any articles matching your current filters or search criteria.
                            </p>
                            <Button onClick={resetFilters} variant="outline">
                                Reset Filters
                            </Button>
                        </div>
                    ) : (
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {filteredBlogs.map((blog) => (
                                <motion.div key={blog._id} variants={itemVariants}>
                                    <Link href={`/blog/${blog.slug}`}>
                                        <Card className="group overflow-hidden bg-white  text-black border-none h-full shadow-sm hover:shadow-xl transition-all duration-300">
                                            <div className="relative h-52 overflow-hidden">
                                                {blog.coverImage ? (
                                                    <img
                                                        src={blog.coverImage}
                                                        alt={blog.title}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 transition-transform duration-700 group-hover:scale-110" />
                                                )}

                                                {/* Category badge overlay */}
                                                {blog.categories && blog.categories.length > 0 && (
                                                    <div className="absolute top-3 left-3">
                                                        <Badge className="bg-white/90 text-primary hover:bg-white border-transparent shadow-sm">
                                                            {blog.categories[0]}
                                                        </Badge>
                                                    </div>
                                                )}

                                                {/* Reading time overlay */}
                                                <div className="absolute bottom-3 right-3">
                                                    <div className="flex items-center bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                                                        <Clock className="h-3 w-3 mr-1" />
                                                        <span>{blog.readingTime} min read</span>
                                                    </div>
                                                </div>

                                                {/* Gradient overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </div>

                                            <div className="p-5">
                                                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                                    {blog.title}
                                                </h3>

                                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                                    {blog.excerpt || "Discover more insights about growing your business with Zapllo."}
                                                </p>

                                                <div className="flex items-center justify-between mt-auto">
                                                    {/* Tags section */}
                                                    <div className="flex flex-wrap gap-2">
                                                        {blog.tags && blog.tags.slice(0, 2).map(tag => (
                                                            <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5 rounded-full p-0 h-8 w-8">
                                                        <ArrowRight className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* Pagination or Load More (optional) */}
                    {/* {filteredBlogs.length > 0 && (
                        <div className="flex justify-center mt-12">
                            <Button variant="outline" className="rounded-full px-8">
                                Load More Articles
                            </Button>
                        </div>
                    )} */}
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="relative z-10 bg-gradient-to-br from-indigo-700 to-purple-800 rounded-2xl p-8 md:p-12 overflow-hidden shadow-xl">
                        <div className="absolute inset-0 overflow-hidden opacity-20">
                            <div className="absolute -inset-x-40 -inset-y-40">
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute rounded-full bg-white"
                                        style={{
                                            top: `${Math.random() * 100}%`,
                                            left: `${Math.random() * 100}%`,
                                            width: `${Math.random() * 300 + 50}px`,
                                            height: `${Math.random() * 300 + 50}px`,
                                            opacity: Math.random() * 0.3,
                                            transform: `scale(${Math.random() * 1.5 + 1})`,
                                            animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="relative z-10 text-center md:text-left md:flex justify-between items-center gap-8">
                            <div className="md:flex-1">
                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                                    Stay ahead with Zapllo insights
                                </h2>
                                <p className="text-indigo-100 mb-6 md:mb-0 max-w-md">
                                    Get expert tips and the latest updates delivered straight to your inbox.
                                </p>
                            </div>

                            <div className="md:flex-1">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm text-white border-white/20 focus:border-white/50"
                                    />
                                    <Button className="bg-white text-indigo-700 hover:bg-white/90 font-medium">
                                        Subscribe
                                    </Button>
                                </div>
                                <p className="text-xs text-indigo-200 mt-2">
                                    We respect your privacy. Unsubscribe at any time.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            {/* <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-5xl mx-auto bg-white rounded-2xl overflow-hidden shadow-sm">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-8 md:p-12 flex flex-col justify-center">
                            <Badge className="w-fit mb-6 bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">
                                Boost Your Productivity
                            </Badge>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                Ready to transform your business with Zapllo?
                            </h2>
                            <p className="text-gray-600 mb-8">
                                Join thousands of businesses already using our AI & automation tools to save time,
                                reduce costs, and drive growth—without any technical expertise.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/signup">
                                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-medium px-6">
                                        Start Free Trial
                                        <Zap className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link href="/demo">
                                    <Button size="lg" variant="outline" className="text-gray-700">
                                        Request Demo
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="relative hidden md:block bg-gradient-to-br from-indigo-50 to-purple-50">
                            <img
                                src="/icons/Big Rocket.webp"
                                alt="Zapllo Dashboard"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section> */}

            <Footer />

            <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          50% { transform: translateY(-20px) translateX(20px) rotate(5deg); }
          100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
        }
      `}</style>
        </div>
    );
}

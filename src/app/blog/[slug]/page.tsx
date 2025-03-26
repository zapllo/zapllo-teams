// src/app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import Blog from "@/models/blogModel";
import User from "@/models/userModel";
import { Metadata } from "next";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import connectDB from "@/lib/db";
import { FloatingNavbar } from "@/components/globals/navbar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import OtherFooter from "@/components/globals/other-footer";
import CommentSection from "@/components/blog/comment-section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Author {
    firstName: string;
    lastName: string;
    profilePic?: string;
}

interface Comment {
    _id: string;
    content: string;
    user: { firstName: string; lastName: string };
    createdAt: string;
}

interface BlogPost {
    _id: string;
    title: string;
    excerpt: string;
    coverImage?: string;
    content: string;
    categories: string[];
    tags: string[];
    author: Author | null;
    createdAt: string;
    published: boolean;
    comments: Comment[];
    readingTime?: number;
    slug?: string;
}

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}): Promise<Metadata> {
    await connectDB();
    const blog = await Blog.findOne({ slug: params.slug }).populate("author");
    if (!blog) {
        return {};
    }

    return {
        title: blog?.metaTitle || blog.title,
        description: blog?.metaDescription || blog.excerpt || "",
        openGraph: {
            title: blog?.metaTitle || blog.title,
            description: blog?.metaDescription || blog.excerpt || "",
            images: blog.coverImage ? [{ url: blog.coverImage }] : [],
        },
    };
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
    await connectDB();
    const post = await Blog.findOne({ slug })
        .populate("author", "firstName lastName profilePic")
        .lean();

    return post as BlogPost | null;
}

// Get related blog posts
async function getRelatedPosts(categories: string[], currentPostId: string, limit = 3): Promise<BlogPost[]> {
    await connectDB();
    const relatedPosts = await Blog.find({
        categories: { $in: categories },
        _id: { $ne: currentPostId },
        published: true
    })
        .limit(limit)
        .populate("author", "firstName lastName profilePic")
        .lean();

    return JSON.parse(JSON.stringify(relatedPosts)) as BlogPost[];
}

export default async function BlogPostPage({
    params,
}: {
    params: { slug: string };
}) {
    const post = await getBlogPost(params.slug);

    if (!post) {
        notFound();
    }

    const {
        title,
        _id,
        excerpt,
        coverImage,
        content,
        categories = [],
        tags = [],
        author,
        createdAt,
        published,
        readingTime = 5,
    } = post;

    // Get related posts
    const relatedPosts = await getRelatedPosts(categories, _id.toString());

    // Format date
    const publishDate = new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const authorName = author
        ? `${author.firstName} ${author.lastName}`
        : "Unknown Author";

    const authorInitials = author
        ? `${author.firstName[0]}${author.lastName[0]}`
        : "NA";

    const authorProfilePic = author?.profilePic || null;

    return (
        <>
            <FloatingNavbar />
            <div className="min-h-screen bg-white">
                {/* Back to blogs navigation */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-6">
                    <Link href="/blog" className="inline-flex items-center text-sm text-gray-600 hover:text-primary transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                        Back to all articles
                    </Link>
                </div>

                {/* Hero Section */}
                <div className="relative pt-6 pb-16 sm:pb-24 lg:pb-32 overflow-hidden">
                    {/* Cover Image as Background with Overlay */}
                    {coverImage && (
                        <div className="absolute inset-0 z-0 opacity-10">
                            <img
                                src={coverImage}
                                alt={title}
                                className="w-full h-full object-cover blur-sm"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-white via-white/90 to-white" />
                        </div>
                    )}

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            {/* Categories */}
                            <div className="flex flex-wrap justify-center gap-2 mb-6">
                                {categories.map((category, idx) => (
                                    <Badge key={idx} className="bg-primary/10 text-primary hover:bg-primary/20 text-sm px-3 py-1">
                                        {category}
                                    </Badge>
                                ))}
                            </div>

                            {/* Title */}
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                                {title}
                            </h1>

                            {/* Excerpt */}
                            {excerpt && (
                                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                                    {excerpt}
                                </p>
                            )}

                            {/* Author & Metadata */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-600">
                                <div className="flex items-center gap-3">
                                    {authorProfilePic ? (
                                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                            <AvatarImage src={authorProfilePic} alt={authorName} />
                                            <AvatarFallback>{authorInitials}</AvatarFallback>
                                        </Avatar>
                                    ) : (
                                        <Avatar className="h-12 w-12 bg-primary text-white border-2 border-white shadow-sm">
                                            <AvatarFallback>{authorInitials}</AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className="text-left">
                                        <p className="font-medium text-gray-900">{authorName}</p>
                                        <p className="text-sm text-gray-500">Author</p>
                                    </div>
                                </div>

                                <Separator orientation="vertical" className="h-8 hidden sm:block" />

                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                    </svg>
                                    <span>{publishDate}</span>
                                </div>

                                <Separator orientation="vertical" className="h-8 hidden sm:block" />

                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                    <span>{readingTime} min read</span>
                                </div>
                            </div>
                        </div>

                        {/* Cover Image for main display */}
                        {/* {coverImage && (
                            <div className="relative mt-8 rounded-xl overflow-hidden shadow-2xl">
                                <img
                                    src={coverImage}
                                    alt={title}
                                    className="w-full max-h-[600px] object-cover"
                                />
                            </div>
                        )} */}
                    </div>
                </div>

                {/* Content Container */}
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                    {/* Desktop Share Buttons */}
                    <div className="hidden md:flex flex-col gap-3 items-center fixed left-8 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                            </svg>
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                                <circle cx="18" cy="5" r="3"></circle>
                                <circle cx="6" cy="12" r="3"></circle>
                                <circle cx="18" cy="19" r="3"></circle>
                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                            </svg>
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </Button>

                        <Separator className="w-8 my-1" />

                        <div className="text-xs text-gray-500 font-medium bg-gray-100 rounded-full h-8 w-8 flex items-center justify-center">
                            {post.comments?.length || 0}
                        </div>
                    </div>

                    {/* Mobile Action Bar */}
                    <div className="md:hidden sticky top-16 z-10 bg-white py-3 border-b mb-8 flex justify-around">
                        <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                            </svg>
                            <span className="text-xs">Like</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                            </svg>
                            <span className="text-xs">Save</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="18" cy="5" r="3"></circle>
                                <circle cx="6" cy="12" r="3"></circle>
                                <circle cx="18" cy="19" r="3"></circle>
                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                            </svg>
                            <span className="text-xs">Share</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                            <span className="text-xs">Comment</span>
                        </Button>
                    </div>

                    {/* Main Content */}
                    <Card className="border-none shadow-none bg-white">
                        <CardContent
                            className="prose prose-lg max-w-none
                                prose-headings:text-gray-900 prose-headings:font-bold
                                prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                                prose-p:text-gray-700 prose-p:leading-relaxed
                                prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                                prose-strong:text-gray-900 prose-strong:font-bold
                                prose-blockquote:border-l-4 prose-blockquote:border-primary/50 prose-blockquote:bg-primary/5 prose-blockquote:p-4 prose-blockquote:rounded-r-md
                                prose-img:rounded-xl prose-img:shadow-lg
                                prose-code:text-primary-dark prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
                            "
                        >
                            {content ? (
                                <div dangerouslySetInnerHTML={{ __html: content }} />
                            ) : (
                                <p>No content available.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Tags Section */}
                    {Array.isArray(tags) && tags.length > 0 && (
                        <div className="mt-12 flex flex-wrap gap-2">
                            {tags.map((tag, idx) => (
                                <Badge
                                    key={idx}
                                    variant="outline"
                                    className="text-gray-700 bg-gray-50 hover:bg-gray-100 border-gray-200 px-3 py-1"
                                >
                                    #{tag}
                                </Badge>
                            ))}
                        </div>
                    )}

                    {/* Author Bio Card */}
                    <div className="mt-16 bg-gray-50 rounded-2xl p-8 border border-gray-100">
                        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                            {authorProfilePic ? (
                                <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-white shadow-md">
                                    <AvatarImage src={authorProfilePic} alt={authorName} />
                                    <AvatarFallback className="text-2xl">{authorInitials}</AvatarFallback>
                                </Avatar>
                            ) : (
                                <Avatar className="h-20 w-20 sm:h-24 sm:w-24 bg-primary text-white border-4 border-white shadow-md">
                                    <AvatarFallback className="text-2xl">{authorInitials}</AvatarFallback>
                                </Avatar>
                            )}

                            <div className="sm:flex-1 text-center sm:text-left">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{authorName}</h3>
                                <p className="text-gray-600 mb-4">Zapllo Team Expert</p>
                                <p className="text-gray-700">
                                    Expert in business automation and AI implementation strategies.
                                    Passionate about helping small businesses scale efficiently.
                                </p>
                                <div className="mt-4 flex gap-2 justify-center sm:justify-start">
                                    <Button variant="outline" size="sm" className="rounded-full">
                                        Follow
                                    </Button>
                                    <Button variant="ghost" size="sm" className="rounded-full">
                                        View Profile
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FOMO CTA Section */}
                    <div className="mt-16 relative overflow-hidden rounded-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-700" />

                        <div className="absolute inset-0 overflow-hidden opacity-20">
                            {/* Static geometric patterns for visual interest */}
                            <div className="absolute rounded-full bg-white w-64 h-64 -left-12 -top-12 opacity-30"></div>
                            <div className="absolute rounded-full bg-white w-96 h-96 -right-20 -bottom-20 opacity-20"></div>
                            <div className="absolute rounded-full bg-white w-32 h-32 left-1/4 top-1/4 opacity-40"></div>
                        </div>

                        <div className="relative z-10 p-8 sm:p-12 text-white flex flex-col md:flex-row items-center gap-8">
                            <div className="md:flex-1">
                                <Badge className="bg-white text-indigo-700 hover:bg-white/90 mb-4">
                                    Limited Time Offer
                                </Badge>
                                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                                    Don&apos;t miss out on the future of business automation!
                                </h2>
                                <p className="text-white/80 mb-6">
                                    Join 2,500+ businesses already saving 30+ hours every week with Zapllo&apos;s AI automation
                                    tools. No technical skills required. Start your 7-day free trial today.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <Link href="/signup">
                                        <Button size="lg" className="bg-white text-indigo-700 hover:bg-white/90 font-bold shadow-lg">
                                            Start Your Free Trial
                                        </Button>
                                    </Link>
                                    <Link href="/demo">
                                        <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                                            Watch Demo
                                        </Button>
                                    </Link>
                                </div>
                                <p className="text-white/70 text-sm mt-4">
                                    ✓ No credit card required ✓ Cancel anytime ✓ 24/7 support
                                </p>
                            </div>
                            <div className="md:flex-shrink-0 md:w-1/3 flex justify-center">
                                <img
                                    src="/icons/Big Rocket.webp"
                                    alt="Zapllo Rocket"
                                    className="h-40 sm:h-48 md:h-64 object-contain"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Related Articles */}
                    {relatedPosts.length > 0 && (
                        <div className="mt-20">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-gray-900">Related Articles</h2>
                                <Link href="/blog">
                                    <Button variant="ghost" className="text-primary font-medium">
                                        View All
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                            <polyline points="12 5 19 12 12 19"></polyline>
                                        </svg>
                                    </Button>
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {relatedPosts.map((post) => (
                                    <Link key={post._id} href={`/blog/${post.slug}`}>
                                        <Card className="h-full hover:shadow-md transition-all duration-300 overflow-hidden">
                                            {post.coverImage && (
                                                <div className="h-48 overflow-hidden">
                                                    <img
                                                        src={post.coverImage}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="pb-6">
                                                <div className="flex items-center text-sm text-gray-500 gap-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <circle cx="12" cy="12" r="10"></circle>
                                                        <polyline points="12 6 12 12 16 14"></polyline>
                                                    </svg>
                                                    <span>{post.readingTime || 5} min read</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Comment Section */}
                    <div className="mt-20" id="comments">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">
                            Join the conversation
                        </h2>
                        <CommentSection blogId={_id.toString()} />
                    </div>
                </div>

                {/* Newsletter Banner */}
                <div className="bg-gray-50 border-t border-gray-100 py-16">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <Badge className="bg-primary/10 text-primary mb-4">Stay Updated</Badge>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Never miss a new article
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                            Get the latest insights on business automation, AI tools, and productivity
                            tips delivered straight to your inbox.
                        </p>
                        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent flex-1"
                            />
                            <Button className="bg-primary hover:bg-primary/90 text-white font-bold">
                                Subscribe
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Stats & Social Proof Bar */}
                <div className="bg-white border-t border-gray-100 py-8">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <p className="text-3xl font-bold text-primary">2,500+</p>
                                <p className="text-gray-600">Businesses using Zapllo</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-primary">20hrs+</p>
                                <p className="text-gray-600">Saved weekly per user</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-primary">300%</p>
                                <p className="text-gray-600">Productivity boost</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-primary">14 days</p>
                                <p className="text-gray-600">Free trial period</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <OtherFooter />
        </>
    );
}
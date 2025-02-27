// src/app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import Blog from "@/models/blogModel";
import User from "@/models/userModel";
import { Metadata } from "next";
// shadcn/ui components
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
import Footer from "@/components/globals/Footer";
import { FaCalendar, FaUser } from "react-icons/fa";
import { Calendar } from "lucide-react";
import SaveLanding from "@/components/product-components/landing/savelanding";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import OtherFooter from "@/components/globals/other-footer";
import CommentSection from "@/components/blog/comment-section";


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
    };
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
    await connectDB();
    const post = await Blog.findOne({ slug })
        .populate("author", "firstName lastName profilePic")
        .lean();

    return post as BlogPost | null; // Ensure TypeScript understands the type
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
    } = post;

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
            <div className=" pt-24 bg-[#FEFEFE] pb-12 w-screen px-4 md:px-0">
                <Card className="overflow-hidden  lg:mx-12 border-muted-foreground bg-[#FEFEFE] text-black  shadow-sm">
                    {/* Cover Image */}
                    {/* {coverImage && (
                        <img
                            src={coverImage}
                            alt={title}
                            className="w-full h-72  object-cover"
                        />
                    )} */}
                    <div className=' bg-background p-4  h-56 flex items-center m-auto text-center justify-center '>
                        <div>
                            <CardTitle className="md:text-4xl text-center text-white font-bold ">
                                {title}
                            </CardTitle>

                            <div className="md:flex md:flex-wrap justify-start items-center gap-3   text-muted mt-4">
                                <p className="flex gap-2 text-xs md:text-sm  text-white items-center">
                                    {authorProfilePic ? (
                                        <img
                                            src={authorProfilePic}
                                            alt={authorName}
                                            className="md:w-8 md:h-8 h-6 w-6 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 flex items-center justify-center bg-primary text-white font-semibold rounded-full">
                                            {authorInitials}
                                        </div>
                                    )}
                                    {authorName}
                                </p>

                                <Separator orientation="vertical" className="h-4 hidden md:block text-white bg-white" />
                                <p className="flex gap-2 text-xs mt-2 md:mt-0  md:text-sm text-white items-center"> Published on {publishDate}</p>
                                <Separator orientation="vertical" className="h-4 bg-white hidden md:block" />
                                <div className="hidden md:block">
                                    {published ? (
                                        <Badge
                                            variant="outline"
                                            className="text-white  border-green-300"
                                        >
                                            Published
                                        </Badge>
                                    ) : (
                                        <Badge
                                            variant="outline"
                                            className="text-orange-700 border-orange-300"
                                        >
                                            Draft
                                        </Badge>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>


                    <CardHeader className="space-y-2 pt-6 md:pt-8">

                        <CardDescription className="md:-mt-20 -mt-14">
                            <div className='shadow-md  shadow-orange-500 bg-white mt-4  p-4 rounded-lg '>
                                {excerpt && <p className="text-black     md:text-">{excerpt}</p>}
                            </div>

                        </CardDescription>
                    </CardHeader>

                    {/* Main content area, using Tailwind typography + custom overrides */}
                    <CardContent
                        className="
              prose text-black
              prose-slate
              prose-strong:text-black
              max-w-full
              text-left

              leading-relaxed
              px-6
              pb-6
              md:px-8
              md:pb-8
              prose-headings:text-black
              prose-headings:font-bold
              prose-h1:text-xl 
              prose-h2:text-3xl
              prose-h3:text-2xl
              
              prose-blockquote:italic
              prose-blockquote:text-black -700
              prose-blockquote:border-l-4
              prose-blockquote:h-24
              prose-blockquote:md:h-12
              prose-blockquote:bg-gray-200
              prose-blockquote:text-sm
              prose-blockquote:flex 
              prose-blockquote:items-center 
              prose-blockquote:border-black -300
prose-a:text-blue-500
              prose-img:my-8
              prose-img:mx-auto
              prose-img:h-full
              prose-img:scale-75
              prose-img:w-full
              prose-img:object-cover
              prose-img:rounded-lg
              prose-img:border
            "
                    >
                        {content ? (
                            <div dangerouslySetInnerHTML={{ __html: content }} />
                        ) : (
                            <p>No content available.</p>
                        )}
                    </CardContent>
                    <div className="relative bg-black text-white py-16 px-6 md:px-12 lg:px-20">
                        {/* Background Image */}
                        <div
                            className="absolute inset-0 bg-cover bg-center rounded-lg opacity-20"
                            style={{ backgroundImage: "url('/branding/post.png')" }}
                        ></div>

                        {/* Content Section */}
                        <div className="relative flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto">
                            {/* Text Content */}
                            <div className="md:w-1/2 space-y-8">
                                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                                    Automate & Upgrade Your Business to 10X
                                </h2>
                                <p className="text-gray-300 text-md md:text-lg">
                                    We help businesses scale smarter not harder, unleashing
                                    <span className="font-semibold"> the power of AI & Automation</span> without the need of any technical knowledge
                                </p>
                                <Link href='/signup'>
                                    <Button className=" text-white px-6 py-4 h-12 mt-6  rounded-lg text-lg font-semibold transition-all">
                                        Let&apos;s Get Started
                                    </Button>
                                </Link>
                            </div>

                            {/* Rocket Image */}
                            <div className="md:w-1/2 flex justify-center mt-6 md:mt-0">
                                <img src="/icons/Big Rocket.webp" alt="Rocket" className="max-w-xs md:max-w-md lg:max-w-lg" />
                            </div>
                        </div>
                    </div>


                    <CardFooter className="mt-12 block px-6 pb-6 md:px-8 md:pb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                            {/* Categories Section */}
                            {Array.isArray(categories) && categories.length > 0 && (
                                <div className="space-y-3">
                                    <h2 className="text-lg font-semibold text-gray-800">Categories</h2>
                                    <div className="flex flex-wrap gap-3">
                                        {categories.map((cat: string, idx: number) => (
                                            <span
                                                key={idx}
                                                className="border border-gray-300 text-gray-700 text-sm px-4 py-2 rounded-full shadow-sm cursor-pointer transition-all hover:bg-gray-200 hover:text-gray-900"
                                            >
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Tags Section */}
                            {Array.isArray(tags) && tags.length > 0 && (
                                <div className="space-y-3">
                                    <h2 className="text-lg font-semibold text-gray-800">Tags</h2>
                                    <div className="flex flex-wrap gap-3">
                                        {tags.map((tag: string, idx: number) => (
                                            <span
                                                key={idx}
                                                className="border border-gray-300 text-gray-700 text-sm px-4 py-2 rounded-full shadow-sm cursor-pointer transition-all hover:bg-gray-200 hover:text-gray-900"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardFooter>
                    <CommentSection blogId={_id.toString()} />
                </Card>

            </div>
            <OtherFooter />
        </>
    );
}

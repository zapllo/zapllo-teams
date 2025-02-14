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


interface Author {
    firstName: string;
    lastName: string;
    profilePic?: string;
}

interface BlogPost {
    title: string;
    excerpt: string;
    coverImage?: string;
    content: string;
    categories: string[];
    tags: string[];
    author: Author | null;  // Author can be null if it's not populated
    createdAt: string;
    published: boolean;
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
                    {coverImage && (
                        <img
                            src={coverImage}
                            alt={title}
                            className="w-full h-72  object-cover"
                        />
                    )}
                    <div className=' bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] p-4  '>
                        <CardTitle className="md:text-4xl text-center text-white font-bold ">
                            {title}
                        </CardTitle>
                    </div>


                    <CardHeader className="space-y-2 pt-6 md:pt-8">
                        <div className="flex flex-wrap items-center gap-3  text-muted mt-2">

                            <p className="flex gap-2 items-center">
                                {authorProfilePic ? (
                                    <img
                                        src={authorProfilePic}
                                        alt={authorName}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-8 h-8 flex items-center justify-center bg-primary text-white font-semibold rounded-full">
                                        {authorInitials}
                                    </div>
                                )}
                                {authorName}
                            </p>
                            <Separator orientation="vertical" className="h-4" />
                            <p className="flex gap-2 items-center"><FaCalendar /> Published on {publishDate}</p>
                            <Separator orientation="vertical" className="h-4" />

                            {published ? (
                                <Badge
                                    variant="outline"
                                    className="text-green-700 border-green-300"
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
                        <CardDescription className="">
                            <div className='border bg-primary mt-4  p-4 rounded-lg '>
                                {excerpt && <p className="text-white md:text-xl">{excerpt}</p>}
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

              prose-img:my-8
              prose-img:mx-auto
              prose-img:h-auto
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
                    <Card className=" flex items-center justify-center w-fit px-20 py-10 bg-transparent text-black  m-auto ">
                        <div className=" flex justify-center  mt-4">
                            <div className='justify-center   flex '>
                                <div className='grid md:grid-cols-1  justify-center items-center '>

                                    <div className="max-w-3xl w-full">
                                        <h1 className="md:text-3xl md:mt-0  text-2xl font-semibold">
                                            Start saving money and start investing in growth
                                        </h1>
                                        <p className="text-sm  text-muted mt-4">
                                            Unlock the Power of ZAPLLO with WhatsApp Reminders & 10X Team Productivity🚀
                                        </p>
                                        <div className=" md:flex gap-4 mt-4 ">
                                            <div className="z-10 mb-4 items-center ">
                                                <div
                                                >
                                                    <Link href='https://masterclass.zapllo.com/workshop/'>

                                                        <Button className="text-2xl rounded-2xl h-12 w-full">Join Live Masterclass</Button>
                                                    </Link>
                                                </div>

                                            </div>
                                            <div className=''>
                                                <Link href='/signup'>
                                                    <Button variant="outline" className="text-2xl bg-transparent rounded-2xl h-12 w-full">Create Your Free Account</Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </Card>

                    <CardFooter className="md:flex text-lg mt-12 block  md:gap-24 px-6 pb-6 md:px-8 md:pb-8">
                        {/* Categories */}
                        {Array.isArray(categories) && categories.length > 0 && (
                            <div>
                                <h2 className="font-semibold mb-2">Categories</h2>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((cat: string, idx: number) => (
                                        <Badge className="text-md bg-primary" variant="secondary" key={idx}>
                                            {cat}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tags */}
                        {Array.isArray(tags) && tags.length > 0 && (
                            <div className="text-black mt-4 md:mt-0">
                                <h2 className="font-semibold mb-2">Tags</h2>
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag: string, idx: number) => (
                                        <Badge className="text-black text-md" variant="outline" key={idx}>
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardFooter>

                </Card>

            </div>
            <Footer />
        </>
    );
}

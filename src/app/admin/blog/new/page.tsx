"use client";

import React, {
    useState,
    useEffect,
    FormEvent,
    useMemo,
    useRef,
} from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// shadcn/ui components
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import "react-quill/dist/quill.snow.css";
import QuillWrapper from "@/lib/QuillWrapper";
import { toast } from "sonner";
import Loader from "@/components/ui/loader";

// Utility to generate a slug
function generateSlug(text: string) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "") // remove non-alphanumeric
        .trim()
        .replace(/\s+/g, "-");
}

export default function NewBlogPage() {
    const router = useRouter();

    // Basic fields
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [coverImageUrl, setCoverImageUrl] = useState("");

    // Additional SEO fields
    const [metaTitle, setMetaTitle] = useState("");
    const [metaDescription, setMetaDescription] = useState("");
    const [categories, setCategories] = useState("");
    const [tags, setTags] = useState("");

    // Publish toggle
    const [published, setPublished] = useState(false);

    // Submission state
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Quill reference
    const quillRef = useRef<any>(null);
    const [isClient, setIsClient] = useState(false); // Track if component is mounted

    useEffect(() => {
        setIsClient(true); // Ensure Quill only loads after mount
    }, []);


    // Generate slug from title if user hasn’t manually edited the slug
    useEffect(() => {
        const currentSlug = generateSlug(title);
        if (!slug || slug === generateSlug(slug)) {
            setSlug(currentSlug);
        }
    }, [title]);

    // Upload for the COVER image
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        try {
            const formData = new FormData();
            formData.append("files", selectedFile);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                console.error("Upload failed");
                toast.error("Cover image upload failed.");
                return;
            }

            const data = await res.json();
            if (data.fileUrls && data.fileUrls.length > 0) {
                setCoverImageUrl(data.fileUrls[0]);
                toast.success("Cover image uploaded successfully.");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    const handleInEditorImageUpload = () => {
        // Ensure we are on the client
        if (!isClient) return;

        // Create a hidden file input and append it to the DOM
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.style.display = "none";
        document.body.appendChild(input);

        // Trigger the file dialog
        input.click();

        input.addEventListener("change", async () => {
            // Remove the input from the DOM after selection
            document.body.removeChild(input);

            const file = input.files?.[0];
            if (!file) return;

            try {
                const formData = new FormData();
                formData.append("files", file);

                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!res.ok) {
                    console.error("Failed to upload image");
                    toast.error("Failed to upload image");
                    return;
                }

                const data = await res.json();
                if (data.fileUrls && data.fileUrls.length > 0) {
                    const imageUrl = data.fileUrls[0];
                    console.log("Image uploaded, URL:", imageUrl);

                    // Get the Quill editor instance
                    const editor = quillRef.current?.getEditor();
                    if (!editor) {
                        console.error("Quill editor not found!");
                        toast.error("Editor not loaded. Please try again.");
                        return;
                    }

                    // Focus the editor and get the current selection
                    editor.focus();
                    let range = editor.getSelection();
                    if (!range) {
                        range = { index: editor.getLength(), length: 0 };
                    }

                    // Insert the image at the current selection
                    editor.insertEmbed(range.index, "image", imageUrl, "user");
                    toast.success("Image inserted into post.");
                }
            } catch (err) {
                console.error(err);
                toast.error("Error uploading in-editor image.");
            }
        });
    };

    // Quill modules config
    const modules = useMemo(() => {
        return {
            toolbar: {
                container: [
                    [{ header: [1, 2, false] }],
                    ["bold", "italic", "underline", "blockquote"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link", "image"],
                    ["clean"],
                ],
            },
            imageUploader: {
                upload: (file: File) => {
                    return new Promise<string>((resolve, reject) => {
                        const formData = new FormData();
                        formData.append("files", file);
                        fetch("/api/upload", {
                            method: "POST",
                            body: formData,
                        })
                            .then((response) => response.json())
                            .then((result) => {
                                if (result.fileUrls && result.fileUrls.length > 0) {
                                    resolve(result.fileUrls[0]);
                                } else {
                                    reject("Upload failed");
                                }
                            })
                            .catch((error) => {
                                console.error("Error during image upload:", error);
                                reject("Upload failed");
                            });
                    });
                },
            },
        };
    }, []);


    // Submit form
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);
        try {
            const categoriesArr = categories.split(",").map((c) => c.trim()).filter(Boolean);
            const tagsArr = tags.split(",").map((t) => t.trim()).filter(Boolean);

            const body = {
                title,
                slug,
                excerpt,
                content,
                coverImage: coverImageUrl,
                published,
                metaTitle,
                metaDescription,
                categories: categoriesArr,
                tags: tagsArr,
            };

            const res = await fetch("/api/blog", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                console.error("Error creating blog post");
                toast.error("Error creating blog post.");
                setIsSubmitting(false);
                return;
            }

            toast.success("Blog post created successfully, redirecting to the created blog post!");
            router.push(`/blog/${slug}`);
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while creating the blog post.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="h-full text-white">
            <Card className="p-8 shadow-lg bg-background">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Create New Blog Post</CardTitle>
                    <CardDescription>
                        Add blog details, images, and meta information. Use the in-editor image button to embed images inline.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter your post title"
                                className="mt-2 placeholder:text-muted-foreground"
                                required
                            />
                        </div>

                        {/* Slug */}
                        <div>
                            <Label htmlFor="slug">Slug</Label>
                            <Input
                                id="slug"
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder="auto-generated from title, or override"
                                className="mt-2 placeholder:text-muted-foreground"
                            />
                        </div>

                        {/* Excerpt */}
                        <div>
                            <Label htmlFor="excerpt">Excerpt</Label>
                            <Textarea
                                id="excerpt"
                                value={excerpt}
                                onChange={(e) => setExcerpt(e.target.value)}
                                placeholder="Short summary or excerpt"
                                className="mt-2 placeholder:text-muted-foreground"
                            />
                        </div>

                        {/* Cover Image */}
                        <div>
                            <Label>Cover Image</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="mt-2"
                            />
                            {coverImageUrl && (
                                <img
                                    src={coverImageUrl}
                                    alt="Cover Preview"
                                    className="mt-2 w-48 h-auto rounded-md border"
                                />
                            )}
                        </div>

                        {isClient && (
                            <div>
                                <Label>Content</Label>
                                <QuillWrapper ref={quillRef} value={content} onChange={setContent} modules={modules} theme="snow" className="mt-2 border bg-gray-300 h-full mb-12 text-black" />
                            </div>
                        )}

                        {/* SEO Fields */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <Label htmlFor="metaTitle">Meta Title</Label>
                                <Input
                                    id="metaTitle"
                                    type="text"
                                    value={metaTitle}
                                    onChange={(e) => setMetaTitle(e.target.value)}
                                    placeholder="Title for SEO"
                                    className="mt-2 placeholder:text-muted-foreground"
                                />
                            </div>
                            <div>
                                <Label htmlFor="metaDescription">Meta Description</Label>
                                <Textarea
                                    id="metaDescription"
                                    value={metaDescription}
                                    onChange={(e) => setMetaDescription(e.target.value)}
                                    placeholder="Short description for SEO"
                                    className="mt-2 placeholder:text-muted-foreground"
                                />
                            </div>
                        </div>

                        {/* Categories & Tags */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <Label htmlFor="categories">Categories</Label>
                                <Input
                                    id="categories"
                                    type="text"
                                    value={categories}
                                    onChange={(e) => setCategories(e.target.value)}
                                    placeholder="e.g. tech, personal (comma-separated)"
                                    className="mt-2 placeholder:text-muted-foreground"
                                />
                            </div>
                            <div>
                                <Label htmlFor="tags">Tags</Label>
                                <Input
                                    id="tags"
                                    type="text"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    placeholder="e.g. nextjs, blog, mongodb (comma-separated)"
                                    className="mt-2 placeholder:text-muted-foreground"
                                />
                            </div>
                        </div>

                        {/* Publish Toggle */}
                        <div className="flex items-center space-x-2 pt-2">
                            <Switch
                                checked={published}
                                onCheckedChange={(checked) => setPublished(checked)}
                            />
                            <Label className="leading-none">Publish Immediately?</Label>
                        </div>
                        {/* Submit Button with Loader */}
                        <div className="relative">
                            <Button type="submit" className="mt-4 py-4 text-xl w-full" disabled={isSubmitting}>
                                {isSubmitting ? "Publishing..." : "Publish"}
                            </Button>
                            {isSubmitting && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Loader />
                                </div>
                            )}
                        </div>
                    </form>
                </CardContent>

                <CardFooter className="text-sm text-muted-foreground">
                    Make sure all required fields are filled out. You can edit or unpublish later.
                </CardFooter>
            </Card>
        </div>
    );
}

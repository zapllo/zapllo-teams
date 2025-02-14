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

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import QuillWrapper from "@/lib/QuillWrapper";

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
                return;
            }

            const data = await res.json();
            if (data.fileUrls && data.fileUrls.length > 0) {
                setCoverImageUrl(data.fileUrls[0]);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    // Custom image handler for Quill
    const handleInEditorImageUpload = () => {
        if (!isClient) return; // Prevents server-side execution
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.click();

        input.onchange = async () => {
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
                    return;
                }

                const data = await res.json();
                if (data.fileUrls && data.fileUrls.length > 0) {
                    const imageUrl = data.fileUrls[0];
                    console.log("Image uploaded, URL:", imageUrl);

                    // Insert the image into the editor
                    const editor = quillRef.current?.getEditor();
                    if (!editor) {
                        console.error("Quill editor not found!");
                        return;
                    }

                    // Force focus, so we definitely have a selection
                    editor.focus();

                    // Attempt to get the current selection
                    let range = editor.getSelection();
                    if (!range) {
                        // If there's still no selection, insert at the end
                        range = { index: editor.getLength(), length: 0 };
                    }

                    editor.insertEmbed(range.index, "image", imageUrl, "user");
                }
            } catch (err) {
                console.error(err);
            }
        };
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
                handlers: {
                    image: handleInEditorImageUpload,
                },
            },
        };
    }, []);

    // Submit form
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

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
                return;
            }

            router.push(`/blog/${slug}`);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="h-full text-white">
            <Card className="p-8 overflow-y-scroll">
                <CardHeader>
                    <CardTitle>Create New Blog Post</CardTitle>
                    <CardDescription>
                        Add blog details, images, and meta information. Use the in-editor image button
                        to embed images inline.
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
                                className="mt-2"
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
                                className="mt-2"
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
                                className="mt-2"
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
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <Label htmlFor="metaDescription">Meta Description</Label>
                                <Textarea
                                    id="metaDescription"
                                    value={metaDescription}
                                    onChange={(e) => setMetaDescription(e.target.value)}
                                    placeholder="Short description for SEO"
                                    className="mt-2"
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
                                    className="mt-2"
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
                                    className="mt-2"
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

                        {/* Submit Button */}
                        <Button type="submit" className="mt-4">
                            Publish
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="text-sm text-muted-foreground">
                    Make sure all required fields are filled out. You can edit or unpublish later.
                </CardFooter>
            </Card>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { toast } from "sonner";

// shadcn/ui components
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import Loader from "@/components/ui/loader";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function EditBlogPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [blog, setBlog] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      setIsFetching(true);
      try {
        const res = await fetch(`/api/blog/${params.id}`);
        const data = await res.json();
        if (res.ok) {
          setBlog(data);
        } else {
          toast.error("Failed to fetch blog");
          console.error("Failed to fetch blog:", data.message);
        }
      } catch (error) {
        toast.error("An error occurred while fetching the blog.");
        console.error("Error fetching blog:", error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchBlog();
  }, [params.id]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/blog/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blog),
      });
      if (res.ok) {
        toast.success("Blog post updated successfully!");
        router.push(`/blog/${blog.slug}`);
      } else {
        const errorData = await res.json();
        toast.error("Failed to update blog: " + errorData.message);
        console.error("Failed to update blog:", errorData);
      }
    } catch (error) {
      toast.error("An error occurred while updating the blog.");
      console.error("Error updating blog:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isFetching || !blog) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader />
      </div>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Edit Blog</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            value={blog.title}
            onChange={(e) => setBlog({ ...blog, title: e.target.value })}
            placeholder="Title"
          />
          <Textarea
            value={blog.excerpt}
            onChange={(e) => setBlog({ ...blog, excerpt: e.target.value })}
            placeholder="Excerpt"
            className="mt-4"
          />
          <ReactQuill
            value={blog.content}
            onChange={(content) => setBlog({ ...blog, content })}
            className="mt-4 bg-gray-300 text-black"
          />
          <div className="mt-4">
            <Switch
              checked={blog.published}
              onCheckedChange={(checked) => setBlog({ ...blog, published: checked })}
            />
            <span className="ml-2">Published</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpdate} disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Update"}
        </Button>
      </CardFooter>
    </Card>
  );
}

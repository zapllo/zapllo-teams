"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function EditBlogPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [blog, setBlog] = useState<any>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      const res = await fetch(`/api/blog/${params.id}`);
      const data = await res.json();
      if (res.ok) {
        setBlog(data);
      } else {
        console.error("Failed to fetch blog");
      }
    };
    fetchBlog();
  }, [params.id]);

  const handleUpdate = async () => {
    const res = await fetch(`/api/blog/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(blog),
    });
    if (res.ok) {
      router.push(`/blog/${blog.slug}`);
    } else {
      console.error("Failed to update blog");
    }
  };

  if (!blog) return <p>Loading...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Blog</CardTitle>
      </CardHeader>
      <CardContent>
        <Input value={blog.title} onChange={(e) => setBlog({ ...blog, title: e.target.value })} placeholder="Title" />
        <Textarea value={blog.excerpt} onChange={(e) => setBlog({ ...blog, excerpt: e.target.value })} placeholder="Excerpt" className="mt-4" />
        <ReactQuill value={blog.content} onChange={(content) => setBlog({ ...blog, content })} className="mt-4 bg-gray-300 text-black" />
        <Switch checked={blog.published} onCheckedChange={(published) => setBlog({ ...blog, published })} className="mt-4" />
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpdate}>Update</Button>
      </CardFooter>
    </Card>
  );
}

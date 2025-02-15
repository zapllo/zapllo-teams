"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { Label } from "../ui/label";
import { Loader2, MessageCircle } from "lucide-react";
import { toast } from "sonner";

interface Comment {
    _id: string;
    content: string;
    user: { firstName: string; lastName: string; profilePic?: string };
    createdAt: string;
}

export default function CommentSection({ blogId }: { blogId: string }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentText, setCommentText] = useState("");
    const [currentUser, setCurrentUser] = useState<{ firstName: string; lastName: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [posting, setPosting] = useState(false); // Loader for posting comment

    // Fetch comments
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await axios.get(`/api/blog/${blogId}/comments`);
                setComments(res.data.comments);
            } catch (error) {
                console.error("Error fetching comments:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchComments();
    }, [blogId]);

    // Fetch logged-in user
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("/api/users/me");
                if (response.data && response.data.data) {
                    setCurrentUser(response.data.data);
                }
            } catch (error) {
                console.log("User not logged in");
            }
        };
        fetchUser();
    }, []);

    // Handle comment submission
    const handleCommentSubmit = async () => {
        if (!commentText.trim()) return;

        setPosting(true);
        try {
            await axios.post(`/api/blog/${blogId}/comments`, { content: commentText });

            // Fetch updated comments to get fully populated user info
            const updatedComments = await axios.get(`/api/blog/${blogId}/comments`);
            setComments(updatedComments.data.comments);

            setCommentText(""); // Clear input after successful comment
            toast.success("Your comment has been posted! 🎉");
        } catch (error) {
            console.error("Error submitting comment:", error);
            toast.error("Failed to post comment. Please try again.");
        } finally {
            setPosting(false);
        }
    };

    return (
        <Card className="bg-white border-none shadow-md mt-12 p-6 rounded-xl">
            <CardHeader className="border-b pb-4 flex items-center justify-between">
                <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                    <MessageCircle className="w-6 h-6 text-primary" />
                    Join the Conversation ({comments.length} Comments)
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {loading ? (
                    <div className="space-y-4 mt-4">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="space-y-2">
                                <Skeleton className="h-5 w-1/3 bg-gray-200 rounded" />
                                <Skeleton className="h-4 w-full bg-gray-200 rounded" />
                                <Skeleton className="h-4 w-1/2 bg-gray-200 rounded" />
                            </div>
                        ))}
                    </div>
                ) : comments.length === 0 ? (
                    <p className="text-gray-500 text-center">No comments yet. Be the first to start the discussion!</p>
                ) : (
                    <div className="space-y-4 mt-6">
                        {comments.map((comment) => (
                            <Card key={comment._id} className="shadow-sm border bg-transparent  border-gray-200">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        {comment.user.profilePic ? (
                                            <img
                                                src={comment.user.profilePic}
                                                alt={comment.user.firstName}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 flex items-center justify-center bg-primary text-white font-semibold rounded-full">
                                                {comment.user.firstName[0]}{comment.user.lastName[0]}
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-gray-800 font-semibold">
                                                {comment.user.firstName} {comment.user.lastName}
                                            </p>
                                            <p className="text-gray-400 text-xs">
                                                {new Date(comment.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 mt-3">{comment.content}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </CardContent>

            {currentUser ? (
                <CardFooter className="flex flex-col gap-4">
                    <label className="text-gray-600 text-start ">Add your comment</label>
                    <Textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Share your thoughts..."
                        className="w-full border-gray-300 placeholder:text-gray-500 text-black focus:ring-2 focus:ring-primary focus:outline-none p-4 rounded-lg"
                    />
                    <Button
                        onClick={handleCommentSubmit}
                        disabled={!commentText.trim() || posting}
                        className="bg-primary text-white px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2"
                    >
                        {posting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {posting ? "Posting..." : "Post Comment 🚀"}
                    </Button>
                </CardFooter>
            ) : (
                <CardFooter className="flex flex-col items-center bg-gray-50 justify-center text-center space-y-4 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800">
                        🚀 Want to Join the Discussion?
                    </h3>
                    <p className="text-gray-500 text-sm">
                        Sign up to engage with other professionals, share insights, and get exclusive updates.
                    </p>
                    <Link href="/signup">
                        <Button variant="default" className="px-6 py-3 bg-primary border-primary hover:text-white transition-all">
                            Sign Up to Comment
                        </Button>
                    </Link>
                </CardFooter>
            )}
        </Card>
    );
}

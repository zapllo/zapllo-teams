'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Paperclip, Send, X } from 'lucide-react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Toaster, toast } from 'sonner'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { formatDistanceToNow } from 'date-fns'
import Loader from '@/components/ui/loader'

type Ticket = {
  _id: string;
  category: string;
  subcategory: string;
  subject: string;
  description: string;
  fileUrl?: string[];
  status: string;
  user: { name: string };
  createdAt: string;
  comments: Array<{
    userId: { firstName: string; lastName: string };
    content: string;
    createdAt: string;
    fileUrls?: string[];
  }>;
};

export default function TicketDetails({ params }: { params: { id: string } }) {
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [comment, setComment] = useState<string>('')
  const [files, setFiles] = useState<File[]>([])
  const [comments, setComments] = useState<Array<{
    userId: { firstName: string; lastName: string };
    content: string;
    createdAt: string;
    fileUrls?: string[];
  }>>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isSubmittingComment, setIsSubmittingComment] = useState<boolean>(false)
  const fileInputRef = useState<React.RefObject<HTMLInputElement>>(React.createRef())[0]

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`/api/tickets/${params.id}`)
        const sortedComments = response.data.comments.sort(
          (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        setTicket(response.data)
        setComments(sortedComments)
      } catch (error) {
        console.error('Error fetching ticket details:', error)
        toast.error("Failed to load ticket details")
      } finally {
        setLoading(false)
      }
    }
    fetchTicket()
  }, [params.id])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-500'
      case 'In Resolution':
        return 'bg-blue-500'
      case 'Closed':
        return 'bg-green-700'
      case 'Cancelled':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prevFiles => [...prevFiles, ...Array.from(e.target.files || [])])
    }
  }

  const handleFileRemove = (file: File) => {
    setFiles(files.filter(f => f !== file))
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (comment.trim() || files.length > 0) {
      setIsSubmittingComment(true)
      try {
        const fileUrls: string[] = []
        if (files.length > 0) {
          const formData = new FormData()
          files.forEach(file => formData.append('files', file))
          const uploadResponse = await axios.post('/api/upload', formData)
          fileUrls.push(...uploadResponse.data.fileUrls)
        }

        await axios.post(`/api/tickets/${params.id}/comments`, { comment, fileUrls })
        toast.success("Comment submitted successfully")
        setComment('')
        setFiles([])

        // Refresh the ticket data
        const updatedTicketResponse = await axios.get(`/api/tickets/${params.id}`)
        const sortedComments = updatedTicketResponse.data.comments.sort(
          (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        setComments(sortedComments)
      } catch (error) {
        console.error('Error submitting comment:', error)
        toast.error("Failed to submit comment")
      } finally {
        setIsSubmittingComment(false)
      }
    } else {
      toast.warning("Please add a comment or attachment before submitting")
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date)
  }

  const timeAgo = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true })
  }

  return (
    <div className=" py-8 mx-auto  px-4 sm:px-6 lg:px-8 mt-16">
      <Toaster />

      <div className="flex items-center mb-6">
        <Link href='/help/tickets' className="mr-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Ticket Details</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader />
        </div>
      ) : ticket ? (
        <div className=" gap-6">
          {/* Ticket Information */}
          <div className="">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{ticket.subject}</CardTitle>
                    <CardDescription className="mt-1">
                      Created {formatDate(ticket.createdAt)}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className={`${getStatusColor(ticket.status)} text-white px-3 py-1`}>
                    {ticket.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-muted-foreground">Category</p>
                    <p>{ticket.category}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Subcategory</p>
                    <p>{ticket.subcategory}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-sm whitespace-pre-line">{ticket.description}</p>
                </div>

                {ticket.fileUrl && ticket.fileUrl.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-medium mb-2">Attachments</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {ticket.fileUrl.map((url, index) => (
                          <TooltipProvider key={index}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block aspect-square rounded-md overflow-hidden border hover:opacity-90 transition-opacity"
                                >
                                  <img
                                    src={url}
                                    alt={`Attachment ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </a>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Click to open</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
     {/* Comment Thread */}
          <div className="w-full mt-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">Conversation History</CardTitle>
              </CardHeader>
              <ScrollArea className="">
                <CardContent>
                  {comments.length > 0 ? (
                    <div className="space-y-6">
                      {comments.map((comment, index) => (
                        <div key={index} className="space-y-3">
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarImage src="/placeholder-user.jpg" />
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {comment.userId.firstName.charAt(0)}{comment.userId.lastName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <p className="font-medium">
                                  {comment.userId.firstName} {comment.userId.lastName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {timeAgo(comment.createdAt)}
                                </p>
                              </div>
                              <p className="mt-1 text-sm whitespace-pre-line">{comment.content}</p>

                              {comment.fileUrls && comment.fileUrls.length > 0 && (
                                <div className="grid grid-cols-3 gap-2 mt-3">
                                  {comment.fileUrls.map((url, idx) => (
                                    <a
                                      key={idx}
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block aspect-square rounded-md overflow-hidden border hover:opacity-90 transition-opacity"
                                    >
                                      <img
                                        src={url}
                                        alt={`Comment attachment ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          {index < comments.length - 1 && <Separator />}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No comments yet.</p>
                      <p className="text-sm mt-1">Add a reply to get started.</p>
                    </div>
                  )}
                </CardContent>
              </ScrollArea>
            </Card>
          </div>
            {/* Reply Form */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Add Reply</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCommentSubmit}>
                  <Textarea
                    value={comment}
                    onChange={handleCommentChange}
                    placeholder="Type your message here..."
                    className="min-h-[120px] resize-none"
                  />

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    multiple
                  />

                  {files.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-4">
                      {files.map((file, index) => (
                        <div key={index} className="relative">
                          <div className="w-24 h-24 rounded-md border border-border overflow-hidden">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`File ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                            onClick={() => handleFileRemove(file)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={triggerFileInput}
                      className="flex items-center gap-2"
                    >
                      <Paperclip className="h-4 w-4" />
                      Attach Files
                    </Button>

                    <Button
                      type="submit"
                      disabled={isSubmittingComment}
                      className="bg-primary hover:bg-primary/90 flex items-center gap-2"
                    >
                      {isSubmittingComment ? (
                        <Loader className="h-4 w-4" />
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send Reply
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>


        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">Ticket not found or an error occurred.</p>
          <Button asChild className="mt-4">
            <Link href="/help/tickets">Return to Tickets</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

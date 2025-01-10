'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog'
import { ArrowLeft } from 'lucide-react'
import ChecklistSidebar from '@/components/sidebar/checklistSidebar'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { IconChecklist } from '@tabler/icons-react'
import { X } from 'lucide-react' // Import X icon for removing files
import Loader from '@/components/ui/loader'
import { toast, Toaster } from 'sonner'

type Ticket = {
    _id: string;
    category: string;
    subcategory: string;
    subject: string;
    description: string;
    fileUrl?: string[]; // Updated to handle array of URLs
    status: string;
    user: { name: string };
    createdAt: string;
    comments: Array<{
        userId: { firstName: string; lastName: string };
        content: string;
        createdAt: string;
        fileUrls?: string[]; // Array of file URLs for comments
    }>;
};

export default function TicketDetails({ params }: { params: { id: string } }) {
    const [ticket, setTicket] = useState<Ticket | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
    const [comment, setComment] = useState<string>('')
    const [files, setFiles] = useState<File[]>([]) // Updated to handle array of files
    const [comments, setComments] = useState<Array<{
        userId: { firstName: string; lastName: string };
        content: string;
        createdAt: string;
        fileUrls?: string[]; // Array of file URLs for comments
    }>>([])
    const [loading, setLoading] = useState<boolean>(true) // Add loading state for fetching ticket details
    const [isSubmittingComment, setIsSubmittingComment] = useState<boolean>(false) // Add loading state for comment submission


    useEffect(() => {
        const fetchTicket = async () => {
            try {
                setLoading(true); // Set loading to true before fetching
                const response = await axios.get(`/api/tickets/${params.id}`)
                const sortedComments = response.data.comments.sort(
                    (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                )
                setTicket(response.data)
                setComments(sortedComments)
                setLoading(false);
            } catch (error) {
                console.error('Error fetching ticket details:', error)
            }
        }
        fetchTicket()
    }, [params.id])

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(e.target.value)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files))
        }
    }

    const handleFileRemove = (file: File) => {
        setFiles(files.filter(f => f !== file))
    }

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (comment.trim() || files.length > 0) {
            setIsSubmittingComment(true) // Show loader during submission
            try {
                const fileUrls: string[] = []
                if (files.length > 0) {
                    const formData = new FormData()
                    files.forEach(file => formData.append('files', file))
                    const uploadResponse = await axios.post('/api/upload', formData)
                    fileUrls.push(...uploadResponse.data.fileUrls)
                }

                const response = await axios.post(`/api/tickets/${params.id}/comments`, { comment, fileUrls })
                console.log('Comment response:', response.data) // Add this line
                toast.success("Comment submitted successfully");
                setComment('')
                setFiles([])
                const updatedTicketResponse = await axios.get(`/api/tickets/${params.id}`)
                const sortedComments = updatedTicketResponse.data.comments.sort(
                    (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                )
                setComments(sortedComments)
            } catch (error) {
                console.error('Error submitting comment:', error)
            } finally {
                setIsSubmittingComment(false) // Hide loader after submission
            }
        }
    }


    return (
        <div className="flex mt-24">
            <ChecklistSidebar />
                        {/* <Toaster /> */}
            <div className="flex-1   p-4">
                <div className="w-full  -ml-2 max-w-8xl mx-auto">
                    <div className="gap-2 flex  w-full">
                        <div className="-mt-2 w-full">
                            {loading ? (
                                <Loader />
                            ) : (
                                <div className='p-6   overflow-y-scroll h-screen scrollbar-hide ml-52  -mt-12 space-y-4'>
                                    <Link href='/help/tickets'>
                                        <div className='flex gap-2 mb-8 font-medium text-xl cursor-pointer'>
                                            <ArrowLeft className='h-7 rounded-full border-white border w-7 hover:bg-white hover:text-black' />
                                            <h1>Back To My Tickets</h1>
                                        </div>
                                    </Link>
                                    {ticket && (
                                        <>
                                            <div className=' border p-4 rounded-xl'>
                                                <div className="relative max-w-full w-full h-full max-h-32">
                                                    <div
                                                        className={`flex border border-[#E0E0E066] px-2 py-1 rounded absolute right-0 ${ticket.status === 'Pending'
                                                            ? 'bg-red-500'
                                                            : ticket.status === 'In Resolution'
                                                                ? 'bg-blue-500'
                                                                : ticket.status === 'Closed'
                                                                    ? 'bg-green-700'
                                                                    : ticket.status === 'Cancelled'
                                                                        ? 'bg-red-800'
                                                                        : ''
                                                            }`}
                                                    >
                                                        <h1 className='text-white text-xs'>{ticket.status}</h1>
                                                    </div>
                                                </div>

                                                <div className='grid grid-cols-2'>
                                                    <div className='space-y-4'>
                                                        <p className='text-sm'><strong>Created At:</strong> {new Date(ticket.createdAt).toLocaleDateString()}</p>
                                                        <p className='text-sm'><strong>Category:</strong> {ticket.category}</p>
                                                        <p className='text-sm'><strong>Subcategory:</strong> {ticket.subcategory}</p>
                                                        <h1 className='text-sm'><strong>Subject:</strong> {ticket.subject}</h1>
                                                        <p className='text-sm'><strong>Description:</strong> {ticket.description}</p>
                                                    </div>
                                                    {ticket.fileUrl && ticket.fileUrl.length > 0 && (
                                                        <div className='-ml-20'>
                                                            <p className="text-sm font-semibold"><strong>Attachments:</strong></p>
                                                            <div className="grid  grid-cols-2 gap-4 sm:grid-cols-3 mt-4 md:grid-cols-4 lg:grid-cols-4 ">
                                                                {ticket.fileUrl.map((url, index) => (
                                                                    <div key={index} className="relative group">
                                                                        <a href={url} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-lg">
                                                                            <img
                                                                                src={url}
                                                                                alt={`Attachment ${index}`}
                                                                                className="w-full h-full object-cover transition-opacity duration-300 ease-in-out group-hover:opacity-70"
                                                                            />
                                                                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
                                                                                <h1 className="text-white text-xs font-bold">Click to open</h1>
                                                                            </div>
                                                                        </a>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                </div>
                                            </div>
                                            <div className='flex text-lg mt-4 gap-2'>
                                                <IconChecklist className='h-7 text-[#01784D]' />
                                                <h1>Ticket Updates</h1>
                                            </div>
                                            <div className='mt-6'>
                                                {comments.length > 0 ? (
                                                    <ul className='space-y-2'>
                                                        {comments.map((c, index) => (
                                                            <div key={index} className='p-2 border  scrollbar-hide  gap-2 rounded text-sm'>
                                                                <div className='flex gap-2'>
                                                                    <Avatar className='mt-1'>
                                                                        <AvatarImage src="/placeholder-user.jpg" />
                                                                        <AvatarFallback className='bg-[#815BF5] rounded-full p-1 text-white'>
                                                                            {c.userId.firstName.charAt(0)}{c.userId.lastName.charAt(0)}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                    <div className='flex '>
                                                                        <p><strong>{c.userId.firstName} {c.userId.lastName}</strong></p>
                                                                        <p><strong> {' '}</strong></p>
                                                                    </div>
                                                                </div>
                                                                <div className='px-2 ml-6'>
                                                                    <p className='text-xs text-gray-200'>{new Date(c.createdAt).toLocaleString()}</p>
                                                                </div>
                                                                <div className='ml-6 max-w-2xl break-words'>
                                                                    <h1 className='p-2 text-xs w-full'>{c.content}</h1>
                                                                </div>
                                                                <div className='flex justify-end'>
                                                                    {c.fileUrls && c.fileUrls.length > 0 && (
                                                                        <div className='relative'>
                                                                            <div className='flex gap-2  -mt-20 right-0'>
                                                                                {c.fileUrls.map((url, index) => (
                                                                                    <div key={index} className='mb-2'>
                                                                                        <a href={url} target="_blank" rel="noopener noreferrer">
                                                                                            <img
                                                                                                src={url}
                                                                                                alt={`Comment Attachment ${index}`}
                                                                                                className="object-cover w-36 h-full max-w-4xl max-h-32 rounded-lg"
                                                                                            />
                                                                                            <h1 className="text-xs text-center -mt-10 hover:underline">Click to open</h1>
                                                                                        </a>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className='text-sm'>No comments yet.</p>
                                                )}
                                            </div>

                                            <div className='  pb-12  rounded-xl '>
                                                <div className='border rounded-xl p-4'>
                                                    <h1 className='uppercase font-bold'>Reply</h1>
                                                    <form onSubmit={handleCommentSubmit} className='mt-4'>
                                                        <textarea
                                                            value={comment}
                                                            onChange={handleCommentChange}
                                                            placeholder='Type your comment here'
                                                            rows={4}
                                                            className='w-full focus:border-[#815bf5] p-2 border bg-[#0B0D29] outline-none  rounded'
                                                        />

                                                        <input
                                                            type='file'
                                                            onChange={handleFileChange}
                                                            className='my-2'
                                                        />
                                                        <div className='flex  justify-end'>
                                                            {isSubmittingComment ? (
                                                                <Loader />
                                                            ) : (
                                                                <Button type='submit' className='bg-[#007A5A] hover:bg-[#007A5A]'>Submit</Button>
                                                            )}
                                                        </div>

                                                        <div className='flex gap-2  flex-wrap mt-2'>
                                                            {files.map((file, index) => (
                                                                <div key={index} className='relative  w-32 h-32 mb-2'>
                                                                    <img
                                                                        src={URL.createObjectURL(file)}
                                                                        alt={`File ${index}`}
                                                                        className='object-cover w-full h-full rounded-lg'
                                                                    />
                                                                    <button
                                                                        type='button'
                                                                        onClick={() => handleFileRemove(file)}
                                                                        className='absolute top-1 right-1 bg-red-600 text-white rounded-full p-1'
                                                                    >
                                                                        <X className='h-4 w-4' />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { toast } from "sonner";

// Icons
import { Eye, Trash2, UploadCloud } from "lucide-react";
import { CrossCircledIcon } from "@radix-ui/react-icons";

// Components
import ChecklistSidebar from "@/components/sidebar/checklistSidebar";
import DeleteConfirmationDialog from "@/components/modals/deleteConfirmationDialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Badge,
} from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

type Ticket = {
  _id: string;
  category: string;
  subcategory: string;
  subject: string;
  status: string;
  description: string;
  fileUrl?: string[];
  user: { name: string };
  createdAt: string;
};

export default function Tickets() {
  const router = useRouter();
  const [category, setCategory] = useState<string>("");
  const [subcategory, setSubcategory] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [ticketToDelete, setTicketToDelete] = useState<Ticket | null>(null);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const userRes = await axios.get("/api/users/me");
        setUserId(userRes.data.data._id);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    getUserDetails();
  }, []);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/tickets/get");
        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        toast.error("Failed to load tickets");
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const handleDeleteTicket = async () => {
    if (!ticketToDelete) return;
    try {
      const response = await fetch(`/api/tickets/${ticketToDelete._id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setTickets(
          tickets.filter((ticket) => ticket._id !== ticketToDelete._id)
        );
        toast.success("Ticket deleted successfully");
      } else {
        toast.error("Failed to delete ticket");
      }
    } catch (error) {
      console.error("Error deleting ticket:", error);
      toast.error("Error deleting ticket");
    }
    setIsDeleteDialogOpen(false);
  };

  const handleOpenDeleteDialog = (ticket: Ticket) => {
    setTicketToDelete(ticket);
    setIsDeleteDialogOpen(true);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;

    if (selectedFiles && selectedFiles.length > 0) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/bmp",
        "video/mp4",
        "video/mpeg",
      ];
      const validFiles: File[] = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];

        if (allowedTypes.includes(file.type)) {
          validFiles.push(file);
        } else {
          toast.error(`"${file.name}" is not a valid type. Please upload only images or videos.`);
        }
      }

      if (validFiles.length > 0) {
        setFiles(validFiles);
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, fileIndex) => fileIndex !== index)
    );
  };

  const handleSubmit = async () => {
    if (!category || !subcategory || !subject || !description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    let fileUrl = [];

    if (files && files.length > 0) {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      try {
        const s3Response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (s3Response.ok) {
          const s3Data = await s3Response.json();
          fileUrl = s3Data.fileUrls;
        } else {
          toast.error("Failed to upload files");
          setIsSubmitting(false);
          return;
        }
      } catch (error) {
        console.error("Error uploading files:", error);
        toast.error("Error uploading files");
        setIsSubmitting(false);
        return;
      }
    }

    const ticketData = {
      category,
      subcategory,
      subject,
      description,
      user: userId,
      fileUrl,
    };

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ticketData),
      });

      if (response.ok) {
        const newTicket = await response.json();
        setTickets([...tickets, newTicket]);
        toast.custom((t) => (
          <div className="w-full mb-6 gap-2 m-auto bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg">
            <div className="w-full flex justify-center">
              <DotLottieReact
                src="/lottie/tick.lottie"
                loop
                autoplay
                style={{ height: "80px", width: "80px" }}
              />
            </div>
            <h1 className="text-black dark:text-white text-center font-medium text-lg">
              Ticket raised successfully
            </h1>
          </div>
        ));

        // Reset form
        setCategory("");
        setSubcategory("");
        setSubject("");
        setDescription("");
        setFiles([]);
        setIsDialogOpen(false);
      } else {
        toast.error("Failed to create ticket");
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error("Error creating ticket");
    }

    setIsSubmitting(false);
  };

  const handleViewDetails = (ticket: Ticket) => {
    router.push(`/help/tickets/${ticket._id}`);
  };

  function getStatusBadgeColor(status: string) {
    switch (status) {
      case "Pending":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "In Resolution":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Closed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    }
  }

  return (
    <div className="flex mt-12 h-screen">

      <div className="flex-1  p-6">
        <Card className="w-full max bg-transparent mx-auto">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">Support Tickets</CardTitle>
                <CardDescription>
                  View and manage your support tickets
                </CardDescription>
              </div>
              <Dialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    Raise a Ticket
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] p-6 z-[100] h-full max-h-screen m-auto">
                  <div className="flex justify-between items-center">
                  <DialogTitle className="text-xl font-semibold mb-2">
                    Raise a Ticket
                  </DialogTitle>
                  <DialogClose className="  ">
                    <CrossCircledIcon className='scale-150  hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]' />
                  </DialogClose>
                  </div>
                  {/* <Separator className="my-2" /> */}

                  <div className="grid gap-4 ">
                    <div className="grid gap-2">
                      <Select
                        value={category}
                        onValueChange={setCategory}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="z-[100]">
                          <SelectItem className='hover:bg-accent'  value="Report An Error">Report An Error</SelectItem>
                          <SelectItem  className='hover:bg-accent' value="Provide Feedback">Provide Feedback</SelectItem>
                          <SelectItem  className='hover:bg-accent' value="Payment/Subscription Issue">Payment/Subscription Issue</SelectItem>
                          <SelectItem  className='hover:bg-accent' value="Delete My Account">Delete My Account</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Select
                        value={subcategory}
                        onValueChange={setSubcategory}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select subcategory" />
                        </SelectTrigger>
                        <SelectContent className='z-[100]'>
                          <SelectItem className='hover:bg-accent' value="Task Delegation">Task Delegation</SelectItem>
                          <SelectItem className='hover:bg-accent' value="My Team">My Team</SelectItem>
                          <SelectItem className='hover:bg-accent' value="Intranet">Intranet</SelectItem>
                          <SelectItem className='hover:bg-accent' value="Leaves">Leaves</SelectItem>
                          <SelectItem className='hover:bg-accent' value="Attendance">Attendance</SelectItem>
                          <SelectItem className='hover:bg-accent' value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        value={subject}
                        className="text-black dark:text-white"
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Enter ticket subject"
                      />
                    </div>

                    <div className="grid gap-2">
                      <label htmlFor="description" className="text-sm font-medium">
                        Description
                      </label>
                      <Textarea
                        id="description"
                        rows={4}
                        value={description}
                        className="text-black dark:text-white"
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your issue in detail"
                      />
                    </div>

                    <div className="grid gap-2">
                      <label className="text-sm font-medium">
                        Attachments
                      </label>
                      <div className="border border-dashed rounded-md p-6 text-center">
                        <input
                          id="file-upload"
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer flex flex-col items-center gap-2"
                        >
                          <UploadCloud className="h-8 w-8 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Drop files here or click to upload
                          </span>
                          <span className="text-xs text-muted-foreground">
                            (Images and videos only)
                          </span>
                        </label>
                      </div>

                      {files.length > 0 && (
                        <div className="mt-2">
                          <h4 className="text-sm font-medium mb-2">Selected files:</h4>
                          <ul className="space-y-2">
                            {files.map((file, index) => (
                              <li
                                className="flex items-center justify-between bg-muted/30 p-2 rounded text-sm"
                                key={index}
                              >
                                <span className="truncate max-w-[300px]">{file.name}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeFile(index)}
                                  className="h-6 w-6 rounded-full"
                                >
                                  <CrossCircledIcon className="h-4 w-4 text-destructive" />
                                </Button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-4">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Ticket"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Subject</TableHead>
                      <TableHead className="w-[20%]">Status</TableHead>
                      <TableHead className="w-[20%]">Created</TableHead>
                      <TableHead className="w-[20%] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tickets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                          No tickets found. Create your first support ticket to get help.
                        </TableCell>
                      </TableRow>
                    ) : (
                      tickets.map((ticket) => (
                        <TableRow key={ticket._id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{ticket.subject}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusBadgeColor(ticket.status)}>
                              {ticket.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewDetails(ticket)}
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenDeleteDialog(ticket)}
                                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                title="Delete Ticket"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteTicket}
      />
    </div>
  );
}

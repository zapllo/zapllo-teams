"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  CheckCircle,
  XCircle,
  Trash2,
  ImagePlus,
  User,
  Calendar,
  Search,
  Filter,
  Upload,
  Eye,
  Clock
} from "lucide-react";
import { endOfMonth, startOfDay, startOfMonth, startOfWeek, subDays } from "date-fns";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// Components
import Loader from "@/components/ui/loader";
import DeleteConfirmationDialog from "@/components/modals/deleteConfirmationDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs3 as Tabs, TabsContent3 as TabsContent, TabsList3 as TabsList, TabsTrigger3 as TabsTrigger } from "@/components/ui/tabs3";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CrossCircledIcon } from "@radix-ui/react-icons";

// Types
interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
}

interface IFaceRegistrationRequest {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  imageUrls: string[];
  status: "pending" | "approved" | "rejected";
  isApproving: boolean;
  isRejecting: boolean;
  createdAt: string;
}

type DateFilterType = "Today" | "Yesterday" | "ThisWeek" | "ThisMonth" | "LastMonth" | "AllTime";

export default function RegisterFace() {
  // State management
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<IFaceRegistrationRequest[]>([]);
  const [updating, setUpdating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [imageModalUrl, setImageModalUrl] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteRequestId, setDeleteRequestId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<DateFilterType>("AllTime");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Fetch the users from the organization
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users/organization");
        const data = await response.json();
        if (response.ok) {
          setUsers(data.data);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch registration requests
  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/face-registration-request");
      const data = await response.json();
      if (response.ok) {
        const requestsWithUpdating = data.requests.map(
          (request: IFaceRegistrationRequest) => ({
            ...request,
            isUpdating: false,
            isApproving: false,
            isRejecting: false
          })
        );
        setRequests(requestsWithUpdating);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to fetch face registration requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const selectedFiles = Array.from(files);
      if (selectedFiles.length > 3) {
        toast.error("You can only upload up to 3 images");
        setError("You can only upload up to 3 images");
      } else {
        setError(null);
        setImageFiles(selectedFiles);
      }
    }
  };

  // Delete request handlers
  const openDeleteDialog = (requestId: string) => {
    setDeleteRequestId(requestId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteRequestId) {
      await handleDeleteRequest(deleteRequestId);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/delete-face-registration/${requestId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (response.ok) {
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== requestId)
        );
        toast.success("Face registration deleted successfully");
      } else {
        toast.error(data.message || "Failed to delete request");
      }
    } catch (err) {
      toast.error("Failed to delete request");
    } finally {
      setUpdating(false);
    }
  };

  // Register faces
  const registerFaces = async () => {
    if (!selectedUser) {
      toast.error("Please select a user");
      return;
    }

    if (imageFiles.length !== 3) {
      toast.error("Please upload exactly 3 images");
      return;
    }

    setUploading(true);

    try {
      // Upload images to S3
      const formData = new FormData();
      imageFiles.forEach((file) => formData.append("files", file));

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (uploadResponse.ok) {
        const imageUrls = uploadData.fileUrls;

        // Register face with image URLs
        const registerResponse = await fetch("/api/register-faces", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: selectedUser,
            imageUrls,
          }),
        });

        const registerData = await registerResponse.json();

        if (registerResponse.ok) {
          toast.success("Face registered successfully");
          fetchRequests();
          setIsDialogOpen(false);
          // Reset form
          setSelectedUser(null);
          setImageFiles([]);
        } else {
          toast.error(registerData.error || "Failed to register face");
        }
      } else {
        toast.error(uploadData.error || "Failed to upload images");
      }
    } catch (err) {
      toast.error("An error occurred during registration");
    } finally {
      setUploading(false);
    }
  };

  // Handle status change
  const handleStatusChange = async (requestId: string, status: "approved" | "rejected") => {
    setRequests((prevRequests) =>
      prevRequests.map((request) =>
        request._id === requestId
          ? status === "approved"
            ? { ...request, isApproving: true }
            : { ...request, isRejecting: true }
          : request
      )
    );

    try {
      const response = await fetch(`/api/approve-face-registration/${requestId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(
          status === "approved"
            ? "Face approved successfully"
            : "Face rejected successfully"
        );
        fetchRequests();
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (err) {
      toast.error("Failed to update request status");
    } finally {
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId
            ? { ...request, isApproving: false, isRejecting: false }
            : request
        )
      );
    }
  };

  // Filter requests by date
  const filterRequestsByDate = (requests: IFaceRegistrationRequest[]) => {
    const today = new Date();
    const yesterday = subDays(today, 1);
    const thisWeekStart = startOfWeek(today);
    const thisMonthStart = startOfMonth(today);
    const lastMonthStart = startOfMonth(new Date(today.getFullYear(), today.getMonth() - 1));
    const lastMonthEnd = endOfMonth(new Date(today.getFullYear(), today.getMonth() - 1));

    return requests.filter((request) => {
      const requestDate = new Date(request.createdAt);

      switch (dateFilter) {
        case "Today":
          return startOfDay(requestDate).getTime() === startOfDay(today).getTime();
        case "Yesterday":
          return startOfDay(requestDate).getTime() === startOfDay(yesterday).getTime();
        case "ThisWeek":
          return requestDate >= thisWeekStart && requestDate <= today;
        case "ThisMonth":
          return requestDate >= thisMonthStart && requestDate <= today;
        case "LastMonth":
          return requestDate >= lastMonthStart && requestDate <= lastMonthEnd;
        case "AllTime":
        default:
          return true;
      }
    });
  };

  // Search requests by user name
  const filterRequestsBySearch = (requests: IFaceRegistrationRequest[]) => {
    if (!searchQuery.trim()) return requests;

    return requests.filter((request) => {
      const fullName = `${request.userId.firstName} ${request.userId.lastName}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase());
    });
  };

  // Apply filters
  const filteredRequests = filterRequestsBySearch(filterRequestsByDate(requests));
  const filteredByStatus = filteredRequests.filter((request) => {
    if (activeTab === "all") return true;
    return request.status === activeTab;
  });

  // Count requests by status
  const countRequests = (status: "pending" | "approved" | "rejected") =>
    requests.filter((request) => request.status === status).length;

  // Status badge renderer
  const StatusBadge = ({ status }: { status: "pending" | "approved" | "rejected" }) => {
    const variants = {
      pending: { variant: "outline", className: "border-yellow-500 text-yellow-500 bg-yellow-500/10" },
      approved: { variant: "outline", className: "border-green-500 text-green-500 bg-green-500/10" },
      rejected: { variant: "outline", className: "border-red-500 text-red-500 bg-red-500/10" }
    };

    return (
      <Badge variant="outline" className={variants[status].className}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Face Registration</h1>
          <p className="text-muted-foreground mt-1">
            Register and manage employee face data for attendance verification
          </p>
        </div>

        <Button
          onClick={() => setIsDialogOpen(true)}
          className="w-full md:w-auto"
        >
          <ImagePlus className="mr-2 h-4 w-4" /> Register New Face
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div className="relative flex items-center w-full md:w-72">
              <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-full text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateFilter === "AllTime" ? "All Time" :
                      dateFilter === "ThisWeek" ? "This Week" :
                        dateFilter === "ThisMonth" ? "This Month" :
                          dateFilter === "LastMonth" ? "Last Month" : dateFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setDateFilter("Today")}>Today</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDateFilter("Yesterday")}>Yesterday</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDateFilter("ThisWeek")}>This Week</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDateFilter("ThisMonth")}>This Month</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDateFilter("LastMonth")}>Last Month</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDateFilter("AllTime")}>All Time</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <div className="px-6 pt-2">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="all" className="text-xs">
                  All ({requests.length})
                </TabsTrigger>
                <TabsTrigger value="pending" className="text-xs">
                  Pending ({countRequests("pending")})
                </TabsTrigger>
                <TabsTrigger value="approved" className="text-xs">
                  Approved ({countRequests("approved")})
                </TabsTrigger>
                <TabsTrigger value="rejected" className="text-xs">
                  Rejected ({countRequests("rejected")})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="pt-2">
              {renderRequestsList(filteredByStatus)}
            </TabsContent>
            <TabsContent value="pending" className="pt-2">
              {renderRequestsList(filteredByStatus)}
            </TabsContent>
            <TabsContent value="approved" className="pt-2">
              {renderRequestsList(filteredByStatus)}
            </TabsContent>
            <TabsContent value="rejected" className="pt-2">
              {renderRequestsList(filteredByStatus)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Registration Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          // Reset form state when dialog is closed
          setSelectedUser(null);
          setImageFiles([]);
          setError(null);
        }
      }}
      >
        <DialogContent className="sm:max-w-[500px] p-6">
          <DialogHeader>
            <div className="flex items-center justify-between mb-4">
              <DialogTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Register Face
              </DialogTitle>
              <DialogClose className="  py-2">
                <CrossCircledIcon className="scale-150 mt-1 hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]" />
              </DialogClose>
            </div>
          </DialogHeader>


          <div className="space-y-6 ">
            {loading ? (
              <div className="flex justify-center py-4">
                <Loader />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Employee</label>
                  <Select value={selectedUser || ""} onValueChange={setSelectedUser}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an employee" />
                    </SelectTrigger>
                    <SelectContent className="z-[100]">
                      {users.map((user) => (
                        <SelectItem key={user._id} value={user._id}>
                          {user.firstName} {user.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Upload Face Images (3 required)</label>
                  <div className="border border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <input
                      type="file"
                      id="face-images"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label htmlFor="face-images" className="cursor-pointer w-full block">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-1">
                        {imageFiles.length === 0
                          ? "Click to upload images"
                          : `${imageFiles.length} image${imageFiles.length !== 1 ? 's' : ''} selected`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Please upload exactly 3 different face angles
                      </p>
                    </label>
                  </div>

                  {error && (
                    <p className="text-sm text-red-500 mt-1">{error}</p>
                  )}
                </div>

                {imageFiles.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Image Preview</label>
                    <div className="grid grid-cols-3 gap-2">
                      {imageFiles.map((file, index) => (
                        <div key={index} className="relative aspect-square overflow-hidden rounded-md border bg-muted">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Face preview ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              onClick={registerFaces}
              disabled={uploading || !selectedUser || imageFiles.length !== 3}
              className="w-full"
            >
              {uploading ? <Loader /> : <ImagePlus className="mr-2 h-4 w-4" />}
              Register Face
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={!!imageModalUrl} onOpenChange={() => setImageModalUrl(null)}>
        <DialogContent className="sm:max-w-[700px] p-0">
          <DialogHeader className="p-6 pb-0 flex justify-between items-center">
            <DialogTitle>Face Image Preview</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <div className="p-6 pt-2">
            <div className="aspect-square overflow-hidden rounded-lg">
              <img
                src={imageModalUrl || ''}
                alt="Face Preview"
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Face Registration"
        description="Are you sure you want to delete this face registration? This action cannot be undone."
      />
    </div>
  );

  // Helper function to render the requests list
  function renderRequestsList(requests: IFaceRegistrationRequest[]) {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader />
        </div>
      );
    }

    if (requests.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <DotLottieReact
            src="/lottie/empty.lottie"
            loop
            autoplay
            className="h-40 w-40"
          />
          <h3 className="mt-4 text-lg font-medium">No Face Registrations Found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            No registrations match your current filters
          </p>
        </div>
      );
    }

    return (
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="h-10 px-4 text-left font-medium">Employee</th>
                <th className="h-10 px-4 text-left font-medium">Status</th>
                <th className="h-10 px-4 text-left font-medium">Images</th>
                <th className="h-10 px-4 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request._id} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {request.userId.firstName.charAt(0)}
                          {request.userId.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{request.userId.firstName} {request.userId.lastName}</p>
                        <p className="text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <StatusBadge status={request.status} />
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex gap-2">
                      {request.imageUrls.slice(0, 2).map((url, index) => (
                        <div
                          key={index}
                          className="relative h-10 w-10 rounded bg-muted overflow-hidden cursor-pointer"
                          onClick={() => setImageModalUrl(url)}
                        >
                          <img
                            src={url}
                            alt={`Face ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-10 w-10 p-0"
                        onClick={() => setImageModalUrl(request.imageUrls[0])}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-2">
                      {request.status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-green-500 text-green-500 hover:bg-green-500/10"
                            onClick={() => handleStatusChange(request._id, "approved")}
                            disabled={request.isApproving}
                          >
                            {request.isApproving ? (
                              <Loader />
                            ) : (
                              <CheckCircle className="h-4 w-4 mr-1" />
                            )}
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-red-500 text-red-500 hover:bg-red-500/10"
                            onClick={() => handleStatusChange(request._id, "rejected")}
                            disabled={request.isRejecting}
                          >
                            {request.isRejecting ? (
                              <Loader />
                            ) : (
                              <XCircle className="h-4 w-4 mr-1" />
                            )}
                            Reject
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-red-500 hover:bg-red-500/10 hover:text-red-500"
                        onClick={() => openDeleteDialog(request._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

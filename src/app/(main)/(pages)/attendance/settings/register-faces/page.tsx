"use client";
import React, { useState, useEffect } from "react";
import Loader from "@/components/ui/loader"; // Assuming you have a Loader component
import { CheckCheck, Circle, Cross, Trash2, X } from "lucide-react";
import {
  endOfMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns";
import { Cross1Icon, CrossCircledIcon, HamburgerMenuIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import DeleteConfirmationDialog from "@/components/modals/deleteConfirmationDialog";
import { toast, Toaster } from "sonner";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FaSearch } from "react-icons/fa";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

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
  createdAt: string; // Add a createdAt field if it doesn't exist already
}

export default function RegisterFace() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false); // For showing the loader
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<IFaceRegistrationRequest[]>([]);
  const [updating, setUpdating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [imageModalUrl, setImageModalUrl] = useState<string | null>(null); // For image preview modal
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteRequestId, setDeleteRequestId] = useState<string | null>(null);

  // Search and date filter states
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search input
  const [dateFilter, setDateFilter] = useState<
    "Today" | "Yesterday" | "ThisWeek" | "ThisMonth" | "LastMonth" | "AllTime"
  >("AllTime"); // Date filter
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Controls dialog open state

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const selectedFiles = Array.from(files);
      if (selectedFiles.length > 3) {
        setError("You can only upload up to 3 images");
      } else {
        setError(null); // Clear error if within limits
        setImageFiles(selectedFiles);
      }
    }
  };

  const openDeleteDialog = (requestId: string) => {
    setDeleteRequestId(requestId); // Store the ID of the request to be deleted
    setIsDeleteDialogOpen(true); // Open the modal
  };

  const confirmDelete = async () => {
    if (deleteRequestId) {
      await handleDeleteRequest(deleteRequestId); // Call delete request function
      setIsDeleteDialogOpen(false); // Close the modal after deletion
    }
  };

  const registerFaces = async () => {
    if (!selectedUser) {
      setError("Please select a user");
      return;
    }

    if (imageFiles.length !== 3) {
      setError("Please upload exactly 3 images");
      return;
    }

    setUploading(true); // Show loader

    try {
      // Step 1: Upload images to S3
      const formData = new FormData();
      imageFiles.forEach((file) => formData.append("files", file));

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (uploadResponse.ok) {
        const imageUrls = uploadData.fileUrls;

        // Step 2: Send the image URLs and user ID to the register API

        const registerResponse = await fetch("/api/register-faces", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: selectedUser,
            imageUrls, // Send image URLs to the backend to save to MongoDB
          }),
        });

        const registerData = await registerResponse.json();

        if (registerResponse.ok) {
          console.log("Face details registered successfully:", registerData);
          toast.success("Face details registered successfully");
          fetchRequests();
          setIsDialogOpen(false); // Close the dialog on successful registration
        } else {
          console.error("Error registering face details:", registerData.error);
        }
      } else {
        console.error("Error uploading images:", uploadData.error);
      }
    } catch (err) {
      console.error("Error during registration process:", err);
    } finally {
      setUploading(false); // Hide loader
    }
  };
  // Fetch requests and initialize isUpdating
  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/face-registration-request");
      const data = await response.json();
      if (response.ok) {
        // Add isUpdating to each request object in the fetched data
        const requestsWithUpdating = data.requests.map(
          (request: IFaceRegistrationRequest) => ({
            ...request,
            isUpdating: false,
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

  // Handle the status change and toggle isUpdating for the specific request
  const handleStatusChange = async (
    requestId: string,
    status: "approved" | "rejected"
  ) => {
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
      const response = await fetch(
        `/api/approve-face-registration/${requestId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success(
          status === "approved"
            ? "Face Approved successfully!"
            : "Face Rejected successfully!"
        );
        fetchRequests(); // Refresh requests
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to update request status");
    } finally {
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId
            ? status === "approved"
              ? { ...request, isApproving: false }
              : { ...request, isRejecting: false }
            : request
        )
      );
    }
  };
  const handleDeleteRequest = async (requestId: string) => {
    setUpdating(true);
    try {
      const response = await fetch(
        `/api/delete-face-registration/${requestId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      if (response.ok) {
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== requestId)
        );
        toast.success("Face deleted successfully!");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to delete request");
    } finally {
      setUpdating(false);
    }
  };
  // Function to filter requests based on date
  const filterRequestsByDate = (requests: IFaceRegistrationRequest[]) => {
    const today = new Date();
    const yesterday = subDays(today, 1);
    const thisWeekStart = startOfWeek(today);
    const thisMonthStart = startOfMonth(today);
    const lastMonthStart = startOfMonth(
      new Date(today.getFullYear(), today.getMonth() - 1)
    );
    const lastMonthEnd = endOfMonth(
      new Date(today.getFullYear(), today.getMonth() - 1)
    );

    return requests.filter((request) => {
      const requestDate = new Date(request.createdAt); // Assuming `createdAt` is a timestamp

      switch (dateFilter) {
        case "Today":
          return (
            startOfDay(requestDate).getTime() === startOfDay(today).getTime()
          );
        case "Yesterday":
          return (
            startOfDay(requestDate).getTime() ===
            startOfDay(yesterday).getTime()
          );
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
    return requests.filter((request) => {
      const fullName =
        `${request.userId.firstName} ${request.userId.lastName}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase());
    });
  };

  // Apply both date and search filters
  const filteredRequests = filterRequestsBySearch(
    filterRequestsByDate(requests)
  );

  const countRequests = (status: "pending" | "approved" | "rejected") =>
    requests.filter((request) => request.status === status).length;

  // Filter by status (all, pending, approved, rejected)
  const filteredByStatus = filteredRequests.filter((request) => {
    if (activeTab === "all") return true;
    return request.status === activeTab;
  });

  return (
    <div className="container mx-auto p-6">
      {/* <Toaster /> */}

      {/* Date Filters */}
      <div className="flex justify-center gap-4 mb-2">
        <button
          onClick={() => setDateFilter("Today")}
          className={`px-4 py-1 h-8 text-xs rounded ${dateFilter === "Today" ? "bg-[#815BF5] text-white" : "bg-[#] border"
            }`}
        >
          Today
        </button>
        <button
          onClick={() => setDateFilter("Yesterday")}
          className={`px-4 py-1 h-8 text-xs rounded ${dateFilter === "Yesterday"
            ? "bg-[#815BF5] text-white"
            : "bg-[#] border"
            }`}
        >
          Yesterday
        </button>
        <button
          onClick={() => setDateFilter("ThisWeek")}
          className={`px-4 py-1 h-8 text-xs rounded ${dateFilter === "ThisWeek"
            ? "bg-[#815BF5] text-white"
            : "bg-[#] border"
            }`}
        >
          This Week
        </button>
        <button
          onClick={() => setDateFilter("ThisMonth")}
          className={`px-4 py-1 h-8 text-xs rounded ${dateFilter === "ThisMonth"
            ? "bg-[#815BF5] text-white"
            : "bg-[#] border"
            }`}
        >
          This Month
        </button>
        <button
          onClick={() => setDateFilter("LastMonth")}
          className={`px-4 py-1 h-8 text-xs rounded ${dateFilter === "LastMonth"
            ? "bg-[#815BF5] text-white"
            : "bg-[#] border"
            }`}
        >
          Last Month
        </button>
        <button
          onClick={() => setDateFilter("AllTime")}
          className={`px-4 py-1 h-8 text-xs rounded ${dateFilter === "AllTime"
            ? "bg-[#815BF5] text-white"
            : "bg-[#] border"
            }`}
        >
          All Time
        </button>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div className="flex justify-center mb-2 w-full">
            <button className="bg-[#017A5B] text-white text-xs py-2 px-4 rounded w-fit mt-2 ml-2">
              Register Faces
            </button>
          </div>
        </DialogTrigger>
        <DialogContent className="flex justify-center items-center">
          <div className="w-full max-w-lg p-6">
            <div className="flex w-full justify-between max-w-">
              <h3 className="text-md text-white ">
                Register Faces - Upload 3 Images of Employee
              </h3>
              <DialogClose>
                {" "}
                <CrossCircledIcon className='scale-150  hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]' />

                {/* <X className="cursor-pointer border  rounded-full border-white h-5 hover:bg-white hover:text-black w-5" /> */}
              </DialogClose>
            </div>
            {loading ? (
              <p>Loading users...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div className="mb-4 mt-4">
                <select
                  className="w-full border text-white py-2 px-4 text-sm rounded outline-none"
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  <option value="text-sm">Select User</option>
                  {users.map((user) => (
                    <option
                      key={user._id}
                      className="text-sm"
                      value={user._id}
                    >
                      {user.firstName} {user.lastName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="mb-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full text-white py-2  text-sm outline-none rounded focus:outline-none focus:ring focus:border-blue-300"
              />
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              {imageFiles.length > 0 &&
                imageFiles.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="w-full h-auto rounded"
                    />
                  </div>
                ))}
            </div>

            {uploading ? (
              <Loader /> // Show loader when uploading
            ) : (
              <button
                onClick={registerFaces}
                className="bg-[#815BF5] text-white font-medium text-sm py-2 px-4 rounded w-full"
              >
                Register Face
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {/* Search Input */}
      <div className="flex justify-center mb-6 p-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs outline-none bg-transparent border rounded pl-10 pr-4 py-2"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon className="text-gray-400 scale-125" />
          </div>
        </div>
      </div>


      {/* Status Tabs */}
      <div className="tabs mb-6 flex justify-center mt-4 space-x-4">
        <button
          className={`px-4 py-2 flex text-xs rounded gap-2 ${activeTab === "all" ? "bg-[#815BF5] text-white" : "bg-[#] border"
            }`}
          onClick={() => setActiveTab("all")}
        >
          <HamburgerMenuIcon />
          All ({requests.length})
        </button>
        <button
          className={`px-4 py-2 flex text-xs rounded gap-2 ${activeTab === "pending" ? "bg-[#815BF5] text-white" : "bg-[#] border"
            }`}
          onClick={() => setActiveTab("pending")}
        >
          <Circle className="text-red-500 h-4" />
          Pending ({countRequests("pending")})
        </button>
        {/* <button
          className={`px-4 py-2 flex text-xs rounded gap-2 ${
            activeTab === "approved"
              ? "bg-[#7c3987] text-white"
              : "bg-[#28152e]"
          }`}
          onClick={() => setActiveTab("approved")}
        >
          <CheckCheck className="text-green-500 h-4" />
          Approved ({countRequests("approved")})
        </button> */}
        <button
          className={`px-4 py-2 flex text-xs rounded gap-2 border ${activeTab === "approved"
            ? "bg-[#815BF5] text-white border-transparent"
            : "bg-[#] border-"
            } hover:border-green-500`}
          onClick={() => setActiveTab("approved")}
        >
          <CheckCheck className="text-green-500 h-4" />
          Approved ({countRequests("approved")})
        </button>
        {/* 
        <button
          className={`px-4 py-2 flex text-xs rounded gap-2 ${
            activeTab === "rejected"
              ? "bg-[#7c3987] text-white"
              : "bg-[#28152e]"
          }`}
          onClick={() => setActiveTab("rejected")}
        >
          <Cross1Icon className="text-red-500 h-4" />
          Rejected ({countRequests("rejected")})
        </button> */}
        <button
          className={`px-4 py-2 flex text-xs rounded gap-2 border ${activeTab === "rejected"
            ? "bg-[#815BF5] text-white border-transparent"
            : "bg-[#] border-"
            } hover:border-red-500`}
          onClick={() => setActiveTab("rejected")}
        >
          <Cross1Icon className="text-red-500 h-4" />
          Rejected ({countRequests("rejected")})
        </button>
      </div>
      {/* Request Table */}
      <div className="overflow-x-auto scrollbar-hide">
        {loading ? (
          <Loader />
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredByStatus.length === 0 ? (
          // Display this message when there are no requests based on filters
          <div className="flex w-full justify-center">
            <div className="mt-8 ml-4">
              <DotLottieReact
                src="/lottie/empty.lottie"
                loop
                className="h-56"
                autoplay
              />
              <h1 className="text-center font-bold text-md mt-2">
                No Face Registration Requests Found
              </h1>
              <p className="text-center text-sm">
                The list is currently empty for the selected filters
              </p>
            </div>
          </div>
        ) : (
          <table className="min-w-full table-auto border  text-white">
            <thead>
              <tr className="border text-xs text-left bg-[#0A0D28]">
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Images</th>
                <th className="px-4 py-2 ">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredByStatus.map((request) => (
                <tr
                  key={request._id}
                  className="border-t text-xs border-gray-600"
                >
                  <td className="px-4 py-2">
                    {request.userId.firstName}
                    {request.userId.lastName}
                  </td>
                  {/* Conditional text color based on status */}
                  <td
                    className={`px-4 py-2 uppercase ${request.status === "approved"
                      ? "text-green-500"
                      : request.status === "rejected"
                        ? "text-red-500"
                        : "text-yellow-500"
                      }`}
                  >
                    {request.status}
                  </td>
                  <td className="px-4 py-2">
                    <div className="grid grid-cols-3 ">
                      {request.imageUrls.map((url, index) => (
                        <div key={request._id}>
                          <img
                            key={index}
                            src={url}
                            alt="Face"
                            className="w-16 h-12 opacity-30 bg-black object-contain rounded cursor-pointer"
                            onClick={() => setImageModalUrl(url)} // Set image URL for preview modal
                          />
                          <h1
                            onClick={() => setImageModalUrl(url)}
                            className=" -mt-8 hover:underline cursor-pointer ml-5 absolute "
                          >
                            View
                          </h1>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2 flex text-right">
                    {request.status === "pending" && (
                      <div className="space-x-2 flex">
                        <div>
                          <button
                            onClick={() =>
                              handleStatusChange(request._id, "approved")
                            }
                            className="bg-transparent flex gap-2 hover:border-green-600 border text-white py-2 px-4 rounded"
                            disabled={updating}
                          >
                            {request.isApproving ? (
                              <Loader />
                            ) : (
                              <CheckCheck className="text-green-700 h-4" />
                            )}{" "}
                            Approve
                          </button>
                        </div>
                        <div>
                          <button
                            onClick={() =>
                              handleStatusChange(request._id, "rejected")
                            }
                            className="border flex gap-2 bg-transparent hover:border-red-600 text-white py-2 px-4 rounded"
                            disabled={updating}
                          >
                            {request.isRejecting ? (
                              <Loader />
                            ) : (
                              <Cross1Icon className="text-red-500 h-4" />
                            )}{" "}
                            Reject
                          </button>
                        </div>
                      </div>
                    )}
                    {/* Delete Button */}
                    <button
                      onClick={() => openDeleteDialog(request._id)}
                      className=" text-white flex justify-start py-2 px-4 rounded "
                      disabled={updating}
                    >
                      <Trash2 className="text-red-500 h-4" />
                    </button>
                    <DeleteConfirmationDialog
                      isOpen={isDeleteDialogOpen}
                      onClose={() => setIsDeleteDialogOpen(false)} // Close the modal when canceled
                      onConfirm={confirmDelete} // Confirm delete action
                      title="Confirm Delete"
                      description="Are you sure you want to delete this face registration request? This action cannot be undone."
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Image Preview Modal */}
      {
        imageModalUrl && (
          <Dialog
            open={!!imageModalUrl}
            onOpenChange={() => setImageModalUrl(null)}
          >

            <DialogContent className=" p-6 ">
              <div className='flex items-center justify-between'>
                <h1 className='text-white text-md'>Uploaded Face</h1>
              <CrossCircledIcon onClick={() => setImageModalUrl(null)} className='scale-150 cursor-pointer  hover:bg-[#ffffff]  rounded-full hover:text-[#815BF5]' />
              </div>
              <div className="bg-[#] object-contain h-64 z-[100] relative p-6 max-w-2xl rounded-lg">
                <img
                  src={imageModalUrl}
                  alt="Face Preview"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            </DialogContent>
          </Dialog>
        )
      }
    </div >
  );
}

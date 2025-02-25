'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Loader from "@/components/ui/loader";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface UserDetails {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  whatsappNo: string;
  profilePic: string;
  role: string;
  reportingManager: {
    firstName: string;
    lastName: string;
    whatsappNo: string;
  } | null;
  isLeaveAccess: boolean;
  isTaskAccess: boolean;
  country: string;
  designation: string;
  staffType: string;
  contactNumber: string;
  asset: string;
  branch: string;
  status: string;
  department: string;
  employeeId: string; // EMP1, EMP2, etc.
  gender: string;
  workFromHomeAllowed: boolean; // <-- Add this line
}

export default function EmployeeProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/api/users/${userId}`)
      .then((response) => {
        setUser(response.data.user);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        setLoading(false);
      });
  }, [userId]);

  const handleUpdateField = (field: string, value: string | boolean) => {
    if (user) {
      setUser((prevUser) => ({
        ...prevUser!,
        [field]: value,
      }));
    }
  };


  const handleUpdateAllFields = async () => {
    if (user) {
      try {
        const response = await axios.patch(`/api/users/update`, { ...user, _id: user._id });
        if (response.data.success) {
          toast.success("User details updated successfully!");
        }
      } catch (error) {
        console.error("Error updating user details:", error);
        toast.error("Failed to update user details.");
      }
    }
  };

  if (loading) return <p><Loader /></p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div>
      {/* Profile Form */}
      <h2 className="text-lg font-semibold mb-4">Profile Information</h2>

      <div className="grid grid-cols-2 gap-4">
        {/* Name */}
        <div className="relative mt-4">
          <label className="absolute text-gray-500 bg-white dark:bg-[#04061E] px-1 -top-2 left-2 text-sm">Name</label>
          <input
            className="border outline-none dark:bg-[#04061E] rounded-2xl text-muted-foreground focus:border-[#815bf5] px-2 py-2 w-full"
            value={`${user.firstName} ${user.lastName}`}
            readOnly
          />
        </div>

        {/* Contact Number */}
        <div className="relative mt-4">
          <label className="absolute text-gray-500 bg-white dark:bg-[#04061E] px-1 -top-2 left-2 text-sm">Contact Number</label>
          <input
            className="border outline-none dark:bg-[#04061E] rounded-2xl text-muted-foreground focus:border-[#815bf5] px-2 py-2 w-full"
            value={user.whatsappNo || ""}
            readOnly
          />
        </div>


        {/* Reporting Manager */}
        <div className="relative mt-4">
          <label className="absolute text-gray-500 bg-white dark:bg-[#04061E] px-1 -top-2 left-2 text-sm">Reporting Manager</label>
          <input
            className="border outline-none dark:bg-[#04061E] rounded-2xl text-muted-foreground focus:border-[#815bf5] px-2 py-2 w-full"
            value={
              user.reportingManager
                ? `${user.reportingManager.firstName} ${user.reportingManager.lastName}`
                : "N/A"
            }
            readOnly
          />
        </div>

        <div className="relative   mt-4">
          <label className="absolute text-gray-500 bg-white dark:bg-[#04061E] px-1 -top-2 left-2 text-sm">Gender</label>
          <div className="flex gap-4 ml-4 mt-4">
            {["Male", "Female", "Other"].map((gender) => (
              <label key={gender} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  checked={user.gender === gender}
                  onChange={() => handleUpdateField("gender", gender)}
                  className="hidden"
                />
                <span
                  className={`relative w-4 h-4 rounded-full border-[3px] flex-shrink-0 mr-2 ${user.gender === gender
                    ? "bg-[#FC8929] border-transparent "
                    : "bg-[#37384b] border-gray-400"
                    }`}
                >
                  {user.gender === gender && (
                    <span className="absolute inset-0 rounded-full bg-white"></span>
                  )}
                </span>
                <span className="dark:text-white font-">{gender}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Designation */}
        <div className="relative mt-4">
          <label className="absolute text-gray-500 bg-white dark:bg-[#04061E] px-1 -top-2 left-2 text-sm">Designation</label>
          <input
            className="border outline-none dark:bg-[#04061E] rounded-2xl focus:border-[#815bf5] px-2 py-2 w-full"
            value={user.designation || ""}
            onChange={(e) => handleUpdateField("designation", e.target.value)}
          />
        </div>

        <div className="relative mt-4">
          <label className="absolute text-gray-500 bg-white dark:bg-[#04061E] px-1 -top-2 left-2 text-sm">Department</label>
          <input
            className="border outline-none dark:bg-[#04061E] rounded-2xl focus:border-[#815bf5] px-2 py-2 w-full"
            value={user.department || ""}
            onChange={(e) => handleUpdateField("department", e.target.value)}
          />
        </div>

        {/* Staff Type */}
        <div className="relative mt-4">
          <label className="absolute text-gray-500 bg-white dark:bg-[#04061E] px-1 -top-2 left-2 text-sm">Staff Type</label>
          <select
            className="border outline-none dark:bg-[#04061E] rounded-2xl focus:border-[#815bf5] px-2 py-2 w-full"
            value={user.staffType || ""}
            onChange={(e) => handleUpdateField("staffType", e.target.value)}
          >
            <option value="Regular Employee">Regular Employee</option>
            <option value="Contractor">Contractor</option>
            <option value="Work Basis">Work Basis</option>
          </select>
        </div>

        {/* Asset */}
        <div className="relative mt-4">
          <label className="absolute text-gray-500 bg-white dark:bg-[#04061E] px-1 -top-2 left-2 text-sm">Asset</label>
          <input
            className="border outline-none dark:bg-[#04061E] rounded-2xl focus:border-[#815bf5] px-2 py-2 w-full"
            value={user.asset || ""}
            onChange={(e) => handleUpdateField("asset", e.target.value)}
          />
        </div>

        {/* Branch */}
        <div className="relative mt-4">
          <label className="absolute text-gray-500 bg-white dark:bg-[#04061E] px-1 -top-2 left-2 text-sm">Branch</label>
          <input
            className="border outline-none dark:bg-[#04061E] rounded-2xl focus:border-[#815bf5] px-2 py-2 w-full"
            value={user.branch || ""}
            onChange={(e) => handleUpdateField("branch", e.target.value)}
          />
        </div>
        <div className="relative mt-4 flex items-center">
          <label className=" text-gray-500 dark:bg-[#04061E] px-1 text-sm">
            Work From Home Allowed
          </label>
          <div className=" ml-2 ">
            <Switch
              // Safely convert to boolean if uncertain. 
              // If your data definitely has a boolean, user.workFromHomeAllowed is fine.
              checked={Boolean(user.workFromHomeAllowed)}
              onCheckedChange={(checked) => handleUpdateField("workFromHomeAllowed", checked)}
            />
          </div>
        </div>
      </div>

      {/* Update Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleUpdateAllFields}
          className="px-4 py-2 bg-[#017a5b] text-sm text-white rounded hover:bg-green-800"
        >
          Update Details
        </button>
      </div>
    </div>
  );
}

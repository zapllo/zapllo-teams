"use client";

import { useState } from "react";
import axios from "axios";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import Loader from "@/components/ui/loader";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.patch("/api/changePassword", {
        currentPassword,
        newPassword,
      });
      setMessage(response.data.message);
      toast(<div className=" w-full mb-6 gap-2 m-auto  ">
        <div className="w-full flex  justify-center">
          <DotLottieReact
            src="/lottie/tick.lottie"
            loop
            autoplay
          />
        </div>
        <h1 className="text-black text-center font-medium text-lg">Password changed successfully</h1>
      </div>);
      setCurrentPassword("");
      setNewPassword("");
      setLoading(false);
    } catch (error: any) {
      setMessage(error.response?.data?.error || "An error occurred");
    }
  };

  return (
    <Card className="p-6  bg-transparent m-6 s">
      <CardTitle className="text-start">Change Your Password</CardTitle>
      {/* <Toaster /> */}
      <form className="space-y-2" onSubmit={handleSubmit}>
        <div className="mt-4 ">
          {/* <Label htmlFor="currentPassword">Current Password</Label> */}
          <input

            id="currentPassword"
            value={currentPassword}
            placeholder="Current Password"
            className="mt-2 p-2 w-full focus:border-[#815bf5] text-xs rounded outline-none bg-transparent border"
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div>
          {/* <Label htmlFor="newPassword">New Password</Label> */}
          <input

            id="newPassword"
            value={newPassword}
            className="mt-2 p-2 w-full focus:border-[#815bf5] mb-4  text-xs rounded outline-none bg-transparent border"
            placeholder="New Password"
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <Button className="mt-8 bg-[#017a5b] hover:bg-[#12614d] text-xs" type="submit">
          {loading ? <Loader /> : "Change Password"}
        </Button>
        {/* {message && <p>{message}</p>} */}
      </form>

    </Card>
  );
};

export default ChangePassword;

"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { Card, CardTitle } from "@/components/ui/card";
import Loader from "@/components/ui/loader";
import { Eye, EyeOff } from "lucide-react"; // Import the icons

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            setToken(token);
        }
    }, [searchParams]);

    const onSubmit = async () => {
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post("/api/reset-password", { token, password });
            if (response.status === 200) {
                toast.success("Password reset successfully");
                router.push("/login");
            }
        } catch (error: any) {
            console.log("Failed to reset password", error.message);
            toast.error("Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col -mt-12 items-center justify-center min-h-screen py-2">
            <Card className="w-full bg-transparent max-w-md p-8 space-y-8 rounded shadow-md">
                <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
                <div className="space-y-4 relative">
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                        <div
                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                        </div>
                    </div>
                </div>

                <div className="space-y-4 relative">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                        <div
                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                            onClick={toggleConfirmPasswordVisibility}
                        >
                            {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                        </div>
                    </div>
                </div>

                <Button className="bg-[#017a5b] hover:bg-[#017a5b]" onClick={onSubmit} disabled={loading}>
                    {loading ? <Loader /> : "Reset Password"}
                </Button>
                <Toaster position="top-center" />
            </Card>
        </div>
    );
}

"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/input";
import GradientText from "@/components/magicui/gradient";
import { Label } from "@/components/ui/label";
import { ShiningButton } from "@/components/globals/shiningbutton";
import { Button } from "@/components/ui/button";
import Meteors from "@/components/magicui/meteors";
import Cookies from "js-cookie";
import { Toaster, toast } from "sonner";
import { cn } from "@/lib/utils";
import Home from "@/components/icons/home";
import Loader from "@/components/ui/loader";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [userLoading, setUserLoading] = useState<boolean | null>(false);
    const [user, setUser] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });
    const [focusedInput, setFocusedInput] = useState({
        email: false,
        password: false,
    });
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = Cookies.get("token");
            if (token) {
                // Add a slight delay before redirecting
                setTimeout(() => {
                    router.replace("/dashboard");
                }, 1500); // Ensure consistent redirection
            }
        };

        checkLoginStatus();
    }, [router]);


    const validateInputs = () => {
        const newErrors = {
            email: "",
            password: "",
        };
        let isValid = true;

        if (!user.email) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(user.email)) {
            newErrors.email = "Invalid email address";
            isValid = false;
        }

        if (!user.password) {
            newErrors.password = "Password is required";
            isValid = false;
        } else if (user.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const onLogin = async () => {
        if (!validateInputs()) return;

        try {
            setLoading(true);
            setUserLoading(true);
            const response = await axios.post("/api/users/login", user, {
                withCredentials: true,
            });
            if (response.status === 200) {
                // Wait for a small delay to ensure the cookie is set
                setTimeout(() => {
                    setLoading(false);
                    setUserLoading(false);
                    router.replace("/dashboard");
                }, 1500); // 500ms delay for cookie propagation
            }
        } catch (error: any) {
            console.log("Login failed", error.message);
            setLoading(false);
            setUserLoading(false);
            let errorMessage = "An error occurred. Please try again."

            // If we have an error response from the server:
            if (error.response?.data?.error) {
                const serverError = error.response.data.error

                // Map serverError to a user-friendly message
                if (serverError === "User does not exist") {
                    errorMessage = "No account found with that email. Please sign up!"
                } else if (serverError === "Invalid password") {
                    errorMessage = "The password you entered is incorrect. Please try again."
                } else if (serverError === "Account is disabled. Please contact support.") {
                    errorMessage = "User account is deactivated";
                }
            }

            // Display final user-friendly message in a toast
            toast(<div className=" w-full mb-6 gap-2 m-auto  ">
                <div className="w-full flex  justify-center">
                    <DotLottieReact
                        src="/lottie/error.lottie"
                        loop
                        autoplay
                    />
                </div>
                <h1 className="text-black text-center font-medium text-lg">{errorMessage}</h1>
            </div>);
        } finally {
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter") {
            onLogin();
        }
    };
    const handleInputChange = (field: string, value: string) => {
        setUser((prev) => ({ ...prev, [field]: value }));

        setErrors((prev) => ({
            ...prev,
            [field]: "",
        }));
    };
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
        <>




{userLoading && (
    <div className="fixed w-screen h-screen z-[100] inset-0 bg-black/95 flex justify-center items-center">
        <div className="relative w-full max-w-md flex flex-col items-center justify-center p-6">
            {/* Professional container with subtle border */}
            <div className="relative bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-8 w-full max-w-sm shadow-2xl">
                {/* Logo with professional animation */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <img
                            src="/logo/loader.png"
                            className="h-16 drop-shadow-lg"
                            alt="Zapllon"
                        />
                        {/* Subtle shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine rounded-lg"></div>
                    </div>
                </div>

                {/* Professional progress indicator */}
                <div className="mb-5">
                    <div className="w-full bg-gray-700/50 h-1 rounded-full overflow-hidden">
                        <div className="h-full bg-[#815bf5] animate-progressBar rounded-full"></div>
                    </div>
                </div>

                {/* Professional messaging */}
                <div className="text-center">
                    <h3 className="text-white font-medium text-sm mb-1">Authenticating</h3>
                    <p className="text-white/60 text-xs">Securely accessing your account</p>
                </div>

                {/* Subtle rotating circles - professional indicators */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] opacity-20">
                        <div className="absolute inset-0 border border-[#815bf5]/30 rounded-full animate-spin-slow"></div>
                        <div className="absolute inset-[10px] border border-[#815bf5]/20 rounded-full animate-reverse-spin-slow"></div>
                        <div className="absolute inset-[20px] border border-[#815bf5]/10 rounded-full animate-spin-slower"></div>
                    </div>
                </div>
            </div>

            {/* Security message for professional reassurance */}
            <p className="text-white/50 text-xs mt-4 text-center">
                Your session is protected with end-to-end encryption
            </p>
        </div>
    </div>
)}


            <div
                onKeyDown={handleKeyDown}
                tabIndex={0}
                className="relative flex bg-[#211123] h-screen z-[50] items-center justify-center overflow-hidden rounded-lg bg-background md:shadow-xl">
                <div className="z-10 bg-[#211123]">
                    <Meteors number={30} />
                </div>
                <div className="max-w-md w-full mt-4 z-[100] mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
                    <div className="flex justify-center">
                        <img src='/logo.png' className="h-7 " />
                    </div>
                    <p className="text-neutral-600 text-sm font-bold text-center max-w-sm mt-2 dark:text-neutral-300">
                        Get Started
                    </p>
                    <div className="my-8">
                        <div className="relative mb-6">
                            <LabelInputContainer className="mb-4 relative">
                                <label
                                    htmlFor="email"
                                    className={cn(
                                        "text-xs absolute ml-2 bg-tra transition-all duration-300 bg-[#000000] text-[#D4D4D4]",
                                        focusedInput.email || user.email ? "top-[-2px]  bg-[#000000] px-1 scale-90" : "top-5 scale-110 left-4"
                                    )}
                                >
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    className={cn(errors.email ? "border-red-500" : "", "border p-2 bg-transparent rounded-lg outline-none focus:border-[#815bf5]")}
                                    value={user.email}
                                    onFocus={() => setFocusedInput({ ...focusedInput, email: true })}
                                    onBlur={() => setFocusedInput({ ...focusedInput, email: false })}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                />

                                {errors.email && <p className="text-red-500 text-xs absolute  inset-0 bottom-0 top-[42px] ml-2 ">{errors.email}</p>}
                            </LabelInputContainer>
                        </div>
                        <div className="relative h- mb-6">
                            <LabelInputContainer className="relative mb-4">
                                <label
                                    htmlFor="password"
                                    className={cn(
                                        "text-xs absolute ml-2 transition-all duration-300 bg-[#000101] text-[#D4D4D4]",
                                        focusedInput.password || user.password ? "top-[-2px]   bg-[#000000] px-1 scale-90" : "top-5 scale-110 left-4"
                                    )}
                                >
                                    Password
                                </label>
                                <input
                                    id="password"
                                    value={user.password}
                                    onFocus={() => setFocusedInput({ ...focusedInput, password: true })}
                                    onBlur={() => setFocusedInput({ ...focusedInput, password: false })}
                                    onChange={(e) => handleInputChange("password", e.target.value)}
                                    type={showPassword ? "text" : "password"}
                                    className={cn(errors.password ? "border-red-500" : "", "border bg-transparent p-2 rounded-lg outline-none focus:border-[#815bf5]")}
                                />
                                <div
                                    className="absolute inset-y-0 right-3  flex items-center cursor-pointer"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? <Eye className="text-[#787CA5]" size={18} /> : <EyeOff className="text-[#787CA5]" size={18} />}
                                </div>

                            </LabelInputContainer>
                            {errors.password &&
                                <p className="text-red-500 text-xs absolute  inset-0 bottom-0 mt-[50px] ml-2 ">{errors.password}</p>
                            }
                        </div>
                        <button
                            className="bg-[#815bf5] p-2 w-full border rounded-lg hover:bg-[#5f31e9]"
                            type="submit"
                            onClick={onLogin}
                        >
                            Login
                            <BottomGradient />
                        </button>
                        <div className="p-4 flex justify-center">
                            <Link href="/signup" className="text-center hover:underline mt-2">
                                Not a <span className="bg-gradient-to-r from-[#815BF5] via-[#FC8929] to-[#FC8929] bg-clip-text text-transparent font-bold">Zapllonian</span>? Register Here
                            </Link>
                        </div>
                        <div className="text-center">
                            <Link href="/forgetPassword" className="hover:underline">
                                Forgot your password?
                            </Link>
                        </div>
                        <p className="text-xs text-center mt-2">
                            By clicking continue, you agree to our {" "}
                            <a href="/terms" className="underline text-blue-400">
                                Terms of Service
                            </a> {" "}
                            and {" "}
                            <a href="/privacypolicy" className="underline text-blue-400">
                                Privacy Policy
                            </a>.
                        </p>
                        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
                        <div className="flex justify-center gap-2">
                            <div className="mt-[6px] scale-125">
                                <Home selected />
                            </div>
                            <Link href='/'>
                                <h1 className="hover:underline cursor-pointer">Back to Home</h1>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </>
    );
};

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>
    );
};

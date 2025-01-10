"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Toaster, toast } from "sonner";

export default function ContactForm() {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [message, setMessage] = useState("");
    const [mobNo, setMobNo] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    const [error, setError] = useState("");

    const handleSubscribe = async (event: React.FormEvent) => {
        event.preventDefault();
        setSubscribed(false);
        setError("");
        if (!email || !firstName || !lastName || !mobNo || !message) {
            setError("All fields are required.");
            return;
        }
        try {
            const response = await fetch("/api/leads", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, firstName, lastName, mobNo, message }),
            });
            if (response.ok) {
                toast.success("Message sent successfully!");
                setSubscribed(true);
                setEmail("");
                setFirstName("");
                setLastName("");
                setMobNo("");
                setMessage("");
            } else {
                const data = await response.json();
                setError(data.error || "Something went wrong");
            }
        } catch (err) {
            setError("Something went wrong");
        }
    };

    return (
        <form onSubmit={handleSubscribe} className="p-8  rounded-lg space-y-6">
            {error && <div className="text-red-500 mb-4">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                    <label className="absolute bg-[#05071E] text-[#787CA5] ml-2 text-xs -mt-2 px-1">
                        First Name
                    </label>
                    <input
                        className="w-full text-xs p-2 bg-transparent text-white outline-none border rounded focus:border-[#815BF5] focus:ring-1 focus:ring-[#815BF5]"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>

                <div className="relative">
                    <label className="absolute bg-[#05071E] text-[#787CA5] ml-2 text-xs -mt-2 px-1">
                        Last Name
                    </label>
                    <input
                     
                        className="w-full text-xs p-2 bg-transparent text-white outline-none border rounded focus:border-[#815BF5] focus:ring-1 focus:ring-[#815BF5]"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>

                <div className="relative">
                    <label className="absolute bg-[#05071E] text-[#787CA5] ml-2 text-xs -mt-2 px-1">
                        Email
                    </label>
                    <input
                    
                        type="email"
                        className="w-full text-xs p-2 bg-transparent text-white outline-none border rounded focus:border-[#815BF5] focus:ring-1 focus:ring-[#815BF5]"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="relative">
                    <label className="absolute bg-[#05071E] text-[#787CA5] ml-2 text-xs -mt-2 px-1">
                        WhatsApp Number
                    </label>
                    <input
                       
                        className="w-full text-xs p-2 bg-transparent text-white outline-none border rounded focus:border-[#815BF5] focus:ring-1 focus:ring-[#815BF5]"
                        value={mobNo}
                        onChange={(e) => setMobNo(e.target.value)}
                    />
                </div>
            </div>

            <div className="relative">
                <label className="absolute bg-[#05071E] text-[#787CA5] ml-2 text-xs -mt-2 px-1">
                    Your Message
                </label>
                <Textarea
                  
                    className="w-full text-xs p-2 bg-transparent text-white outline-none border rounded focus:border-[#815BF5] focus:ring-1 focus:ring-[#815BF5] h-32"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </div>

            <div className="md:flex md:justify-between mt-4">
                <Button
                    type="submit"
                    className="bg-[#815BF5] hover:bg-[#5E29FF] text-sm text-white px-6 py-2 rounded w-full md:w-auto"
                    disabled={subscribed}
                >
                    {subscribed ? "Message Sent!" : "Submit Now"}
                </Button>
                <p className="flex gap-2 md:max-w-[300px] md:mt-0 mt-4 text-[#676B93] text-xs">
                    <InfoCircledIcon className="scale-150" />
                    All fields are required. By submitting the form, you agree to the Terms & Conditions and Privacy Policy.
                </p>
            </div>
        </form>
    );
}

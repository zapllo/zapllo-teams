'use client'

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "sonner";

const RegistrationSuccess = () => {
    const handleCopyLink = () => {
        const link = "https://chat.whatsapp.com/BCgURzYeQZb1PB96uKvxjd"; // Replace with your actual link
        navigator.clipboard.writeText(link);
        toast.success("Link copied to clipboard");
    };

    const joinWhatsappGroup = () => {
        window.open("https://chat.whatsapp.com/BCgURzYeQZb1PB96uKvxjd", "_blank"); // Replace with your WhatsApp group link
    };

    return (
        <div className="flex  items-center justify-center flex- h-full max-h-screen w-full overflow-y-scroll scrollbar-hide m-auto    ">
            <div className="bg-gray-900 p-8 mt-12 mb-12 rounded-lg shadow-md text-center max-w-md w-full">
                {/* Green Checkmark Icon */}
                <div className="flex items-center justify-center mb-4 h-full w-full">
                    <div className="h-24">
                        <DotLottieReact
                            src="/lottie/success.lottie"
                            loop
                            autoplay
                        />
                    </div>
                </div>

                {/* Heading */}
                <h1 className="text-2xl font-semibold text-green-400">
                    Congratulations For Your Purchase!
                </h1>

                {/* Invite a Friend Section */}
                <p className="mt-4 text-lg">Invite a Friend</p>
                <div className="flex items-center justify-center gap-4 mt-4">
                    <button
                        onClick={handleCopyLink}
                        className="px-6 py-2 bg-white text-black rounded-full font-medium shadow-md hover:bg-gray-200"
                    >
                        Copy Link
                    </button>
                    <button
                        onClick={joinWhatsappGroup}
                        className="px-6 py-2 bg-green-500 text-white rounded-full font-medium flex items-center gap-2 shadow-md hover:bg-green-600"
                    >
                        <FaWhatsapp className="text-xl" />
                        WhatsApp
                    </button>
                </div>

                {/* WhatsApp Community Section */}
                <p className="mt-8 text-gray-300">
                    Join The{" "}
                    <span className="text-green-400 font-medium">
                    &quot;Zapllo Business Workspace Community&quot;
                    </span>{" "}
                    on WhatsApp For More Updates
                </p>
                <div className="flex justify-center">
                    <button
                        onClick={joinWhatsappGroup}
                        className="mt-4 px-8 py-3 bg-green-500 text-white rounded-full font-medium flex items-center justify-center shadow-md hover:bg-green-600"
                    >
                        WhatsApp Group
                    </button>
                </div>
                {/* Motivational Message */}

            </div>

        </div>
    );
};

export default RegistrationSuccess;

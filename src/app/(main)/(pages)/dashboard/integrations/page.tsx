"use client";

import CustomTimePicker from "@/components/globals/time-picker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/loader";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { CrossCircledIcon, StopwatchIcon } from "@radix-ui/react-icons";
import axios from "axios";
import {
    ChevronRight,
    Mail,
    Phone,
    PhoneCallIcon,
    Plus,
    PlusCircle,
    Video,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

interface Category {
    _id: string;
    name: string;
    organization: string;
}

export default function Page() {
    return (
        <div className="p-4  h-fit max-h-screen  scrollbar-hide overflow-y-scroll ">
            {/* <Toaster /> */}

        </div >
    );
}

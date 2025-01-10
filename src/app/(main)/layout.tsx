"use client";

import InfoBar from "@/components/infobar";
import MenuOptions from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { formatDistanceToNow, intervalToDuration } from "date-fns";
import { X, XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = { children: React.ReactNode };

const Layout = (props: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [isVisible2, setIsVisible2] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [userExceed, setUserExceed] = useState(false);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [trialExpires, setTrialExpires] = useState<Date | null>(null);
  const [timeMessage, setTimeMessage] = useState("");
  const [noAnnouncement, setNoAnnouncement] = useState(false);
  const [userLoading, setUserLoading] = useState<boolean | null>(false);
  const [isSubscriptionActive, setIsSubscriptionActive] = useState(false);
  const [subscriptionExpires, setSubscriptionExpires] = useState<Date | null>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    const fetchActiveAnnouncements = async () => {
      try {
        const response = await axios.get("/api/announcements");
        const fetchedAnnouncements = response.data.attachments; // Assuming `attachments` is the correct field
        setAnnouncements(fetchedAnnouncements);
        setIsVisible2(fetchedAnnouncements.length > 0);
        setNoAnnouncement(fetchedAnnouncements.length === 0); // Update `noAnnouncement` based on the length
      } catch (error) {
        console.error("Error fetching active announcements:", error);
      }
    };

    fetchActiveAnnouncements();
  }, []);


  const handleClose = () => setIsVisible(false);
  const handleAnnouncementClose = () => setIsVisible2(false);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        setUserLoading(true);
        const userRes = await axios.get("/api/users/me");
        setIsPro(userRes.data.data.isPro);
        const response = await axios.get("/api/organization/getById");
        const organization = response.data.data;
        setUserExceed(organization.userExceed);
        const trialEnd = new Date(organization.trialExpires);
        const subscriptionEnd = organization.subscriptionExpires
          ? new Date(organization.subscriptionExpires)
          : null;

        const trialExpired = trialEnd <= new Date();
        const subscriptionActive =
          subscriptionEnd && subscriptionEnd > new Date();

        setTrialExpires(trialEnd);
        setSubscriptionExpires(subscriptionEnd);
        setIsTrialExpired(trialExpired);
        setIsSubscriptionActive(!!subscriptionActive);

        setUserLoading(false);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    getUserDetails();
  }, []);

  useEffect(() => {
    if (trialExpires) {
      const updateTimeMessage = () => {
        const now = new Date();
        const trialEnd = new Date(trialExpires);

        if (isTrialExpired) {
          // Calculate elapsed time since expiration
          const duration = intervalToDuration({ start: trialEnd, end: now });
          const message =
            (duration.days || 0) > 0
              ? `${duration.days} days ago`
              : `${duration.hours || 0}h ${duration.minutes || 0}m since trial expired`;
          setTimeMessage(message);
        } else {
          // Calculate remaining time until expiration
          const remaining = formatDistanceToNow(trialEnd, { addSuffix: true });
          setTimeMessage(remaining);
        }
      };

      updateTimeMessage(); // Initial call
      const intervalId = setInterval(updateTimeMessage, 1000 * 60); // Update every minute

      return () => clearInterval(intervalId); // Cleanup on unmount
    }
  }, [isTrialExpired, trialExpires]);


  const isDynamicRoute = pathname.match(/^\/dashboard\/tickets\/[^/]+$/);

  if (
    isTrialExpired &&
    !isSubscriptionActive &&
    pathname !== "/dashboard/billing" &&
    pathname !== "/tutorials" &&
    pathname !== "/help/tickets" &&
    !isDynamicRoute
  ) {
    return (
      <div className="text-center pt-48 h-screen">
        <div className="justify-center flex items-center w-full">
          <div>
            <div className="flex justify-center w-full">
              <DotLottieReact
                src="/lottie/expired.lottie"
                loop
                className="h-36"
                autoplay
              />
            </div>
            <h1 className="text-2xl font-bold text-red-500">
              Your trial has expired!
            </h1>
            {/* <p>{timeMessage}</p> */}
            <p className="mt-4">
              Please purchase a subscription to continue using the Task
              Management features.
            </p>
          </div>
        </div>
        <Link href="/dashboard/billing">
          <Button className="h-9 bg-[#017a5b] hover:bg-[#23ac8a] text-white hover:text-white mt-4 text-md">
            Upgrade to Pro
          </Button>
        </Link>
      </div>
    );
  }

  if (
    userExceed &&
    pathname !== "/dashboard/billing" &&
    pathname !== "/tutorials" &&
    pathname !== "/help/tickets" &&
    !isDynamicRoute
  ) {
    return (
      <div className="text-center pt-48 h-screen">
        <div className="justify-center flex items-center w-full">
          <div>
            <div className="flex justify-center w-full">
              <DotLottieReact
                src="/lottie/expired.lottie"
                loop
                className="h-36"
                autoplay
              />
            </div>
            <h1 className="text-2xl font-bold text-red-500">
              Your User Limit Exceeded
            </h1>
            {/* <p>{timeMessage}</p> */}
            <p className="mt-4">
              You have created more users than your purchased plan, upgrade to more users or Contact Admin.
            </p>
          </div>
        </div>
        <Link href="/help/tickets">
          <Button className="h-9 bg-[#017a5b] hover:bg-[#23ac8a] text-white hover:text-white mt-4 text-md">
            Raise a Ticket
          </Button>
        </Link>
      </div>
    );
  }
  console.log(noAnnouncement, 'no announcement?')
  return (
    <div>
      {isVisible2 && (
        <div>
          {announcements.map((announcement) => (
            <div key={announcement._id}>
              {announcement && (

                <div style={{ background: "linear-gradient(90deg, #7451F8, #F57E57)" }} className="p-2  flex fixed top-0 w-full justify-center z-[100] gap-2  border">

                  <div className="flex gap-2 justify-center w-full items-center">
                    <div>
                      <h1 className="text-center  flex text-white text-xs">
                        <strong className="text-white">{announcement.announcementName}</strong>
                      </h1>
                    </div>
                    <div>
                      <Link href={announcement.buttonLink}>
                        <Button className="h-5 rounded dark:bg-white w-fit px-2 font-bold py-3  text-xs text-black">
                          {announcement.buttonName}
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <button onClick={handleAnnouncementClose} className="ml-auto text-white">
                    <X className="h-4 rounded-full" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isVisible && !isPro && !isSubscriptionActive && (
        <div className={`p-2 ${isVisible2 ? "mt-10" : "mt-0"} flex fixed top-0 w-full justify-center z-[100] gap-2 bg-[#37384B] border`}>

          <div className="flex gap-2 justify-center w-full">
            <h1 className="text-center mt-1 flex text-white text-xs">
              {isTrialExpired ? (
                <>Your trial period expired </>
              ) : (
                <>Your Trial Period will expire </>
              )}
              <strong className="text-yellow-500 ml-1">{timeMessage}</strong>,
              Upgrade now for uninterrupted access
            </h1>
            <Link href="/dashboard/billing">
              <Button className="h-5 rounded dark:bg-[#017a5b] w-fit px-2 py-3 text-xs text-white">
                Upgrade Now
              </Button>
            </Link>
          </div>
          <button onClick={handleClose} className="ml-auto text-white">
            <CrossCircledIcon className="scale-150  hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]" />
          </button>
        </div>
      )}
      <div
        className={`flex overflow-hidden ${isVisible && !isPro && !isSubscriptionActive ? "mt-10" : ""
          }  ${isVisible2 && isVisible ? "mt-20" : !isVisible && isVisible2 ? "mt-10" : !isVisible && !isVisible2 ? "" : ""} dark:bg-[#04061E] scrollbar-hide h-full w-full`}
      >
        <MenuOptions />
        <div className="w-full overflow-hidden h-screen">
          <InfoBar />
          <div className="ml-16">{props.children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;

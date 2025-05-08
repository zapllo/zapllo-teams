'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from 'next/navigation';
import {
  File,
  Wallet,
  CreditCard,
  Receipt,
  Clock,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { cn } from "@/lib/utils";

interface BillingSidebarProps {
  sidebarWidth?: number;
}

const BillingSidebar: React.FC<BillingSidebarProps> = ({ sidebarWidth = 20 }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get("/api/users/me");
        setUserRole(response.data.data.role);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const isActive = (path: string) => pathname === path;
  const isOrgAdmin = userRole === "orgAdmin";

  return (
    <div className="h-screen overflow-y-scroll scrollbar-hide mt-4 dark:bg-[#04061e]">
      <div className="px-4 py-6 flex flex-col h-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Billing & Payments</h2>
          </div>
          <div className="h-0.5 bg-gradient-to-r from-primary/60 to-transparent mt-2"></div>
        </div>

        {/* Navigation Groups */}
        <div className="space-y-6">
          {/* Main Billing Section */}
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-muted-foreground ml-2 mb-2">OVERVIEW</h3>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start rounded-md gap-3 py-2 h-auto",
                isActive('/dashboard/billing')
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted"
              )}
              onClick={() => handleNavigation('/dashboard/billing')}
            >
              <File className={cn("h-4 w-4", isActive('/dashboard/billing') && "text-primary")} />
              <span>Billing</span>
            </Button>
          </div>

          {/* Transaction Section */}
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-muted-foreground ml-2 mb-2">TRANSACTIONS</h3>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start rounded-md gap-3 py-2 h-auto",
                isActive('/dashboard/billing/wallet-logs')
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted"
              )}
              onClick={() => handleNavigation('/dashboard/billing/wallet-logs')}
            >
              <Wallet className={cn("h-4 w-4", isActive('/dashboard/billing/wallet-logs') && "text-primary")} />
              <span>Billing Logs</span>
            </Button>

            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start rounded-md gap-3 py-2 h-auto",
                isActive('/dashboard/wallet-recharge')
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted"
              )}
              onClick={() => handleNavigation('/dashboard/wallet-recharge')}
            >
              <FaWhatsapp className={cn("h-4 w-4", isActive('/dashboard/wallet-recharge') && "text-primary")} />
              <span>WABA Wallet</span>
            </Button>
          </div>


        </div>
      </div>
    </div>
  );
};

export default BillingSidebar;

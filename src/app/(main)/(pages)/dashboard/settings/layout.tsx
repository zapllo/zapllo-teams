'use client';

import React, { useEffect, useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import SettingsSidebar from '@/components/sidebar/settingsSidebar';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import axios from 'axios';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [isMounted, setIsMounted] = useState(false);
  const [sidebarSize, setSidebarSize] = useState(30);
  const [isTrialExpired, setIsTrialExpired] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Load saved sidebar size from localStorage if available
    const savedSize = localStorage.getItem('settingsSidebarSize');
    if (savedSize) {
      setSidebarSize(Number(savedSize));
    }

    // Fetch user/organization details
    const getUserDetails = async () => {
      try {
        const response = await axios.get('/api/organization/getById');
        const organization = response.data.data;
        const isExpired = organization.trialExpires && new Date(organization.trialExpires) <= new Date();
        setIsTrialExpired(isExpired);
      } catch (error) {
        console.error('Error fetching organization details:', error);
      }
    };

    getUserDetails();
  }, []);

  // Save sidebar size to localStorage when it changes
  const handleSidebarResize = (size: number) => {
    setSidebarSize(size);
    localStorage.setItem('settingsSidebarSize', size.toString());
  };

  if (!isMounted) {
    return null;
  }

  if (!isDesktop) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex items-center border-b h-14 px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 sticky top-0">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              <SettingsSidebar />
            </SheetContent>
          </Sheet>
          <h1 className="font-semibold">Settings</h1>
        </div>
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden mt-12">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={25}
          minSize={20}
          maxSize={30}
          onResize={handleSidebarResize}
          className="border-r border-border/40 bg-background/50 backdrop-blur-sm"
        >
          <SettingsSidebar sidebarWidth={sidebarSize} />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel>
          <ScrollArea className="h-full">
            {/* You can add your InfoBar here if needed */}
            {children}
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

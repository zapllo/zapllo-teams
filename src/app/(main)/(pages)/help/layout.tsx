'use client';

import React, { useEffect, useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import HelpSidebar from '@/components/sidebar/helpSidebar';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

interface HelpLayoutProps {
  children: React.ReactNode;
}

export default function HelpLayout({ children }: HelpLayoutProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [isMounted, setIsMounted] = useState(false);
  // Default to 260px (converted to percentage of viewport later)
  const [sidebarSize, setSidebarSize] = useState(30);

  useEffect(() => {
    setIsMounted(true);

    // Load saved sidebar size from localStorage if available
    const savedSize = localStorage.getItem('helpSidebarSize');
    if (savedSize) {
      setSidebarSize(Number(savedSize));
    }
  }, []);

  // Save sidebar size to localStorage when it changes
  const handleSidebarResize = (size: number) => {
    setSidebarSize(size);
    localStorage.setItem('helpSidebarSize', size.toString());
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
              <HelpSidebar />
            </SheetContent>
          </Sheet>
          <h1 className="font-semibold">Help Center</h1>
        </div>
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={25}
          // Minimum width that ensures descriptions remain readable
          minSize={20}
          // Maximum width to prevent sidebar from dominating the screen
          maxSize={30}
          onResize={handleSidebarResize}
          className="border-r border-border/40 bg-background/50 backdrop-blur-sm"
        >
          <HelpSidebar sidebarWidth={sidebarSize} />
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel>
          <ScrollArea className="h-full">
            {children}
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

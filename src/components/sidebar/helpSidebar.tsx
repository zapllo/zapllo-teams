import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CheckCircle,
  HelpCircle,
  LifeBuoy,
  Smartphone,
  Ticket,
  Video,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NavItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  description: string;
}

interface HelpSidebarProps {
  sidebarWidth?: number;
}

const HelpSidebar: React.FC<HelpSidebarProps> = ({ sidebarWidth = 20 }) => {
  const pathname = usePathname();
  const router = useRouter();

  // Determine if we're in a narrow state where we need to be more compact
  const isNarrow = sidebarWidth < 20;

  const navItems: NavItem[] = [
    {
      title: "Getting Started",
      path: "/help/checklist",
      icon: <CheckCircle className="h-5 w-5" />,
      description: "Complete onboarding tasks"
    },
    {
      title: "Tutorials",
      path: "/help/tutorials",
      icon: <Video className="h-5 w-5" />,
      description: "Learn how to use Zapllo"
    },
    {
      title: "Mobile App",
      path: "/help/mobile-app",
      icon: <Smartphone className="h-5 w-5" />,
      description: "Download our mobile applications"
    },
    {
      title: "Events",
      path: "/help/events",
      icon: <Calendar className="h-5 w-5" />,
      description: "Join upcoming events and webinars"
    },
    {
      title: "Support Tickets",
      path: "/help/tickets",
      icon: <Ticket className="h-5 w-5" />,
      description: "Get help from our support team"
    },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <div className="h-full flex mt-12 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-scroll h-screen scrollbar-hide">
        <div className="py-6 px-4 space-y-6">
          <div className="px-2">
            <div className="flex items-center gap-2 mb-1">
              <LifeBuoy className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Help Center</h2>
            </div>
            <p className="text-xs text-muted-foreground pl-8">
              Resources and support
            </p>
          </div>

          <div className="space-y-1 px-2">
            {navItems.map((item) => (
              <TooltipProvider key={item.path} delayDuration={isNarrow ? 0 : 300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start px-3 py-2 h-auto text-left relative",
                        isActive(item.path)
                          ? "bg-muted font-medium text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                      onClick={() => router.push(item.path)}
                    >
                      {isActive(item.path) && (
                        <span className="absolute left-0 inset-y-0 w-1 bg-primary rounded-full" />
                      )}
                      <div className="flex items-start gap-3">
                        <div className={isActive(item.path) ? "text-primary" : ""}>
                          {item.icon}
                        </div>
                        <div className={cn("flex flex-col", isNarrow && "max-w-[120px]")}>
                          <span className={cn(isNarrow && "text-sm")}>{item.title}</span>
                          <span className={cn(
                            "text-xs text-muted-foreground mt-0.5",
                            isNarrow && "truncate"
                          )}>
                            {item.description}
                          </span>
                        </div>
                      </div>
                    </Button>
                  </TooltipTrigger>
                  {isNarrow && (
                    <TooltipContent side="right">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>

          <div className="mt-6 px-2">
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Pro Tips</h3>
              </div>
              <p className={cn("text-xs text-muted-foreground", isNarrow && "line-clamp-2")}>
                Get the most out of Zapllo with expert tips and best practices.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => router.push('/help/tutorials')}
              >
                Explore Tips
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSidebar;

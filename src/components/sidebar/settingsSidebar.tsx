import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  GitBranchPlusIcon,
  PieChart,
  Settings,
  WalletCards
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

interface SettingsSidebarProps {
  sidebarWidth?: number;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ sidebarWidth = 20 }) => {
  const pathname = usePathname();
  const router = useRouter();

  // Determine if we're in a narrow state where we need to be more compact
  const isNarrow = sidebarWidth < 20;

  const navItems: NavItem[] = [
    {
      title: "General",
      path: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
      description: "Account and general settings"
    },
    {
      title: "Categories",
      path: "/dashboard/settings/categories",
      icon: <PieChart className="h-5 w-5" />,
      description: "Manage your categories"
    },
    {
      title: "Billing",
      path: "/dashboard/billing",
      icon: <WalletCards className="h-5 w-5" />,
      description: "Manage subscription and billing"
    },
    {
      title: "Integrations",
      path: "/dashboard/settings/integrations",
      icon: <GitBranchPlusIcon className="h-5 w-5" />,
      description: "Connect with other services"
    }
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-scroll h-screen scrollbar-hide">
        <div className="py-6 px-4 space-y-6">
          <div className="px-2">
            <div className="flex items-center gap-2 mb-1">
              <Settings className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Settings</h2>
            </div>
            <p className="text-xs text-muted-foreground pl-8">
              Configure your preferences
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
        </div>
      </div>
    </div>
  );
};

export default SettingsSidebar;

"use client";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowUpRight,
  Bell,
  Box,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  Download,
  ExternalLink,
  Globe,
  Grid3X3,
  HelpCircle,
  Info,
  Layers,
  MessageSquare,
  Phone,
  Puzzle,
  Shapes,
  Sparkles,
  Star,
  Users,
  Webhook,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

type IntegrationStatus = "coming-soon" | "beta" | "available";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  logo: string;
  status: IntegrationStatus;
  category: "zapllo" | "productivity" | "communication" | "other";
  popular?: boolean;
  comingSoon?: string; // date or quarter
}

export default function IntegrationsPage() {
  const [email, setEmail] = useState("");
  const [notifyLoading, setNotifyLoading] = useState(false);

  const handleNotifyMe = async (integration: string) => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setNotifyLoading(true);
    // Simulating API call
    setTimeout(() => {
      toast.success("You'll be notified when this integration launches", {
        description: `We'll send updates about ${integration} to ${email}`,
      });
      setEmail("");
      setNotifyLoading(false);
    }, 1500);
  };

  const integrations: Integration[] = [
    {
      id: "zapllo-crm",
      name: "Zapllo CRM",
      description: "Sync tasks with your CRM contacts, deals, and opportunities. Automate follow-ups and never miss a client engagement.",
      icon: <Users className="h-5 w-5 text-blue-500" />,
      logo: "/branding/zapllo-crm-logo.svg",
      status: "coming-soon",
      category: "zapllo",
      popular: true,
      comingSoon: "Q2 2023"
    },
    {
      id: "zapllo-calendar",
      name: "Zapllo Calendar",
      description: "Schedule tasks directly on your calendar. Convert events to tasks and vice versa.",
      icon: <CalendarDays className="h-5 w-5 text-indigo-500" />,
      logo: "/branding/zapllo-calendar-logo.svg",
      status: "coming-soon",
      category: "zapllo",
      comingSoon: "Q3 2023"
    },
    {
      id: "zapllo-chat",
      name: "Zapllo Chat",
      description: "Turn conversations into actionable tasks. Collaborate on tasks within your team chat.",
      icon: <MessageSquare className="h-5 w-5 text-green-500" />,
      logo: "/branding/zapllo-chat-logo.svg",
      status: "coming-soon",
      category: "zapllo",
      comingSoon: "Q4 2023"
    },
    {
      id: "google-workspace",
      name: "Google Workspace",
      description: "Integrate with Gmail, Google Calendar, and Google Drive for seamless task management.",
      icon: <Globe className="h-5 w-5 text-red-500" />,
      logo: "/integrations/google-workspace.svg",
      status: "coming-soon",
      category: "productivity",
      popular: true,
      comingSoon: "Q2 2023"
    },
    {
      id: "microsoft-365",
      name: "Microsoft 365",
      description: "Connect with Outlook, Teams, and other Microsoft tools to centralize your tasks.",
      icon: <Grid3X3 className="h-5 w-5 text-blue-600" />,
      logo: "/integrations/microsoft-365.svg",
      status: "coming-soon",
      category: "productivity",
      comingSoon: "Q3 2023"
    },
    {
      id: "slack",
      name: "Slack",
      description: "Convert messages to tasks, get notifications, and manage tasks without leaving Slack.",
      icon: <MessageSquare className="h-5 w-5 text-purple-500" />,
      logo: "/integrations/slack.svg",
      status: "coming-soon",
      category: "communication",
      popular: true,
      comingSoon: "Q2 2023"
    },
    {
      id: "zapier",
      name: "Zapier",
      description: "Connect Zapllo Tasks to 3,000+ apps and automate your workflows.",
      icon: <Webhook className="h-5 w-5 text-orange-500" />,
      logo: "/integrations/zapier.svg",
      status: "coming-soon",
      category: "other",
      comingSoon: "Q4 2023"
    },
    {
      id: "whatsapp",
      name: "WhatsApp Business",
      description: "Create tasks from WhatsApp messages and receive task notifications via WhatsApp.",
      icon: <Phone className="h-5 w-5 text-green-600" />,
      logo: "/integrations/whatsapp.svg",
      status: "coming-soon",
      category: "communication",
      comingSoon: "Q3 2023"
    },
  ];

  const categories = [
    { id: "all", name: "All Integrations" },
    { id: "zapllo", name: "Zapllo Ecosystem" },
    { id: "productivity", name: "Productivity Tools" },
    { id: "communication", name: "Communication" },
    { id: "other", name: "Other Integrations" },
  ];

  const [activeCategory, setActiveCategory] = useState("all");

  const filteredIntegrations = activeCategory === "all"
    ? integrations
    : integrations.filter(integration => integration.category === activeCategory);

  return (
    <div className=" h-fit max-h-screen overflow-y-scroll p-6 mx-auto max-w- scrollbar-hide space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground">
          Connect Zapllo Tasks with your favorite tools and services
        </p>
      </div>

      {/* Featured Integration - Zapllo Ecosystem */}
      <Card className="border-0 bg-gradient-to-br from-[#815BF5]/10 to-transparent shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#815BF5]/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#815BF5]/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl flex items-center">
                <Puzzle className="mr-2 h-6 w-6 text-[#815BF5]" />
                Zapllo Ecosystem
              </CardTitle>
              <CardDescription className="text-base mt-1">
                Seamlessly connect with other Zapllo products for maximum productivity
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-[#815BF5]/10 text-[#815BF5] border-[#815BF5]/30 px-3 py-1">
              Coming Soon
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            {integrations
              .filter(integration => integration.category === "zapllo")
              .map(integration => (
                <Card key={integration.id} className="border shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-[#815BF5]/10 flex items-center justify-center mr-3">
                          {integration.icon}
                        </div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                      </div>
                      {integration.popular && (
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                          <Star className="h-3 w-3 text-amber-500 mr-1" fill="currentColor" />
                          Popular
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="mt-2">
                      {integration.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between items-center pb-3 pt-2 border-t bg-muted/30">

                    <Button variant="outline" size="sm" className="text-xs h-8">
                      <span>Learn More</span>
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 items-center">
        {categories.map(category => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(category.id)}
            className={`
              rounded-full text-sm font-medium h-9
              ${activeCategory === category.id ? "bg-primary" : "hover:bg-muted"}
            `}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* All Integrations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map(integration => (
          <Card
            key={integration.id}
            className="border shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-muted">
                    {integration.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <Badge
                      variant="outline"
                      className="mt-1 text-xs px-2 py-0 h-5 bg-gradient-to-r from-amber-100/50 to-amber-50/30 text-amber-800 dark:text-amber-400"
                    >
                      Coming Soon
                    </Badge>
                  </div>
                </div>
                {integration.popular && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-6 h-6 flex items-center justify-center">
                          <Star className="h-5 w-5 text-amber-400" fill="currentColor" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Popular integration</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </CardHeader>

            <CardContent className="py-3">
              <p className="text-sm text-muted-foreground">
                {integration.description}
              </p>
            </CardContent>

          </Card>
        ))}
      </div>

      {/* Zapier/Developer Section */}
      <Card className="shadow-sm border-0 bg-gradient-to-br from-slate-100 to-white dark:from-slate-900/40 dark:to-slate-900/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Box className="mr-2 h-5 w-5 text-primary" />
            Build Custom Integrations
          </CardTitle>
          <CardDescription>
            Coming soon: Connect Zapllo Tasks to thousands of apps with our API and webhooks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1 space-y-2">
              <h3 className="text-sm font-medium">Developer API</h3>
              <p className="text-sm text-muted-foreground">
                Our upcoming API will allow developers to build custom integrations and extend Zapllo's functionality.
              </p>
              {/* <Badge variant="outline" className="mt-2">Coming Q4 2023</Badge> */}
            </div>

            <div className="flex-1 space-y-2">
              <h3 className="text-sm font-medium">Webhooks</h3>
              <p className="text-sm text-muted-foreground">
                Trigger actions in other systems based on events in Zapllo Tasks.
              </p>
              {/* <Badge variant="outline" className="mt-2">Coming Q4 2023</Badge> */}
            </div>

            <div className="flex-1 space-y-2">
              <h3 className="text-sm font-medium">Zapier Integration</h3>
              <p className="text-sm text-muted-foreground">
                Connect to 3,000+ apps without coding through our upcoming Zapier integration.
              </p>
              {/* <Badge variant="outline" className="mt-2">Coming Q3 2023</Badge> */}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pt-0">

        </CardFooter>
      </Card>

      {/* Request Integration Section */}
      {/* <Card className="shadow-sm border border-primary/20 ">
        <CardContent className="pt-6 mb-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-primary" />
                Don't see what you need?
              </h3>
              <p className="text-sm text-muted-foreground">
                Let us know which integrations would help your workflow. We're constantly adding new connections.
              </p>
            </div>
            <Button className="shrink-0">
              Request Integration
            </Button>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}

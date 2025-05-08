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
import { Tabs3 as Tabs, TabsContent3 as TabsContent, TabsList3 as TabsList, TabsTrigger3 as TabsTrigger } from "@/components/ui/tabs3";
import {
  ArrowUpRight,
  Box,
  CalendarDays,
  ChevronRight,
  ExternalLink,
  Globe,
  Grid3X3,
  Link,
  MessageSquare,
  Phone,
  Puzzle,
  Search,
  Star,
  Users,
  Webhook,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";

type IntegrationStatus = "coming-soon" | "beta" | "available";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: IntegrationStatus;
  category: "zapllo" | "productivity" | "communication" | "other";
  popular?: boolean;
  comingSoon?: string; // date or quarter
}

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const integrations: Integration[] = [
    {
      id: "zapllo-crm",
      name: "Zapllo CRM",
      description: "Sync tasks with your CRM contacts, deals, and opportunities. Automate follow-ups and never miss a client engagement.",
      icon: <Users className="h-5 w-5" />,
      status: "coming-soon",
      category: "zapllo",
      popular: true,
      comingSoon: "Q2 2023"
    },
    {
      id: "zapllo-calendar",
      name: "Zapllo Calendar",
      description: "Schedule tasks directly on your calendar. Convert events to tasks and vice versa.",
      icon: <CalendarDays className="h-5 w-5" />,
      status: "coming-soon",
      category: "zapllo",
      comingSoon: "Q3 2023"
    },
    {
      id: "zapllo-chat",
      name: "Zapllo Chat",
      description: "Turn conversations into actionable tasks. Collaborate on tasks within your team chat.",
      icon: <MessageSquare className="h-5 w-5" />,
      status: "coming-soon",
      category: "zapllo",
      comingSoon: "Q4 2023"
    },
    {
      id: "google-workspace",
      name: "Google Workspace",
      description: "Integrate with Gmail, Google Calendar, and Google Drive for seamless task management.",
      icon: <Globe className="h-5 w-5" />,
      status: "coming-soon",
      category: "productivity",
      popular: true,
      comingSoon: "Q2 2023"
    },
    {
      id: "microsoft-365",
      name: "Microsoft 365",
      description: "Connect with Outlook, Teams, and other Microsoft tools to centralize your tasks.",
      icon: <Grid3X3 className="h-5 w-5" />,
      status: "coming-soon",
      category: "productivity",
      comingSoon: "Q3 2023"
    },
    {
      id: "slack",
      name: "Slack",
      description: "Convert messages to tasks, get notifications, and manage tasks without leaving Slack.",
      icon: <MessageSquare className="h-5 w-5" />,
      status: "coming-soon",
      category: "communication",
      popular: true,
      comingSoon: "Q2 2023"
    },
    {
      id: "zapier",
      name: "Zapier",
      description: "Connect Zapllo Tasks to 3,000+ apps and automate your workflows.",
      icon: <Webhook className="h-5 w-5" />,
      status: "coming-soon",
      category: "other",
      comingSoon: "Q4 2023"
    },
    {
      id: "whatsapp",
      name: "WhatsApp Business",
      description: "Create tasks from WhatsApp messages and receive task notifications via WhatsApp.",
      icon: <Phone className="h-5 w-5" />,
      status: "coming-soon",
      category: "communication",
      comingSoon: "Q3 2023"
    },
  ];

  // Filter integrations based on search query
  const filteredIntegrations = integrations.filter(integration =>
    integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    integration.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group filtered integrations by category
  const zaplloIntegrations = filteredIntegrations.filter(i => i.category === "zapllo");
  const productivityIntegrations = filteredIntegrations.filter(i => i.category === "productivity");
  const communicationIntegrations = filteredIntegrations.filter(i => i.category === "communication");
  const otherIntegrations = filteredIntegrations.filter(i => i.category === "other");

  const IntegrationCard = ({ integration }: { integration: Integration }) => (
    <Card className="overflow-hidden border hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 text-primary">
              {integration.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">{integration.name}</CardTitle>
                {integration.popular && (
                  <TooltipProvider>

                  <Tooltip>
                    <TooltipTrigger>
                      <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    </TooltipTrigger>
                    <TooltipContent>Popular integration</TooltipContent>
                  </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <CardDescription className="text-xs">{`Coming Soon`}</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="bg-primary/5 text-xs">Coming Soon</Badge>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {integration.description}
      </CardContent>
      <CardFooter className="flex justify-between pt-2 pb-3 border-t bg-muted/20">
        <Button variant="ghost" size="sm" className="h-8 text-xs text-primary">
          Learn More <ChevronRight className="h-3 w-3 ml-1" />
        </Button>
        <Button variant="outline" size="sm" className="h-8 text-xs">
          Get Notified
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="h-full p-6 pb-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Integrations</h1>
          <p className="text-muted-foreground">
            Connect Zapllo with your favorite tools and services
          </p>
        </div>

        <Separator />

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search integrations..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Integration Categories */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6 gap-2 bg-muted/50">
            <TabsTrigger value="all">All Integrations</TabsTrigger>
            <TabsTrigger value="zapllo">Zapllo Ecosystem</TabsTrigger>
            <TabsTrigger value="productivity">Productivity</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>

          {/* All Integrations */}
          <TabsContent value="all" className="space-y-6">
            {/* Featured integration */}
            <div className="rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 border">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="bg-primary/20 rounded-full p-5">
                  <Puzzle className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2 md:flex-1">
                  <h2 className="text-xl font-medium">Zapllo Ecosystem</h2>
                  <p className="text-muted-foreground">
                    Connect with other Zapllo products for a seamless workflow experience.
                    Manage everything from one place.
                  </p>
                </div>
                <Link href="/" className="shrink-0">
                <Button className="shrink-0">
                  Explore Ecosystem <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
                </Link>
              </div>
            </div>

            {/* Categories sections */}
            {zaplloIntegrations.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-medium flex items-center">
                  <Puzzle className="mr-2 h-5 w-5 text-primary" />
                  Zapllo Ecosystem
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {zaplloIntegrations.map(integration => (
                    <IntegrationCard key={integration.id} integration={integration} />
                  ))}
                </div>
              </div>
            )}

            {productivityIntegrations.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-medium flex items-center">
                  <Box className="mr-2 h-5 w-5 text-emerald-500" />
                  Productivity Tools
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {productivityIntegrations.map(integration => (
                    <IntegrationCard key={integration.id} integration={integration} />
                  ))}
                </div>
              </div>
            )}

            {communicationIntegrations.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-medium flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-blue-500" />
                  Communication
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {communicationIntegrations.map(integration => (
                    <IntegrationCard key={integration.id} integration={integration} />
                  ))}
                </div>
              </div>
            )}

            {otherIntegrations.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-medium flex items-center">
                  <Webhook className="mr-2 h-5 w-5 text-amber-500" />
                  Other Integrations
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {otherIntegrations.map(integration => (
                    <IntegrationCard key={integration.id} integration={integration} />
                  ))}
                </div>
              </div>
            )}

            {/* Developer Section */}
            <Card className="bg-muted/30 border">
              <CardHeader>
                <CardTitle className="text-lg">For Developers</CardTitle>
                <CardDescription>Build custom solutions with our API</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h3 className="font-medium">REST API</h3>
                    <p className="text-sm text-muted-foreground">
                      Coming soon: Programmatically manage tasks, users, and more with our comprehensive API.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Webhooks</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive real-time notifications when events happen in your Zapllo workspace.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">App Directory</h3>
                    <p className="text-sm text-muted-foreground">
                      Publish your integration to our upcoming app directory and reach more users.
                    </p>
                  </div>
                </div>
              </CardContent>
              {/* <CardFooter>
                <Button variant="outline">
                  Join Developer Waitlist
                </Button>
              </CardFooter> */}
            </Card>
          </TabsContent>

          {/* Zapllo Tab */}
          <TabsContent value="zapllo" className="space-y-6">
            <div className="rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 border">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="bg-primary/20 rounded-full p-5">
                  <Puzzle className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2 md:flex-1">
                  <h2 className="text-xl font-medium">Zapllo Ecosystem</h2>
                  <p className="text-muted-foreground">
                    Connect with other Zapllo products for a seamless workflow experience.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {zaplloIntegrations.map(integration => (
                <IntegrationCard key={integration.id} integration={integration} />
              ))}
            </div>
          </TabsContent>

          {/* Productivity Tab */}
          <TabsContent value="productivity" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              {productivityIntegrations.map(integration => (
                <IntegrationCard key={integration.id} integration={integration} />
              ))}
            </div>
            {productivityIntegrations.length === 0 && (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No productivity integrations match your search.</p>
              </div>
            )}
          </TabsContent>

          {/* Communication Tab */}
          <TabsContent value="communication" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              {communicationIntegrations.map(integration => (
                <IntegrationCard key={integration.id} integration={integration} />
              ))}
            </div>
            {communicationIntegrations.length === 0 && (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No communication integrations match your search.</p>
              </div>
            )}
          </TabsContent>

          {/* Other Tab */}
          <TabsContent value="other" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              {otherIntegrations.map(integration => (
                <IntegrationCard key={integration.id} integration={integration} />
              ))}
            </div>
            {otherIntegrations.length === 0 && (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No other integrations match your search.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

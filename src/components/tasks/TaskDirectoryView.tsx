import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Eye, Copy, X, Filter, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Badge } from '@/components/ui/badge';
import { Tabs3 as Tabs, TabsContent3 as TabsContent, TabsList3 as TabsList, TabsTrigger3 as TabsTrigger } from '@/components/ui/tabs3';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

// Define necessary interfaces
interface TemplateData {
  _id?: string;
  title?: string;
  description?: string;
  priority?: string;
  repeat?: boolean;
  repeatType?: string;
  days?: string[];
  dates?: number[];
  attachments?: string[];
  links?: string[];
  reminders?: {
    notificationType: string;
    type: string;
    value?: number;
    date?: Date;
    sent?: boolean;
  }[];
}

interface DirectoryData {
  categoryName: string;
  templates: TemplateData[];
}

interface DirectoryTemplateCardProps {
  template: TemplateData;
  categoryName: string;
}

export default function TaskDirectoryView() {
  const [selectedDirCategory, setSelectedDirCategory] = useState("All");
  const [directorySearchText, setDirectorySearchText] = useState("");

  // Build an array of all category names so we can populate the dropdown
  const allCategoryNames = directoryData.map((cat) => cat.categoryName);

  // Filter logic
  const filteredData = React.useMemo(() => {
    // 1) Filter by category
    let catFiltered = directoryData;
    if (selectedDirCategory && selectedDirCategory !== "All") {
      catFiltered = catFiltered.filter(
        (c) =>
          c.categoryName.toLowerCase() ===
          selectedDirCategory.toLowerCase()
      );
    }

    // 2) For each category, filter the templates by directorySearchText
    return catFiltered.map((catItem) => {
      if (!directorySearchText.trim()) {
        return catItem; // no search => no additional filter
      }
      const lowerSearch = directorySearchText.toLowerCase();
      const filteredTemplates = catItem.templates.filter(
        (tmpl) =>
          tmpl.title?.toLowerCase().includes(lowerSearch) ||
          tmpl.description?.toLowerCase().includes(lowerSearch)
      );
      return {
        ...catItem,
        templates: filteredTemplates,
      };
    }).filter((catItem) => catItem.templates.length > 0);
  }, [selectedDirCategory, directorySearchText]);

  return (
    <div className="flex flex-col h-full space-y-6 max-w-7xl mx-auto px-4 pb-6">
      <div className="flex flex-col space-y-4 pt-6">
        <h1 className="text-3xl font-bold tracking-tight">Task Templates Directory</h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-3xl">
          Browse our library of ready-made templates, sorted by category. Copy any
          template into your organization with a single click.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search templates..."
            value={directorySearchText}
            onChange={(e) => setDirectorySearchText(e.target.value)}
            className="pl-10 w-full border-muted bg-background"
          />
          {directorySearchText && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
              onClick={() => setDirectorySearchText("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="hidden md:block h-4 w-4 text-muted-foreground" />
          <Select value={selectedDirCategory} onValueChange={setSelectedDirCategory}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {allCategoryNames.map((cn) => (
                <SelectItem key={cn} value={cn}>
                  {cn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue={allCategoryNames[0]} className="w-full">
        <TabsList className="gap-2 mb-4">
          <TabsTrigger value="All" onClick={() => setSelectedDirCategory("All")}>
            All Categories
          </TabsTrigger>
          {allCategoryNames.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              onClick={() => setSelectedDirCategory(category)}
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="w-full">
          {filteredData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredData.flatMap((categoryItem) =>
                categoryItem.templates.map((tmpl: TemplateData, idx: number) => (
                  <DirectoryTemplateCard
                    key={`${categoryItem.categoryName}-${idx}`}
                    template={tmpl}
                    categoryName={categoryItem.categoryName}
                  />
                ))
              )}
            </div>
          ) : (
            <div className="bg-muted/30 rounded-lg flex flex-col items-center justify-center py-12">
              <DotLottieReact
                src="/lottie/empty.lottie"
                loop
                className="h-40 mx-auto"
                autoplay
              />
              <h2 className="text-lg font-semibold mt-6">No Templates Found</h2>
              <p className="text-muted-foreground mt-1 text-center max-w-md">
                Try adjusting your search criteria or selecting a different category
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setDirectorySearchText("");
                  setSelectedDirCategory("All");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
}

function DirectoryTemplateCard({ template, categoryName }: DirectoryTemplateCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  async function copyTemplate() {
    try {
      // 1) Fetch all existing categories
      const catRes = await fetch("/api/category/get", { method: "GET" });
      if (!catRes.ok) {
        const errData = await catRes.json();
        throw new Error(errData.error || "Failed to fetch categories");
      }

      const catJson = await catRes.json();
      const allCategories = catJson.data || [];

      // 2) Check if user's org already has a matching category
      const foundCategory = allCategories.find(
        (c: any) => c.name.toLowerCase() === categoryName.toLowerCase()
      );
      let categoryId;

      // 3) If not found, create it
      if (!foundCategory) {
        const createCatRes = await fetch("/api/category/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: categoryName }),
        });
        if (!createCatRes.ok) {
          const createErrData = await createCatRes.json();
          throw new Error(createErrData.error || "Failed to create category");
        }
        const createCatJson = await createCatRes.json();
        categoryId = createCatJson.data._id;
      } else {
        categoryId = foundCategory._id;
      }

      // 4) Create the new template
      const bodyData = {
        title: template.title,
        description: template.description,
        priority: template.priority,
        category: categoryId,
      };

      const res = await fetch("/api/taskTemplates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Failed to copy template");
      }

      // Show success toast
      toast.success("Template copied successfully to your organization");
    } catch (err: any) {
      console.error(err);
      toast.error("Error copying template: " + err.message);
    }
  }

  function handleViewDetails() {
    setShowDetails(true);
  }

  function handleConfirmCopy() {
    setShowConfirmation(false);
    copyTemplate();
  }

  // Helper function to get priority badge styling
  const getPriorityBadgeStyles = (priority?: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400";
      case "Medium":
        return "bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400";
      default:
        return "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400";
    }
  };

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-all border-muted">
      <CardHeader className="p-5 pb-0">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {template.title}
          </CardTitle>
          <Badge variant="outline" className="shrink-0 text-xs font-normal">
            {categoryName}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {template.description}
        </p>

        <Badge variant="secondary" className={getPriorityBadgeStyles(template.priority)}>
          <Tag className="h-3 w-3 mr-1" />
          {template.priority} Priority
        </Badge>
      </CardContent>

      <CardFooter className="p-4 pt-2 flex justify-between border-t bg-muted/20">
        <Button
          variant="outline"
          size="sm"
          onClick={handleViewDetails}
          className="text-xs h-8"
        >
          <Eye className="h-3.5 w-3.5 mr-1" />
          View Details
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowConfirmation(true)}
          className="text-xs h-8"
        >
          <Copy className="h-3.5 w-3.5 mr-1" />
          Copy
        </Button>
      </CardFooter>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="p-6">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl">{template.title}</DialogTitle>
              <Badge variant="outline">{categoryName}</Badge>
            </div>
            <DialogDescription>
              Template details and configuration
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] overflow-auto pr-4">
            <div className="space-y-4 py-2">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                <p className="text-sm">{template.description}</p>
              </div>

              <Separator />

              <div className="flex gap-2 items-center">
                <h4 className="text-sm font-medium text-muted-foreground">Priority:</h4>
                <Badge variant="secondary" className={getPriorityBadgeStyles(template.priority)}>
                  {template.priority}
                </Badge>
              </div>

              {template.repeat && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Recurrence</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-muted-foreground">Type:</span>
                      <span>{template.repeatType}</span>

                      {template.days && template.days.length > 0 && (
                        <>
                          <span className="text-muted-foreground">Days:</span>
                          <span>{template.days.join(", ")}</span>
                        </>
                      )}

                      {template.dates && template.dates.length > 0 && (
                        <>
                          <span className="text-muted-foreground">Dates:</span>
                          <span>{template.dates.join(", ")}</span>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}

              {template.reminders && template.reminders.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Reminders</h4>
                    <div className="space-y-2">
                      {template.reminders.map((rem, i: number) => (
                        <div key={i} className="flex gap-2 text-sm bg-muted/50 p-2 rounded-md">
                          <span className="text-muted-foreground">{rem.notificationType}:</span>
                          <span>{rem.type} - {rem.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            <Button
              onClick={() => setShowConfirmation(true)}
              className="gap-1.5"
            >
              <Copy className="h-4 w-4" />
              Copy to My Templates
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="p-6">
          <DialogHeader>
            <DialogTitle>Copy Template?</DialogTitle>
            <DialogDescription>
              This will create a new copy of &quot;{template.title}&quot; in your organization.
              Are you sure you want to proceed?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmCopy}
            >
              Yes, copy template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}


// Sample directory data
const directoryData: DirectoryData[] = [
  {
    categoryName: "Sales",
    templates: [
      { title: "Follow-up Email Campaign", description: "Automated tasks for following up with potential leads who have shown interest in our products.", priority: "High" },
      { title: "Prospect Research", description: "Daily tasks for researching and qualifying potential leads before outreach begins.", priority: "Medium" },
      { title: "Sales Pipeline Review", description: "Weekly review of the entire sales pipeline to identify bottlenecks and opportunities.", priority: "High" },
      { title: "Lead Qualification", description: "Process for qualifying new leads and determining their sales readiness.", priority: "Low" },
      { title: "Account Renewal Tracking", description: "Monitor upcoming account renewals to ensure timely follow-up with customers.", priority: "Medium" },
    ],
  },
  {
    categoryName: "Marketing",
    templates: [
      { title: "Social Media Calendar", description: "Plan weekly social media posts across all platforms to maintain consistent presence.", priority: "Medium" },
      { title: "SEO Keyword Research", description: "Monthly analysis of keywords to target in content creation and website optimization.", priority: "High" },
      { title: "Content Strategy", description: "Brainstorm and plan content topics for blog posts, videos, and downloadable resources.", priority: "Medium" },
      { title: "Email Newsletter", description: "Draft and schedule regular newsletters to keep subscribers engaged with company updates.", priority: "Low" },
      { title: "Webinar Promotion", description: "Comprehensive promotion plan for upcoming webinars to maximize attendance.", priority: "Medium" },
    ],
  },
  {
    categoryName: "HR",
    templates: [
      { title: "New Hire Onboarding", description: "Complete orientation process for new employees joining the company.", priority: "High" },
      { title: "Vacation Requests", description: "Track and manage annual leave requests from team members.", priority: "Low" },
      { title: "Payroll Processing", description: "Monthly payroll tasks including approvals, adjustments, and reporting.", priority: "High" },
      { title: "Performance Reviews", description: "Quarterly performance review templates and scheduling.", priority: "Medium" },
      { title: "Job Posting & Recruitment", description: "Process for creating and distributing job postings across platforms.", priority: "Medium" },
    ],
  },
  {
    categoryName: "Finance",
    templates: [
      { title: "Budget Planning", description: "Annual budget preparation process including departmental input gathering.", priority: "High" },
      { title: "Invoice Processing", description: "Monthly invoice handling workflow from receipt to payment approval.", priority: "Low" },
      { title: "Expense Reimbursements", description: "Process for tracking and approving employee expense reimbursements.", priority: "Medium" },
      { title: "Financial Reporting", description: "Quarterly financial statement preparation and analysis.", priority: "High" },
      { title: "Tax Preparation", description: "Gather documentation and prepare information needed for tax filings.", priority: "High" },
    ],
  },
  {
    categoryName: "IT",
    templates: [
      { title: "Server Maintenance", description: "Weekly schedule for server updates, backups, and performance checks.", priority: "High" },
      { title: "Backup Verification", description: "Daily verification of system backups to ensure data integrity.", priority: "Low" },
      { title: "Network Security Scan", description: "Monthly comprehensive scan of network vulnerabilities.", priority: "High" },
      { title: "Software Updates", description: "Process for testing and deploying software updates across the organization.", priority: "Medium" },
      { title: "Help Desk Triage", description: "Workflow for prioritizing and assigning incoming support tickets.", priority: "Low" },
    ],
  }
];

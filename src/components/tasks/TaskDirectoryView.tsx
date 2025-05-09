import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Eye, Copy, X } from 'lucide-react';
import { toast } from 'sonner';
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

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

export default function TaskDirectoryView() {
  const [selectedDirCategory, setSelectedDirCategory] = useState("");
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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Task Templates Directory</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search directory..."
              value={directorySearchText}
              onChange={(e) => setDirectorySearchText(e.target.value)}
              className="pl-10"
            />
            {directorySearchText && (
              <X
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer"
                onClick={() => setDirectorySearchText("")}
              />
            )}
          </div>

          {/* Category Dropdown */}
          <Select value={selectedDirCategory} onValueChange={setSelectedDirCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
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

      <p className="text-muted-foreground mt-2 text-sm max-w-prose">
        Browse our library of ready-made templates, sorted by category. Copy any
        template into your organization with a single click.
      </p>

      {/* Render filtered data */}
      <div className="space-y-8">
        {filteredData.length > 0 ? (
          filteredData.map((categoryItem) => (
            <div key={categoryItem.categoryName} className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">
                {categoryItem.categoryName}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryItem.templates.map((tmpl, idx) => (
                  <DirectoryTemplateCard
                    key={idx}
                    template={tmpl}
                    categoryName={categoryItem.categoryName}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <DotLottieReact
              src="/lottie/empty.lottie"
              loop
              className="h-40 mx-auto"
              autoplay
            />
            <h2 className="text-lg font-semibold mt-4">No Templates Found</h2>
            <p className="text-muted-foreground mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface DirectoryTemplateCardProps {
  template: TemplateData;
  categoryName: string;
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
    // Close the confirmation dialog immediately
    setShowConfirmation(false);
    // Then proceed with actual copying
    copyTemplate();
  }

  return (
    <Card className="p-4 border hover:border-primary transition-colors">
      <div className="mb-1">
        <h3 className="text-lg font-semibold truncate">{template.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 h-">
          {template.description}
        </p>
      </div>

      <div className="flex mt-4 flex-wrap gap-2 mb-3">
        <span className={`text-xs px-2 py-1 rounded-full ${
          template.priority === "High"
            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            : template.priority === "Medium"
              ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
              : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
        }`}>
          {template.priority}
        </span>
      </div>

      <div className="flex justify-end gap-2 mt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleViewDetails}
          className="hover:text-primary hover:bg-primary/10"
        >
          <Eye className="h-4 w-4" />
          <span className="sr-only">View Details</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowConfirmation(true)}
          className="hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20"
        >
          <Copy className="h-4 w-4" />
          <span className="sr-only">Copy</span>
        </Button>
      </div>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="p-6">
          <div className="flex items-center justify-between">
            <DialogTitle>{template.title}</DialogTitle>
            <DialogClose>
              <X className="h-4 w-4 cursor-pointer" />
            </DialogClose>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <span className="font-medium">Description:</span>
              <p className="text-sm mt-1">{template.description}</p>
            </div>

            <div>
              <span className="font-medium">Priority:</span>
              <p className="text-sm mt-1">{template.priority}</p>
            </div>

            {template.repeat && (
              <div>
                <span className="font-medium">Repeat Type:</span>
                <p className="text-sm mt-1">{template.repeatType}</p>

                {template.days && template.days.length > 0 && (
                  <div className="mt-2">
                    <span className="font-medium">Days:</span>
                    <p className="text-sm mt-1">{template.days.join(", ")}</p>
                  </div>
                )}

                {template.dates && template.dates.length > 0 && (
                  <div className="mt-2">
                    <span className="font-medium">Dates:</span>
                    <p className="text-sm mt-1">{template.dates.join(", ")}</p>
                  </div>
                )}
              </div>
            )}

            {template.reminders && template.reminders.length > 0 && (
              <div>
                <span className="font-medium">Reminders:</span>
                <ul className="list-disc list-inside text-sm mt-1">
                  {template.reminders.map((rem, i) => (
                    <li key={i}>
                      {rem.notificationType} - {rem.type} - {rem.value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-4">
            <Button
              onClick={() => setShowConfirmation(true)}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              <span>Copy to My Templates</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="p-6">
          <DialogHeader>
            <DialogTitle>Copy Template?</DialogTitle>
            <DialogDescription>
              This will create a new copy of the template in your organization.
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
              Yes, copy
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

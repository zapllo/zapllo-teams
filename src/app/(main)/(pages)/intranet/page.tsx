"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { LinkIcon, ExternalLink, Globe } from "lucide-react";

// Components
import IntranetTable from "@/components/tables/intranetTable";
import Loader from "@/components/ui/loader";

// UI Components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs3 as Tabs, TabsContent3 as TabsContent, TabsList3 as TabsList, TabsTrigger3 as TabsTrigger } from "@/components/ui/tabs3";
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
  _id: string;
  name: string;
}

interface IntranetEntry {
  _id: string;
  linkUrl: string;
  description: string;
  linkName: string;
  category: {
    _id: string;
    name: string;
  };
}

const IntranetPage: React.FC = () => {
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    linkUrl: "",
    description: "",
    linkName: "",
    category: "",
  });

  // Data state
  const [categories, setCategories] = useState<Category[]>([]);
  const [entries, setEntries] = useState<IntranetEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  // Tab state
  const [activeTab, setActiveTab] = useState("all");
  // Stats
  const [stats, setStats] = useState({
    totalLinks: 0,
    categoryCounts: {} as Record<string, number>,
  });

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchEntries(), fetchCategories()]);
      } catch (error) {
        console.error("Error loading initial data:", error);
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Update stats when entries or categories change
  useEffect(() => {
    if (entries.length > 0 && categories.length > 0) {
      const categoryCounts: Record<string, number> = {};

      // Initialize counts for all categories
      categories.forEach(cat => {
        categoryCounts[cat._id] = 0;
      });

      // Count entries per category
      entries.forEach(entry => {
        if (entry.category && entry.category._id) {
          categoryCounts[entry.category._id] = (categoryCounts[entry.category._id] || 0) + 1;
        }
      });

      setStats({
        totalLinks: entries.length,
        categoryCounts,
      });
    }
  }, [entries, categories]);

  async function fetchEntries() {
    try {
      const response = await axios.get("/api/intranet");
      setEntries(response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch intranet entries:", error);
      toast.error("Failed to load links");
      throw error;
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/category/get");
      const result = await response.json();
      if (response.ok) {
        setCategories(result.data);
        return result.data;
      } else {
        console.error("Error fetching categories:", result.error);
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
      throw error;
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.linkUrl || !formData.linkName || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/intranet", formData);

      // Reset form and close dialog
      setFormData({ linkUrl: "", description: "", linkName: "", category: "" });
      setIsDialogOpen(false);
      toast.success("Link added successfully");

      // Refresh data
      await fetchEntries();
    } catch (error) {
      console.error("Failed to create intranet entry:", error);
      toast.error("Failed to add link");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewClick = () => {
    setIsDialogOpen(true);
  };
  // Function to handle category card clicks
  const handleCategoryCardClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setActiveTab("all");
  };

if (isLoading) {
  return (
    <div className="container py-8 mt-12 space-y-6">
      {/* Page header skeleton */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-9 w-56" />
        </div>
        <Skeleton className="h-5 w-full max-w-md" />
      </div>

      {/* Tabs and action button skeleton */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex rounded-lg p-1 h-10 bg-muted">
          <Skeleton className="h-8 w-24 mx-1 rounded-md" />
          <Skeleton className="h-8 w-24 mx-1 rounded-md" />
        </div>
        <Skeleton className="h-10 w-36 rounded-md" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-md border overflow-hidden">
        {/* Table header */}
        <div className="bg-muted/50 p-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 w-full max-w-lg">
              <Skeleton className="h-10 w-40 rounded-md" />
              <Skeleton className="h-10 flex-1 rounded-md" />
            </div>
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </div>

        {/* Table header row */}
        <div className="grid grid-cols-[1fr_2fr_1fr_auto] gap-2 px-4 py-3 border-b bg-muted/30">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-16" />
        </div>

        {/* Table rows */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="grid grid-cols-[1fr_2fr_1fr_auto] gap-2 px-4 py-3 border-b items-center">
            <div>
              <Skeleton className="h-5 w-40 mb-1" />
              <Skeleton className="h-4 w-24" />
            </div>

            <div>
              <Skeleton className="h-5 w-full max-w-lg mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            <Skeleton className="h-6 w-24 rounded-full" />

            <div className="flex justify-end space-x-2">
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
          </div>
        ))}

        {/* Table pagination */}
        <div className="p-4 flex items-center justify-between border-t">
          <Skeleton className="h-5 w-32" />
          <div className="flex gap-1">
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </div>
      </div>

      {/* Stats tab content (hidden) */}
      <div className="hidden mt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="space-y-2">
                <Skeleton className="h-8 w-16" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-20 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
  return (
    <div className="container py-8 mt-12 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Globe className="h-8 w-8 text-primary" />
          Link Manager
        </h1>
        <p className="text-muted-foreground">
          Organize and manage all your important links in one place
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Links</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>
          <Button onClick={handleAddNewClick}>
            <LinkIcon className="h-4 w-4 mr-2" /> Add New Link
          </Button>
        </div>

        <TabsContent value="all" className="mt-0">
          <IntranetTable
            entries={entries}
            fetchEntries={fetchEntries}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categories={categories}
            onCategoryChange={setSelectedCategory}
            onAddNewClick={handleAddNewClick}
          />
        </TabsContent>


        <TabsContent value="stats" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card
              className="cursor-pointer transition-all hover:shadow-md hover:border-primary/30"
              onClick={() => {
                setSelectedCategory("all");
                setActiveTab("all");
              }}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold">
                  {stats.totalLinks}
                </CardTitle>
                <CardDescription className="flex items-center justify-between">
                  Total Links
                  <Button variant="ghost" size="sm" className="h-6 text-xs">View All</Button>
                </CardDescription>
              </CardHeader>
            </Card>

            {categories.map(category => (
              <Card
                key={category._id}
                className="cursor-pointer transition-all hover:shadow-md hover:border-primary/30"
                onClick={() => handleCategoryCardClick(category._id)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl font-bold">
                    {stats.categoryCounts[category._id] || 0}
                  </CardTitle>
                  <CardDescription className="flex items-center justify-between">
                    {category.name}
                    <Button variant="ghost" size="sm" className="h-6 text-xs">View Links</Button>
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add New Link Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px] p-6 ">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              Add New Link
            </DialogTitle>
            <DialogDescription>
              Enter the details of the link you want to save.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="linkName">Link Name <span className="text-red-500">*</span></Label>
              <Input
                id="linkName"
                value={formData.linkName}
                onChange={handleFormChange}
                className="text-muted-foreground"
                placeholder="Enter a name for this link"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkUrl">URL <span className="text-red-500">*</span></Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="linkUrl"
                  type="url"
                  value={formData.linkUrl}
                  className="text-muted-foreground"
                  onChange={handleFormChange}
                  placeholder="https://example.com"
                  required
                />
                {formData.linkUrl && (
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => window.open(formData.linkUrl, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={handleFormChange}

                placeholder="Enter a description (optional)"
                className="min-h-[80px] text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="z-[100]">
                  {categories.map((cat) => (
                    <SelectItem className="hover:bg-accent" key={cat._id} value={cat._id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader /> : "Save Link"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IntranetPage;

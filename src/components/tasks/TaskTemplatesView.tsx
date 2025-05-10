import React, { useEffect, useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Tag,
  CheckCircle,
  Pencil,
  Trash2,
  X,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TaskModal from '@/components/globals/taskModal';
import { toast } from 'sonner';
import TaskTemplateDialog from '@/components/forms/taskTemplateForm';
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogHeader, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Skeleton } from '../ui/skeleton';

interface Template {
  _id: string;
  title?: string;
  description?: string;
  category?: { _id: string; name: string };
  priority?: string;
  repeat?: boolean;
  repeatType?: string;
  days?: string[];
}

interface Category {
  _id: string;
  name: string;
}

export default function TaskTemplatesView() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchText, setSearchText] = useState("");
  const [openTemplateDialog, setOpenTemplateDialog] = useState(false);
  const [templateToEdit, setTemplateToEdit] = useState<Template | null>(null);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch categories from the server
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/category/get", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const result = await response.json();

        if (response.ok) {
          setCategories(result.data);
        } else {
          console.error("Error fetching categories:", result.error);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);




  // Fetch templates
  async function fetchTemplates() {
    try {
      setLoading(true);
      const res = await fetch("/api/taskTemplates", { method: "GET" });
      const data = await res.json();
      if (res.ok) {
        setTemplates(data.data);
      } else {
        console.error("Error fetching templates:", data.error);
        toast.error("Failed to load templates");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while loading templates");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTemplates();
  }, []);

  // Filter templates by category & search
  const filteredTemplates = useMemo(() => {
    let temp = [...templates];

    // If a category is selected, filter by category._id
    if (selectedCategory) {
      temp = temp.filter(
        (t) => t.category?._id === selectedCategory._id
      );
    }

    // If searchText is non-empty, filter by title or description
    if (searchText.trim()) {
      const lowerSearch = searchText.toLowerCase();
      temp = temp.filter(
        (t) =>
          t.title?.toLowerCase().includes(lowerSearch) ||
          t.description?.toLowerCase().includes(lowerSearch)
      );
    }

    return temp;
  }, [templates, selectedCategory, searchText]);

  // Handler for "Use Template" button
  function handleUseTemplate(template: Template) {
    setSelectedTemplate(template);
    setOpenTaskModal(true);
  }

  // Handler for "Edit Template" button
  function handleEditTemplate(template: Template) {
    setTemplateToEdit(template);
    setOpenTemplateDialog(true);
  }

   // Template Card Skeleton for loading state
  const TemplateCardSkeleton = () => (
    <Card className="p-4 border">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-2/3 mb-4" />

      <div className="flex flex-wrap gap-2 mb-3">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>

      <div className="flex justify-end gap-2 mt-2">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </Card>
  );

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Task Templates</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search templates..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            value={selectedCategory ? selectedCategory._id : "all"}
            onValueChange={(value) => {
              if (value === "all") {
                setSelectedCategory(null);
              } else {
                const category = categories.find(c => c._id === value);
                setSelectedCategory(category || null);
              }
            }}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat._id} value={cat._id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={() => {
              setTemplateToEdit(null);
              setOpenTemplateDialog(true);
            }}
            className="bg-primary hover:bg-primary/90 flex gap-1 items-center text-white"
          >
            <Plus className="h-4 w-4" />
            <span>Create Template</span>
          </Button>
        </div>
      </div>

      {loading ? (
        // Replaced the loading animation with a grid of skeleton cards
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, index) => (
            <TemplateCardSkeleton key={index} />
          ))}
        </div>
      ) : filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template._id}
              template={template}
              onUseTemplate={handleUseTemplate}
              onEdit={handleEditTemplate}
              onSuccess={fetchTemplates}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <DotLottieReact
            src="/lottie/empty.lottie"
            loop
            autoplay
            className="h-40 mx-auto"
          />
          <h2 className="text-lg font-semibold mt-4">No Templates Found</h2>
          <p className="text-muted-foreground mt-1">
            {searchText || selectedCategory
              ? "Try adjusting your search or filters"
              : "Create your first task template to get started"}
          </p>
          <Button
            onClick={() => {
              setTemplateToEdit(null);
              setOpenTemplateDialog(true);
            }}
            className="mt-4"
          >
            <Plus className="h-4 w-4 mr-2" /> Create Template
          </Button>
        </div>
      )}

      {/* Template Creation/Edit Dialog */}
      <TaskTemplateDialog
        open={openTemplateDialog}
        setOpen={setOpenTemplateDialog}
        existingTemplate={templateToEdit}
        onSuccess={fetchTemplates}
      />

      {/* Create Task from Template Modal */}
      {openTaskModal && selectedTemplate && (
        <TaskModal
          closeModal={() => setOpenTaskModal(false)}
          prefillData={selectedTemplate}
        />
      )}
    </div>
  );
}

interface TemplateCardProps {
  template: Template;
  onUseTemplate?: (template: Template) => void;
  onEdit?: (template: Template) => void;
  onSuccess: () => void;
}

function TemplateCard({ template, onUseTemplate, onEdit, onSuccess }: TemplateCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  async function handleDeleteTemplate() {
    try {
      const res = await fetch(`/api/taskTemplates/${template._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete template");
      }

      toast.success("Template deleted successfully!");
      setDeleteDialogOpen(false);
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting template");
    }
  }

  return (
    <Card className="p-4 border hover:border-primary transition-colors">
      <div className="mb-1">
        <h2 className="text-lg font-semibold truncate">{template.title}</h2>
        <p className="text-sm text-muted-foreground line-clamp-2 h-">
          {template.description}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mt-2 mb-3">
        {template.category && (
          <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
            {template.category.name}
          </span>
        )}

        {template.priority && (
          <span className={`text-xs px-2 py-1 rounded-full ${template.priority === "High"
              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              : template.priority === "Medium"
                ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            }`}>
            {template.priority}
          </span>
        )}

        {template.repeat && (
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
            {template.repeatType || "Repeating"}
          </span>
        )}
      </div>

      <div className="flex justify-end gap-2 mt-2">
        {onUseTemplate && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUseTemplate(template)}
            className="hover:text-primary hover:bg-primary/10"
          >
            <CheckCircle className="h-4 w-4" />
            <span className="sr-only">Use Template</span>
          </Button>
        )}

        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(template)}
            className="hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20"
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDeleteDialogOpen(true)}
          className="hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{template.title}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTemplate}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

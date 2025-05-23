import React, { useEffect, useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Tag,
  CheckCircle,
  Pencil,
  Trash2,
  X,
  ArrowRight,
  FolderOpen,
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
import { Badge } from '@/components/ui/badge';
import { motion } from "framer-motion";

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
  const [isViewingCategory, setIsViewingCategory] = useState(false);

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

  // Group templates by category
  const templatesByCategory = useMemo(() => {
    const grouped: Record<string, Template[]> = {};

    // Initialize with empty arrays for all categories
    categories.forEach(cat => {
      grouped[cat._id] = [];
    });

    // Add a special category for templates without a category
    grouped['uncategorized'] = [];

    // Sort templates into categories
    templates.forEach(template => {
      if (template.category && template.category._id) {
        if (!grouped[template.category._id]) {
          grouped[template.category._id] = [];
        }
        grouped[template.category._id].push(template);
      } else {
        grouped['uncategorized'].push(template);
      }
    });

    return grouped;
  }, [templates, categories]);

  // Filter templates by search
  const filteredTemplates = useMemo(() => {
    if (!selectedCategory) return [];

    const categoryTemplates = selectedCategory._id
      ? templatesByCategory[selectedCategory._id] || []
      : templatesByCategory['uncategorized'] || [];

    if (!searchText.trim()) {
      return categoryTemplates;
    }

    const lowerSearch = searchText.toLowerCase();
    return categoryTemplates.filter(
      (t) =>
        t.title?.toLowerCase().includes(lowerSearch) ||
        t.description?.toLowerCase().includes(lowerSearch)
    );
  }, [templatesByCategory, selectedCategory, searchText]);

  // Generate category card data with template counts - only for categories with templates
  const categoryCards = useMemo(() => {
    // Filter to only include categories that have at least one template
    return categories
      .filter(cat => (templatesByCategory[cat._id]?.length || 0) > 0)
      .map(cat => ({
        ...cat,
        templateCount: templatesByCategory[cat._id]?.length || 0,
        color: getRandomColorClass()
      }));
  }, [categories, templatesByCategory]);

  // Function to get a random color class for category cards
  function getRandomColorClass() {
    const colors = [
      'bg-blue-700',
      'bg-purple-700',
      'bg-green-700',
      'bg-yellow-700',
      'bg-red-700',
      'bg-indigo-700',
      'bg-pink-700',
      'bg-teal-700',
      'bg-orange-700',
      'bg-cyan-700'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Handler for selecting a category
  function handleCategorySelect(category: Category) {
    setSelectedCategory(category);
    setIsViewingCategory(true);
    setSearchText("");
  }

  // Handler for going back to category view
  function handleBackToCategories() {
    setIsViewingCategory(false);
    setSelectedCategory(null);
  }

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
    <Card className="p-4 border h-full flex flex-col">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-2/3 mb-4" />

      <div className="flex flex-wrap gap-2 mb-3">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>

      <div className="flex justify-end gap-2 mt-auto pt-2">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </Card>
  );

  // Category Card Skeleton
  const CategoryCardSkeleton = () => (
    <Card className="overflow-hidden h-full flex flex-col border-muted">
      <div className="relative h-40 overflow-hidden">
        <Skeleton className="absolute inset-0" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="p-4 flex-grow">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4 mt-2" />
      </div>
      <div className="p-4 border-t bg-muted/20 flex justify-between items-center">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
    </Card>
  );

  // Check if there are any templates at all
  const hasAnyTemplates = useMemo(() => {
    return templates.length > 0;
  }, [templates]);

  // Count total categories with templates
  const categoriesWithTemplatesCount = useMemo(() => {
    return categoryCards.length + (templatesByCategory['uncategorized']?.length > 0 ? 1 : 0);
  }, [categoryCards, templatesByCategory]);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Header Section */}
      <div className="p-4 sm:p-6 border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-2xl font-bold text-primary/90">
              {isViewingCategory
                ? selectedCategory?.name
                : "Task Templates"
              }
            </h1>

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

          {!isViewingCategory && (
            <p className="text-muted-foreground text-sm md:text-base max-w-3xl">
              Browse your task templates organized by category or create new ones to streamline your workflow.
            </p>
          )}

          {isViewingCategory && (
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handleBackToCategories}
                className="flex items-center gap-2 pl-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                <span>Back to Categories</span>
              </Button>

              <div className="relative w-full max-w-sm ml-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search templates..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="pl-10 w-full"
                />
                {searchText && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                    onClick={() => setSearchText("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content Section - Scrollable */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 sm:p-6">
        {loading ? (
          // Loading skeleton based on view
          isViewingCategory ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(6).fill(0).map((_, index) => (
                <TemplateCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, index) => (
                <CategoryCardSkeleton key={index} />
              ))}
            </div>
          )
        ) : isViewingCategory ? (
          // Template view for selected category
          filteredTemplates.length > 0 ? (
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
            <div className="bg-muted/30 rounded-lg flex flex-col items-center justify-center py-12">
              <DotLottieReact
                src="/lottie/empty.lottie"
                loop
                className="h-40 mx-auto"
                autoplay
              />
              <h2 className="text-lg font-semibold mt-6">No Templates Found</h2>
              <p className="text-muted-foreground mt-1 text-center max-w-md">
                {searchText
                  ? "Try adjusting your search criteria"
                  : `No templates in the "${selectedCategory?.name}" category yet`
                }
              </p>
              <div className="flex gap-3 mt-4">
                {searchText && (
                  <Button
                    variant="outline"
                    onClick={() => setSearchText("")}
                  >
                    Clear search
                  </Button>
                )}
                <Button
                  onClick={() => {
                    setTemplateToEdit(null);
                    setOpenTemplateDialog(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" /> Create Template
                </Button>
              </div>
            </div>
          )
        ) : (
          // Category grid view - only show categories with templates
          categoriesWithTemplatesCount > 0 ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryCards.map((category) => (
                  <CategoryCard
                    key={category._id}
                    category={category}
                    onClick={() => handleCategorySelect(category)}
                  />
                ))}

                {/* Uncategorized Templates Card - only show if there are uncategorized templates */}
                {templatesByCategory['uncategorized']?.length > 0 && (
                  <CategoryCard
                    category={{
                      _id: 'uncategorized',
                      name: 'Uncategorized',
                      templateCount: templatesByCategory['uncategorized'].length,
                      color: 'bg-gray-700'
                    }}
                    onClick={() => handleCategorySelect({ _id: 'uncategorized', name: 'Uncategorized' })}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 flex flex-col items-center justify-center h-full">
              <DotLottieReact
                src="/lottie/empty.lottie"
                loop
                autoplay
                className="h-40 mx-auto"
              />
              <h2 className="text-lg font-semibold mt-4">No Templates Found</h2>
              <p className="text-muted-foreground mt-1 max-w-md">
                Create your first task template to get started
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
          )
        )}
      </div>

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

interface CategoryCardProps {
  category: {
    _id: string;
    name: string;
    templateCount: number;
    color: string;
  };
  onClick: () => void;
}

function CategoryCard({ category, onClick }: CategoryCardProps) {
  // Placeholder image path based on category name
  const imagePath = `/images/templates/${category.name.toLowerCase().replace(/\s+/g, '')}.jpg`;
  const fallbackImage = "/images/templates/default.jpg";

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card
        className="overflow-hidden cursor-pointer h-full flex flex-col hover:shadow-lg transition-all border-muted"
        onClick={onClick}
      >
        <div className="relative h-40 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${imagePath})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            onError={(e: React.SyntheticEvent<HTMLDivElement, Event>) => {
              const target = e.target as HTMLDivElement;
              target.style.backgroundImage = `url(${fallbackImage})`;
            }}
          />
          <div className={`absolute inset-0 opacity-60 ${category.color}`} />

          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              <h3 className="font-bold text-lg">{category.name}</h3>
            </div>
            <div className="text-sm mt-1 opacity-90">
              {category.templateCount} {category.templateCount === 1 ? 'template' : 'templates'}
            </div>
          </div>
        </div>

        <div className="flex-grow p-4">
          <p className="text-sm text-muted-foreground">
            Browse and manage templates in the {category.name} category
          </p>
        </div>

        <div className="p-4 border-t bg-muted/20 flex justify-between items-center">
          <span className="text-sm text-muted-foreground">View templates</span>
          <ArrowRight className="h-4 w-4" />
        </div>
      </Card>
    </motion.div>
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="flex flex-col h-full hover:shadow-md transition-all border-muted">
        <div className="p-5 pb-0">
          <div className="flex justify-between items-start gap-2">
            <h2 className="text-lg font-semibold line-clamp-2">
              {template.title}
            </h2>
          </div>
        </div>

        <div className="p-5 flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
            {template.description}
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            {template.priority && (
              <Badge variant="secondary" className={`text-xs ${template.priority === "High"
                  ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                  : template.priority === "Medium"
                    ? "bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400"
                    : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                }`}>
                <Tag className="h-3 w-3 mr-1" />
                {template.priority} Priority
              </Badge>
            )}

            {template.repeat && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 text-xs">
                {template.repeatType || "Repeating"}
              </Badge>
            )}
          </div>
        </div>

        <div className="p-4 pt-2 flex justify-between border-t bg-muted/20">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUseTemplate && onUseTemplate(template)}
            className="text-xs h-8 hover:text-primary hover:bg-primary/10"
          >
            <CheckCircle className="h-3.5 w-3.5 mr-1" />
            Use Template
          </Button>

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit && onEdit(template)}
              className="h-8 w-8 p-0 rounded-full hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20"
              title="Edit Template"
            >
              <Pencil className="h-3.5 w-3.5" />
              <span className="sr-only">Edit</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
              className="h-8 w-8 p-0 rounded-full hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
              title="Delete Template"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md p-6">
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
    </motion.div>
  );
}

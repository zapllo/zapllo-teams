"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import DeleteConfirmationDialog from "@/components/modals/deleteConfirmationDialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  Check,
  Edit,
  Edit3,
  Filter,
  Folder,
  FolderPlus,
  HelpCircle,
  InfoIcon,
  Lightbulb,
  Plus,
  Search,
  Sparkles,
  Tag,
  Trash,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface Category {
  _id: string;
  name: string;
  organization: string;
}

const Categories: React.FC = () => {
  const [newCategory, setNewCategory] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState<string>("");
  const [role, setRole] = useState("role");
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteEntryId, setDeleteEntryId] = useState<string | null>(null);
  const [industry, setIndustry] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/category/get");
      if (response.status === 200) {
        setCategories(response.data.data);
        setPageLoading(false);
      } else {
        console.error("Error fetching categories:", response.data.error);
        setPageLoading(false);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async () => {
    if (!newCategory) {
      toast.error("Please enter a category name");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/category/create", {
        name: newCategory,
      });

      if (response.status === 200) {
        setCategories([...categories, response.data.data]);
        fetchCategories();
        setNewCategory("");
        toast.success("Category created successfully", {
          description: `"${newCategory}" has been added to your categories`
        });
        setLoading(false);
      } else {
        console.error("Error creating category:", response.data.error);
        toast.error("Failed to create category");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
      setLoading(false);
    }
  };

  const handleEditCategory = async (categoryId: string) => {
    if (!editCategoryName) {
      toast.error("Category name cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.patch("/api/category/edit", {
        categoryId,
        name: editCategoryName,
      });

      if (response.status === 200) {
        setCategories(
          categories.map((cat) =>
            cat._id === categoryId ? response.data.data : cat
          )
        );
        setEditingCategoryId(null);
        toast.success("Category updated successfully");
        setEditCategoryName("");
        setLoading(false);
      } else {
        console.error("Error updating category:", response.data.error);
        toast.error("Failed to update category");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
      setLoading(false);
    }
  };

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const res = await axios.get("/api/users/me");
        const user = res.data.data;
        setRole(user.role);

        const response = await axios.get("/api/organization/getById");
        const organization = response.data.data;
        setIndustry(organization.industry);

        const trialStatusRes = await axios.get("/api/organization/trial-status");
        setIsTrialExpired(trialStatusRes.data.isExpired);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    getUserDetails();
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSuggestedCategories = async () => {
    setLoadingAI(true);

    try {
      const response = await axios.post("/api/category/suggest", { industry });
      if (response.status === 200) {
        const { categories } = response.data;
        setSuggestedCategories(categories);
        toast.success("AI suggestions generated successfully");
        setIsDialogOpen(true);
      } else {
        toast.error("Failed to generate suggested categories");
      }
    } catch (error) {
      console.error("Error suggesting categories:", error);
      toast.error("Error generating suggested categories");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteEntryId) return;

    setLoading(true);
    try {
      const response = await axios.delete("/api/category/delete", {
        data: { categoryId: deleteEntryId },
      });

      if (response.status === 200) {
        setCategories(categories.filter((cat) => cat._id !== deleteEntryId));
        setIsDeleteDialogOpen(false);
        setDeleteEntryId(null);
        toast.success("Category deleted successfully");
        setLoading(false);
      } else {
        console.error("Error deleting category:", response.data.error);
        toast.error("Failed to delete category");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteEntryId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleClose = () => {
    setSuggestedCategories([]);
    setIsDialogOpen(false);
  };

  const handleCreateCategoriesFromSelection = async () => {
    if (selectedCategories.length === 0) {
      toast.error("Please select at least one category");
      return;
    }

    try {
      setLoading(true);
      const promises = selectedCategories.map((category) =>
        axios.post("/api/category/create", {
          name: typeof category === 'string' ? category : category.name
        })
      );
      await Promise.all(promises);

      fetchCategories();
      setSelectedCategories([]);
      setIsDialogOpen(false);
      toast.success(`${selectedCategories.length} categories added successfully`);
    } catch (error) {
      console.error("Error adding categories:", error);
      toast.error("Failed to add categories");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="container flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <Loader />
          <p className="mt-4 text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container h-screen overflow-y-scroll p-6 mx-auto max-w- scrollbar-hide space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground">
          Organize your tasks with custom categories
        </p>
      </div>

      {/* AI-Powered Categories Section - Featured as Hero */}
      {role === "orgAdmin" && (
        <Card className="shadow-md overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#815BF5]/5 to-transparent pointer-events-none"></div>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <img src="/branding/AII.png" className="h-10 dark:block hidden" alt="AI Logo" />
                <img src="/branding/zapllo ai.png" className="h-5 dark:block hidden" alt="Zapllo AI" />
                <img src="/branding/ai-light.png" className="h-9 dark:hidden block" alt="Zapllo AI Light" />
              </div>
              <Badge className="bg-[#815BF5] hover:bg-[#815BF5]/90 text-xs text-white">POWERED BY AI</Badge>
            </div>
            <CardTitle className="text-xl mt-2">Smart Category Suggestions</CardTitle>
            <CardDescription className="text-sm max-w-3xl">
              Our intelligent AI engine analyzes your industry and curates categories tailored to your business needs.
              Save time and optimize your workflow with industry-specific category recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-[#0B0D29]/60 p-4 rounded-lg border">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-start space-x-3">
                      <Sparkles className="h-5 w-5 text-[#815BF5] flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-medium text-sm">Why use AI suggestions?</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Get industry-specific categories instantly, ensuring your task management system is optimized from the start.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <InfoIcon className="h-5 w-5 text-[#815BF5] flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-medium text-sm">How it works</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Based on your industry ({industry || "your business"}), our AI generates relevant category suggestions that you can select and add with one click.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={handleAddSuggestedCategories}
                      disabled={loadingAI}
                      className="w-full relative group overflow-hidden bg-gradient-to-r from-[#815BF5] to-[#5e38d0] hover:from-[#7651e0] hover:to-[#5432be] shadow-md border-0"
                    >
                      <div className="absolute inset-0 bg-[url('/subtle-pattern.png')] opacity-10"></div>
                      {loadingAI ? (
                        <Loader />
                      ) : (
                        <Sparkles className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform text-white" />
                      )}
                      <span className="z-10 font-medium">Generate AI-Powered Categories</span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                    </Button>
                  </DialogTrigger>

                  {/* AI Suggestion Dialog Content */}
                  <DialogContent className="m-auto p-6">
                    <DialogHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src="/branding/AII.png" className="h-8 dark:block hidden" alt="AI Logo" />
                          <img src="/branding/ai-light.png" className="h-8 dark:hidden block" alt="Zapllo AI Light" />
                        </div>
                        <DialogClose>
                          <X className="h-4 w-4" />
                        </DialogClose>
                      </div>
                      <DialogTitle className="text-xl mt-4">AI-Suggested Categories</DialogTitle>
                      <DialogDescription className="text-sm">
                        Based on your industry data, we&apos;ve generated relevant categories that might benefit your organization.
                        Select the ones you&apos;d like to add to your workflow.
                      </DialogDescription>
                    </DialogHeader>

                    {loadingAI ? (
                      <div className="flex flex-col items-center justify-center py-10">
                        <DotLottieReact
                          src="/lottie/ai-loader.lottie"
                          loop
                          autoplay
                          className="h-28 w-28"
                        />
                        <p className="mt-4 text-center text-muted-foreground">
                          Generating optimized categories for your industry...
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-center my-4">
                          <span className="text-sm text-muted-foreground">
                            {selectedCategories.length} of {suggestedCategories.length} selected
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto scrollbar-hide p-1">
                          {suggestedCategories.map((category, index) => {
                            const categoryObj = typeof category === 'string'
                              ? { _id: index.toString(), name: category, organization: '' }
                              : category;
                            const isSelected = selectedCategories.some(c => c.name === categoryObj.name);

                            return (
                              <div
                                key={index}
                                onClick={() => {
                                  if (isSelected) {
                                    setSelectedCategories(
                                      selectedCategories.filter(c => c.name !== categoryObj.name)
                                    );
                                  } else {
                                    setSelectedCategories([...selectedCategories, categoryObj]);
                                  }
                                }}
                                className={`
                flex items-center gap-3 p-3 rounded-md cursor-pointer border
                ${isSelected
                                    ? "bg-primary/5 border-primary"
                                    : "hover:border-primary/30 border-border"}
              `}
                              >
                                <div className={`
                h-5 w-5 rounded flex items-center justify-center flex-shrink-0
                ${isSelected
                                    ? "bg-primary text-primary-foreground"
                                    : "border border-muted-foreground"}
              `}>
                                  {isSelected && <Check className="h-3 w-3" />}
                                </div>
                                <span className="text-sm font-medium">{typeof category === "string" ? category : category}</span>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}

                    <DialogFooter className="mt-6 gap-2">
                      <Button variant="outline" onClick={handleClose}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreateCategoriesFromSelection}
                        disabled={selectedCategories.length === 0 || loading}
                        className="gap-2"
                      >
                        {loading ? <Loader /> : <>
                          <Check className="h-4 w-4" />
                          Add Selected ({selectedCategories.length})
                        </>}
                      </Button>
                    </DialogFooter>
                  </DialogContent>

                </Dialog>
              </div>

              {/* Manual Category Creation Section */}
              <div className="p-5 border rounded-lg bg-card">
                <h3 className="text-sm font-medium mb-3 flex items-center">
                  <FolderPlus className="mr-2 h-4 w-4 text-primary" />
                  Manually Create Categories
                </h3>
                <div className="flex gap-2 mb-2">
                  <Input
                    type="text"
                    placeholder="Add new category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="text-sm"
                  />
                  <Button
                    onClick={handleCreateCategory}
                    disabled={!newCategory.trim() || loading}
                    className="bg-[#017a5b] hover:bg-[#017a5b]/90 relative group overflow-hidden"
                  >
                    {loading ? (
                      <Loader />
                    ) : (
                      <Plus className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    )}
                    Create
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Define custom categories based on your specific needs
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories List Section */}
      <Card className="shadow-sm mb-56">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center">
              <Tag className="mr-2 h-5 w-5 text-primary" />
              Your Categories
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-[250px]"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <CardDescription>
            {filteredCategories.length} {filteredCategories.length === 1 ? 'category' : 'categories'} available
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-6">
                <DotLottieReact
                  src="/lottie/empty-state.lottie"
                  loop
                  autoplay
                  className="h-32 w-32 mx-auto"
                />
              </div>
              <h3 className="text-lg font-medium">No categories found</h3>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                {searchQuery
                  ? `No results for "${searchQuery}". Try a different search.`
                  : "Start by creating categories manually or let our AI suggest categories for you."
                }
              </p>
              {role === "orgAdmin" && !searchQuery && (
                <Button
                  onClick={handleAddSuggestedCategories}
                  className="mt-4 bg-[#815BF5] hover:bg-[#815BF5]/90"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate AI Suggestions
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 mb-12 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredCategories.map((cat) => (
                <div
                  key={cat._id}
                  className="border rounded-lg text-sm p-4 transition-all duration-200 hover:shadow-md bg-card"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CategoryAvatar name={cat.name} />
                      <h3 className="font-medium truncate text-xs max-w-[100px]" title={cat.name}>
                        {cat.name}
                      </h3>
                    </div>

                    {role === "orgAdmin" && (
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="p-6">
                            <DialogHeader>
                              <DialogTitle>Update Category</DialogTitle>
                              <DialogDescription>
                                Make changes to your category name
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <Input
                                autoFocus
                                defaultValue={cat.name}
                                onChange={(e) => setEditCategoryName(e.target.value)}
                                className="text-sm"
                                placeholder="Enter category name"
                              />
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setEditingCategoryId(null);
                                    setEditCategoryName("");
                                  }}
                                >
                                  Cancel
                                </Button>
                              </DialogClose>
                              <Button
                                onClick={() => handleEditCategory(cat._id)}
                                disabled={loading || !editCategoryName.trim()}
                              >
                                {loading ? <Loader /> : "Save Changes"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                          onClick={() => handleDeleteClick(cat._id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteCategory}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone and will affect all tasks assigned to this category."
      />

      {/* Full screen loader */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg flex flex-col items-center">
            <Loader />
            <p className="mt-4">Processing your request...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;

interface CategoryAvatarProps {
  name: string;
}

const CategoryAvatar: React.FC<CategoryAvatarProps> = ({ name }) => {
  // Generate a consistent color based on the name
  const getColorFromName = (name: string) => {
    const colors = [
      "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
      "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500",
      "bg-orange-500", "bg-cyan-500"
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    hash = Math.abs(hash);
    return colors[hash % colors.length];
  };

  const initial = name.charAt(0).toUpperCase();
  const bgColor = getColorFromName(name);

  return (
    <div className={`${bgColor} rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0`}>
      <span className="text-white font-bold text-sm">{initial}</span>
    </div>
  );
};

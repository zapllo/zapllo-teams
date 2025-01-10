"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Edit, Edit3, Plus, Trash } from "lucide-react";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { businessCategories } from "@/lib/constants";
import { toast, Toaster } from "sonner";
import Loader from "@/components/ui/loader";
import DeleteConfirmationDialog from "@/components/modals/deleteConfirmationDialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface Category {
  _id: string;
  name: string;
  organization: string;
}

const Categories: React.FC = () => {
  const [newCategory, setNewCategory] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [suggestedCategories, setSuggestedCategories] = useState<Category[]>(
    []
  );
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [editCategoryName, setEditCategoryName] = useState<string>("");
  const [role, setRole] = useState("role");
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteEntryId, setDeleteEntryId] = useState<string | null>(null);
  const [industry, setIndustry] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control the dialog
  const [loadingAI, setLoadingAI] = useState(false); // State for AI loader

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/category/get");
      if (response.status === 200) {
        setCategories(response.data.data);
      } else {
        console.error("Error fetching categories:", response.data.error);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  console.log(categories, "categories??????");

  const handleCreateCategory = async () => {
    if (!newCategory) return;

    setLoading(true);

    try {
      const response = await axios.post("/api/category/create", {
        name: newCategory,
      });

      if (response.status === 200) {
        setCategories([...categories, response.data.data]);
        fetchCategories();
        setNewCategory("");
        toast(<div className=" w-full mb-6 gap-2 m-auto  ">
          <div className="w-full flex  justify-center">
            <DotLottieReact
              src="/lottie/tick.lottie"
              loop
              autoplay
            />
          </div>
          <h1 className="text-black text-center font-medium text-lg">Category created successfully</h1>
        </div>);
        setLoading(false);
      } else {
        console.error("Error creating category:", response.data.error);
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleEditCategory = async (categoryId: string) => {
    if (!editCategoryName) return;

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
        toast(<div className=" w-full mb-6 gap-2 m-auto  ">
          <div className="w-full flex  justify-center">
            <DotLottieReact
              src="/lottie/tick.lottie"
              loop
              autoplay
            />
          </div>
          <h1 className="text-black text-center font-medium text-lg">Category updated successfully</h1>
        </div>);
        setEditCategoryName("");
      } else {
        console.error("Error updating category:", response.data.error);
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  useEffect(() => {
    const getUserDetails = async () => {
      const res = await axios.get("/api/users/me");
      const user = res.data.data;
      setRole(user.role);
      const response = await axios.get("/api/organization/getById");
      const organization = response.data.data;
      setIndustry(organization.industry);
      const trialStatusRes = await axios.get("/api/organization/trial-status");
      setIsTrialExpired(trialStatusRes.data.isExpired);
    };
    getUserDetails();
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isTrialExpired) {
    return (
      <div className="p-4 text-center mt-32">
        <h1 className="text-xl font-bold text-red-500">
          Your trial has expired!
        </h1>
        <p>
          Please purchase a subscription to continue using the Task Management
          features.
        </p>
        <Link href="/dashboard/billing">
          <Button className="h-10 bg-white text-black hover:text-white mt-4 text-lg ">
            👑 Upgrade to Pro
          </Button>
        </Link>
      </div>
    );
  }

  const handleAddSuggestedCategories = async () => {
    setLoadingAI(true);

    try {
      const response = await axios.post("/api/category/suggest", { industry });
      if (response.status === 200) {
        const { categories } = response.data;
        setSuggestedCategories(categories);
        // fetchCategories();
        toast.success("Suggested categories generated successfully.");
        // fetchCategories();
        setIsDialogOpen(true); // Open the dialog when categories are fetched
      } else {
        toast.error("Failed to generate suggested categories.");
      }
    } catch (error) {
      console.error("Error suggesting categories:", error);
      toast.error("Error generating suggested categories");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteEntryId) return; // No ID to delete

    try {
      const response = await axios.delete("/api/category/delete", {
        data: { categoryId: deleteEntryId },
      });

      if (response.status === 200) {
        setCategories(categories.filter((cat) => cat._id !== deleteEntryId));
        setIsDeleteDialogOpen(false);
        setDeleteEntryId(null); // Clear the ID after deletion
      } else {
        console.error("Error deleting category:", response.data.error);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteEntryId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleClose = () => {
    setSuggestedCategories([]);
    setIsDialogOpen(false);
  }

  const handleCreateCategoriesFromSelection = async () => {
    try {
      setLoading(true);
      const promises = selectedCategories.map((category) =>
        axios.post("/api/category/create", { name: category })
      );
      await Promise.all(promises);

      setCategories([...categories, ...selectedCategories]);
      setSelectedCategories([]); // Clear selected categories after adding
      fetchCategories();
      setIsDialogOpen(false); // Close dialog when done
      toast.success("Categories added successfully.");
    } catch (error) {
      console.error("Error adding categories:", error);
      toast.error("Failed to add categories.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="p-4 h-screen overflow-y-scroll scrollbar-hide ">
      {/* <h1 className='text- text-xl font-medium bg-[#0A0D28]   py-2 rounded px-2'>Category</h1> */}
      {/* <Toaster /> */}
      <div className="flex justify-start bg- rounded ">
        {role === "orgAdmin" && (
          <div className="flex justify-center w-full">
            <div className="mt-4  flex justify-center ">
              {/* <Label>Add a New Category</Label> */}
              <input
                type="text"
                placeholder="Add New Category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full focus-within:border-[#815BF5] outline-none text-xs text-white bg-[#0A0D28] border rounded px-3 py-2"
              />
            </div>
            <div className="mt-4">
              <button
                onClick={handleCreateCategory}
                className="ml-2 px-3 py-2  bg-[#017a5b] hover:bg-[#15624f] text-sm text-white rounded"
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        )}
      </div>
      {role === "orgAdmin" && (
        <div>
          <Dialog open={isDialogOpen} onOpenChange={handleClose}>
            <DialogTrigger asChild>
              <div className="">
                <div
                  className="  rounded-lg w-72 border  mt-2 px-4 py-2 cursor-pointer"
                  onClick={handleAddSuggestedCategories}
                >
                  <div className="flex gap-2  mt-4 items-center text-muted-foreground">
                    <img src="/branding/AII.png" className="h-10" />
                    <img src="/branding/zapllo ai.png" className="h-5 mt-2" />
                  </div>
                  <p className="text-muted-foreground text-xs w-fit mt-4">
                    Use our intelligent AI engine to analyze your industry and
                    carefully curate a selection of categories for your workflow.
                  </p>
                  <Button className="flex gap-2 mt-4 h-fit mb-4 bg-[#815BF5] hover:bg-[#5e38d0]">
                    <Plus className="h-4" />
                    <h1 className="text-xs font-medium">
                      {loadingAI ? <Loader /> : "Add Suggested Categories"}
                    </h1>
                  </Button>
                </div>
              </div>
            </DialogTrigger>

            <DialogContent className="z-[100] w-full p-6  max-w-5xl">
              <div className="flex justify-between ">
                <div className="">
                  <div className="flex gap-2 items-center text-muted-foreground">
                    <img src="/branding/AII.png" className="h-7" />
                    <img src="/branding/zapllo ai.png" className="h-4 mt-2" />
                  </div>
                  {/* <DialogTitle className='text-md mt-4 '>✨ Suggested Categories

                            </DialogTitle> */}

                  <DialogDescription className="mt-4 ml-1 text-xs ">
                    Our intelligent AI engine has analyzed your industry and
                    carefully curated a selection of categories. Choose the ones
                    that suit your business, and let’s add them to your workflow
                    effortlessly!
                  </DialogDescription>
                </div>
                <div>
                  <DialogClose>
                    <CrossCircledIcon className="scale-150 mt-1 cursor-pointer hover:bg-white rounded-full hover:text-[#815BF5]" />
                  </DialogClose>
                </div>
              </div>
              {loadingAI && <Loader />}{" "}


              {/* Show loader while fetching AI categories */}
              <div className="grid grid-cols-3 gap-4 mt-6 ">
                {suggestedCategories.map((category, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      if (selectedCategories.includes(category)) {
                        setSelectedCategories(
                          selectedCategories.filter((cat) => cat !== category)
                        );
                      } else {
                        setSelectedCategories([...selectedCategories, category]);
                      }
                    }}
                    className={`cursor-pointer border-2 text-xs rounded-lg p-2 hover:shadow-lg transition-all ${selectedCategories.includes(category)
                      ? "bg-gradient-to-l from-[#815BF5] to-purple-900 text-white border-transparent"
                      : "border text-white -700 "
                      }`}
                  >
                    <h3 className="font-medium">
                      {typeof category === "string" ? category : category.name}
                    </h3>
                    <p className="text-xs mt-1 text-muted-foreground">
                      Tap to select
                    </p>
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button
                  onClick={handleCreateCategoriesFromSelection}
                  className="mt-6 bg-[#017a5b] text-white hover:bg-[#017a5b] w-full"
                >
                  {loading ? <Loader /> : "Confirm & Save"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      <div
        className={`${loading
          ? "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          : ""
          }`}
      >
        {loading ? <Loader /> : ""}
      </div>

      <div className="flex justify-start rounded items-center border bg-[#0A0D28] w-full mt-4">
        {/* <Label>Search Categories</Label> */}
        <h1 className="text-start text- font-medium  p-4">Categories</h1>
        <div className=" ml-auto">
          <input
            type="text"
            placeholder="Search Categories"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className=" outline-none focus-within:border-[#815BF5] text-xs text-white bg-[#0B0D29] border rounded px-4 py-2 mx-4"
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 mb-16">
        {filteredCategories.map((cat) => (
          <div key={cat._id} className="border w-full h-10 flex gap-2 items-center text-sm">
            {editingCategoryId === cat._id ? (
              <Dialog open={Boolean(editingCategoryId)} onOpenChange={() => setEditingCategoryId(null)}>
                <DialogTrigger asChild>
                  <button onClick={() => setEditingCategoryId(cat._id)} className="py-2 bg-warning text-white rounded">
                    <Edit3 className="h-4 text-blue-400" />
                  </button>
                </DialogTrigger>
                <DialogContent className="z-[100] p-6">
                  <div
                    className=""
                  >
                    <div className="flex justify-between mb-4 items-center">
                      <DialogTitle className=" text-md">Update Category</DialogTitle>
                      <DialogClose asChild>
                        <CrossCircledIcon onClick={() => setEditingCategoryId(null)} className="scale-150 cursor-pointer  hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]" />

                      </DialogClose>
                    </div>

                    <input
                      type="text"
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                      className="w-full text-sm focus-within:border-[#815BF5] text-white outline-none bg-transparent border rounded px-3 py-2"
                    />
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleEditCategory(cat._id)}
                        className="bg-[#007A5A] hover:bg-[#007A5A] text-sm w-full px-3 py-2 text-white rounded"
                      >
                        Save
                      </button>


                    </div>
                  </div>
                </DialogContent>

              </Dialog>
            ) : (
              <div className=" flex justify-between w-full  ">
                <div className="flex justify-between w-full ">
                  <div className="flex gap-2 w-full">
                    <div className="px-1 scale-90 flex items-center">
                      <FallbackImage name={cat.name} />
                    </div>
                    <span className="text-xs w-full flex items-center">{cat.name}</span>
                  </div>
                  <div className="  w-full">
                    {role === "orgAdmin" && (
                      <div className="flex 2 justify-end gap-2 w-full">
                        <div className="">
                          <button
                            onClick={() => {
                              setEditingCategoryId(cat._id);
                              setEditCategoryName(cat.name);
                            }}
                            className=" py-2 bg-warning text-white rounded"
                          >
                            <Edit3 className="h-4 text-blue-400" />
                          </button>
                        </div>
                        <div>
                          <button
                            onClick={() => handleDeleteClick(cat._id)}
                            className="  py-2 bg-danger text-white rounded"
                          >
                            <Trash className="h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        ))}
      </div>
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteCategory}
        title="Delete Task"
        description="Are you sure you want to delete this category? This action cannot be undone."
      />
    </div >
  );
};

export default Categories;

interface FallbackImageProps {
  name: string; // Define the type of 'name'
}

const FallbackImage: React.FC<FallbackImageProps> = ({ name }) => {
  const initial = name.charAt(0).toUpperCase(); // Get the first letter of the category name
  return (
    <div className="bg-[#282D32] rounded-full h-8 w-8 flex items-center justify-center">
      <span className="text-white font-bold text-lg">{initial}</span>
    </div>
  );
};

const getCategoryIcon = (categoryName: String) => {
  switch (categoryName) {
    case "Automation":
      return "/icons/intranet.png";
    case "Customer Support":
      return "/icons/support.png";
    case "Marketing":
      return "/icons/marketing.png";
    case "Operations":
      return "/icons/operations.png";
    case "Sales":
      return "/icons/sales.png";
    case "HR":
      return "/icons/attendance.png";
    default:
      return null; // Or a default icon if you prefer
  }
};

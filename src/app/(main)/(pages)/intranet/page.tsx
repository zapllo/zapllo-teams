// pages/intranet.tsx
"use client";

import IntranetTable from "@/components/tables/intranetTable";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { motion, useAnimation } from "framer-motion";
import Loader from "@/components/ui/loader";
import { toast } from "sonner";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [description, setDescription] = useState("");
  const [linkName, setLinkName] = useState("");
  const [category, setCategory] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [entries, setEntries] = useState<IntranetEntry[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(""); // State for selected category
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query

  useEffect(() => {
    fetchEntries();
    fetchCategories();
  }, []);

  async function fetchEntries() {
    try {
      const response = await axios.get("/api/intranet");
      setEntries(response.data);
    } catch (error) {
      console.error("Failed to fetch intranet entries:", error);
    }
  }
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/category/get");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      await axios.post("/api/intranet", {
        linkUrl,
        description,
        linkName,
        category,
      });
      // Handle success (e.g., reset form, show message, etc.)
      setLinkName("");
      setLinkUrl("");
      setDescription("");
      setCategory("");
      setLoading(false);
      setIsDialogOpen(false); // Close dialog
      toast.success("Link Added Successfully")
      fetchEntries();
    } catch (error) {
      console.error("Failed to create intranet entry:", error);
      // Handle error (e.g., show error message)
    }
  };

  const controls = useAnimation();

  const modalVariants = {
    hidden: {
      opacity: 0,
      y: "100%",
    },
    visible: {
      opacity: 1,
      y: "0%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 40,
      },
    },
  };

  // Trigger the animation when the component mounts
  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  return (
    <div className="flex w-full justify-center ">
      <div className="p-6 mt-12 w-full">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <div className=" px-2 py-4">
            <div className="flex items-center justify-center">

              <div className="flex items-center justify-end w-full space-x-4">
              <select
                  className="p-2 px-4  bg-[#0B0D29] border  outline-none h-[35px] rounded-sm text-xs border-gray-700 "
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <DialogTrigger asChild>
                  {/* <button className="px-4 py-2 bg-[#017A5B] text-xs text-white rounded hover:bg-[#017A5B]">
                New Links
              </button> */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent border font-semibold hover:bg-[#145d4a] bg-[#017a5b] text-[#ffffff]  px-4 py-1 rounded"

                  >
                    New Link </Button>
                </DialogTrigger>
               

              </div>
              {/* <input
              type="text"
              className="px-4 py-2 text-xs outline-none"
              placeholder="Search Link Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            /> */}
            </div>
          </div>

          {/* Add New Link Modal */}
          <DialogContent className="z-[100]   ">
            <div className="mb-6 ">
              <div className="flex items-center justify-between border-b  p-6  ">
                <DialogTitle className="text-md font-semibold text-white">
                  Add New Link
                </DialogTitle>
                <DialogClose className="">
                  <CrossCircledIcon className="scale-150 h-4 w-4  hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]" />
                </DialogClose>
              </div>

              <form onSubmit={handleSubmit} className="px-6 mt-4 space-y-4">
                <div>
                  {/* <label htmlFor="linkUrl" className="block text-xs font-medium text-white -700">Link URL</label> */}
                  <input
                    type="url"
                    placeholder="Link URL"
                    id="linkUrl"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    required
                    className="  px-4 focus-within:border-[#815BF5]  block text-xs w-full  bg-transparent outline-none p-2 border rounded-md"
                  // className="w-full h-12 px-4 bg-transparent text-white  rounded-md border-0 outline-none"
                  />
                </div>

                <div>
                  {/* <label htmlFor="description" className="block text-xs font-medium text-white -700">Description</label> */}
                  <textarea
                    id="description"
                    value={description}
                    placeholder="Description"
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className=" w-full focus-within:border-[#815BF5] h-24 px-4  block text-xs bg-transparent outline-none  p-2 border rounded-md"
                  />
                </div>

                <div>
                  {/* <label htmlFor="linkName" className="block text-xs font-medium text-white -700">Link Name</label> */}
                  <input
                    type="text"
                    id="linkName"
                    value={linkName}
                    onChange={(e) => setLinkName(e.target.value)}
                    required
                    placeholder="Link Name"
                    className="w-full px-4 focus-within:border-[#815BF5] bg-transparent text-xs outline-none block  p-2 border rounded-md"
                  />
                </div>

                <div>
                  {/* <label htmlFor="category" className="block text-xs font-medium text-white -700">Category</label> */}
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className=" h-9 px-4  bg-[#0b0d29] block text-xs  outline-none w-full p-2 border rounded-md"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="bg-[#815BF5] w-full  mt-2 py-2 mb-4 text-xs cursor-pointer  text-white rounded-md"
                >
                  {loading ? <Loader /> : "Submit Now"}
                </button>
              </form>
            </div>
          </DialogContent>
        </Dialog>
        <div className="w-full  ">
          <IntranetTable
            entries={entries}
            fetchEntries={fetchEntries}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
          />
        </div>
      </div>
    </div>
  );
};

export default IntranetPage;

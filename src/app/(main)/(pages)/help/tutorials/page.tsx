"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import { VideoIcon, Bookmark, Info } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const categories = [
  "All Tutorials",
  "Task Delegation App",
  "Leave and Attendance App",
  "Zapllo WABA",
];

export default function Tutorials() {
  const [tutorials, setTutorials] = useState<any[]>([]);
  const [filteredTutorials, setFilteredTutorials] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Tutorials");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const response = await axios.get("/api/tutorials");
        setTutorials(response.data.tutorials);
        setFilteredTutorials(response.data.tutorials);
      } catch (err) {
        console.error("Failed to fetch tutorials:", err);
        setError("Failed to load tutorials.");
      } finally {
        setLoading(false);
      }
    };

    fetchTutorials();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    const filtered = tutorials.filter((tutorial) =>
      tutorial.title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    filterByCategory(selectedCategory, filtered);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    filterByCategory(value, tutorials);
  };

  const filterByCategory = (category: string, tutorialList: any[]) => {
    if (category === "All Tutorials") {
      setFilteredTutorials(
        tutorialList.filter((tutorial) =>
          tutorial.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      const filtered = tutorialList.filter(
        (tutorial) =>
          tutorial.category === category &&
          tutorial.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTutorials(filtered);
    }
  };

  const handleTutorialClick = (id: string) => {
    router.push(`/help/tutorials/${id}`);
  };

 if (loading) {
  return (
    <div className=" mx-auto p-6">
      {/* Page header skeleton */}
      <div className="mb-8">
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-5 w-full max-w-md" />
      </div>

      {/* Search and filter controls skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <Skeleton className="h-10 w-full md:w-72 rounded-md" />
        <Skeleton className="h-10 w-full md:w-64 rounded-md" />
      </div>

      {/* Tutorial cards grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="overflow-hidden rounded-lg border">
            {/* Thumbnail skeleton */}
            <Skeleton className="w-full h-48" />

            {/* Content skeleton */}
            <div className="p-4">
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-4/5 mb-3" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex justify-center mt-8">
        <div className="flex gap-1">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>
    </div>
  );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className=" mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Video Tutorials</h1>
        <p className="text-muted-foreground">
          Learn how to use Zapllo with step-by-step video guides
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="relative w-full md:w-72">
          <Input
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search tutorials..."
            className="pl-10"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        </div>

        <Select
          value={selectedCategory}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger className="w-full md:w-64">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCategory !== "All Tutorials" && (
        <Alert className="mb-6 bg-muted/50">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Showing tutorials for <strong>{selectedCategory}</strong>.
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => handleCategoryChange("All Tutorials")}
            >
              View all tutorials
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-6">
        {filteredTutorials.length > 0 ? (
          filteredTutorials.map((tutorial) => (
            <Card
              key={tutorial._id}
              className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => handleTutorialClick(tutorial._id)}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Button size="sm" variant="secondary" className="gap-2">
                    <VideoIcon className="h-4 w-4" />
                    Watch Now
                  </Button>
                </div>
                <img
                  src={tutorial.thumbnail}
                  alt={tutorial.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white flex items-center gap-1">
                  <VideoIcon className="h-3 w-3" />
                  Tutorial
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium line-clamp-2">{tutorial.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {tutorial.category || "General"}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <DotLottieReact
              src="/lottie/empty.lottie"
              loop
              autoplay
              className="h-40"
            />
            <h3 className="font-medium mt-4">No tutorials found</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Try adjusting your search or category filter
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All Tutorials");
                setFilteredTutorials(tutorials);
              }}
            >
              Reset filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

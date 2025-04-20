"use client";

import { useState } from "react";
import axios from "axios";
import { ExternalLink, Copy, PencilLine, Trash2, Search, Plus } from "lucide-react";
import { toast } from "sonner";
import EditIntranetDialog from "../modals/editIntranetDialog";
import DeleteConfirmationDialog from "../modals/deleteConfirmationDialog";

// Shadcn components
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
  category: Category;
}

interface IntranetTableProps {
  entries: IntranetEntry[];
  fetchEntries: () => Promise<void>;
  selectedCategory: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: Category[];
  onCategoryChange: (categoryId: string) => void;
  onAddNewClick: () => void;
}

const IntranetTable: React.FC<IntranetTableProps> = ({
  entries,
  fetchEntries,
  selectedCategory,
  searchQuery,
  onSearchChange,
  categories,
  onCategoryChange,
  onAddNewClick,
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<IntranetEntry | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteEntryId, setDeleteEntryId] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Use "all" as the value for all categories instead of empty string
  const ALL_CATEGORIES = "all";

  // Filter entries based on selected category and search query
  const filteredEntries = entries.filter((entry) => {
    const matchesCategory = selectedCategory === ALL_CATEGORIES
      ? true
      : entry.category._id === selectedCategory;

    const matchesSearch = searchQuery
      ? entry.linkName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesCategory && matchesSearch;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredEntries.length / rowsPerPage);
  const indexOfLastEntry = currentPage * rowsPerPage;
  const indexOfFirstEntry = indexOfLastEntry - rowsPerPage;
  const currentEntries = filteredEntries.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handleGoToLink = (url: string) => {
    window.open(url, "_blank");
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  const handleEdit = (entry: IntranetEntry) => {
    setEditEntry(entry);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteEntryId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteEntryId) {
      try {
        await axios.delete("/api/intranet", { data: { id: deleteEntryId } });
        toast.success("Link deleted successfully");
        setIsDeleteDialogOpen(false);
        setDeleteEntryId(null);
        await fetchEntries();
      } catch (error) {
        console.error("Failed to delete entry:", error);
        toast.error("Failed to delete link");
      }
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-border dark:bg-transparent dark:border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search links..."
                className="pl-8 bg-transparent dark:text-white  text-black placeholder:text-muted-foreground"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Select
                value={selectedCategory}
                onValueChange={onCategoryChange}
              >
                <SelectTrigger className="w-full md:w-[180px] bg-transparent">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_CATEGORIES}>All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {entries.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <ExternalLink className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No links found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Get started by adding your first link.
              </p>
              <Button onClick={onAddNewClick} className="mt-4">
                <Plus className="h-4 w-4 mr-1" /> Add New Link
              </Button>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="p-8 text-center">
              <h3 className="text-lg font-semibold">No matching links</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try adjusting your search or filter to find what you&apos;re looking for.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  onSearchChange("");
                  onCategoryChange(ALL_CATEGORIES);
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="relative overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[40%]">Link</TableHead>
                    <TableHead className="w-[20%]">Category</TableHead>
                    <TableHead className="text-right w-[40%]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentEntries.map((entry) => (
                    <TableRow key={entry._id} className="group">
                      <TableCell>
                        <div>
                          <div className="font-medium line-clamp-1">{entry.linkName}</div>

                          <div className="text-xs text-muted-foreground/70 mt-1 line-clamp-1">
                            {entry.linkUrl}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-normal">
                          {entry.category.name}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2 opacity-100  transition-opacity">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-2 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-950 hover:bg-blue-50 dark:hover:bg-blue-950/50"
                            onClick={() => handleGoToLink(entry.linkUrl)}
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only md:not-sr-only md:ml-2">Visit</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-2 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-950 hover:bg-purple-50 dark:hover:bg-purple-950/50"
                            onClick={() => handleCopyLink(entry.linkUrl)}
                          >
                            <Copy className="h-4 w-4" />
                            <span className="sr-only md:not-sr-only md:ml-2">Copy</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-2 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-950 hover:bg-amber-50 dark:hover:bg-amber-950/50"
                            onClick={() => handleEdit(entry)}
                          >
                            <PencilLine className="h-4 w-4" />
                            <span className="sr-only md:not-sr-only md:ml-2">Edit</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-2 text-red-600 dark:text-red-400 border-red-200 dark:border-red-950 hover:bg-red-50 dark:hover:bg-red-950/50"
                            onClick={() => handleDeleteClick(entry._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only md:not-sr-only md:ml-2">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        {filteredEntries.length > 0 && (
          <CardFooter className="flex items-center justify-between p-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="text-nowrap">
                Showing {indexOfFirstEntry + 1}-
                {Math.min(indexOfLastEntry, filteredEntries.length)} of{" "}
                {filteredEntries.length} links
              </div>
              <Select
                value={rowsPerPage.toString()}
                onValueChange={handleRowsPerPageChange}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 20, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={pageSize.toString()}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-nowrap">per page</div>
            </div>

            <Pagination className="justify-end w-full flex">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <PaginationItem key={i}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNum)}
                        isActive={currentPage === pageNum}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => handlePageChange(totalPages)}
                      isActive={currentPage === totalPages}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className={
                      currentPage === totalPages ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        )}
      </Card>

      {isEditDialogOpen && editEntry && (
        <EditIntranetDialog
          entry={editEntry}
          onClose={() => setIsEditDialogOpen(false)}
          onSave={async (updatedEntry) => {
            try {
              await axios.patch("/api/intranet", {
                id: updatedEntry._id,
                linkUrl: updatedEntry.linkUrl,
                description: updatedEntry.description,
                linkName: updatedEntry.linkName,
                category: updatedEntry.category._id,
              });
              setIsEditDialogOpen(false);
              toast.success("Link updated successfully");
              await fetchEntries();
            } catch (error) {
              console.error("Failed to update entry:", error);
              toast.error("Failed to update link");
            }
          }}
        />
      )}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Link"
        description="Are you sure you want to delete this link? This action cannot be undone."
      />
    </div>
  );
};

export default IntranetTable;

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Copy, Edit, Globe, Trash } from "lucide-react";
import { Toaster, toast } from "sonner";
import EditIntranetDialog from "../modals/editIntranetDialog";
import DeleteConfirmationDialog from "../modals/deleteConfirmationDialog";
import { Button } from "@/components/ui/button";

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
}

const IntranetTable: React.FC<IntranetTableProps> = ({
  entries,
  fetchEntries,
  selectedCategory,
  searchQuery,
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<IntranetEntry | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteEntryId, setDeleteEntryId] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default to 5 rows per page

  // Filter entries based on selected category and search query
  const filteredEntries = entries.filter((entry) => {
    const matchesCategory = selectedCategory
      ? entry.category._id === selectedCategory
      : true;
    const matchesSearch = entry.linkName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
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

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  const handleGoToLink = (url: string) => {
    window.open(url, "_blank");
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Link Copied Successfully!");
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
      }
    }
  };

  return (
    <div className="relative mt-6 w-full">
      {/*             <Toaster /> */}

      {/* Table container with a fixed height and scrollable content */}
      <main>
        <div className="bg-[#0B0D29] text-sm w-full rounded-2xl  border overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#0B0D29] ">
              <tr className=" ">
                <th className="text-left py-3 px-4 text-gray-400 font-normal">
                  LINK NAME
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-normal">
                  CATEGORY
                </th>
                <th className="text-left py-3 px-4 text-gray-400 font-normal">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {currentEntries?.map((entry) => (
                <tr key={entry._id} className=" border-t">
                  <td className="py-4 px-4 font-medium">{entry?.linkName}</td>
                  <td className="py-4 px-4">{entry?.category?.name}</td>
                  <td className="py-4 px-4">
                    <div className="flex justivy-end space-x-2">
                      {/* <button onClick={() => handleGoToLink(entry?.linkUrl)}>
                        <Globe className="h-4" />
                      </button> */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent border font-semibold border-orange-400 text-orange-400 hover:bg-orange-400/10 px-4 py-1 rounded"
                        onClick={() => handleGoToLink(entry?.linkUrl)}
                      >
                        {/* <Globe className="h-4" /> */}
                        Website
                      </Button>
                      {/* <button onClick={() => handleCopyLink(entry?.linkUrl)}>
                        <Copy className="h-4" />
                      </button> */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent font-semibold border border-[#6943F6] text-[#6943F6] hover:bg-purple-400/10 px-4 py-1 rounded"
                        onClick={() => handleCopyLink(entry?.linkUrl)}
                      >
                        {/* <Copy className="h-4" /> */}
                        Copy
                      </Button>
                      {/* <button onClick={() => handleEdit(entry)}>
                        <Edit className="h-4 text-blue-400" />
                      </button> */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent border font-semibold border-orange-400 text-orange-400 hover:bg-orange-400/10 px-4 py-1 rounded"
                        onClick={() => handleEdit(entry)}
                      >
                        {/* <Edit className="h-4 text-blue-400" /> */}
                        Edit
                      </Button>
                      {/* <button onClick={() => handleDeleteClick(entry?._id)}>
                        <Trash className="h-4 text-red-500" />
                      </button> */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent border font-semibold border-[#E9001C] text-[#E9001C] hover:bg-red-400/20 px-4 py-1 rounded"
                        onClick={() => handleDeleteClick(entry?._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Pagination Controls - fixed at the bottom */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center">
          <span className="mr-2 text-sm">Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="px-2 py-1 border outline-none rounded"
          >
            {[5, 10, 15, 20].map((rows) => (
              <option key={rows} value={rows}>
                {rows}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-3 py-1 mx-1 rounded"
          >
            &lt;
          </button>
          <span className="text-sm">{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-3 py-1 mx-1"
          >
            &gt;
          </button>
        </div>
      </div>

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
              toast.success("Link Updated Successfully");
              await fetchEntries();
            } catch (error) {
              console.error("Failed to update entry:", error);
            }
          }}
        />
      )}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Entry"
        description="Are you sure you want to delete this entry? This action cannot be undone."
      />
    </div>
  );
};

export default IntranetTable;

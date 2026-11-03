
"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { AlertTriangle, Trash2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type DeleteStudioProps = {
  studioId: string;
  studioTitle: string;
  onDeleted: (studioId: string) => void;
};

export default function DeleteStudio({
  studioId,
  studioTitle,
  onDeleted,
}: DeleteStudioProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);

    try {
      const response = await apiClient(
        `/my-listings/${studioId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to delete studio."
        );
      }

      if (result.deletedCount !== 1) {
        throw new Error("Studio not found or already deleted.");
      }

      onDeleted(studioId);
      setOpen(false);

      toast.success("Studio deleted successfully!", {
        duration: 4000,
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="h-9 gap-1 rounded-lg border-red-200 px-2.5 text-xs font-semibold text-red-600 hover:border-red-500 hover:bg-red-50 hover:text-red-700 dark:border-red-900/60 dark:bg-transparent dark:text-red-400 dark:hover:border-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-300"
      >
        <Trash2 size={15} />
        Delete
      </Button>

      <AlertDialog
        open={open}
        onOpenChange={(value) => {
          if (!isDeleting) {
            setOpen(value);
          }
        }}
      >
        <AlertDialogContent className="max-h-[85vh] w-[calc(100%-2rem)] max-w-[440px] overflow-y-auto rounded-2xl border border-[#EAE7E2] bg-white p-5 shadow-xl dark:border-[#374347] dark:bg-[#1C2629] sm:p-7">
          <AlertDialogHeader className="gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400">
              <AlertTriangle size={27} strokeWidth={1.8} />
            </div>

            <AlertDialogTitle className="text-xl font-extrabold text-[#202729] dark:text-white">
              Delete Studio Listing?
            </AlertDialogTitle>

            <AlertDialogDescription className="break-words text-sm leading-7 text-[#777D7D] dark:text-[#B5BDBA]">
              Are you sure you want to delete{" "}
              <span className="font-bold text-[#202729] dark:text-white">
                {studioTitle}
              </span>
              ? This studio will be permanently removed from your
              listings. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-5 flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <AlertDialogCancel
              disabled={isDeleting}
              className="h-10 w-full rounded-lg border-[#EAE7E2] px-5 font-semibold text-[#202729] hover:bg-[#F5F3EE] dark:border-[#465457] dark:bg-[#263437] dark:text-white dark:hover:bg-[#334347] sm:w-auto"
            >
              Cancel
            </AlertDialogCancel>

            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-10 w-full rounded-lg bg-red-600 px-5 font-semibold text-white hover:bg-red-700 dark:bg-red-600 dark:text-white dark:hover:bg-red-700 sm:w-auto"
            >
              <Trash2 size={16} />
              {isDeleting ? "Deleting..." : "Delete Studio"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

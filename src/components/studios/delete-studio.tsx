
"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { AlertTriangle, Trash2 } from "lucide-react";

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
      const response = await fetch(
        `http://localhost:5000/my-listings/${studioId}`,
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
        className="h-9 gap-1 rounded-lg border-red-200 px-2.5 text-xs font-semibold text-red-600 hover:border-red-500 hover:bg-red-50 hover:text-red-700"
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
        <AlertDialogContent className="w-[calc(100%-2rem)] max-w-[440px] rounded-2xl border border-[#EAE7E2] bg-white p-7 shadow-xl">
          <AlertDialogHeader className="gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <AlertTriangle size={27} strokeWidth={1.8} />
            </div>

            <AlertDialogTitle className="text-xl font-extrabold text-[#202729]">
              Delete Studio Listing?
            </AlertDialogTitle>

            <AlertDialogDescription className="text-sm leading-7 text-[#777D7D]">
              Are you sure you want to delete{" "}
              <span className="font-bold text-[#202729]">
                {studioTitle}
              </span>
              ? This studio will be permanently removed from your
              listings. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-5 gap-3 sm:justify-end">
            <AlertDialogCancel
              disabled={isDeleting}
              className="h-10 rounded-lg border-[#EAE7E2] px-5 font-semibold text-[#202729]"
            >
              Cancel
            </AlertDialogCancel>

            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-10 rounded-lg bg-red-600 px-5 font-semibold text-white hover:bg-red-700"
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

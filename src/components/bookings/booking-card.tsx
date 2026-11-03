
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/api-client";

import {
  CalendarDays,
  Clock3,
  Wallet,
  Building2,
  XCircle,
  AlertTriangle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
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

export type Booking = {
  _id: string;
  studioId: string;
  studioTitle: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  hourlyRate: number;
  totalPrice: number;
  userName: string;
  userEmail: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  imageUrl?: string;
};

type BookingCardProps = {
  booking: Booking;
  onCancelled: (bookingId: string) => void;
};

const statusStyles: Record<Booking["status"], string> = {
  Pending:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300",
  Confirmed:
    "border-green-200 bg-green-50 text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-300",
  Completed:
    "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300",
  Cancelled:
    "border-red-200 bg-red-50 text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300",
};

export default function BookingCard({
  booking,
  onCancelled,
}: BookingCardProps) {
  const [studioImage, setStudioImage] = useState("");
  const [imageError, setImageError] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (booking.imageUrl) return;

    const controller = new AbortController();

    const fetchStudioImage = async () => {
      try {
        const response = await apiClient(`/studios/${booking.studioId}`, {
          signal: controller.signal,
        });

        if (!response.ok) return;

        const studio = await response.json();

        if (!controller.signal.aborted && studio?.imageUrl) {
          setStudioImage(studio.imageUrl);
        }
      } catch {
        if (!controller.signal.aborted) {
          setStudioImage("");
        }
      }
    };

    void fetchStudioImage();

    return () => controller.abort();
  }, [booking.studioId, booking.imageUrl]);

  const handleCancel = async () => {
    if (isCancelling || booking.status !== "Pending") return;

    setIsCancelling(true);

    try {
      const response = await apiClient(`/my-bookings/${booking._id}`, {
        method: "PATCH",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to cancel booking."
        );
      }

      onCancelled(booking._id);
      setCancelOpen(false);

      toast.success("Booking cancelled successfully!", {
        duration: 4000,
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setIsCancelling(false);
    }
  };

  const imageUrl = booking.imageUrl || studioImage;

  const formattedDate = new Date(
    `${booking.bookingDate}T00:00:00`
  ).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <Card className="flex flex-col gap-0 overflow-hidden rounded-2xl border border-[#EAE7E2] bg-white py-0 shadow-sm transition-all duration-300 hover:shadow-md dark:border-[#374347] dark:bg-[#1C2629] md:flex-row">

        <div className="relative h-48 w-full shrink-0 bg-[#F0EEEB] dark:bg-[#293638] sm:h-56 md:h-auto md:min-h-[250px] md:w-56 lg:w-72">
          {imageUrl && !imageError ? (
            <Image
              src={imageUrl}
              alt={booking.studioTitle}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 288px"
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full min-h-48 items-center justify-center sm:min-h-56">
              <Building2
                size={46}
                className="text-[#B4B8B5] dark:text-[#64716E]"
              />
            </div>
          )}
        </div>

        <CardContent className="flex min-w-0 flex-1 flex-col justify-center px-5 py-6 sm:px-7 sm:py-7">

          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-[2px] text-[#F16F50]">
              Studio Reservation
            </span>

            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                statusStyles[booking.status] || statusStyles.Pending
              }`}
            >
              {booking.status}
            </span>
          </div>

          <h2 className="break-words text-lg font-bold leading-7 text-[#202729] dark:text-white sm:text-xl">
            {booking.studioTitle}
          </h2>

          <div className="mt-5 space-y-4">

            <div className="flex items-center gap-3 text-sm text-[#777D7D] dark:text-[#B5BDBA]">
              <CalendarDays
                size={18}
                className="shrink-0 text-[#F16F50]"
              />
              <span>{formattedDate}</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-[#777D7D] dark:text-[#B5BDBA]">
              <Clock3
                size={18}
                className="shrink-0 text-[#F16F50]"
              />
              <span>
                {booking.startTime} – {booking.endTime}
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm text-[#777D7D] dark:text-[#B5BDBA]">
              <Clock3
                size={18}
                className="shrink-0 text-[#F16F50]"
              />
              <span>
                Duration: {booking.durationHours} hours
              </span>
            </div>

          </div>
        </CardContent>

        <div className="flex shrink-0 flex-col justify-between gap-5 border-t border-[#EAE7E2] px-5 py-6 dark:border-[#374347] sm:flex-row sm:items-center md:w-[230px] md:flex-col md:items-end md:border-l md:border-t-0">

          <div className="md:text-right">
            <p className="flex items-center gap-2 text-xs font-medium text-[#929797] md:justify-end">
              <Wallet size={16} />
              Total Price
            </p>

            <p className="mt-2 text-2xl font-extrabold text-[#202729] dark:text-white">
              ${booking.totalPrice.toFixed(2)}
            </p>

            <p className="mt-1 text-xs text-[#929797] dark:text-[#9AA6A2]">
              ${booking.hourlyRate.toFixed(2)} / hour
            </p>
          </div>

          {booking.status === "Pending" && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setCancelOpen(true)}
              className="h-10 w-full rounded-lg border-red-200 px-5 font-semibold text-red-600 transition-colors hover:border-red-500 hover:bg-red-50 hover:text-red-700 dark:border-red-900/60 dark:bg-transparent dark:text-red-400 dark:hover:border-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-300 sm:w-auto"
            >
              <XCircle size={17} />
              Cancel Booking
            </Button>
          )}

        </div>
      </Card>

      <AlertDialog
        open={cancelOpen}
        onOpenChange={(value) => {
          if (!isCancelling) {
            setCancelOpen(value);
          }
        }}
      >
        <AlertDialogContent className="max-h-[85vh] w-[calc(100%-2rem)] max-w-[440px] overflow-y-auto rounded-2xl border border-[#EAE7E2] bg-white p-5 shadow-xl dark:border-[#374347] dark:bg-[#1C2629] sm:p-7">

          <AlertDialogHeader className="gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400">
              <AlertTriangle size={27} strokeWidth={1.8} />
            </div>

            <AlertDialogTitle className="text-xl font-extrabold text-[#202729] dark:text-white">
              Cancel This Booking?
            </AlertDialogTitle>

            <AlertDialogDescription className="break-words text-sm leading-7 text-[#777D7D] dark:text-[#B5BDBA]">
              Are you sure you want to cancel your reservation for{" "}
              <span className="font-bold text-[#202729] dark:text-white">
                {booking.studioTitle}
              </span>
              ? Your booking status will change to Cancelled.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-5 flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <AlertDialogCancel
              disabled={isCancelling}
              className="h-10 w-full rounded-lg border-[#EAE7E2] px-5 font-semibold text-[#202729] hover:bg-[#F5F3EE] dark:border-[#465457] dark:bg-[#263437] dark:text-white dark:hover:bg-[#334347] sm:w-auto"
            >
              Keep Booking
            </AlertDialogCancel>

            <Button
              type="button"
              variant="destructive"
              onClick={handleCancel}
              disabled={isCancelling}
              className="h-10 w-full rounded-lg bg-red-600 px-5 font-semibold text-white hover:bg-red-700 sm:w-auto"
            >
              <XCircle size={16} />
              {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
            </Button>

          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

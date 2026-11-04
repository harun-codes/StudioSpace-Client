
"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  CalendarDays,
  Clock3,
  Wallet,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { apiClient } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

type BookingModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studioId: string;
  studioTitle: string;
  hourlyRate: number;
};

const inputClass =
  "h-11 w-full rounded-xl border-[#EAE7E2] bg-[#F8F7F4] text-sm text-[#202729] focus-visible:border-[#F16F50] focus-visible:ring-[#F16F50]/15 dark:border-[#465457] dark:bg-[#233034] dark:text-white dark:[color-scheme:dark]";

export default function BookingModal({
  open,
  onOpenChange,
  studioId,
  studioTitle,
  hourlyRate,
}: BookingModalProps) {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toMinutes = (time: string) => {
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
      return null;
    }

    const [hours, minutes] = time.split(":").map(Number);

    return hours * 60 + minutes;
  };

  const startMinutes = toMinutes(startTime);
  const endMinutes = toMinutes(endTime);

  const duration =
    startMinutes !== null &&
    endMinutes !== null &&
    endMinutes > startMinutes
      ? (endMinutes - startMinutes) / 60
      : 0;

  const totalPrice = duration * hourlyRate;

  const invalidTime =
    Boolean(startTime) &&
    Boolean(endTime) &&
    duration === 0;

  const handleBooking = async () => {
    if (isSubmitting) return;

    if (!session?.user) {
      const returnTo =
        `${window.location.pathname}${window.location.search}`;

      router.push(
        `/login?callbackURL=${encodeURIComponent(returnTo)}`
      );

      return;
    }

    if (
      !bookingDate ||
      !startTime ||
      !endTime ||
      duration <= 0
    ) {
      toast.error("Please select a valid booking date and time.");
      return;
    }

    if (
      !studioId ||
      !Number.isFinite(hourlyRate) ||
      hourlyRate <= 0
    ) {
      toast.error("Invalid studio information.");
      return;
    }

    setIsSubmitting(true);

    try {
      const tokenResult = await authClient.token();

      const token = tokenResult.data?.token;

      if (tokenResult.error || !token) {
        toast.error(
          "Your session has expired. Please sign in again."
        );

        const returnTo =
          `${window.location.pathname}${window.location.search}`;

        router.push(
          `/login?callbackURL=${encodeURIComponent(returnTo)}`
        );

        return;
      }

      const bookingData = {
        studioId,
        bookingDate,
        startTime,
        endTime,
      };

      const response = await apiClient("/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json().catch(() => null);

      if (response.status === 401) {
        toast.error(
          "Your authentication token is invalid or expired. Please sign in again."
        );

        const returnTo =
          `${window.location.pathname}${window.location.search}`;

        router.push(
          `/login?callbackURL=${encodeURIComponent(returnTo)}`
        );

        return;
      }

      if (!response.ok) {
        throw new Error(
          result?.message || "Failed to create booking."
        );
      }

      toast.success("Booking submitted successfully!");

      onOpenChange(false);
      setBookingDate("");
      setStartTime("");
      setEndTime("");

      router.push("/my-bookings");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] w-[calc(100%-1.5rem)] max-w-[540px] overflow-y-auto rounded-2xl border border-[#EAE7E2] bg-white p-0 transition-colors duration-300 dark:border-[#374347] dark:bg-[#1C2629] sm:w-full">

        <DialogHeader className="border-b border-[#EAE7E2] px-4 py-5 text-left dark:border-[#374347] sm:px-8 sm:py-6">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F16F50]/10 text-[#F16F50]">
              <CalendarDays size={22} />
            </div>

            <DialogTitle className="text-lg font-extrabold text-[#202729] dark:text-white sm:text-xl">
              Book Your Workspace
            </DialogTitle>
          </div>

          <DialogDescription className="text-sm leading-6 text-[#777D7D] dark:text-[#B5BDBA]">
            Select your preferred date and time to reserve this creative studio.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 px-4 py-5 sm:space-y-6 sm:px-8 sm:py-6">

          <div className="rounded-xl border border-[#EAE7E2] bg-[#F8F7F4] px-4 py-4 dark:border-[#374347] dark:bg-[#233034]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#F16F50]">
              Selected Studio
            </p>

            <h3 className="mt-2 break-words text-base font-bold text-[#202729] dark:text-white">
              {studioTitle}
            </h3>

            <p className="mt-1 text-sm text-[#777D7D] dark:text-[#B5BDBA]">
              ${hourlyRate.toFixed(2)} / hour
            </p>
          </div>

          <FieldGroup className="gap-5">
            <Field>
              <FieldLabel
                htmlFor="bookingDate"
                className="flex items-center gap-2 text-sm font-semibold text-[#202729] dark:text-[#E6E8E8]"
              >
                <CalendarDays size={16} className="text-[#F16F50]" />
                Booking Date
              </FieldLabel>

              <Input
                id="bookingDate"
                name="bookingDate"
                type="date"
                value={bookingDate}
                onChange={(event) =>
                  setBookingDate(event.target.value)
                }
                required
                className={inputClass}
              />
            </Field>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel
                  htmlFor="startTime"
                  className="flex items-center gap-2 text-sm font-semibold text-[#202729] dark:text-[#E6E8E8]"
                >
                  <Clock3 size={16} className="text-[#F16F50]" />
                  Start Time
                </FieldLabel>

                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={startTime}
                  onChange={(event) =>
                    setStartTime(event.target.value)
                  }
                  required
                  className={inputClass}
                />
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="endTime"
                  className="flex items-center gap-2 text-sm font-semibold text-[#202729] dark:text-[#E6E8E8]"
                >
                  <Clock3 size={16} className="text-[#F16F50]" />
                  End Time
                </FieldLabel>

                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={endTime}
                  onChange={(event) =>
                    setEndTime(event.target.value)
                  }
                  required
                  className={inputClass}
                />
              </Field>
            </div>

            {invalidTime && (
              <p className="text-xs font-medium text-red-600 dark:text-red-400">
                End time must be later than start time.
              </p>
            )}
          </FieldGroup>

          <div className="rounded-xl border border-[#EAE7E2] bg-[#F8F7F4] p-4 dark:border-[#374347] dark:bg-[#233034] sm:p-5">
            <div className="mb-4 flex items-center gap-2">
              <Wallet size={19} className="text-[#F16F50]" />

              <h3 className="text-base font-bold text-[#202729] dark:text-white">
                Booking Summary
              </h3>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[#777D7D] dark:text-[#B5BDBA]">
                  Hourly Rate
                </span>

                <span className="font-semibold text-[#202729] dark:text-[#E6E8E8]">
                  ${hourlyRate.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-[#777D7D] dark:text-[#B5BDBA]">
                  Duration
                </span>

                <span className="font-semibold text-[#202729] dark:text-[#E6E8E8]">
                  {duration > 0
                    ? `${duration.toFixed(2)} hours`
                    : "—"}
                </span>
              </div>

              <div className="border-t border-[#EAE7E2] pt-4 dark:border-[#465457]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-base font-bold text-[#202729] dark:text-white">
                    Total Price
                  </span>

                  <span className="text-xl font-extrabold text-[#F16F50] sm:text-2xl">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="flex items-start gap-2 text-xs leading-5 text-[#777D7D] dark:text-[#B5BDBA]">
            <CheckCircle2
              size={16}
              className="mt-0.5 shrink-0 text-[#F16F50]"
            />
            New reservations will initially have Pending status.
          </p>

          <DialogFooter className="flex-col-reverse gap-3 border-t border-[#EAE7E2] pt-5 dark:border-[#374347] sm:flex-row">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
              className="h-11 w-full rounded-xl border-[#EAE7E2] font-semibold text-[#202729] hover:bg-[#F8F7F4] dark:border-[#465457] dark:bg-[#233034] dark:text-white dark:hover:bg-[#2B3B3F] sm:w-auto"
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleBooking}
              disabled={
                isSubmitting ||
                !bookingDate ||
                duration <= 0
              }
              className="h-11 w-full rounded-xl bg-[#F16F50] px-7 font-semibold text-white hover:bg-[#DF5D40] sm:w-auto"
            >
              {isSubmitting
                ? "Submitting..."
                : "Confirm Booking"}
            </Button>
          </DialogFooter>

        </div>
      </DialogContent>
    </Dialog>
  );
}

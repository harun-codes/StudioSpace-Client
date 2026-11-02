
"use client";

import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";

import {
  Pencil,
  Building2,
  DollarSign,
  ImagePlus,
  UserRound,
  Save,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";

type Studio = {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  imageUrl: string;
  overview: string;
  amenities: string[];
  ownerName: string;
  ownerEmail: string;
  isActive?: boolean;
};

type UpdateEditProps = {
  studio: Studio;
  onUpdated: (updatedStudio: Studio) => void;
};

const categories = [
  { label: "Photo Studio", value: "Photo Studio" },
  { label: "Film Stage", value: "Film Stage" },
  { label: "Podcast Lounge", value: "Podcast Lounge" },
  { label: "Music Suite", value: "Music Suite" },
  { label: "Workshop", value: "Workshop" },
];

const amenityOptions = [
  "Wi-Fi",
  "Air Conditioning",
  "Lighting Equipment",
  "Cameras",
  "Microphones",
  "Soundproofing",
  "Mixing Console",
  "Props & Backdrops",
  "Changing Room",
  "Parking",
  "Restroom",
  "Projector",
];

const inputClass =
  "h-11 w-full rounded-xl border-[#EAE7E2] bg-[#F8F7F4] text-sm text-[#202729] focus-visible:border-[#F16F50] focus-visible:ring-[#F16F50]/15";

const labelClass = "text-sm font-semibold text-[#202729]";

export default function UpdateEdit({
  studio,
  onUpdated,
}: UpdateEditProps) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(studio.category);
  const [amenities, setAmenities] = useState<string[]>(
    studio.amenities || []
  );
  const [formVersion, setFormVersion] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const openEditor = () => {
    setCategory(studio.category);
    setAmenities(studio.amenities || []);
    setFormVersion((previous) => previous + 1);
    setOpen(true);
  };

  const handleAmenityChange = (
    amenity: string,
    checked: boolean
  ) => {
    setAmenities((previous) =>
      checked
        ? [...previous.filter((item) => item !== amenity), amenity]
        : previous.filter((item) => item !== amenity)
    );
  };

  const handleUpdate = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isSaving) return;

    const formData = new FormData(event.currentTarget);

    const updatedData = {
      title: String(formData.get("title") || "").trim(),
      category,
      hourlyRate: Number(formData.get("hourlyRate")),
      securityDeposit: Number(formData.get("securityDeposit")),
      maxCapacity: Number(formData.get("maxCapacity")),
      location: String(formData.get("location") || "").trim(),
      imageUrl: String(formData.get("imageUrl") || "").trim(),
      overview: String(formData.get("overview") || "").trim(),
      amenities,
    };

    if (!category) {
      toast.error("Please select a studio category.");
      return;
    }

    if (amenities.length === 0) {
      toast.error("Please select at least one amenity.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(
        `http://localhost:5000/my-listings/${studio._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update studio."
        );
      }

      if (result.matchedCount === 0) {
        throw new Error("Studio not found.");
      }

      onUpdated({
        ...studio,
        ...updatedData,
      });

      setOpen(false);

      toast.success("Studio updated successfully!", {
        duration: 4000,
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={openEditor}
        className="h-9 gap-1 rounded-lg border-[#EAE7E2] px-2.5 text-xs font-semibold text-[#202729] hover:border-[#F16F50] hover:text-[#F16F50]"
      >
        <Pencil size={15} />
        Edit
      </Button>

      <Dialog
        open={open}
        onOpenChange={(value) => {
          if (!isSaving) {
            setOpen(value);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border-[#EAE7E2] bg-white p-0 sm:max-w-[720px]">
          <DialogHeader className="border-b border-[#EAE7E2] px-6 pb-5 pt-7 sm:px-8">
            <div className="mb-2 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F16F50]/10 text-[#F16F50]">
                <Pencil size={20} />
              </span>

              <DialogTitle className="text-xl font-extrabold text-[#202729]">
                Update Studio
              </DialogTitle>
            </div>

            <DialogDescription className="text-sm text-[#777D7D]">
              Review and edit your existing studio information.
            </DialogDescription>
          </DialogHeader>

          <form
            key={formVersion}
            onSubmit={handleUpdate}
            className="space-y-7 px-6 py-6 sm:px-8"
          >
            <section className="space-y-5">
              <div className="flex items-center gap-3">
                <Building2
                  size={19}
                  className="text-[#F16F50]"
                />

                <h3 className="text-base font-bold text-[#202729]">
                  Basic Information
                </h3>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel
                    htmlFor="edit-title"
                    className={labelClass}
                  >
                    Studio Title
                  </FieldLabel>

                  <Input
                    id="edit-title"
                    name="title"
                    defaultValue={studio.title}
                    minLength={5}
                    maxLength={120}
                    required
                    className={inputClass}
                  />
                </Field>

                <Field>
                  <FieldLabel
                    htmlFor="edit-category"
                    className={labelClass}
                  >
                    Studio Category
                  </FieldLabel>

                  <Select
                    items={categories}
                    value={category}
                    onValueChange={(value) =>
                      setCategory(value ?? "")
                    }
                  >
                    <SelectTrigger
                      id="edit-category"
                      className={inputClass}
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>

                    <SelectContent>
                      {categories.map((item) => (
                        <SelectItem
                          key={item.value}
                          value={item.value}
                        >
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field className="sm:col-span-2">
                  <FieldLabel
                    htmlFor="edit-location"
                    className={labelClass}
                  >
                    Location / Address
                  </FieldLabel>

                  <Input
                    id="edit-location"
                    name="location"
                    defaultValue={studio.location}
                    required
                    className={inputClass}
                  />
                </Field>
              </div>
            </section>

            <section className="space-y-5 border-t border-[#EAE7E2] pt-6">
              <div className="flex items-center gap-3">
                <DollarSign
                  size={19}
                  className="text-[#F16F50]"
                />

                <h3 className="text-base font-bold text-[#202729]">
                  Pricing & Capacity
                </h3>
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <Field>
                  <FieldLabel
                    htmlFor="edit-hourlyRate"
                    className={labelClass}
                  >
                    Hourly Rate ($)
                  </FieldLabel>

                  <Input
                    id="edit-hourlyRate"
                    name="hourlyRate"
                    type="number"
                    min="1"
                    step="0.01"
                    defaultValue={studio.hourlyRate}
                    required
                    className={inputClass}
                  />
                </Field>

                <Field>
                  <FieldLabel
                    htmlFor="edit-securityDeposit"
                    className={labelClass}
                  >
                    Security Deposit ($)
                  </FieldLabel>

                  <Input
                    id="edit-securityDeposit"
                    name="securityDeposit"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={studio.securityDeposit}
                    required
                    className={inputClass}
                  />
                </Field>

                <Field>
                  <FieldLabel
                    htmlFor="edit-maxCapacity"
                    className={labelClass}
                  >
                    Max Capacity
                  </FieldLabel>

                  <Input
                    id="edit-maxCapacity"
                    name="maxCapacity"
                    type="number"
                    min="1"
                    step="1"
                    defaultValue={studio.maxCapacity}
                    required
                    className={inputClass}
                  />
                </Field>
              </div>
            </section>

            <section className="space-y-5 border-t border-[#EAE7E2] pt-6">
              <div className="flex items-center gap-3">
                <ImagePlus
                  size={19}
                  className="text-[#F16F50]"
                />

                <h3 className="text-base font-bold text-[#202729]">
                  Studio Image & Overview
                </h3>
              </div>

              <Field>
                <FieldLabel
                  htmlFor="edit-imageUrl"
                  className={labelClass}
                >
                  Studio Image URL
                </FieldLabel>

                <Input
                  id="edit-imageUrl"
                  name="imageUrl"
                  type="url"
                  defaultValue={studio.imageUrl}
                  required
                  className={inputClass}
                />
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="edit-overview"
                  className={labelClass}
                >
                  Detailed Overview
                </FieldLabel>

                <Textarea
                  id="edit-overview"
                  name="overview"
                  rows={5}
                  minLength={20}
                  defaultValue={studio.overview}
                  required
                  className="min-h-32 resize-y rounded-xl border-[#EAE7E2] bg-[#F8F7F4] text-sm leading-7 text-[#202729] focus-visible:border-[#F16F50] focus-visible:ring-[#F16F50]/15"
                />
              </Field>
            </section>

            <section className="space-y-4 border-t border-[#EAE7E2] pt-6">
              <h3 className="text-base font-bold text-[#202729]">
                Amenities & Equipment
              </h3>

              <p className="text-sm text-[#777D7D]">
                Modify the available facilities and equipment.
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                {amenityOptions.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#EAE7E2] bg-[#F8F7F4] px-4 py-3 transition-colors hover:border-[#F16F50]/50"
                  >
                    <Checkbox
                      checked={amenities.includes(amenity)}
                      onCheckedChange={(checked) =>
                        handleAmenityChange(
                          amenity,
                          checked === true
                        )
                      }
                      className="border-[#B4B8B5] data-checked:border-[#F16F50] data-checked:bg-[#F16F50]"
                    />

                    <span className="text-sm font-medium text-[#202729]">
                      {amenity}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <section className="space-y-5 border-t border-[#EAE7E2] pt-6">
              <div className="flex items-center gap-3">
                <UserRound
                  size={19}
                  className="text-[#F16F50]"
                />

                <h3 className="text-base font-bold text-[#202729]">
                  Host Information
                </h3>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel
                    htmlFor="edit-ownerName"
                    className={labelClass}
                  >
                    User Name
                  </FieldLabel>

                  <Input
                    id="edit-ownerName"
                    value={studio.ownerName || ""}
                    readOnly
                    className={`${inputClass} cursor-default bg-[#F0F0ED]`}
                  />
                </Field>

                <Field>
                  <FieldLabel
                    htmlFor="edit-ownerEmail"
                    className={labelClass}
                  >
                    User Email
                  </FieldLabel>

                  <Input
                    id="edit-ownerEmail"
                    value={studio.ownerEmail || ""}
                    readOnly
                    className={`${inputClass} cursor-default bg-[#F0F0ED]`}
                  />
                </Field>
              </div>
            </section>

            <DialogFooter className="gap-3 border-t border-[#EAE7E2] pt-6">
              <Button
                type="button"
                variant="outline"
                disabled={isSaving}
                onClick={() => setOpen(false)}
                className="h-11 rounded-xl border-[#EAE7E2] px-6 font-semibold"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSaving}
                className="h-11 rounded-xl bg-[#F16F50] px-7 font-semibold text-white hover:bg-[#DF5D40]"
              >
                <Save size={17} />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

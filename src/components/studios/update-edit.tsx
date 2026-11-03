"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import toast from "react-hot-toast";

import {
  Pencil,
  Building2,
  DollarSign,
  ImagePlus,
  UserRound,
  Save,
  Upload,
  X,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";

import { apiClient } from "@/lib/api-client";
import { uploadImage } from "@/lib/upload-image";

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
  "h-11 w-full min-w-0 rounded-xl border-[#EAE7E2] bg-[#F8F7F4] text-sm text-[#202729] placeholder:text-[#929797] focus-visible:border-[#F16F50] focus-visible:ring-[#F16F50]/15 dark:border-[#465457] dark:bg-[#233034] dark:text-white dark:placeholder:text-[#8B9694]";

const labelClass =
  "text-sm font-semibold text-[#202729] dark:text-[#E6E8E8]";

const sectionClass =
  "space-y-5 border-t border-[#EAE7E2] pt-6 dark:border-[#374347]";

export default function UpdateEdit({
  studio,
  onUpdated,
}: UpdateEditProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(studio.category);
  const [amenities, setAmenities] = useState<string[]>(
    studio.amenities || []
  );
  const [imageUrl, setImageUrl] = useState(studio.imageUrl || "");
  const [formVersion, setFormVersion] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const imageChanged = imageUrl !== (studio.imageUrl || "");

  const openEditor = () => {
    setCategory(studio.category);
    setAmenities(studio.amenities || []);
    setImageUrl(studio.imageUrl || "");
    setFormVersion((previous) => previous + 1);
    setOpen(true);
  };

  const handleImageUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.currentTarget;
    const file = input.files?.[0];

    if (!file || isUploading || isSaving) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG and WebP images are allowed.");
      input.value = "";
      return;
    }

    if (file.size === 0 || file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be under 10MB.");
      input.value = "";
      return;
    }

    setIsUploading(true);

    try {
      const uploadedImageUrl = await uploadImage(file);

      setImageUrl(uploadedImageUrl);

      toast.success("New image uploaded successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to upload image."
      );
    } finally {
      setIsUploading(false);
      input.value = "";
    }
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

    if (isSaving || isUploading) return;

    if (!category) {
      toast.error("Please select a studio category.");
      return;
    }

    if (!imageUrl) {
      toast.error("Please upload a studio image.");
      return;
    }

    if (amenities.length === 0) {
      toast.error("Please select at least one amenity.");
      return;
    }

    const formData = new FormData(event.currentTarget);

    const updatedData = {
      title: String(formData.get("title") || "").trim(),
      category,
      hourlyRate: Number(formData.get("hourlyRate")),
      securityDeposit: Number(formData.get("securityDeposit")),
      maxCapacity: Number(formData.get("maxCapacity")),
      location: String(formData.get("location") || "").trim(),
      imageUrl,
      overview: String(formData.get("overview") || "").trim(),
      amenities,
    };

    if (
      !updatedData.title ||
      !updatedData.location ||
      !updatedData.overview ||
      !Number.isFinite(updatedData.hourlyRate) ||
      updatedData.hourlyRate <= 0 ||
      !Number.isFinite(updatedData.securityDeposit) ||
      updatedData.securityDeposit < 0 ||
      !Number.isInteger(updatedData.maxCapacity) ||
      updatedData.maxCapacity < 1
    ) {
      toast.error("Please provide valid studio information.");
      return;
    }

    setIsSaving(true);

    try {

      const response = await apiClient(
        `/my-listings/${studio._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      const contentType = response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        const responseText = await response.text();

        console.error("Unexpected server response:", responseText);

        throw new Error(
          `Server returned an invalid response (${response.status}). Check the API URL and backend route.`
        );
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update studio."
        );
      }

      if (result.matchedCount === 0) {
        throw new Error("Studio not found or access denied.");
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
        className="h-9 gap-1 rounded-lg border-[#EAE7E2] px-2.5 text-xs font-semibold text-[#202729] hover:border-[#F16F50] hover:text-[#F16F50] dark:border-[#465457] dark:bg-[#233034] dark:text-white dark:hover:border-[#F16F50] dark:hover:text-[#F16F50]"
      >
        <Pencil size={15} />
        Edit
      </Button>

      <Dialog
        open={open}
        onOpenChange={(value) => {
          if (!isSaving && !isUploading) {
            setOpen(value);
          }
        }}
      >
        <DialogContent className="max-h-[90dvh] w-[calc(100%-1.5rem)] max-w-[720px] overflow-y-auto rounded-2xl border border-[#EAE7E2] bg-white p-0 transition-colors duration-300 dark:border-[#374347] dark:bg-[#1C2629] sm:w-full sm:max-w-[720px]">
          <DialogHeader className="border-b border-[#EAE7E2] px-4 pb-5 pt-6 text-left dark:border-[#374347] sm:px-8 sm:pt-7">
            <div className="mb-2 flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F16F50]/10 text-[#F16F50]">
                <Pencil size={20} />
              </span>

              <DialogTitle className="text-xl font-extrabold text-[#202729] dark:text-white">
                Update Studio
              </DialogTitle>
            </div>

            <DialogDescription className="text-sm leading-6 text-[#777D7D] dark:text-[#B5BDBA]">
              Review and edit your existing studio information.
            </DialogDescription>
          </DialogHeader>

          <form
            key={formVersion}
            onSubmit={handleUpdate}
            className="space-y-7 px-4 py-6 sm:px-8"
          >
            <section className="space-y-5">
              <div className="flex items-center gap-3">
                <Building2
                  size={19}
                  className="shrink-0 text-[#F16F50]"
                />

                <h3 className="text-base font-bold text-[#202729] dark:text-white">
                  Basic Information
                </h3>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field className="min-w-0">
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

                <Field className="min-w-0">
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
                      className={`${inputClass} justify-between`}
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>

                    <SelectContent className="border-[#EAE7E2] bg-white dark:border-[#465457] dark:bg-[#233034]">
                      {categories.map((item) => (
                        <SelectItem
                          key={item.value}
                          value={item.value}
                          className="text-sm text-[#202729] dark:text-white dark:focus:bg-[#374347] dark:focus:text-white"
                        >
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field className="min-w-0 sm:col-span-2">
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

            <section className={sectionClass}>
              <div className="flex items-center gap-3">
                <DollarSign
                  size={19}
                  className="shrink-0 text-[#F16F50]"
                />

                <h3 className="text-base font-bold text-[#202729] dark:text-white">
                  Pricing & Capacity
                </h3>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <Field className="min-w-0">
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

                <Field className="min-w-0">
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

                <Field className="min-w-0">
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

            <section className={sectionClass}>
              <div className="flex items-center gap-3">
                <ImagePlus
                  size={19}
                  className="shrink-0 text-[#F16F50]"
                />

                <h3 className="text-base font-bold text-[#202729] dark:text-white">
                  Studio Image & Overview
                </h3>
              </div>

              <Field className="min-w-0">
                <FieldLabel className={labelClass}>
                  Studio Image
                </FieldLabel>

                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  disabled={isUploading || isSaving}
                  className="sr-only"
                  aria-label="Upload studio image"
                />

                {!imageUrl ? (
                  <button
                    type="button"
                    disabled={isUploading || isSaving}
                    onClick={() => imageInputRef.current?.click()}
                    className="flex min-h-36 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#DAD6CF] bg-[#F8F7F4] p-5 text-center transition-colors hover:border-[#F16F50] hover:bg-[#F16F50]/5 disabled:cursor-not-allowed disabled:opacity-70 dark:border-[#465457] dark:bg-[#233034] dark:hover:border-[#F16F50]"
                  >
                    {isUploading ? (
                      <>
                        <LoaderCircle
                          size={30}
                          className="animate-spin text-[#F16F50]"
                        />

                        <span className="mt-3 text-sm font-bold text-[#202729] dark:text-white">
                          Uploading your image...
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F16F50]/10 text-[#F16F50]">
                          <Upload size={23} />
                        </div>

                        <span className="mt-3 text-sm font-bold text-[#202729] dark:text-white">
                          Click to upload an image
                        </span>

                        <span className="mt-2 text-xs text-[#929797] dark:text-[#8B9694]">
                          JPG, PNG or WebP · Maximum 10 MB
                        </span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="overflow-hidden rounded-xl border border-[#EAE7E2] dark:border-[#465457]">
                    <div className="relative">
                      <img
                        src={imageUrl}
                        alt={`${studio.title} image preview`}
                        className="h-48 w-full object-cover sm:h-64"
                      />

                      <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-[#202729]/85 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm">
                        {isUploading ? (
                          <>
                            <LoaderCircle
                              size={15}
                              className="animate-spin"
                            />
                            Uploading...
                          </>
                        ) : imageChanged ? (
                          <>
                            <CheckCircle2
                              size={15}
                              className="text-green-400"
                            />
                            New Image Ready
                          </>
                        ) : (
                          <>
                            <CheckCircle2
                              size={15}
                              className="text-green-400"
                            />
                            Current Studio Image
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EAE7E2] bg-[#F8F7F4] p-3 dark:border-[#465457] dark:bg-[#233034] sm:p-4">
                      <p className="text-xs leading-5 text-[#777D7D] dark:text-[#B5BDBA]">
                        {imageChanged
                          ? "The new image will be saved when you update the studio."
                          : "This is your currently saved studio image."}
                      </p>

                      <div className="flex flex-wrap items-center gap-2">
                        {imageChanged && (
                          <button
                            type="button"
                            disabled={isUploading || isSaving}
                            onClick={() =>
                              setImageUrl(studio.imageUrl || "")
                            }
                            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#EAE7E2] bg-white px-3 text-xs font-bold text-[#202729] transition hover:border-[#F16F50] hover:text-[#F16F50] disabled:opacity-60 dark:border-[#465457] dark:bg-[#1C2629] dark:text-white dark:hover:border-[#F16F50] dark:hover:text-[#F16F50]"
                          >
                            <X size={15} />
                            Restore Original
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={isUploading || isSaving}
                          onClick={() => imageInputRef.current?.click()}
                          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#F16F50] px-3 text-xs font-bold text-white transition hover:bg-[#DF5D40] disabled:opacity-60"
                        >
                          {isUploading ? (
                            <LoaderCircle
                              size={15}
                              className="animate-spin"
                            />
                          ) : (
                            <Upload size={15} />
                          )}
                          {isUploading ? "Uploading..." : "Change Image"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-xs leading-5 text-[#929797] dark:text-[#8B9694]">
                  Upload a JPG, PNG or WebP image under 10 MB.
                  The image URL will be saved through ImgBB.
                </p>
              </Field>

              <Field className="min-w-0">
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
                  className="min-h-32 w-full resize-y rounded-xl border-[#EAE7E2] bg-[#F8F7F4] text-sm leading-7 text-[#202729] placeholder:text-[#929797] focus-visible:border-[#F16F50] focus-visible:ring-[#F16F50]/15 dark:border-[#465457] dark:bg-[#233034] dark:text-white dark:placeholder:text-[#8B9694]"
                />
              </Field>
            </section>

            <section className={sectionClass}>
              <h3 className="text-base font-bold text-[#202729] dark:text-white">
                Amenities & Equipment
              </h3>

              <p className="text-sm text-[#777D7D] dark:text-[#B5BDBA]">
                Modify the available facilities and equipment.
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                {amenityOptions.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex min-w-0 cursor-pointer items-center gap-3 rounded-xl border border-[#EAE7E2] bg-[#F8F7F4] px-3 py-3 transition-colors hover:border-[#F16F50]/50 dark:border-[#374347] dark:bg-[#233034] dark:hover:border-[#F16F50] sm:px-4"
                  >
                    <Checkbox
                      checked={amenities.includes(amenity)}
                      onCheckedChange={(checked) =>
                        handleAmenityChange(
                          amenity,
                          checked === true
                        )
                      }
                      className="shrink-0 border-[#B4B8B5] data-checked:border-[#F16F50] data-checked:bg-[#F16F50] dark:border-[#697775] dark:data-checked:border-[#F16F50] dark:data-checked:bg-[#F16F50]"
                    />

                    <span className="break-words text-sm font-medium text-[#202729] dark:text-[#E6E8E8]">
                      {amenity}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <section className={sectionClass}>
              <div className="flex items-center gap-3">
                <UserRound
                  size={19}
                  className="shrink-0 text-[#F16F50]"
                />

                <h3 className="text-base font-bold text-[#202729] dark:text-white">
                  Host Information
                </h3>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field className="min-w-0">
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
                    className={`${inputClass} cursor-default bg-[#F0F0ED] dark:bg-[#293638]`}
                  />
                </Field>

                <Field className="min-w-0">
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
                    className={`${inputClass} cursor-default bg-[#F0F0ED] dark:bg-[#293638]`}
                  />
                </Field>
              </div>
            </section>

            <DialogFooter className="flex flex-col-reverse gap-3 border-t border-[#EAE7E2] pt-6 dark:border-[#374347] sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={isSaving || isUploading}
                onClick={() => setOpen(false)}
                className="h-11 w-full rounded-xl border-[#EAE7E2] px-6 font-semibold text-[#202729] dark:border-[#465457] dark:bg-[#233034] dark:text-white dark:hover:bg-[#2B3B3F] sm:w-auto"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSaving || isUploading}
                className="h-11 w-full rounded-xl bg-[#F16F50] px-7 font-semibold text-white hover:bg-[#DF5D40] sm:w-auto"
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
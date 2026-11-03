
"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

import {
  ArrowUpRight,
  Building2,
  DollarSign,
  ImagePlus,
  MapPin,
  UserRound,
  Mail,
  CheckCircle2,
  Upload,
  X,
  LoaderCircle,
} from "lucide-react";

import { apiClient } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { uploadImage } from "@/lib/upload-image";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categoryOptions = [
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

const sectionBorderClass =
  "border-t border-[#EAE7E2] pt-7 dark:border-[#374347]";

export default function AddStudioForm() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [category, setCategory] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = session?.user;

  const handleImageUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.currentTarget;
    const file = input.files?.[0];

    if (!file || isUploading || isSubmitting) return;

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

      toast.success("Image uploaded successfully!");
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
    setSelectedAmenities((previous) =>
      checked
        ? [...previous.filter((item) => item !== amenity), amenity]
        : previous.filter((item) => item !== amenity)
    );
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isSubmitting || isUploading) return;

    if (!user?.email) {
      toast.error("Please login before adding a studio.");
      return;
    }

    if (!category) {
      toast.error("Please select a studio category.");
      return;
    }

    if (!imageUrl) {
      toast.error("Please upload a studio image.");
      return;
    }

    if (selectedAmenities.length === 0) {
      toast.error("Please select at least one amenity.");
      return;
    }

    const formData = new FormData(event.currentTarget);

    const studioData = {
      title: String(formData.get("title") || "").trim(),
      category,
      hourlyRate: Number(formData.get("hourlyRate")),
      securityDeposit: Number(formData.get("securityDeposit")),
      maxCapacity: Number(formData.get("maxCapacity")),
      location: String(formData.get("location") || "").trim(),
      imageUrl,
      overview: String(formData.get("overview") || "").trim(),
      amenities: selectedAmenities,
      ownerName: user.name,
      ownerEmail: user.email.trim().toLowerCase(),
      isActive: true,
      rating: 0,
      reviewCount: 0,
      reviews: [],
      galleryImages: [],
      createdAt: new Date().toISOString(),
    };

    setIsSubmitting(true);

    try {
      const response = await apiClient(
        "/add-studios",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(studioData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to add studio."
        );
      }

      toast.success("Studio added successfully!", {
        duration: 4500,
      });

      router.push("/my-listings");
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
    <Card className="w-full min-w-0 gap-0 overflow-hidden rounded-2xl border border-[#EAE7E2] bg-white py-0 shadow-sm transition-colors duration-300 dark:border-[#374347] dark:bg-[#1C2629]">
      <CardHeader className="border-b border-[#EAE7E2] px-5 py-6 dark:border-[#374347] sm:px-8 sm:py-7">
        <CardTitle className="text-xl font-bold text-[#202729] dark:text-white">
          Studio Listing Information
        </CardTitle>

        <CardDescription className="mt-2 text-sm leading-6 text-[#777D7D] dark:text-[#B5BDBA]">
          Complete the details below to list your creative workspace.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-4 py-6 sm:px-8 sm:py-8">
        <form onSubmit={handleSubmit}>
          <FieldGroup className="gap-7">
            <section className="min-w-0">
              <div className="mb-5 flex items-center gap-3">
                <Building2
                  size={20}
                  className="shrink-0 text-[#F16F50]"
                />

                <h2 className="text-lg font-bold text-[#202729] dark:text-white">
                  Basic Information
                </h2>
              </div>

              <div className="grid min-w-0 gap-5 sm:grid-cols-2">
                <Field className="min-w-0">
                  <FieldLabel
                    htmlFor="title"
                    className={labelClass}
                  >
                    Studio Title
                  </FieldLabel>

                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter studio title"
                    required
                    minLength={5}
                    maxLength={120}
                    className={inputClass}
                  />
                </Field>

                <Field className="min-w-0">
                  <FieldLabel
                    htmlFor="category"
                    className={labelClass}
                  >
                    Studio Category
                  </FieldLabel>

                  <Select
                    items={categoryOptions}
                    value={category}
                    onValueChange={(value) =>
                      setCategory(value ?? "")
                    }
                  >
                    <SelectTrigger
                      id="category"
                      className={`${inputClass} justify-between`}
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>

                    <SelectContent className="border-[#EAE7E2] bg-white dark:border-[#465457] dark:bg-[#233034]">
                      {categoryOptions.map((item) => (
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
                    htmlFor="location"
                    className={labelClass}
                  >
                    Location / Address
                  </FieldLabel>

                  <div className="relative">
                    <MapPin
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#929797] dark:text-[#8B9694]"
                    />

                    <Input
                      id="location"
                      name="location"
                      placeholder="Street, City, Country"
                      required
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </Field>
              </div>
            </section>

            <section className={sectionBorderClass}>
              <div className="mb-5 flex items-center gap-3">
                <DollarSign
                  size={20}
                  className="shrink-0 text-[#F16F50]"
                />

                <h2 className="text-lg font-bold text-[#202729] dark:text-white">
                  Pricing & Capacity
                </h2>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <Field className="min-w-0">
                  <FieldLabel
                    htmlFor="hourlyRate"
                    className={labelClass}
                  >
                    Hourly Rate ($)
                  </FieldLabel>

                  <Input
                    id="hourlyRate"
                    name="hourlyRate"
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="50"
                    required
                    className={inputClass}
                  />
                </Field>

                <Field className="min-w-0">
                  <FieldLabel
                    htmlFor="securityDeposit"
                    className={labelClass}
                  >
                    Security Deposit ($)
                  </FieldLabel>

                  <Input
                    id="securityDeposit"
                    name="securityDeposit"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue="0"
                    required
                    className={inputClass}
                  />
                </Field>

                <Field className="min-w-0">
                  <FieldLabel
                    htmlFor="maxCapacity"
                    className={labelClass}
                  >
                    Maximum Capacity
                  </FieldLabel>

                  <Input
                    id="maxCapacity"
                    name="maxCapacity"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="10"
                    required
                    className={inputClass}
                  />
                </Field>
              </div>
            </section>

            <section className={sectionBorderClass}>
              <div className="mb-5 flex items-center gap-3">
                <ImagePlus
                  size={20}
                  className="shrink-0 text-[#F16F50]"
                />

                <h2 className="text-lg font-bold text-[#202729] dark:text-white">
                  Studio Image & Overview
                </h2>
              </div>

              <div className="space-y-5">
                <Field className="min-w-0">
                  <FieldLabel className={labelClass}>
                    Upload Studio Image
                  </FieldLabel>

                  {!imageUrl && (
                    <>
                      <label
                        htmlFor="studioImage"
                        className={`flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#DAD6CF] bg-[#F8F7F4] p-5 text-center transition-colors hover:border-[#F16F50] hover:bg-[#F16F50]/5 dark:border-[#465457] dark:bg-[#233034] dark:hover:border-[#F16F50] ${isUploading
                            ? "pointer-events-none opacity-70"
                            : ""
                          }`}
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

                            <span className="mt-1 text-xs text-[#929797] dark:text-[#8B9694]">
                              Please wait
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
                      </label>

                      <Input
                        id="studioImage"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageUpload}
                        disabled={isUploading || isSubmitting}
                        className="sr-only"
                      />
                    </>
                  )}

                  {imageUrl && (
                    <div className="relative overflow-hidden rounded-xl border border-[#EAE7E2] dark:border-[#465457]">
                      <img
                        src={imageUrl}
                        alt="Uploaded studio preview"
                        className="h-56 w-full object-cover sm:h-64"
                      />

                      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-3 bg-[#202729]/85 px-4 py-3 backdrop-blur-sm">
                        <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-white">
                          <CheckCircle2
                            size={17}
                            className="shrink-0 text-green-400"
                          />

                          <span className="truncate">
                            Image uploaded successfully
                          </span>
                        </span>

                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => setImageUrl("")}
                          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-500"
                        >
                          <X size={15} />
                          Remove
                        </button>
                      </div>
                    </div>
                  )}

                  <FieldDescription className="text-xs leading-5 text-[#929797] dark:text-[#8B9694]">
                    Your image will be uploaded to ImgBB and its URL will be saved with your studio listing.
                  </FieldDescription>
                </Field>

                <Field className="min-w-0">
                  <FieldLabel
                    htmlFor="overview"
                    className={labelClass}
                  >
                    Detailed Overview
                  </FieldLabel>

                  <Textarea
                    id="overview"
                    name="overview"
                    placeholder="Describe your studio, equipment, environment and facilities..."
                    rows={5}
                    minLength={20}
                    required
                    className="min-h-32 w-full resize-y rounded-xl border-[#EAE7E2] bg-[#F8F7F4] text-sm leading-7 text-[#202729] placeholder:text-[#929797] focus-visible:border-[#F16F50] focus-visible:ring-[#F16F50]/15 dark:border-[#465457] dark:bg-[#233034] dark:text-white dark:placeholder:text-[#8B9694]"
                  />
                </Field>
              </div>
            </section>

            <section className={sectionBorderClass}>
              <h2 className="text-lg font-bold text-[#202729] dark:text-white">
                Amenities & Equipment
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#777D7D] dark:text-[#B5BDBA]">
                Select the facilities available in your studio.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {amenityOptions.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex min-w-0 cursor-pointer items-center gap-3 rounded-xl border border-[#EAE7E2] bg-[#F8F7F4] px-3 py-3 transition-colors hover:border-[#F16F50]/50 dark:border-[#374347] dark:bg-[#233034] dark:hover:border-[#F16F50] sm:px-4"
                  >
                    <Checkbox
                      checked={selectedAmenities.includes(amenity)}
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

            <section className={sectionBorderClass}>
              <div className="mb-5 flex items-center gap-3">
                <UserRound
                  size={20}
                  className="shrink-0 text-[#F16F50]"
                />

                <h2 className="text-lg font-bold text-[#202729] dark:text-white">
                  Host Information
                </h2>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field className="min-w-0">
                  <FieldLabel
                    htmlFor="ownerName"
                    className={labelClass}
                  >
                    User Name
                  </FieldLabel>

                  <div className="relative">
                    <UserRound
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#929797] dark:text-[#8B9694]"
                    />

                    <Input
                      id="ownerName"
                      value={user?.name || ""}
                      readOnly
                      placeholder={
                        isPending ? "Loading..." : "Not logged in"
                      }
                      className={`${inputClass} bg-[#F0F0ED] pl-11 dark:bg-[#293638]`}
                    />
                  </div>
                </Field>

                <Field className="min-w-0">
                  <FieldLabel
                    htmlFor="ownerEmail"
                    className={labelClass}
                  >
                    User Email
                  </FieldLabel>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#929797] dark:text-[#8B9694]"
                    />

                    <Input
                      id="ownerEmail"
                      value={user?.email || ""}
                      readOnly
                      placeholder={
                        isPending ? "Loading..." : "Not logged in"
                      }
                      className={`${inputClass} bg-[#F0F0ED] pl-11 dark:bg-[#293638]`}
                    />
                  </div>
                </Field>
              </div>

              <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-[#929797] dark:text-[#8B9694]">
                <CheckCircle2
                  size={15}
                  className="mt-0.5 shrink-0 text-[#F16F50]"
                />

                Host details are taken from your Better Auth account.
              </p>

              {!isPending && !user && (
                <p className="mt-3 text-sm text-red-600 dark:text-red-400">
                  Please{" "}
                  <Link
                    href="/login"
                    className="font-semibold underline"
                  >
                    login
                  </Link>{" "}
                  before creating a studio.
                </p>
              )}
            </section>

            <div className="flex justify-end border-t border-[#EAE7E2] pt-7 dark:border-[#374347]">
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  isUploading ||
                  isPending ||
                  !user
                }
                className="h-12 w-full gap-2 rounded-xl bg-[#F16F50] px-8 text-sm font-bold text-white transition hover:bg-[#DF5D40] sm:w-auto"
              >
                {isSubmitting ? "Saving Studio..." : "Save Studio"}

                {!isSubmitting && <ArrowUpRight size={18} />}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

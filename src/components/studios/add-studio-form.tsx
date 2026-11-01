
"use client";

import { useState, type FormEvent } from "react";
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
} from "lucide-react";

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
  "h-11 w-full rounded-xl border-[#EAE7E2] bg-[#F8F7F4] text-sm text-[#202729] focus-visible:border-[#F16F50] focus-visible:ring-[#F16F50]/15";

const labelClass = "text-sm font-semibold text-[#202729]";

export default function AddStudioForm() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [category, setCategory] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = session?.user;

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

    if (isSubmitting) return;

    if (!user?.email) {
      toast.error("Please login before adding a studio.");
      return;
    }

    if (!category) {
      toast.error("Please select a studio category.");
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
      imageUrl: String(formData.get("imageUrl") || "").trim(),
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
      const response = await fetch(
        "http://localhost:5000/add-studios",
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
    <Card className="gap-0 rounded-2xl border border-[#EAE7E2] bg-white py-0 shadow-sm">
      <CardHeader className="border-b border-[#EAE7E2] px-6 py-7 sm:px-8">
        <CardTitle className="text-xl font-bold text-[#202729]">
          Studio Listing Information
        </CardTitle>

        <CardDescription className="mt-2 text-sm text-[#777D7D]">
          Complete the details below to list your creative workspace.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 py-8 sm:px-8">
        <form onSubmit={handleSubmit}>
          <FieldGroup className="gap-7">

            <section>
              <div className="mb-5 flex items-center gap-3">
                <Building2 size={20} className="text-[#F16F50]" />
                <h2 className="text-lg font-bold text-[#202729]">
                  Basic Information
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="title" className={labelClass}>
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

                <Field>
                  <FieldLabel htmlFor="category" className={labelClass}>
                    Studio Category
                  </FieldLabel>

                  <Select
                    items={categoryOptions}
                    value={category}
                    onValueChange={(value) => setCategory(value ?? "")}
                  >
                    <SelectTrigger
                      id="category"
                      className={inputClass}
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>

                    <SelectContent>
                      {categoryOptions.map((item) => (
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

                <Field className="md:col-span-2">
                  <FieldLabel htmlFor="location" className={labelClass}>
                    Location / Address
                  </FieldLabel>

                  <div className="relative">
                    <MapPin
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#929797]"
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

            <section className="border-t border-[#EAE7E2] pt-7">
              <div className="mb-5 flex items-center gap-3">
                <DollarSign size={20} className="text-[#F16F50]" />
                <h2 className="text-lg font-bold text-[#202729]">
                  Pricing & Capacity
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <Field>
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

                <Field>
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

                <Field>
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

            <section className="border-t border-[#EAE7E2] pt-7">
              <div className="mb-5 flex items-center gap-3">
                <ImagePlus size={20} className="text-[#F16F50]" />
                <h2 className="text-lg font-bold text-[#202729]">
                  Studio Image & Overview
                </h2>
              </div>

              <div className="space-y-5">
                <Field>
                  <FieldLabel
                    htmlFor="imageUrl"
                    className={labelClass}
                  >
                    Studio Image URL
                  </FieldLabel>

                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    placeholder="https://example.com/studio.jpg"
                    required
                    className={inputClass}
                  />

                  <FieldDescription>
                    Enter a publicly accessible image URL.
                  </FieldDescription>
                </Field>

                <Field>
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
                    className="min-h-32 resize-y rounded-xl border-[#EAE7E2] bg-[#F8F7F4] text-sm leading-7 text-[#202729] focus-visible:border-[#F16F50] focus-visible:ring-[#F16F50]/15"
                  />
                </Field>
              </div>
            </section>

            <section className="border-t border-[#EAE7E2] pt-7">
              <h2 className="text-lg font-bold text-[#202729]">
                Amenities & Equipment
              </h2>

              <p className="mt-2 text-sm text-[#777D7D]">
                Select the facilities available in your studio.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {amenityOptions.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#EAE7E2] bg-[#F8F7F4] px-4 py-3 transition-colors hover:border-[#F16F50]/50"
                  >
                    <Checkbox
                      checked={selectedAmenities.includes(amenity)}
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

            <section className="border-t border-[#EAE7E2] pt-7">
              <div className="mb-5 flex items-center gap-3">
                <UserRound size={20} className="text-[#F16F50]" />
                <h2 className="text-lg font-bold text-[#202729]">
                  Host Information
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field>
                  <FieldLabel
                    htmlFor="ownerName"
                    className={labelClass}
                  >
                    User Name
                  </FieldLabel>

                  <div className="relative">
                    <UserRound
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#929797]"
                    />

                    <Input
                      id="ownerName"
                      value={user?.name || ""}
                      readOnly
                      placeholder={isPending ? "Loading..." : "Not logged in"}
                      className={`${inputClass} bg-[#F0F0ED] pl-11`}
                    />
                  </div>
                </Field>

                <Field>
                  <FieldLabel
                    htmlFor="ownerEmail"
                    className={labelClass}
                  >
                    User Email
                  </FieldLabel>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#929797]"
                    />

                    <Input
                      id="ownerEmail"
                      value={user?.email || ""}
                      readOnly
                      placeholder={isPending ? "Loading..." : "Not logged in"}
                      className={`${inputClass} bg-[#F0F0ED] pl-11`}
                    />
                  </div>
                </Field>
              </div>

              <p className="mt-3 flex items-center gap-2 text-xs text-[#929797]">
                <CheckCircle2
                  size={15}
                  className="text-[#F16F50]"
                />
                Host details are taken from your Better Auth account.
              </p>

              {!isPending && !user && (
                <p className="mt-3 text-sm text-red-600">
                  Please{" "}
                  <Link href="/login" className="font-semibold underline">
                    login
                  </Link>{" "}
                  before creating a studio.
                </p>
              )}
            </section>

            <div className="flex justify-end border-t border-[#EAE7E2] pt-7">
              <Button
                type="submit"
                disabled={isSubmitting || isPending || !user}
                className="h-12 w-full rounded-xl bg-[#F16F50] px-8 text-sm font-bold text-white hover:bg-[#DF5D40] sm:w-auto"
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


"use client";

import {
    useEffect,
    useRef,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
    ArrowLeft,
    Building2,
    CheckCircle2,
    DollarSign,
    ImagePlus,
    LoaderCircle,
    LockKeyhole,
    MapPin,
    RotateCcw,
    Save,
    Upload,
    UserRound,
} from "lucide-react";

import { apiClient } from "@/lib/api-client";
import { uploadImage } from "@/lib/upload-image";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
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
import { Field, FieldLabel } from "@/components/ui/field";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

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

const sectionClass =
    "border-t border-[#EAE7E2] pt-7 dark:border-[#374347]";

export default function EditStudioPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const studioId = params.id;

    const { data: session, isPending } =
        authClient.useSession();

    const userEmail =
        session?.user?.email?.trim().toLowerCase();

    const imageInputRef = useRef<HTMLInputElement>(null);

    const [studio, setStudio] = useState<Studio | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadedKey, setLoadedKey] = useState("");
    const [error, setError] = useState("");

    const [category, setCategory] = useState("");
    const [amenities, setAmenities] = useState<string[]>([]);
    const [imageUrl, setImageUrl] = useState("");

    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const requestKey = `${studioId}:${userEmail || ""}`;

    useEffect(() => {
        if (isPending || !userEmail || !studioId) return;

        const controller = new AbortController();

        const loadStudio = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await apiClient(
                    `/my-listings?ownerEmail=${encodeURIComponent(userEmail)}`,
                    {
                        method: "GET",
                        cache: "no-store",
                        signal: controller.signal,
                    }
                );

                const data: unknown = await response
                    .json()
                    .catch(() => null);

                if (!response.ok) {
                    const message =
                        data &&
                            typeof data === "object" &&
                            "message" in data &&
                            typeof data.message === "string"
                            ? data.message
                            : "Failed to load your studio listings.";

                    throw new Error(message);
                }

                if (!Array.isArray(data)) {
                    throw new Error(
                        "Invalid studio listings data received."
                    );
                }

                const currentStudio = (data as Studio[]).find(
                    (item) =>
                        item &&
                        String(item._id) === String(studioId)
                );

                if (!currentStudio) {
                    throw new Error(
                        "Studio not found in your listings."
                    );
                }

                if (
                    currentStudio.ownerEmail?.trim().toLowerCase() !==
                    userEmail
                ) {
                    throw new Error(
                        "You can only edit studios that belong to your account."
                    );
                }

                if (!controller.signal.aborted) {
                    setStudio(currentStudio);
                    setCategory(currentStudio.category || "");

                    setAmenities(
                        Array.isArray(currentStudio.amenities)
                            ? currentStudio.amenities
                            : []
                    );

                    setImageUrl(currentStudio.imageUrl || "");
                }
            } catch (error) {
                if (!controller.signal.aborted) {
                    setStudio(null);

                    setError(
                        error instanceof Error
                            ? error.message
                            : "Unable to load studio."
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoadedKey(`${studioId}:${userEmail}`);
                    setLoading(false);
                }
            }
        };

        void loadStudio();

        return () => controller.abort();
    }, [studioId, userEmail, isPending]);


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
                ? [
                    ...previous.filter(
                        (item) => item !== amenity
                    ),
                    amenity,
                ]
                : previous.filter(
                    (item) => item !== amenity
                )
        );
    };

    const handleRestoreImage = () => {
        if (!studio || isUploading || isSaving) return;

        setImageUrl(studio.imageUrl || "");

        toast.success("Original image restored.");
    };

    const handleUpdate = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!studio || isSaving || isUploading) return;

        if (!userEmail) {
            toast.error("Please login to edit your studio.");
            return;
        }

        if (
            studio.ownerEmail?.trim().toLowerCase() !==
            userEmail
        ) {
            toast.error(
                "You are not allowed to edit this studio."
            );
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

        if (amenities.length === 0) {
            toast.error("Please select at least one amenity.");
            return;
        }

        const formData = new FormData(event.currentTarget);

        const updatedData = {
            title: String(
                formData.get("title") || ""
            ).trim(),

            category,

            hourlyRate: Number(
                formData.get("hourlyRate")
            ),

            securityDeposit: Number(
                formData.get("securityDeposit")
            ),

            maxCapacity: Number(
                formData.get("maxCapacity")
            ),

            location: String(
                formData.get("location") || ""
            ).trim(),

            imageUrl,

            overview: String(
                formData.get("overview") || ""
            ).trim(),

            amenities,
        };

        if (
            updatedData.title.length < 5 ||
            updatedData.title.length > 120 ||
            !updatedData.location ||
            updatedData.overview.length < 20 ||
            !Number.isFinite(updatedData.hourlyRate) ||
            updatedData.hourlyRate < 1 ||
            !Number.isFinite(updatedData.securityDeposit) ||
            updatedData.securityDeposit < 0 ||
            !Number.isInteger(updatedData.maxCapacity) ||
            updatedData.maxCapacity < 1
        ) {
            toast.error(
                "Please check your studio information."
            );

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

            const result = await response
                .json()
                .catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "Failed to update studio."
                );
            }

            if (result.matchedCount === 0) {
                throw new Error(
                    "Studio not found or access denied."
                );
            }

            toast.success(
                "Studio updated successfully!",
                {
                    duration: 4000,
                }
            );

            router.push("/my-listings");
            router.refresh();
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

    const isPageLoading =
        isPending ||
        (
            Boolean(userEmail) &&
            (loading || loadedKey !== requestKey)
        );

    const imageChanged =
        studio !== null &&
        imageUrl !== (studio.imageUrl || "");

    const availableAmenities = Array.from(
        new Set([
            ...amenityOptions,
            ...(studio?.amenities || []),
        ])
    );

    const availableCategories = [
        ...categoryOptions,
        ...(studio?.category &&
            !categoryOptions.some(
                (item) => item.value === studio.category
            )
            ? [
                {
                    label: studio.category,
                    value: studio.category,
                },
            ]
            : []),
    ];

    if (isPageLoading) {
        return (
            <main
                role="status"
                className="flex min-h-[70vh] items-center justify-center bg-[#F5F3EE] px-4 dark:bg-[#12191C]"
            >
                <div className="flex flex-col items-center gap-4">
                    <LoaderCircle
                        size={36}
                        className="animate-spin text-[#F16F50]"
                    />

                    <p className="text-sm font-medium text-[#777D7D] dark:text-[#B5BDBA]">
                        Loading studio information...
                    </p>
                </div>
            </main>
        );
    }

    if (!userEmail) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center bg-[#F5F3EE] px-4 dark:bg-[#12191C]">
                <div className="w-full max-w-lg rounded-2xl border border-[#EAE7E2] bg-white px-6 py-12 text-center dark:border-[#374347] dark:bg-[#1C2629]">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F16F50]/10">
                        <LockKeyhole
                            size={30}
                            className="text-[#F16F50]"
                        />
                    </div>

                    <h1 className="mt-5 text-2xl font-bold text-[#202729] dark:text-white">
                        Login Required
                    </h1>

                    <p className="mt-3 text-sm leading-7 text-[#777D7D] dark:text-[#B5BDBA]">
                        Please sign in before editing your studio.
                    </p>

                    <Link
                        href="/login"
                        className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#F16F50] px-7 text-sm font-semibold text-white hover:bg-[#DF5D40]"
                    >
                        Go to Login
                    </Link>
                </div>
            </main>
        );
    }

    if (error || !studio) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center bg-[#F5F3EE] px-4 dark:bg-[#12191C]">
                <div className="w-full max-w-lg rounded-2xl border border-[#EAE7E2] bg-white px-6 py-12 text-center dark:border-[#374347] dark:bg-[#1C2629]">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                        <Building2 size={30} />
                    </div>

                    <h1 className="mt-5 text-2xl font-bold text-[#202729] dark:text-white">
                        Unable to Edit Studio
                    </h1>

                    <p className="mt-3 text-sm leading-7 text-[#777D7D] dark:text-[#B5BDBA]">
                        {error || "Studio not found."}
                    </p>

                    <Link
                        href="/my-listings"
                        className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#F16F50] px-6 text-sm font-semibold text-white hover:bg-[#DF5D40]"
                    >
                        <ArrowLeft size={17} />
                        Back to My Listings
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#F5F3EE] px-4 py-8 transition-colors duration-300 dark:bg-[#12191C] sm:px-8 sm:py-10 lg:py-14">
            <div className="mx-auto max-w-[1000px]">
                <Link
                    href="/my-listings"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#777D7D] transition-colors hover:text-[#F16F50] dark:text-[#B5BDBA] dark:hover:text-[#F16F50]"
                >
                    <ArrowLeft size={17} />
                    Back to My Listings
                </Link>

                <div className="mb-8">
                    <div className="mb-4 flex items-center gap-3">
                        <span className="h-[2px] w-8 bg-[#F16F50]" />

                        <p className="text-xs font-bold uppercase tracking-[2px] text-[#F16F50] sm:tracking-[3px]">
                            Studio Management
                        </p>
                    </div>

                    <h1 className="text-3xl font-extrabold tracking-tight text-[#202729] dark:text-white sm:text-4xl">
                        Edit Your
                        <span className="text-[#F16F50]"> Studio.</span>
                    </h1>

                    <p className="mt-3 text-sm leading-7 text-[#777D7D] dark:text-[#B5BDBA]">
                        Update your creative workspace information,
                        pricing, amenities and studio image.
                    </p>
                </div>

                <Card className="gap-0 overflow-hidden rounded-2xl border border-[#EAE7E2] bg-white py-0 shadow-sm dark:border-[#374347] dark:bg-[#1C2629]">
                    <CardHeader className="border-b border-[#EAE7E2] px-5 py-6 dark:border-[#374347] sm:px-8 sm:py-7">
                        <CardTitle className="text-xl font-bold text-[#202729] dark:text-white">
                            Studio Listing Information
                        </CardTitle>

                        <CardDescription className="mt-2 text-sm leading-6 text-[#777D7D] dark:text-[#B5BDBA]">
                            Review and update your existing studio details.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-4 py-6 sm:px-8 sm:py-8">
                        <form onSubmit={handleUpdate}>
                            <div className="space-y-7">
                                <section>
                                    <div className="mb-5 flex items-center gap-3">
                                        <Building2
                                            size={20}
                                            className="text-[#F16F50]"
                                        />

                                        <h2 className="text-lg font-bold text-[#202729] dark:text-white">
                                            Basic Information
                                        </h2>
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
                                                items={availableCategories}
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
                                                    {availableCategories.map((item) => (
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

                                        <Field className="sm:col-span-2">
                                            <FieldLabel
                                                htmlFor="edit-location"
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
                                                    id="edit-location"
                                                    name="location"
                                                    defaultValue={studio.location}
                                                    required
                                                    className={`${inputClass} pl-11`}
                                                />
                                            </div>
                                        </Field>
                                    </div>
                                </section>

                                <section className={sectionClass}>
                                    <div className="mb-5 flex items-center gap-3">
                                        <DollarSign
                                            size={20}
                                            className="text-[#F16F50]"
                                        />

                                        <h2 className="text-lg font-bold text-[#202729] dark:text-white">
                                            Pricing & Capacity
                                        </h2>
                                    </div>

                                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                                                defaultValue={studio.securityDeposit ?? 0}
                                                required
                                                className={inputClass}
                                            />
                                        </Field>

                                        <Field>
                                            <FieldLabel
                                                htmlFor="edit-maxCapacity"
                                                className={labelClass}
                                            >
                                                Maximum Capacity
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
                                    <div className="mb-5 flex items-center gap-3">
                                        <ImagePlus
                                            size={20}
                                            className="text-[#F16F50]"
                                        />

                                        <h2 className="text-lg font-bold text-[#202729] dark:text-white">
                                            Studio Image & Overview
                                        </h2>
                                    </div>

                                    <div className="space-y-5">
                                        <Field>
                                            <FieldLabel className={labelClass}>
                                                Studio Image
                                            </FieldLabel>

                                            <Input
                                                ref={imageInputRef}
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                onChange={handleImageUpload}
                                                disabled={isUploading || isSaving}
                                                aria-label="Upload studio image"
                                                className="sr-only"
                                            />

                                            {imageUrl ? (
                                                <div className="overflow-hidden rounded-xl border border-[#EAE7E2] dark:border-[#465457]">
                                                    <div className="relative h-56 w-full bg-[#EAE7E2] dark:bg-[#293638] sm:h-72">
                                                        <Image
                                                            src={imageUrl}
                                                            alt={studio.title}
                                                            fill
                                                            unoptimized
                                                            sizes="(max-width: 640px) 100vw, 900px"
                                                            className="object-cover"
                                                        />

                                                        <div className="absolute left-3 top-3 rounded-lg bg-[#202729]/85 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm">
                                                            {imageChanged
                                                                ? "New Image Ready"
                                                                : "Current Studio Image"}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-3 border-t border-[#EAE7E2] bg-[#F8F7F4] p-4 dark:border-[#465457] dark:bg-[#233034] sm:flex-row sm:items-center sm:justify-between">
                                                        <span className="flex items-center gap-2 text-xs font-medium text-[#777D7D] dark:text-[#B5BDBA]">
                                                            <CheckCircle2
                                                                size={16}
                                                                className="shrink-0 text-green-600 dark:text-green-400"
                                                            />

                                                            {imageChanged
                                                                ? "New image uploaded. Save changes to apply."
                                                                : "Your current studio image"}
                                                        </span>

                                                        <div className="flex flex-wrap gap-2">
                                                            {imageChanged && (
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    disabled={isUploading || isSaving}
                                                                    onClick={handleRestoreImage}
                                                                    className="h-10 gap-2 rounded-lg border-[#EAE7E2] text-xs font-semibold text-[#202729] dark:border-[#465457] dark:bg-[#293638] dark:text-white"
                                                                >
                                                                    <RotateCcw size={15} />
                                                                    Restore Original
                                                                </Button>
                                                            )}

                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                disabled={isUploading || isSaving}
                                                                onClick={() =>
                                                                    imageInputRef.current?.click()
                                                                }
                                                                className="h-10 gap-2 rounded-lg border-[#F16F50] text-xs font-semibold text-[#F16F50] hover:bg-[#F16F50]/10 dark:border-[#F16F50] dark:bg-transparent dark:text-[#F16F50]"
                                                            >
                                                                {isUploading ? (
                                                                    <LoaderCircle
                                                                        size={16}
                                                                        className="animate-spin"
                                                                    />
                                                                ) : (
                                                                    <Upload size={16} />
                                                                )}

                                                                {isUploading
                                                                    ? "Uploading..."
                                                                    : "Change Image"}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    disabled={isUploading || isSaving}
                                                    onClick={() =>
                                                        imageInputRef.current?.click()
                                                    }
                                                    className="flex min-h-44 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#DAD6CF] bg-[#F8F7F4] p-5 text-center transition-colors hover:border-[#F16F50] dark:border-[#465457] dark:bg-[#233034] dark:hover:border-[#F16F50]"
                                                >
                                                    {isUploading ? (
                                                        <LoaderCircle
                                                            size={30}
                                                            className="animate-spin text-[#F16F50]"
                                                        />
                                                    ) : (
                                                        <Upload
                                                            size={28}
                                                            className="text-[#F16F50]"
                                                        />
                                                    )}

                                                    <span className="mt-3 text-sm font-semibold text-[#202729] dark:text-white">
                                                        {isUploading
                                                            ? "Uploading your image..."
                                                            : "Click to upload studio image"}
                                                    </span>

                                                    <span className="mt-2 text-xs text-[#929797] dark:text-[#8B9694]">
                                                        JPG, PNG or WebP · Maximum 10 MB
                                                    </span>
                                                </button>
                                            )}
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
                                                defaultValue={studio.overview}
                                                rows={5}
                                                minLength={20}
                                                required
                                                className="min-h-32 w-full resize-y rounded-xl border-[#EAE7E2] bg-[#F8F7F4] text-sm leading-7 text-[#202729] placeholder:text-[#929797] focus-visible:border-[#F16F50] focus-visible:ring-[#F16F50]/15 dark:border-[#465457] dark:bg-[#233034] dark:text-white dark:placeholder:text-[#8B9694]"
                                            />
                                        </Field>
                                    </div>
                                </section>

                                <section className={sectionClass}>
                                    <h2 className="text-lg font-bold text-[#202729] dark:text-white">
                                        Amenities & Equipment
                                    </h2>

                                    <p className="mt-2 text-sm leading-6 text-[#777D7D] dark:text-[#B5BDBA]">
                                        Select the facilities available in your studio.
                                    </p>

                                    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                        {availableAmenities.map((amenity) => (
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
                                    <div className="mb-5 flex items-center gap-3">
                                        <UserRound
                                            size={20}
                                            className="text-[#F16F50]"
                                        />

                                        <h2 className="text-lg font-bold text-[#202729] dark:text-white">
                                            Host Information
                                        </h2>
                                    </div>

                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <Field>
                                            <FieldLabel
                                                htmlFor="edit-ownerName"
                                                className={labelClass}
                                            >
                                                Host Name
                                            </FieldLabel>

                                            <Input
                                                id="edit-ownerName"
                                                value={studio.ownerName || ""}
                                                readOnly
                                                className={`${inputClass} bg-[#F0F0ED] dark:bg-[#293638]`}
                                            />
                                        </Field>

                                        <Field>
                                            <FieldLabel
                                                htmlFor="edit-ownerEmail"
                                                className={labelClass}
                                            >
                                                Host Email
                                            </FieldLabel>

                                            <Input
                                                id="edit-ownerEmail"
                                                value={studio.ownerEmail || ""}
                                                readOnly
                                                className={`${inputClass} bg-[#F0F0ED] dark:bg-[#293638]`}
                                            />
                                        </Field>
                                    </div>

                                    <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-[#929797] dark:text-[#8B9694]">
                                        <CheckCircle2
                                            size={15}
                                            className="mt-0.5 shrink-0 text-[#F16F50]"
                                        />

                                        Host information cannot be changed
                                        from this form.
                                    </p>
                                </section>

                                <div className="flex flex-col-reverse gap-3 border-t border-[#EAE7E2] pt-7 dark:border-[#374347] sm:flex-row sm:justify-end">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={isSaving || isUploading}
                                        onClick={() =>
                                            router.push("/my-listings")
                                        }
                                        className="h-12 w-full rounded-xl border-[#EAE7E2] px-7 font-semibold text-[#202729] dark:border-[#465457] dark:bg-[#233034] dark:text-white sm:w-auto"
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        type="submit"
                                        disabled={isSaving || isUploading}
                                        className="h-12 w-full gap-2 rounded-xl bg-[#F16F50] px-8 text-sm font-bold text-white hover:bg-[#DF5D40] sm:w-auto"
                                    >
                                        {isSaving ? (
                                            <LoaderCircle
                                                size={18}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <Save size={18} />
                                        )}

                                        {isSaving
                                            ? "Saving Changes..."
                                            : "Save Changes"}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}

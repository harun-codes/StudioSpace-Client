
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
    ArrowUpRight,
    Check,
    Eye,
    EyeOff,
    ImageIcon,
    LockKeyhole,
    Mail,
    UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";


export default function RegisterPage() {
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");

    const passwordRules = [
        {
            label: "At least 8 characters",
            valid: password.length >= 8,
        },
        {
            label: "One uppercase letter",
            valid: /[A-Z]/.test(password),
        },
        {
            label: "One lowercase letter",
            valid: /[a-z]/.test(password),
        },
    ];



const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  setMessage("");

  const formData = new FormData(event.currentTarget);

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const image = String(formData.get("image") || "").trim();
  const userPassword = String(formData.get("password") || "");

  if (!name || !email || !userPassword) {
    setMessage("Please fill in all required fields.");
    return;
  }

  const isValidPassword =
    userPassword.length >= 8 &&
    /[A-Z]/.test(userPassword) &&
    /[a-z]/.test(userPassword);

  if (!isValidPassword) {
    setMessage(
      "Password must contain at least 8 characters, one uppercase letter and one lowercase letter."
    );
    return;
  }

  try {
    const { data, error } = await authClient.signUp.email({
      name,
      email,
      password: userPassword,
      ...(image ? { image } : {}),
    });

    if (error) {
      console.error("Registration error:", error);
      setMessage(error.message || "Registration failed.");
      return;
    }

    if (!data) {
      setMessage("Registration could not be confirmed. Please try again.");
      return;
    }
  } catch (error) {
    console.error("Registration exception:", error);

    setMessage(
      error instanceof Error
        ? error.message
        : "Unable to connect to the authentication server."
    );

    return;
  }

  router.push("/login");
};


    return (
        <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#F5F3EE] px-4 py-6 sm:px-6">
            <Card className="w-full max-w-[520px] gap-0 rounded-2xl border border-[#EAE7E2] bg-white py-0 shadow-lg shadow-[#202729]/5">
                <CardHeader className="space-y-2 px-6 pb-5 pt-7 text-center sm:px-9 sm:pt-8">
                    <div className="mb-1 flex items-center justify-center gap-3">
                        <span className="h-[2px] w-6 bg-[#F16F50]" />

                        <p className="text-[11px] font-bold uppercase tracking-[3px] text-[#F16F50]">
                            Join StudioSpace
                        </p>

                        <span className="h-[2px] w-6 bg-[#F16F50]" />
                    </div>

                    <CardTitle className="text-2xl font-extrabold tracking-tight text-[#202729] sm:text-3xl">
                        Create your account
                        <span className="text-[#F16F50]">.</span>
                    </CardTitle>
                </CardHeader>

                <CardContent className="px-6 pb-7 sm:px-9 sm:pb-8">

                    <form onSubmit={handleRegister}>
                        <FieldGroup className="gap-3.5">

                            <Field className="gap-1.5">
                                <FieldLabel
                                    htmlFor="name"
                                    className="text-sm font-semibold text-[#202729]"
                                >
                                    Full Name
                                </FieldLabel>

                                <div className="relative">
                                    <UserRound
                                        size={17}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#929797]"
                                    />

                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        autoComplete="name"
                                        required
                                        className="h-10 rounded-lg border-[#EAE7E2] bg-[#F8F7F4] pl-10 text-sm text-[#202729] focus-visible:border-[#F16F50] focus-visible:ring-[#F16F50]/15"
                                    />
                                </div>
                            </Field>

                            <Field className="gap-1.5">
                                <FieldLabel
                                    htmlFor="email"
                                    className="text-sm font-semibold text-[#202729]"
                                >
                                    Email Address
                                </FieldLabel>

                                <div className="relative">
                                    <Mail
                                        size={17}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#929797]"
                                    />

                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email address"
                                        autoComplete="email"
                                        required
                                        className="h-10 rounded-lg border-[#EAE7E2] bg-[#F8F7F4] pl-10 text-sm text-[#202729] focus-visible:border-[#F16F50] focus-visible:ring-[#F16F50]/15"
                                    />
                                </div>
                            </Field>

                            <Field className="gap-1.5">
                                <FieldLabel
                                    htmlFor="photo"
                                    className="text-sm font-semibold text-[#202729]"
                                >
                                    Photo URL
                                    <span className="ml-1 font-normal text-[#929797]">
                                        (Optional)
                                    </span>
                                </FieldLabel>

                                <div className="relative">
                                    <ImageIcon
                                        size={17}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#929797]"
                                    />

                                    <Input
                                        id="photo"
                                        name="image"
                                        type="url"
                                        placeholder="Enter your photo URL"
                                        className="h-10 rounded-lg border-[#EAE7E2] bg-[#F8F7F4] pl-10 text-sm text-[#202729] focus-visible:border-[#F16F50] focus-visible:ring-[#F16F50]/15"
                                    />
                                </div>
                            </Field>

                            <Field className="gap-1.5">
                                <FieldLabel
                                    htmlFor="password"
                                    className="text-sm font-semibold text-[#202729]"
                                >
                                    Password
                                </FieldLabel>


                                <div className="relative">
                                    <LockKeyhole
                                        size={17}
                                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#929797]"
                                    />

                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a strong password"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        autoComplete="new-password"
                                        required
                                        minLength={8}
                                        aria-describedby="password-rules"
                                        className="h-10 w-full rounded-lg border-[#EAE7E2] bg-[#F8F7F4] pl-10 pr-12 text-sm text-[#202729] focus-visible:border-[#F16F50] focus-visible:ring-[#F16F50]/15"
                                    />

                                    <div className="absolute inset-y-0 right-2 flex items-center justify-center">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onMouseDown={(event) => event.preventDefault()}
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                            aria-pressed={showPassword}
                                            className="h-8 w-8 shrink-0 rounded-md p-0 text-[#929797] hover:bg-transparent hover:text-[#202729]"
                                        >
                                            <span className="flex h-5 w-5 items-center justify-center">
                                                {showPassword ? (
                                                    <EyeOff size={18} strokeWidth={1.8} />
                                                ) : (
                                                    <Eye size={18} strokeWidth={1.8} />
                                                )}
                                            </span>
                                        </Button>
                                    </div>
                                </div>

                                <div
                                    id="password-rules"
                                    className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1.5"
                                >
                                    {passwordRules.map((rule) => (
                                        <div
                                            key={rule.label}
                                            className="flex items-center gap-1.5"
                                        >
                                            <span
                                                className={`flex h-4 w-4 items-center justify-center rounded-full ${rule.valid
                                                    ? "bg-green-100 text-green-600"
                                                    : "bg-[#F0EEEB] text-[#A3A8A5]"
                                                    }`}
                                            >
                                                <Check size={10} strokeWidth={3} />
                                            </span>

                                            <span
                                                className={`text-[11px] ${rule.valid
                                                    ? "text-green-600"
                                                    : "text-[#929797]"
                                                    }`}
                                            >
                                                {rule.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </Field>

                            {message && (
                                <FieldDescription
                                    role="status"
                                    className="rounded-lg border border-[#F16F50]/20 bg-[#F16F50]/5 p-2.5 text-center text-xs text-[#202729]"
                                >
                                    {message}
                                </FieldDescription>
                            )}

                            <Field>
                                <Button
                                    type="submit"
                                    className="group h-10 w-full rounded-lg bg-[#F16F50] text-sm font-bold text-white transition-all hover:bg-[#DF5D40]"
                                >
                                    Create Account

                                    <ArrowUpRight
                                        size={17}
                                        className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                                    />
                                </Button>
                            </Field>

                            <FieldSeparator className="my-1 *:data-[slot=field-separator-content]:bg-white">
                                Or continue with
                            </FieldSeparator>

                            <Field>
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() =>
                                        setMessage(
                                            "Google registration will be connected next."
                                        )
                                    }
                                    className="h-10 w-full rounded-lg border-[#EAE7E2] bg-white text-sm font-semibold text-[#202729] hover:border-[#F16F50] hover:bg-[#F8F7F4]"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        className="mr-2 h-5 w-5"
                                    >
                                        <path
                                            fill="#4285F4"
                                            d="M21.35 12.23c0-.75-.07-1.47-.2-2.16H12v4.09h5.23a4.47 4.47 0 0 1-1.94 2.93v2.43h3.13c1.83-1.68 2.93-4.16 2.93-7.29Z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 21.72c2.62 0 4.82-.87 6.42-2.2l-3.13-2.43c-.87.58-1.98.93-3.29.93-2.53 0-4.68-1.71-5.45-4.01H3.32v2.5A9.72 9.72 0 0 0 12 21.72Z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M6.55 14.01a5.85 5.85 0 0 1 0-3.72v-2.5H3.32a9.72 9.72 0 0 0 0 8.72l3.23-2.5Z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 6.28c1.43 0 2.71.49 3.72 1.46l2.79-2.79A9.3 9.3 0 0 0 12 2.28a9.72 9.72 0 0 0-8.68 5.51l3.23 2.5c.77-2.3 2.92-4.01 5.45-4.01Z"
                                        />
                                    </svg>

                                    Continue with Google
                                </Button>
                            </Field>

                            <FieldDescription className="text-center text-sm text-[#777D7D]">
                                Already have an account?{" "}
                                <Link
                                    href="/login"
                                    className="font-bold text-[#F16F50] hover:underline"
                                >
                                    Login
                                </Link>
                            </FieldDescription>

                            <FieldDescription className="text-center text-[11px] leading-5 text-[#929797]">
                                By creating an account, you agree to our
                                terms and community guidelines.
                            </FieldDescription>
                        </FieldGroup>
                    </form>


                </CardContent>
            </Card>
        </main>
    );
}


"use client";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowUpRight,
  Check,
  Eye,
  EyeOff,
  ImageIcon,
  LoaderCircle,
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

const inputClass =
  "h-11 w-full min-w-0 rounded-xl border-[#EAE7E2] bg-[#F8F7F4] pl-10 text-sm text-[#202729] placeholder:text-[#929797] focus-visible:border-[#F16F50] focus-visible:ring-[#F16F50]/15 dark:border-[#465457] dark:bg-[#233034] dark:text-white dark:placeholder:text-[#8B9694]";

const labelClass =
  "text-sm font-semibold text-[#202729] dark:text-[#E6E8E8]";

const iconClass =
  "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#929797] dark:text-[#8B9694]";

const getAuthErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object") {
    const details = error as Record<string, unknown>;

    if (
      typeof details.message === "string" &&
      details.message.trim()
    ) {
      return details.message;
    }

    if (
      typeof details.code === "string" &&
      details.code.trim()
    ) {
      return `Authentication failed: ${details.code}`;
    }

    try {
      const serialized = JSON.stringify(error);

      if (serialized && serialized !== "{}") {
        return serialized;
      }
    } catch {
      return "Unable to read authentication error.";
    }
  }

  return "Google sign-in could not be started. Check the browser console.";
};

export default function RegisterPage() {
  const router = useRouter();

  const { data: session, isPending } =
    authClient.useSession();

  const isAuthenticated = Boolean(session?.user);

  const [isRegistrationInProgress, setIsRegistrationInProgress] =
    useState(false);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] =
    useState(false);

  useEffect(() => {
    if (
      isPending ||
      !isAuthenticated ||
      isRegistrationInProgress
    ) {
      return;
    }

    router.replace("/");
  }, [isPending, isAuthenticated, isRegistrationInProgress, router]);

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

  const handleRegister = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      isSubmitting ||
      isGoogleSubmitting ||
      isAuthenticated
    ) {
      return;
    }

    setMessage("");

    const formData = new FormData(event.currentTarget);

    const name = String(
      formData.get("name") || ""
    ).trim();

    const email = String(
      formData.get("email") || ""
    ).trim();

    const image = String(
      formData.get("image") || ""
    ).trim();

    const userPassword = String(
      formData.get("password") || ""
    );

    if (!name || !email || !userPassword) {
      setMessage(
        "Please fill in all required fields."
      );
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

    setIsSubmitting(true);
    setIsRegistrationInProgress(true);

    let registrationSucceeded = false;

    try {
      const { data, error } =
        await authClient.signUp.email({
          name,
          email,
          password: userPassword,
          ...(image ? { image } : {}),
        });

      if (error) {
        setMessage(
          error.message || "Registration failed."
        );
        return;
      }

      if (!data) {
        setMessage(
          "Registration could not be confirmed. Please try again."
        );
        return;
      }

      registrationSucceeded = true;

      if ("token" in data && data.token) {
        const { error: signOutError } =
          await authClient.signOut();

        if (signOutError) {
          setMessage(
            "Account created, but automatic sign-in could not be cleared. Please sign out from the profile menu before logging in again."
          );
          return;
        }
      }

      router.replace("/login");
      router.refresh();
    } catch (error) {
      setMessage(
        registrationSucceeded
          ? "Account created, but the login redirect could not be completed. Please check your session."
          : error instanceof Error
            ? error.message
            : "Unable to connect to the authentication server."
      );
    } finally {
      setIsSubmitting(false);

      if (!registrationSucceeded) {
        setIsRegistrationInProgress(false);
      }
    }
  };
  const handleGoogleRegister = async () => {
    if (
      isSubmitting ||
      isGoogleSubmitting ||
      isAuthenticated
    ) {
      return;
    }

    setMessage("");
    setIsGoogleSubmitting(true);

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/`,
        errorCallbackURL: `${window.location.origin}/register`,
      });

      if (result.error) {
        console.error(
          "Google OAuth initiation failed:",
          result.error
        );

        setMessage(
          getAuthErrorMessage(result.error)
        );

        return;
      }

      console.log("Google OAuth request initiated:", result.data);
    } catch (error) {
      console.error("Google OAuth exception:", error);

      setMessage(
        getAuthErrorMessage(error)
      );
    } finally {
      setIsGoogleSubmitting(false);
    }
  };
  if (
    isPending ||
    (isAuthenticated && !isRegistrationInProgress)
  ) {
    return (
      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#F5F3EE] px-4 dark:bg-[#12191C]">
        <div
          role="status"
          className="flex flex-col items-center gap-4"
        >
          <LoaderCircle
            size={36}
            className="animate-spin text-[#F16F50]"
          />

          <p className="text-sm font-medium text-[#777D7D] dark:text-[#B5BDBA]">
            {isAuthenticated
              ? "Redirecting to Home..."
              : "Checking your session..."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#F5F3EE] px-4 py-8 transition-colors duration-300 dark:bg-[#12191C] sm:px-6 sm:py-12">
      <Card className="w-full max-w-[520px] gap-0 overflow-hidden rounded-2xl border border-[#EAE7E2] bg-white py-0 shadow-lg shadow-[#202729]/5 dark:border-[#374347] dark:bg-[#1C2629] dark:shadow-black/20">
        <CardHeader className="space-y-2 px-5 pb-5 pt-7 text-center sm:px-9 sm:pt-8">
          <div className="mb-1 flex items-center justify-center gap-3">
            <span className="h-[2px] w-6 shrink-0 bg-[#F16F50]" />

            <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#F16F50] sm:tracking-[3px]">
              Join StudioSpace
            </p>

            <span className="h-[2px] w-6 shrink-0 bg-[#F16F50]" />
          </div>

          <CardTitle className="text-2xl font-extrabold leading-tight tracking-tight text-[#202729] dark:text-white sm:text-3xl">
            Create your account
            <span className="text-[#F16F50]">.</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="px-5 pb-7 sm:px-9 sm:pb-8">
          <form onSubmit={handleRegister}>
            <FieldGroup className="gap-4">
              <Field className="gap-1.5">
                <FieldLabel
                  htmlFor="name"
                  className={labelClass}
                >
                  Full Name
                </FieldLabel>

                <div className="relative">
                  <UserRound
                    size={17}
                    className={iconClass}
                  />

                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                    className={inputClass}
                  />
                </div>
              </Field>

              <Field className="gap-1.5">
                <FieldLabel
                  htmlFor="email"
                  className={labelClass}
                >
                  Email Address
                </FieldLabel>

                <div className="relative">
                  <Mail
                    size={17}
                    className={iconClass}
                  />

                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    autoComplete="email"
                    required
                    className={inputClass}
                  />
                </div>
              </Field>

              <Field className="gap-1.5">
                <FieldLabel
                  htmlFor="photo"
                  className={labelClass}
                >
                  Photo URL
                  <span className="ml-1 font-normal text-[#929797] dark:text-[#8B9694]">
                    (Optional)
                  </span>
                </FieldLabel>

                <div className="relative">
                  <ImageIcon
                    size={17}
                    className={iconClass}
                  />

                  <Input
                    id="photo"
                    name="image"
                    type="url"
                    placeholder="Enter your photo URL"
                    className={inputClass}
                  />
                </div>
              </Field>

              <Field className="gap-1.5">
                <FieldLabel
                  htmlFor="password"
                  className={labelClass}
                >
                  Password
                </FieldLabel>

                <div className="relative">
                  <LockKeyhole
                    size={17}
                    className={iconClass}
                  />

                  <Input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    autoComplete="new-password"
                    required
                    minLength={8}
                    aria-describedby="password-rules"
                    className={`${inputClass} pr-12`}
                  />

                  <div className="absolute inset-y-0 right-2 flex items-center justify-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onMouseDown={(event) =>
                        event.preventDefault()
                      }
                      onClick={() =>
                        setShowPassword(
                          (previous) => !previous
                        )
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      aria-pressed={showPassword}
                      className="h-8 w-8 shrink-0 rounded-md p-0 text-[#929797] hover:bg-[#EAE7E2] hover:text-[#202729] dark:text-[#B5BDBA] dark:hover:bg-[#374347] dark:hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff
                          size={18}
                          strokeWidth={1.8}
                        />
                      ) : (
                        <Eye
                          size={18}
                          strokeWidth={1.8}
                        />
                      )}
                    </Button>
                  </div>
                </div>

                <div
                  id="password-rules"
                  className="mt-2 flex flex-wrap gap-x-4 gap-y-2"
                >
                  {passwordRules.map((rule) => (
                    <div
                      key={rule.label}
                      className="flex items-center gap-1.5"
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-colors ${rule.valid
                            ? "bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400"
                            : "bg-[#F0EEEB] text-[#A3A8A5] dark:bg-[#293638] dark:text-[#8B9694]"
                          }`}
                      >
                        <Check
                          size={10}
                          strokeWidth={3}
                        />
                      </span>

                      <span
                        className={`text-[11px] leading-5 ${rule.valid
                            ? "text-green-600 dark:text-green-400"
                            : "text-[#929797] dark:text-[#8B9694]"
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
                  role="alert"
                  className="rounded-xl border border-[#F16F50]/20 bg-[#F16F50]/5 p-3 text-center text-xs leading-5 text-[#202729] dark:border-[#F16F50]/30 dark:bg-[#F16F50]/10 dark:text-[#F4C0B4]"
                >
                  {message}
                </FieldDescription>
              )}

              <Field>
                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    isGoogleSubmitting
                  }
                  className="group h-11 w-full gap-2 rounded-xl bg-[#F16F50] text-sm font-bold text-white transition-all hover:bg-[#DF5D40] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle
                        size={17}
                        className="animate-spin"
                      />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowUpRight
                        size={17}
                        className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                      />
                    </>
                  )}
                </Button>
              </Field>

              <FieldSeparator className="my-1 text-[#929797] dark:text-[#B5BDBA] [&_[data-slot=field-separator-content]]:bg-white dark:[&_[data-slot=field-separator-content]]:bg-[#1C2629]">
                Or continue with
              </FieldSeparator>

              <Field>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleRegister}
                  disabled={
                    isSubmitting ||
                    isGoogleSubmitting
                  }
                  className="h-11 w-full gap-2 rounded-xl border-[#EAE7E2] bg-white text-sm font-semibold text-[#202729] transition-colors hover:border-[#F16F50] hover:bg-[#F8F7F4] dark:border-[#465457] dark:bg-[#233034] dark:text-white dark:hover:border-[#F16F50] dark:hover:bg-[#2B3B3F]"
                >
                  {isGoogleSubmitting ? (
                    <LoaderCircle
                      size={18}
                      className="animate-spin"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="h-5 w-5 shrink-0"
                      aria-hidden="true"
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
                  )}

                  {isGoogleSubmitting
                    ? "Connecting to Google..."
                    : "Continue with Google"}
                </Button>
              </Field>

              <FieldDescription className="text-center text-sm text-[#777D7D] dark:text-[#B5BDBA]">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-bold text-[#F16F50] hover:underline"
                >
                  Login
                </Link>
              </FieldDescription>

              <FieldDescription className="text-center text-[11px] leading-5 text-[#929797] dark:text-[#8B9694]">
                By creating an account, you agree
                to our terms and community guidelines.
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

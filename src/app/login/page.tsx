
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
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
} from "lucide-react";

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

function getSafeRedirectPath() {
  if (typeof window === "undefined") {
    return "/";
  }

  const searchParams = new URLSearchParams(
    window.location.search
  );

  const destination =
    searchParams.get("callbackURL") ||
    searchParams.get("next") ||
    "/";

  if (
    !destination.startsWith("/") ||
    destination.startsWith("//") ||
    destination.includes("\\")
  ) {
    return "/";
  }

  try {
    const url = new URL(
      destination,
      window.location.origin
    );

    if (url.origin !== window.location.origin) {
      return "/";
    }

    if (
      url.pathname === "/login" ||
      url.pathname === "/register"
    ) {
      return "/";
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/";
  }
}

export default function LoginPage() {
  const router = useRouter();

  const {
    data: session,
    isPending,
  } = authClient.useSession();

  const isAuthenticated = Boolean(session?.user);

  const [showPassword, setShowPassword] =
    useState(false);

  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [
    isGoogleSubmitting,
    setIsGoogleSubmitting,
  ] = useState(false);

  useEffect(() => {
    if (isPending || !isAuthenticated) {
      return;
    }

    router.replace(getSafeRedirectPath());
    router.refresh();
  }, [isPending, isAuthenticated, router]);

  const handleLogin = async (
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

    const formData = new FormData(
      event.currentTarget
    );

    const email = String(
      formData.get("email") || ""
    ).trim().toLowerCase();

    const password = String(
      formData.get("password") || ""
    );

    if (!email || !password) {
      setMessage(
        "Please enter your email and password."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } =
        await authClient.signIn.email({
          email,
          password,
        });

      if (error) {
        setMessage(
          error.message ||
            "Invalid email or password."
        );
        return;
      }

      if (!data) {
        setMessage(
          "Login could not be confirmed. Please try again."
        );
        return;
      }

      router.replace(getSafeRedirectPath());
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to connect to the authentication server."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
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
      const { error } =
        await authClient.signIn.social({
          provider: "google",
          callbackURL: getSafeRedirectPath(),
        });

      if (error) {
        setMessage(
          error.message ||
            "Google sign-in failed. Please try again."
        );
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to continue with Google."
      );
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  if (isPending || isAuthenticated) {
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
              ? "Redirecting to your destination..."
              : "Checking your session..."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#F5F3EE] px-4 py-8 transition-colors duration-300 dark:bg-[#12191C] sm:px-6 sm:py-12">
      <Card className="w-full max-w-[520px] gap-0 overflow-hidden rounded-2xl border border-[#EAE7E2] bg-white py-0 shadow-lg shadow-[#202729]/5 dark:border-[#374347] dark:bg-[#1C2629] dark:shadow-black/20">
        <CardHeader className="space-y-2 px-5 pb-6 pt-8 text-center sm:px-9 sm:pt-9">
          <div className="mb-2 flex items-center justify-center gap-3">
            <span className="h-[2px] w-6 shrink-0 bg-[#F16F50]" />

            <p className="text-[11px] font-bold uppercase tracking-[2px] text-[#F16F50] sm:tracking-[3px]">
              Welcome to StudioSpace
            </p>

            <span className="h-[2px] w-6 shrink-0 bg-[#F16F50]" />
          </div>

          <CardTitle className="text-2xl font-extrabold tracking-tight text-[#202729] dark:text-white sm:text-3xl">
            Welcome back
            <span className="text-[#F16F50]">
              .
            </span>
          </CardTitle>

          <CardDescription className="mx-auto max-w-sm text-sm leading-6 text-[#777D7D] dark:text-[#B5BDBA]">
            Log in to your account and continue
            your creative journey.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-5 pb-8 sm:px-9 sm:pb-9">
          <form onSubmit={handleLogin}>
            <FieldGroup className="gap-4">
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
                <div className="flex items-center justify-between gap-3">
                  <FieldLabel
                    htmlFor="password"
                    className={labelClass}
                  >
                    Password
                  </FieldLabel>

                  <Button
                    type="button"
                    variant="link"
                    onClick={() =>
                      setMessage(
                        "Password reset will be available soon."
                      )
                    }
                    className="h-auto shrink-0 p-0 text-xs font-semibold text-[#F16F50] hover:text-[#DF5D40] dark:text-[#F16F50] dark:hover:text-[#FF9378]"
                  >
                    Forgot password?
                  </Button>
                </div>

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
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
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
              </Field>

              {message && (
                <FieldDescription
                  role="alert"
                  className="rounded-xl border border-[#F16F50]/20 bg-[#F16F50]/5 p-3 text-center text-xs leading-5 text-[#202729] dark:border-[#F16F50]/30 dark:bg-[#F16F50]/10 dark:text-[#F4C0B4]"
                >
                  {message}
                </FieldDescription>
              )}

              <Field className="mt-1">
                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    isGoogleSubmitting
                  }
                  className="group h-11 w-full gap-2 rounded-xl bg-[#F16F50] text-sm font-bold text-white transition-all hover:bg-[#DF5D40]"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle
                        size={17}
                        className="animate-spin"
                      />
                      Logging In...
                    </>
                  ) : (
                    <>
                      Login to StudioSpace
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
                  onClick={handleGoogleLogin}
                  disabled={
                    isSubmitting ||
                    isGoogleSubmitting
                  }
                  className="h-11 w-full gap-2 rounded-xl border-[#EAE7E2] bg-white text-sm font-semibold text-[#202729] hover:border-[#F16F50] hover:bg-[#F8F7F4] dark:border-[#465457] dark:bg-[#233034] dark:text-white dark:hover:border-[#F16F50] dark:hover:bg-[#2B3B3F]"
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

              <FieldDescription className="mt-2 text-center text-sm text-[#777D7D] dark:text-[#B5BDBA]">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-bold text-[#F16F50] hover:underline"
                >
                  Create Account
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

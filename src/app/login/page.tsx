
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Eye,
  EyeOff,
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
import { redirect } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin =  async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const user = Object.fromEntries(formData.entries()) as {
      email: string;
      password: string;
    };

    const {data, error} = await authClient.signIn.email ({
        ...user,
    })

    if(data) {
        redirect('/')
    }
     if (error) {
            console.error("Error registering user:", error);

     }

  };

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#F5F3EE] px-4 py-6 sm:px-6">
      <Card className="w-full max-w-[520px] gap-0 rounded-2xl border border-[#EAE7E2] bg-white py-0 shadow-lg shadow-[#202729]/5">
        <CardHeader className="space-y-2 px-6 pb-6 pt-8 text-center sm:px-9 sm:pt-9">
          <div className="mb-2 flex items-center justify-center gap-3">
            <span className="h-[2px] w-6 bg-[#F16F50]" />

            <p className="text-[11px] font-bold uppercase tracking-[3px] text-[#F16F50]">
              Welcome to StudioSpace
            </p>

            <span className="h-[2px] w-6 bg-[#F16F50]" />
          </div>

          <CardTitle className="text-2xl font-extrabold tracking-tight text-[#202729] sm:text-3xl">
            Welcome back
            <span className="text-[#F16F50]">.</span>
          </CardTitle>

          <CardDescription className="mx-auto max-w-sm text-sm leading-6 text-[#777D7D]">
            Login in to your account and continue your creative journey.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-8 sm:px-9 sm:pb-9">

          <form onSubmit={handleLogin}>
            <FieldGroup className="gap-4">

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
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#929797]"
                  />

                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    autoComplete="email"
                    required
                    className="h-10 w-full rounded-lg border-[#EAE7E2] bg-[#F8F7F4] pl-10 text-sm text-[#202729] focus-visible:border-[#F16F50] focus-visible:ring-[#F16F50]/15"
                  />
                </div>
              </Field>


              <Field className="gap-1.5">
                <div className="flex items-center justify-between gap-3">
                  <FieldLabel
                    htmlFor="password"
                    className="text-sm font-semibold text-[#202729]"
                  >
                    Password
                  </FieldLabel>

                  <Button
                    type="button"
                    variant="link"
                    onClick={() =>
                      setMessage("Password reset will be available soon.")
                    }
                    className="h-auto p-0 text-xs font-semibold text-[#F16F50] hover:text-[#DF5D40]"
                  >
                    Forgot password?
                  </Button>
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#929797]"
                  />

                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="h-10 w-full rounded-lg border-[#EAE7E2] bg-[#F8F7F4] pl-10 pr-12 text-sm text-[#202729] focus-visible:border-[#F16F50] focus-visible:ring-[#F16F50]/15"
                  />

                  <div className="absolute inset-y-0 right-2 flex items-center justify-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
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
              </Field>


              {message && (
                <FieldDescription
                  role="status"
                  className="rounded-lg border border-[#F16F50]/20 bg-[#F16F50]/5 p-3 text-center text-xs text-[#202729]"
                >
                  {message}
                </FieldDescription>
              )}

              <Field className="mt-1">
                <Button
                  type="submit"
                  className="group h-10 w-full rounded-lg bg-[#F16F50] text-sm font-bold text-white transition-all hover:bg-[#DF5D40]"
                >
                  Login to StudioSpace

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
                      "Google login will be connected to Better Auth next."
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

              <FieldDescription className="mt-2 text-center text-sm text-[#777D7D]">
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

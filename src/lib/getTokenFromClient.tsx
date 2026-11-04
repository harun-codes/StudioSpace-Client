
"use client";

import { authClient } from "@/lib/auth-client";

export async function getTokenFromClient(): Promise<string> {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error(
      "Your session has expired. Please sign in again."
    );
  }

  return data.token;
}

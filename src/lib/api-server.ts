
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const API_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

export const apiServer = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const requestHeaders = new Headers(options.headers);

  try {
    const result = await auth.api.getToken({
      headers: await headers(),
    });

    if (result?.token) {
      requestHeaders.set(
        "Authorization",
        `Bearer ${result.token}`
      );
    }
  } catch {
  }

  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: requestHeaders,
    cache: "no-store",
  });
};

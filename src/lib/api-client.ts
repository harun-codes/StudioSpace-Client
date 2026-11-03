
import { getTokenFromClient } from "@/lib/getTokenFromClient";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000"
).replace(/\/+$/, "");

export const apiClient = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = await getTokenFromClient();

  if (!token) {
    return new Response(
      JSON.stringify({
        message: "Unauthorized. Please login.",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const headers = new Headers(options.headers);

  headers.set("Authorization", `Bearer ${token}`);

  return fetch(
    `${API_URL}/${endpoint.replace(/^\/+/, "")}`,
    {
      ...options,
      headers,
      credentials: "omit",
    }
  );
};

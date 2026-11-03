
"use client";

import { getTokenFromClient } from "@/lib/getTokenFromClient";

export const uploadImage = async (
  file: File
): Promise<string> => {
  const token = await getTokenFromClient();

  if (!token) {
    throw new Error("Unauthorized. Please login again.");
  }

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("/api/upload-image", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message || "Image upload failed."
    );
  }

  if (!result?.imageUrl) {
    throw new Error("Image URL was not returned.");
  }

  return result.imageUrl;
};

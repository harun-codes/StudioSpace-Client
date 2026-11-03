
import { createRemoteJWKSet, jwtVerify } from "jose";

let JWKS: ReturnType<typeof createRemoteJWKSet> | null = null;

const getJWKS = () => {
  const authURL = process.env.BETTER_AUTH_URL;

  if (!authURL) {
    throw new Error("BETTER_AUTH_URL is not configured");
  }

  if (!JWKS) {
    JWKS = createRemoteJWKSet(
      new URL("/api/auth/jwks", authURL)
    );
  }

  return JWKS;
};

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json(
        { message: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7).trim();

    if (!token) {
      return Response.json(
        { message: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    try {
      await jwtVerify(token, getJWKS());
    } catch {
      return Response.json(
        { message: "Invalid or expired token." },
        { status: 401 }
      );
    }

    const apiKey = process.env.IMGBB_API_KEY;

    if (!apiKey) {
      return Response.json(
        { message: "Image upload is not configured." },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return Response.json(
        { message: "Please select an image." },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(image.type) ||
      image.size === 0 ||
      image.size > 10 * 1024 * 1024
    ) {
      return Response.json(
        {
          message: "Select a JPG, PNG or WebP image under 10MB.",
        },
        { status: 400 }
      );
    }

    const uploadData = new FormData();

    uploadData.append("image", image, image.name);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        body: uploadData,
      }
    );

    const result = await response.json().catch(() => null);

    if (
      !response.ok ||
      !result?.success ||
      !result?.data?.url
    ) {
      return Response.json(
        { message: "Failed to upload image to ImgBB." },
        { status: 502 }
      );
    }

    return Response.json(
      {
        message: "Image uploaded successfully.",
        imageUrl: result.data.url,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Image upload error:", error);

    return Response.json(
      { message: "Image upload failed." },
      { status: 500 }
    );
  }
}


import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      const loginUrl = new URL("/login", request.url);

      const destination =
        request.nextUrl.pathname +
        request.nextUrl.search;

      loginUrl.searchParams.set(
        "callbackURL",
        destination
      );

      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Proxy authentication error:", error);

    return new NextResponse(
      "Unable to verify your session. Please try again.",
      {
        status: 503,
      }
    );
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/add-studio/:path*",
    "/my-listings/:path*",
    "/my-bookings/:path*",
    "/studios/edit/:path*",
  ],
};

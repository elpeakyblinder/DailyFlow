import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const session = await auth();
    const { pathname } = request.nextUrl;

    if (!session?.user?.id) {
        return NextResponse.redirect(
            new URL("/auth/login", request.url)
        );
    }

    if (pathname.startsWith("/employee")) {
        return NextResponse.next();
    }

    if (pathname.startsWith("/admin")) {
        if (session.user.role !== "admin") {
            return NextResponse.redirect(
                new URL("/employee/dashboard", request.url)
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/employee/:path*", "/admin/:path*"],
};

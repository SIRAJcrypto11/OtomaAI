import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse, NextRequest } from "next/server";

export default NextAuth(authConfig).auth((req: NextRequest & { auth: any }) => {
    const isLoggedin = !!req.auth;
    const { nextUrl } = req;

    const isAuthRoute = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register");
    const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");
    const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");

    if (isApiAuthRoute) return NextResponse.next();

    if (isAuthRoute) {
        if (isLoggedin) {
            return NextResponse.redirect(new URL("/dashboard", nextUrl));
        }
        return NextResponse.next();
    }

    if (isDashboardRoute && !isLoggedin) {
        return NextResponse.redirect(new URL("/login", nextUrl));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

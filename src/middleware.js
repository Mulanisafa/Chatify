// middleware.ts or middleware.js
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // যদি টোকেন না থাকে, ইউজার লগইন না করে থাকে
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // টোকেন থাকলে যেতে দাও
  return NextResponse.next();
}

// কোন কোন রাউট চেক করা হবে
export const config = {
  matcher: "/dashboard/:path*",
};

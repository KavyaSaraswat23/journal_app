import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(
  "/dashboard(.*)",
  "/collection(.*)",
  "/journal(.*)"
);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|.*\\.(?:html?|css|js(?!on)|jpg|jpeg|png|gif|svg|woff2?|ttf|ico|csv|zip)).*)",
    "/(api|trpc)(.*)",
  ],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check if the 'sessionCartId' cookie exists.
  // Note: We access the cookie's value using the `.value` property.
  const sessionCartId = request.cookies.get("sessionCartId")?.value;
  
  if (!sessionCartId) {
    // Generate a new UUID for the sessionCartId.
    const newSessionCartId = crypto.randomUUID();

    // Create a NextResponse that will continue routing.
    const response = NextResponse.next();

    // Set the new sessionCartId cookie in the response.
    response.cookies.set("sessionCartId", newSessionCartId, {
      path: "/", // Ensure the cookie is available on all routes.
    });

    return response;
  }

  // If the cookie is present, simply continue.
  return NextResponse.next();
}


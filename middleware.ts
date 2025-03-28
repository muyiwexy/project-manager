import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { APPWRITE_NODE } from "./lib/server_appwrite";
import { permit } from "./lib/permit/permit";

type UserAttributes = {
  roles: string;
  department: string;
  employment_status: string;
};

type AuthContext = {
  allowed: boolean;
  uniqueId: string;
  department: string;
};

/**
 * Middleware for project creation authorization
 */
export async function middleware(request: NextRequest) {
  if (request.method !== "POST") {
    return NextResponse.next();
  }

  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized - Missing or invalid token" },
        { status: 401 }
      );
    }

    const jwt = authHeader.split(" ")[1];

    APPWRITE_NODE.client.setJWT(jwt);

    const user = await APPWRITE_NODE.account.get();
    const { roles, department, employment_status } =
      user.prefs as UserAttributes;

    const uniqueId = APPWRITE_NODE.id.unique();

    const allowed = await permit.check(
      {
        key: user.email,
        attributes: { roles, department, employment_status },
      },
      "create",
      {
        type: "Projects",
        key: uniqueId,
        attributes: {
          department: department,
        },
      }
    );

    const context: AuthContext = {
      allowed,
      uniqueId,
      department,
    };

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-auth-context", JSON.stringify(context));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error("Authorization middleware error:", error);

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-auth-error", "true");
    requestHeaders.set(
      "x-auth-error-message",
      error instanceof Error ? error.message : "Unknown error"
    );

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
}

export const config = {
  matcher: ["/api/:path*"],
};

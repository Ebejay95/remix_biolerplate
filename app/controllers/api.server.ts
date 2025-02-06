// app/controllers/api.server.ts
import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { AuthController } from "./auth.server";

interface ApiError {
  error: string;
  message?: string;
  path?: string;
}

export class ApiController {
  private static readonly CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  static async handleRequest({ request, params }: LoaderFunctionArgs) {
    // Handle OPTIONS requests for CORS
    if (request.method === "OPTIONS") {
      return json(null, { headers: this.CORS_HEADERS });
    }

    try {
      // Authenticate user
      await AuthController.requireAuthenticatedUser(request);

      // Get the route path from params
      const path = params["*"];

      try {
        // Dynamically import the route handler
        const route = await import(/* @vite-ignore */ `../routes/${path}.tsx`);

        // Verify loader exists
        if (!route.loader) {
          throw new Error("No loader found");
        }

        // Execute the route's loader
        const response = await route.loader({ request, params });
        const data = await response.json();

        // Return the response with CORS headers
        return json(data, {
          headers: {
            ...this.CORS_HEADERS,
            "Cache-Control": "no-cache, no-store, must-revalidate",
          }
        });

      } catch (error) {
        // Handle route-specific errors
        if (error instanceof Error && error.message === "No loader found") {
          console.error("API route error: No loader found for path", path);
        } else {
          console.error("API route error:", error);
        }

        const errorResponse: ApiError = {
          error: "Not Found",
          path
        };

        return json(errorResponse, {
          status: 404,
          headers: this.CORS_HEADERS
        });
      }

    } catch (error) {
      // Handle authentication errors
      if (error instanceof Response && error.status === 401) {
        const errorResponse: ApiError = {
          error: "Unauthorized",
          message: "Please login to access this resource"
        };

        return json(errorResponse, {
          status: 401,
          headers: this.CORS_HEADERS
        });
      }

      // Handle unexpected errors
      console.error("Unexpected error in API route:", error);
      const errorResponse: ApiError = {
        error: "Internal Server Error",
        message: "An unexpected error occurred"
      };

      return json(errorResponse, {
        status: 500,
        headers: this.CORS_HEADERS
      });
    }
  }
}

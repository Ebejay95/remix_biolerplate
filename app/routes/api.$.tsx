import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireAuthenticatedUser } from "~/services/session.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  try {
    // Verify authentication first
    await requireAuthenticatedUser(request);

    const path = params["*"];

    try {
      const route = await import(/* @vite-ignore */ `./${path}.tsx`);

      if (!route.loader) {
        throw new Error("No loader found");
      }

      const response = await route.loader({ request, params });
      const data = await response.json();
      return json(data);

    } catch (error) {
      if (error instanceof Error && error.message === "No loader found") {
        console.error("API route error: No loader found for path", path);
      } else {
        console.error("API route error:", error);
      }

      return json(
        { error: "Not Found", path },
        { status: 404 }
      );
    }

  } catch (error) {
    // Handle authentication errors
    if (error instanceof Response) {
      if (error.status === 401) {
        return json(
          {
            error: "Unauthorized",
            message: "Please login to access this resource"
          },
          { status: 401 }
        );
      }
      throw error;
    }

    // Handle unexpected errors
    console.error("Unexpected error in API route:", error);
    return json(
      {
        error: "Internal Server Error",
        message: "An unexpected error occurred"
      },
      { status: 500 }
    );
  }
};

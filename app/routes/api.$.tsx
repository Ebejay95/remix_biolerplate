import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireUserId } from "~/services/session.server";


export const loader: LoaderFunction = async ({ request, params }) => {
  try {
    await requireUserId(request);

    const path = params["*"];

    try {
      const route = await import(`./${path}.tsx`);

      if (route.loader) {
        const response = await route.loader({ request, params });

        const data = await response.json();

        return json(data);
      }

      throw new Error("No loader found");
    } catch (error) {
      console.error("API route error:", error);
      return json(
        { error: "Not Found", path },
        { status: 404 }
      );
    }
  } catch (error) {
    if (error instanceof Response && error.status === 302) {
      return json(
        {
          error: "Unauthorized",
          message: "Please login to access this resource"
        },
        { status: 401 }
      );
    }

    console.error("Authentication error:", error);
    return json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
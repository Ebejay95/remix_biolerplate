import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireUser } from "~/services/session.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {

  await requireUser(request);

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
    return json(
      { error: "Not Found", path },
      { status: 404 }
    );
  }
};
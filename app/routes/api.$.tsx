// routes/api.$.tsx
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

/**
 * Dieser Loader fängt alle API-Anfragen ab und leitet sie an die entsprechende Route weiter
 */
export const loader: LoaderFunction = async ({ request, params }) => {
	const url = new URL(request.url);
	const path = params["*"]; // Gibt uns den Rest des Pfads nach /api/

	try {
		// Dynamischer Import der entsprechenden Route
		const route = await import(`./${path}.tsx`);

		// Prüfe ob die Route einen Loader hat
		if (route.loader) {
			// Führe den Loader der Route aus
			const response = await route.loader({ request, params });

			// Hole die Daten aus der Response
			const data = await response.json();

			// Gib die Daten als JSON zurück
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
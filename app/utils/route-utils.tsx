import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

/**
 * HOF (Higher Order Function) die einen Loader erstellt,
 * der sowohl für HTML als auch JSON-Responses verwendet werden kann
 */
export function createLoader<T>(dataFn: () => T | Promise<T>): LoaderFunction {
	return async ({ request }) => {
		const data = await dataFn();
		return json(data);
	};
}
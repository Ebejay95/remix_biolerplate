import type { LoaderFunctionArgs } from "@remix-run/node";
import { ApiController } from "~/controllers/api.server";

export const loader = async (args: LoaderFunctionArgs) => {
 return ApiController.handleRequest(args);
};

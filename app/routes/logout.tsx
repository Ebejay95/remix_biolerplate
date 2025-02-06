// app/routes/logout.tsx
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { AuthController } from "~/controllers/auth.server";

export const action = ({ request }: ActionFunctionArgs) => {
 return AuthController.logout(request);
};

export const loader = ({ request }: LoaderFunctionArgs) => {
 return AuthController.logout(request);
};

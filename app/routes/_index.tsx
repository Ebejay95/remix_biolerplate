// app/routes/index.tsx
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { createMetaFunction } from "~/utils/meta";
import { AuthController } from "~/controllers/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => null;

export const meta = createMetaFunction({
	title: "App | Remix Boilerplate",
	description: "The App"
});

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to the Application
          </h1>
          <p className="mt-4 text-lg opacity-75">
            Please sign in to access your dashboard.
          </p>
        </div>
        <div className="flex justify-center btn-group">
          <Link to="/dashboard" className="btn-secondary text-center">
            To Dashboard
          </Link>
          <Link to="/about" className="btn-secondary text-center">
            About
          </Link>
        </div>
      </div>
    </div>
  );
}

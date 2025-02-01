import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { User } from "~/models/user.server";
import { getUserId, createUserSession } from "~/services/session.server";
import bcrypt from "bcryptjs";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) {
    return redirect("/dashboard");
  }
  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return json({ error: "Invalid credentials" }, { status: 400 });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return json({ error: "Invalid credentials" }, { status: 400 });
  }

  return createUserSession(user._id.toString(), "/dashboard");
};

export const meta: MetaFunction = () => {
	return [
		{ title: "Login | Remix Boilerplate" },
		{ name: "description", content: "Login to the app" },
		{ property: "og:title", content: "Login | Remix Boilerplate" },
		{ property: "og:description", content: "Login to the app" },
	];
  };

export default function Login() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Login to your account
          </h2>
          <p className="mt-2 text-sm opacity-75">
            Enter your credentials to access the dashboard
          </p>
        </div>

        <div className="dashboard-card p-8">
          <Form method="post" className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="form-input rounded-md"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="form-input rounded-md"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {actionData?.error && (
              <div className="text-sm text-red-500">{actionData.error}</div>
            )}

            <button type="submit" className="btn-primary w-full">
              Login
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}
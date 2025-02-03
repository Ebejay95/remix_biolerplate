import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { User } from "~/models/user.server";
import { createUserSession } from "~/services/session.server";
import { getAuthenticatedUser } from "~/services/session.server";
import { validateEmail } from "~/utils/validations";
import bcrypt from "bcryptjs";
import { generateMeta } from "~/utils/meta";

interface ActionData {
  errors?: {
    email?: string;
    password?: string;
    form?: string;
  };
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getAuthenticatedUser(request);
  if (user) {
    return redirect("/dashboard");
  }
  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  // Validate form inputs
  const errors: ActionData["errors"] = {};

  if (!email || typeof email !== "string") {
    errors.email = "Email is required";
  } else {
    const emailError = validateEmail(email);
    if (emailError) errors.email = emailError;
  }

  if (!password || typeof password !== "string") {
    errors.password = "Password is required";
  }

  if (Object.keys(errors).length > 0) {
    return json<ActionData>({ errors }, { status: 400 });
  }

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return json<ActionData>(
        { errors: { form: "Invalid credentials" } },
        { status: 400 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return json<ActionData>(
        { errors: { form: "Invalid credentials" } },
        { status: 400 }
      );
    }

    return createUserSession(user._id.toString(), "/dashboard");
  } catch (error) {
    console.error("Login error:", error);
    return json<ActionData>(
      { errors: { form: "An error occurred during login" } },
      { status: 500 }
    );
  }
};

export const meta: MetaFunction = () => {
  return generateMeta({
    title: "Login | Remix Boilerplate",
    description: "Login to the app",
  });
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
                  aria-describedby={actionData?.errors?.email ? "email-error" : undefined}
                />
                {actionData?.errors?.email && (
                  <p className="mt-1 text-sm text-red-500" id="email-error">
                    {actionData.errors.email}
                  </p>
                )}
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
                  aria-describedby={actionData?.errors?.password ? "password-error" : undefined}
                />
                {actionData?.errors?.password && (
                  <p className="mt-1 text-sm text-red-500" id="password-error">
                    {actionData.errors.password}
                  </p>
                )}
              </div>
            </div>

            {actionData?.errors?.form && (
              <div
                className="text-sm text-red-500"
                role="alert"
              >
                {actionData.errors.form}
              </div>
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

import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, Link } from "@remix-run/react";
import { createUser } from "~/services/auth.server";
import { validateEmail, validatePassword } from "~/utils/validations";
import { requireUserId } from "~/services/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);
  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireUserId(request);

  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const role = formData.get("role") as string || "user";

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
    confirmPassword: password !== confirmPassword ? "Passwords do not match" : null,
  };

  if (Object.values(errors).some(Boolean)) {
    return json({ errors }, { status: 400 });
  }

  try {
    await createUser(email, password, role as "user" | "admin");
    return redirect("/dashboard");
  } catch (error) {
    return json({
      errors: {
        form: "Error creating account"
      }
    }, { status: 500 });
  }
};

export const meta: MetaFunction = () => {
	return [
		{ title: "Register | Remix Boilerplate" },
		{ name: "description", content: "Register to the app" },
		{ property: "og:title", content: "Register | Remix Boilerplate" },
		{ property: "og:description", content: "Register to the app" },
	];
  };

export default function Register() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Create new user
          </h2>
          <p className="mt-2 text-sm opacity-75">
            Add a new user to the system
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
                  placeholder="Enter email address"
                />
                {actionData?.errors?.email && (
                  <p className="mt-1 text-sm text-red-500">{actionData.errors.email}</p>
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
                  required
                  className="form-input rounded-md"
                  placeholder="Create password"
                />
                {actionData?.errors?.password && (
                  <p className="mt-1 text-sm text-red-500">{actionData.errors.password}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="form-input rounded-md"
                  placeholder="Confirm password"
                />
                {actionData?.errors?.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{actionData.errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium">
                User Role
              </label>
              <div className="mt-1">
                <select
                  id="role"
                  name="role"
                  className="form-input rounded-md"
                  defaultValue="user"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {actionData?.errors?.form && (
              <div className="text-sm text-red-500">{actionData.errors.form}</div>
            )}

            <div className="flex items-center justify-between gap-4">
              <button type="submit" className="btn-primary flex-1">
                Create User
              </button>
              <Link to="/dashboard" className="btn-secondary">
                Cancel
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
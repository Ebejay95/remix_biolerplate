import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, Link, useLoaderData } from "@remix-run/react";
import { validateEmail, validatePassword } from "~/utils/validations";
import { generateMeta } from "~/utils/meta";
import {
  createUser,
  getAuthenticatedUser,
  createUserSession,
  type AuthenticatedUser
} from "~/services/session.server";

interface ActionData {
  errors?: {
    email?: string;
    password?: string;
    confirmPassword?: string;
    role?: string;
    form?: string;
  };
}

interface LoaderData {
  isAdmin: boolean;
}

type UserRole = AuthenticatedUser['role'];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getAuthenticatedUser(request);
  return json<LoaderData>({
    isAdmin: user?.role === 'admin' || user?.role === 'master'
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const role = formData.get("role");

  // Get current user to check permissions
  const currentUser = await getAuthenticatedUser(request);

  // Determine the role to be set
  let finalRole: UserRole = "user"; // Default role
  if (currentUser?.role === "admin" || currentUser?.role === "master") {
    finalRole = (role as UserRole) || "user";
  }

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
  } else {
    const passwordError = validatePassword(password);
    if (passwordError) errors.password = passwordError;
  }

  if (!confirmPassword || typeof confirmPassword !== "string") {
    errors.confirmPassword = "Please confirm your password";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  // Only validate role if user is admin/master and role was provided
  if (currentUser?.role === "admin" || currentUser?.role === "master") {
    if (role && role !== "user" && role !== "admin") {
      errors.role = "Invalid role selected";
    }
  }

  if (Object.keys(errors).length > 0) {
    return json<ActionData>({ errors }, { status: 400 });
  }

  try {
    const user = await createUser(email, password, finalRole);

    // If no user is logged in, create a session for the new user
    if (!currentUser) {
      return createUserSession(user._id.toString(), "/dashboard");
    }

    // If admin created a new user, redirect to dashboard without creating session
    return redirect("/dashboard");
  } catch (error) {
    if (error instanceof Error && error.message === "User already exists") {
      return json<ActionData>(
        { errors: { email: "A user with this email already exists" } },
        { status: 400 }
      );
    }

    console.error("User creation error:", error);
    return json<ActionData>(
      { errors: { form: "Error creating account. Please try again." } },
      { status: 500 }
    );
  }
};

export const meta: MetaFunction = () => {
  return generateMeta({
    title: "Register | Remix Boilerplate",
    description: "Register to the app",
  });
};

export default function Register() {
  const actionData = useActionData<typeof action>();
  const { isAdmin } = useLoaderData<typeof loader>();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            {isAdmin ? "Create new user" : "Register"}
          </h2>
          <p className="mt-2 text-sm opacity-75">
            {isAdmin ? "Add a new user to the system" : "Create your account"}
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
                  required
                  className="form-input rounded-md"
                  placeholder="Create password"
                  aria-describedby={actionData?.errors?.password ? "password-error" : undefined}
                />
                {actionData?.errors?.password && (
                  <p className="mt-1 text-sm text-red-500" id="password-error">
                    {actionData.errors.password}
                  </p>
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
                  aria-describedby={actionData?.errors?.confirmPassword ? "confirmPassword-error" : undefined}
                />
                {actionData?.errors?.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500" id="confirmPassword-error">
                    {actionData.errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {isAdmin && (
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
                    aria-describedby={actionData?.errors?.role ? "role-error" : undefined}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  {actionData?.errors?.role && (
                    <p className="mt-1 text-sm text-red-500" id="role-error">
                      {actionData.errors.role}
                    </p>
                  )}
                </div>
              </div>
            )}

            {actionData?.errors?.form && (
              <div
                className="text-sm text-red-500"
                role="alert"
              >
                {actionData.errors.form}
              </div>
            )}

            <div className="flex items-center justify-between gap-4">
              <button type="submit" className="btn-primary flex-1">
                {isAdmin ? "Create User" : "Register"}
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

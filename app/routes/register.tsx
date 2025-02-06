import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, Link, useLoaderData } from "@remix-run/react";
import { AuthController } from "~/controllers/auth.server";
import { createMetaFunction } from "~/utils/meta";
import { validateEmail, validatePassword } from "~/utils/validations";
import type { AuthUser } from "~/controllers/auth.server";

interface ActionData {
 errors?: {
   email?: string;
   password?: string;
   confirmPassword?: string;
   role?: string;
   form?: string;
 };
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
 const user = await AuthController.getAuthenticatedUser(request);
 return json({
   isAdmin: user?.role === 'admin' || user?.role === 'master'
 });
};

export const action = async ({ request }: ActionFunctionArgs) => {
 const formData = await request.formData();
 const email = formData.get("email") as string;
 const password = formData.get("password") as string;
 const confirmPassword = formData.get("confirmPassword") as string;
 const role = formData.get("role");

 const currentUser = await AuthController.getAuthenticatedUser(request);
 const finalRole: AuthUser['role'] =
   (currentUser?.role === "admin" || currentUser?.role === "master")
   ? (role as AuthUser['role']) || "user"
   : "user";

 const errors: ActionData["errors"] = {};

 if (!email) {
   errors.email = "Email is required";
 } else {
   const emailError = validateEmail(email);
   if (emailError) errors.email = emailError;
 }

 if (!password) {
   errors.password = "Password is required";
 } else {
   const passwordError = validatePassword(password);
   if (passwordError) errors.password = passwordError;
 }

 if (!confirmPassword) {
   errors.confirmPassword = "Please confirm your password";
 } else if (password !== confirmPassword) {
   errors.confirmPassword = "Passwords do not match";
 }

 if (Object.keys(errors).length) {
   return json<ActionData>({ errors }, { status: 400 });
 }

 try {
   const user = await AuthController.createUser(email, password, finalRole);
   return currentUser
     ? redirect("/dashboard")
     : AuthController.createSession(user._id.toString(), "/dashboard");
 } catch (error) {
   if (error instanceof Error && error.message === "User already exists") {
     return json<ActionData>(
       { errors: { email: "A user with this email already exists" } },
       { status: 400 }
     );
   }
   console.error("User creation error:", error);
   return json<ActionData>(
     { errors: { form: "Error creating account" } },
     { status: 500 }
   );
 }
};

export const meta = createMetaFunction({
 title: "Register | Remix Boilerplate",
 description: "Register to the app"
});

// Component code remains the same
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

import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { AuthController } from "~/controllers/auth.server";
import { createMetaFunction } from "~/utils/meta";
import { validateEmail } from "~/utils/validations";

interface ActionData {
 errors?: {
   email?: string;
   password?: string;
   form?: string;
 };
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
 const user = await AuthController.getAuthenticatedUser(request);
 return user ? AuthController.createSession(user._id, "/dashboard") : null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
 const formData = await request.formData();
 const email = formData.get("email") as string;
 const password = formData.get("password") as string;

 const errors: ActionData["errors"] = {};

 if (!email) {
   errors.email = "Email is required";
 } else {
   const emailError = validateEmail(email);
   if (emailError) errors.email = emailError;
 }

 if (!password) {
   errors.password = "Password is required";
 }

 if (Object.keys(errors).length) {
   return json<ActionData>({ errors }, { status: 400 });
 }

 try {
   const user = await AuthController.verifyLogin(email, password);
   if (!user) {
     return json<ActionData>(
       { errors: { form: "Invalid credentials" } },
       { status: 400 }
     );
   }

   return AuthController.createSession(user._id.toString(), "/dashboard");
 } catch (error) {
   console.error("Login error:", error);
   return json<ActionData>(
     { errors: { form: "An error occurred during login" } },
     { status: 500 }
   );
 }
};

export const meta = createMetaFunction({
 title: "Login | Remix Boilerplate",
 description: "Login to the app"
});

// Rest of the component code remains the same
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

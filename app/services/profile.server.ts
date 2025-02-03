// app/routes/profile.server.ts
import { json } from "@remix-run/node";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { requireAuthenticatedUser } from "~/services/session.server";
import { User } from "~/models/user.server";

export async function getProfile(request: Request) {
  const authenticatedUser = await requireAuthenticatedUser(request);
  return json({ user: authenticatedUser });
}

export async function updateProfile(request: Request) {
  const authenticatedUser = await requireAuthenticatedUser(request);
  const formData = await request.formData();
  const email = formData.get("email") as string;

  try {
    await User.findByIdAndUpdate(authenticatedUser._id, { email });
    return json({ success: true });
  } catch (error) {
    console.error("Update profile error:", error);
    return json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

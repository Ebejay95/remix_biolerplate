import { json } from "@remix-run/node";
import { AuthController } from "./auth.server";
import { UserController } from "./user.server";

export class ProfileController {
 static async getProfile(request: Request) {
   const user = await AuthController.requireAuthenticatedUser(request);
   return json({ user });
 }

 static async updateProfile(request: Request) {
   const user = await AuthController.requireAuthenticatedUser(request);
   const formData = await request.formData();
   const email = formData.get("email") as string;

   try {
     await UserController.update(user._id, { email });
     return json({ success: true });
   } catch (error) {
     console.error("Update profile error:", error);
     return json({ error: "Failed to update profile" }, { status: 500 });
   }
 }
}

import { createCookieSessionStorage, redirect, json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import bcrypt from "bcryptjs";
import { UserController } from "./user.server";

export interface AuthUser {
 _id: string;
 email: string;
 role: 'user' | 'admin' | 'master';
 verified: boolean;
 createdAt: string;
}

const storage = createCookieSessionStorage({
 cookie: {
   name: "RJ_session",
   secure: process.env.NODE_ENV === "production",
   secrets: [process.env.SESSION_SECRET || ""],
   sameSite: "lax",
   path: "/",
   maxAge: 60 * 60 * 24 * 30,
   httpOnly: true,
 },
});

export class AuthController {
 static async createSession(userId: string, redirectTo: string) {
   const session = await storage.getSession();
   session.set("userId", userId);
   return redirect(redirectTo, {
     headers: { "Set-Cookie": await storage.commitSession(session) },
   });
 }

 static async getUserId(request: Request): Promise<string | null> {
   const session = await storage.getSession(request.headers.get("Cookie"));
   const userId = session.get("userId");
   return typeof userId === "string" ? userId : null;
 }

 static async requireUserId(request: Request): Promise<string> {
   const userId = await this.getUserId(request);
   if (!userId) throw redirect("/login");
   return userId;
 }

 static async logout(request: Request) {
   const session = await storage.getSession(request.headers.get("Cookie"));
   return redirect("/", {
     headers: { "Set-Cookie": await storage.destroySession(session) },
   });
 }

 static async createUser(email: string, password: string, role: AuthUser['role'] = 'user') {
   if (await UserController.findOne({ email })) {
     throw new Error("User already exists");
   }

   return UserController.create({
     email,
     password: await bcrypt.hash(password, 10),
     role,
     verificationToken: bcrypt.genSaltSync(10),
     verified: role === 'master'
   });
 }

 static async verifyLogin(email: string, password: string) {
   const user = await UserController.findOne({ email }, '+password');
   if (!user) return null;

   return await bcrypt.compare(password, user.password) ? user : null;
 }

 static async getAuthenticatedUser(request: Request): Promise<AuthUser | null> {
   try {
     const userId = await this.getUserId(request);
     if (!userId) return null;

     const user = await UserController.findById(userId);
     if (!user) return null;

     return {
       _id: user._id.toString(),
       email: user.email,
       role: user.role,
       verified: user.verified,
       createdAt: user.createdAt.toISOString(),
     };
   } catch (error) {
     console.error('Authentication error:', error);
     return null;
   }
 }

 static async requireAuthenticatedUser(request: Request): Promise<AuthUser> {
   const user = await this.getAuthenticatedUser(request);
   if (!user) {
     throw json(
       { error: "Unauthorized", message: "Please log in" },
       { status: 401 }
     );
   }
   return user;
 }

 static createProtectedLoader<T>(
   handler: (user: AuthUser, args: LoaderFunctionArgs) => Promise<T>
 ) {
   return async (args: LoaderFunctionArgs) => {
     const user = await this.requireAuthenticatedUser(args.request);
     return handler(user, args);
   };
 }
}

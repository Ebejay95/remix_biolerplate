import { createCookieSessionStorage, json, redirect } from "@remix-run/node";
import { User, UserRole } from "~/models/user.server";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

export async function requireUser(request: Request, requiredRole?: UserRole) {
  const userId = await getUserId(request);

  if (!userId) {
    throw redirect("/login");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw redirect("/login");
  }

  if (requiredRole && user.role !== requiredRole && user.role !== 'master') {
    throw redirect("/unauthorized");
  }

  return user;
}

export async function getUserId(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  return userId;
}

export async function logout(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

export async function createUser(email: string, password: string, role: UserRole = 'user') {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const verificationToken = crypto.randomBytes(32).toString('hex');

  const user = await User.create({
    email,
    password,
    role,
    verificationToken,
    verified: role === 'master'
  });

  // typically send a verification email
  // await sendVerificationEmail(email, verificationToken);

  return user;
}
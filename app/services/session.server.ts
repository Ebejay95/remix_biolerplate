import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import bcrypt from "bcryptjs";
import { User } from "~/models/user.server";

export interface AuthenticatedUser {
  _id: string;
  email: string;
  role: 'user' | 'admin' | 'master';
  verified: boolean;
  createdAt: string;
}

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

export async function getUserId(request: Request): Promise<string | null> {
  const session = await storage.getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") return null;
  return userId;
}

export async function requireUserId(request: Request): Promise<string> {
  const userId = await getUserId(request);
  if (!userId) {
    throw redirect("/login");
  }
  return userId;
}

export async function logout(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  return redirect("/", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

function generateVerificationToken(): string {
  return bcrypt.genSaltSync(10); // Using bcrypt's salt generation as a random token
}

export async function createUser(email: string, password: string, role: AuthenticatedUser['role'] = 'user') {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = generateVerificationToken();

  const user = await User.create({
    email,
    password: hashedPassword, // Store hashed password
    role,
    verificationToken,
    verified: role === 'master'
  });

  // typically send a verification email
  // await sendVerificationEmail(email, verificationToken);

  return user;
}

export async function verifyLogin(email: string, password: string) {
  const user = await User.findOne({ email });
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return user;
}

export async function getAuthenticatedUser(request: Request): Promise<AuthenticatedUser | null> {
  try {
    const userId = await getUserId(request);
    if (!userId) return null;

    const user = await User.findById(userId).select('-password');
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

export async function requireAuthenticatedUser(request: Request): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    throw json(
      { error: "Unauthorized", message: "Please log in to access this resource" },
      { status: 401 }
    );
  }
  return user;
}

export function createProtectedLoader<T>(
  handler: (user: AuthenticatedUser, args: LoaderFunctionArgs) => Promise<T>
) {
  return async (args: LoaderFunctionArgs) => {
    const user = await requireAuthenticatedUser(args.request);
    return handler(user, args);
  };
}

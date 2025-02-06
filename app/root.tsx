// app/root.tsx
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useMatches,
  useRouteError,
  isRouteErrorResponse,
  Link
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { ProfileMenu } from "~/components/profile-menu";
import { AuthController, type AuthUser } from "~/controllers/auth.server";
import "./styles/tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap",
  },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await AuthController.getAuthenticatedUser(request);
  return json({ user });
};

function getPageTitle(matches: ReturnType<typeof useMatches>) {
  for (const match of [...matches].reverse()) {
    if (match.handle?.meta) {
      const meta = Array.isArray(match.handle.meta)
        ? match.handle.meta
        : match.handle.meta({});

      const title = meta.find(m => m.title)?.title;
      if (title) return title;
    }

    if (match.data?.meta) {
      const meta = Array.isArray(match.data.meta)
        ? match.data.meta
        : (typeof match.data.meta === 'function'
          ? match.data.meta({})
          : match.data.meta);

      const title = meta.find(m => m.title)?.title;
      if (title) return title;
    }
  }
  return "Application";
}

function Document({
  children,
  user
}: {
  children: React.ReactNode;
  user: AuthUser | null;
}) {
  const matches = useMatches();
  const title = getPageTitle(matches);
  const linkPath = user ? '/dashboard' : '/';

  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <div className="min-h-full">
          <header className="dashboard-header">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
              <Link to={linkPath}>
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              </Link>
              <nav className="bg-white shadow-sm dark:bg-gray-800">
                <ProfileMenu user={user} />
              </nav>
            </div>
          </header>
          <main>
            {children}
          </main>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <Document user={null}>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-xl w-full space-y-8 text-center">
          <h1 className="text-4xl font-bold">
            {isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : 'Application Error'}
          </h1>
          <p className="text-lg opacity-75">
            {isRouteErrorResponse(error)
              ? error.data?.message || 'Something went wrong'
              : error instanceof Error
                ? error.message
                : 'An unexpected error occurred'}
          </p>
          <div>
            <a href="/" className="btn-primary">
              Return Home
            </a>
          </div>
        </div>
      </div>
    </Document>
  );
}

export default function App() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <Document user={user}>
      <Outlet />
    </Document>
  );
}

import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useMatches,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { ProfileMenu } from "~/components/profile-menu";
import { getAuthenticatedUser, type AuthenticatedUser } from "~/services/session.server";
import { Link } from "@remix-run/react";
import "./styles/tailwind.css";

interface LoaderData {
  user: AuthenticatedUser | null;
}

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getAuthenticatedUser(request);
  return json<LoaderData>({ user });
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

  return "Dashboard";
}

function Document({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>();
  const matches = useMatches();
  const title = getPageTitle(matches);

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
              <Link to="/"><h1 className="text-3xl font-bold tracking-tight">{title}</h1></Link>
              <nav className="bg-white shadow-sm dark:bg-gray-800">
                <ProfileMenu user={data?.user ?? null} />
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

export function Layout({ children }: { children: React.ReactNode }) {
  return <Document>{children}</Document>;
}

export default function App() {
  return <Outlet />;
}

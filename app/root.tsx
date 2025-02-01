// app/root.tsx
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
  } from "@remix-run/react";
  import type { LinksFunction, LoaderFunction } from "@remix-run/node";
  import { json } from "@remix-run/node";
  import { User } from "~/models/user.server";
  import { getUserId } from "./services/session.server";
  import { ProfileMenu } from "~/components/profile-menu";

  import "./tailwind.css";

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

  interface LoaderData {
	user: {
	  _id: string;
	  email: string;
	  role: 'user' | 'admin' | 'master';
	  verified: boolean;
	  createdAt: string;
	} | null;
  }

  export const loader: LoaderFunction = async ({ request }) => {
	try {
	  const userId = await getUserId(request);

	  if (!userId) {
		return json<LoaderData>({ user: null });
	  }

	  const user = await User.findById(userId).select('-password');

	  if (!user) {
		return json<LoaderData>({ user: null });
	  }

	  return json<LoaderData>({
		user: {
		  _id: user._id.toString(),
		  email: user.email,
		  role: user.role,
		  verified: user.verified,
		  createdAt: user.createdAt.toISOString(),
		}
	  });
	} catch (error) {
	  console.error('Loader error:', error);
	  return json<LoaderData>({ user: null });
	}
  };

  function Document({ children }: { children: React.ReactNode }) {
	const data = useLoaderData<LoaderData>();

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
			<nav className="bg-white shadow-sm dark:bg-gray-800">
			  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
				  <div className="flex">
					{/* Logo und Navigation hier */}
				  </div>
				  <div className="flex items-center">
					<ProfileMenu user={data.user} />
				  </div>
				</div>
			  </div>
			</nav>
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
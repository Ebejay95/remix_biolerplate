import { LoaderFunctionArgs, json } from "@remix-run/node";
import { requireUserId } from "~/services/session.server";
import { useLoaderData, Form, Link } from "@remix-run/react";
import { User } from "~/models/user.server";
import type { MetaFunction } from "@remix-run/node";

type LoaderData = {
  currentUserId: string;
  users: Array<{
    _id: string;
    email: string;
    role: string;
    verified: boolean;
    createdAt: string;
  }>;
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  try {
    const currentUserId = await requireUserId(request);
    const isApi = params.type === 'api';

    const users = await User.find({})
      .select('email role verified createdAt')
      .sort({ createdAt: -1 });

    const data = {
      currentUserId,
      users: users.map(user => ({
        _id: user._id.toString(),
        email: user.email,
        role: user.role,
        verified: user.verified,
        createdAt: user.createdAt.toLocaleString()
      }))
    };

    if (isApi) {
      return json(data);
    }

    return json<LoaderData>(data);
  } catch (error) {
    if (error instanceof Response && error.status === 302 && params.type === 'api') {
      return json({
        error: "Unauthorized",
        message: "Please log in to access this resource"
      }, {
        status: 401
      });
    }

    if (error instanceof Response) {
      throw error;
    }

    console.error('Error in dashboard route:', error);

    if (params.type === 'api') {
      return json({
        error: "Internal Server Error",
        message: "Failed to fetch dashboard data"
      }, {
        status: 500
      });
    }

    throw new Error('Failed to load dashboard data');
  }
};

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard | Remix Boilerplate" },
    { name: "description", content: "Manage your app" },
    { property: "og:title", content: "Dashboard | Remix Boilerplate" },
    { property: "og:description", content: "Manage your app" },
  ];
};

export default function Dashboard() {
  const { currentUserId, users } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen">
      <header className="dashboard-header">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="dashboard-card rounded-lg">
          <div className="px-6 py-5 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
            <div>
              <h2 className="text-xl font-semibold">User Management</h2>
              <p className="mt-1 text-sm opacity-75">
                Manage user accounts and permissions
              </p>
            </div>
            <Link to="/register" className="btn-primary">
              Add User
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="dashboard-table min-w-full">
              <thead>
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider opacity-75">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider opacity-75">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider opacity-75">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider opacity-75">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className={`${user._id === currentUserId ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''} hover:bg-gray-50/50 dark:hover:bg-gray-800/50`}
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium">{user.email}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold
                        ${user.role === 'master' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200' :
                          user.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200' :
                          'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold
                        ${user.verified ?
                          'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'}`}>
                        {user.verified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm opacity-75">
                      {user.createdAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
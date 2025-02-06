// app/routes/dashboard.tsx
import { useLoaderData, Link } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { UserController } from "~/controllers/user.server";
import { AuthController } from "~/controllers/auth.server";
import { createMetaFunction } from "~/utils/meta";
import type { AuthUser } from "~/controllers/auth.server";
import React from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await AuthController.requireAuthenticatedUser(request);
  const users = await UserController.getUsers();

  return json({
    currentUserId: user._id,
    users: users.map(user => ({
      _id: user._id,
      email: user.email,
      role: user.role,
      verified: user.verified,
      createdAt: user.createdAt
    }))
  });
};

export const meta = createMetaFunction({
  title: "Dashboard | Admin",
  description: "Manage your application"
});

interface Props {
  role: AuthUser['role'];
  verified: boolean;
}

const RoleTag = ({ role }: Pick<Props, 'role'>) => {
  const styles = {
    master: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200',
    admin: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200',
    user: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
  };
  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${styles[role]}`}>
      {role}
    </span>
  );
};

const StatusTag = ({ verified }: Pick<Props, 'verified'>) => {
  const styles = verified
    ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200';
  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${styles}`}>
      {verified ? 'Verified' : 'Unverified'}
    </span>
  );
};

export default function Dashboard() {
  const { currentUserId, users } = useLoaderData<typeof loader>();
const layout = [
  { i: 'a', x: 0, y: 0, w: 2, h: 2 },
  { i: 'b', x: 2, y: 0, w: 2, h: 2 },
  { i: 'c', x: 4, y: 0, w: 2, h: 2 }
];
  return (
    <div className="min-h-screen">
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
                      <RoleTag role={user.role} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <StatusTag verified={user.verified} />
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
		<GridLayout className="layout" layout={layout} cols={12} rowHeight={30} width={1200}>
			<div className="dashboard-card p-6 rounded-lg" key="a">A</div>
			<div className="dashboard-card p-6 rounded-lg" key="b">B</div>
			<div className="dashboard-card p-6 rounded-lg" key="c">C</div>
		</GridLayout>
      </main>
    </div>
  );
}

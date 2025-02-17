import { useLoaderData, Link } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { UserController } from "~/controllers/user.server";
import { AuthController } from "~/controllers/auth.server";
import { createMetaFunction } from "~/utils/meta";
import type { AuthUser } from "~/controllers/auth.server";
import React, { useState, useCallback} from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { DynamicTable } from "../components/table"
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

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

const generateLayout = () => ({
  lg: [
    { i: "active-users", x: 0, y: 0, w: 12, h: 2 },
    { i: "new-registrations", x: 0, y: 2, w: 12, h: 2 },
    { i: "pending-verifications", x: 0, y: 4, w: 12, h: 2 }
  ]
});

export default function Dashboard() {
  const { currentUserId, users } = useLoaderData<typeof loader>();
  const [layouts, setLayouts] = useState(generateLayout());
  const [isInteractingWithContent, setIsInteractingWithContent] = useState(false);

  const handleLayoutChange = (_, allLayouts) => {
    console.log('Layout changed:', allLayouts);
    setLayouts(allLayouts);
  };

  const handleContentMouseEnter = useCallback(() => {
    setIsInteractingWithContent(true);
  }, []);

  const handleContentMouseLeave = useCallback(() => {
    setIsInteractingWithContent(false);
  }, []);

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mt-8">
          <ResponsiveGridLayout
            className="layout dashboard-grid"
            layouts={layouts}
            breakpoints={{ lg: 1200 }}
            cols={{ lg: 12 }}
            rowHeight={150}
            margin={[20, 20]}
            isResizable={true}
            isDraggable={true}
            onLayoutChange={handleLayoutChange}
            resizeHandles={['se']}
            preventCollision={false}
            compactType="vertical"
          >
            <div
              key="active-users"
              className="dashboard-card p-6 rounded-lg shadow-sm"
            >
              <div className="dashboard-card-content"
                onMouseEnter={handleContentMouseEnter}
                onMouseLeave={handleContentMouseLeave}>
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
                <DynamicTable
                  data={users}
                  highlightedId={currentUserId}
                  excludeFields={['password', '__v']}
                />
              </div>
            </div>

            <div
              key="new-registrations"
              className="dashboard-card p-6 rounded-lg shadow-sm"
            >
              {/* Content for new registrations */}
            </div>

            <div
              key="pending-verifications"
              className="dashboard-card p-6 rounded-lg shadow-sm"
            >
              {/* Content for pending verifications */}
            </div>
          </ResponsiveGridLayout>
        </div>
      </main>
    </div>
  );
}

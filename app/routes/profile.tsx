import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useActionData, Form } from "@remix-run/react";
import { useState } from "react";
import { ProfileController } from "~/controllers/profile.server";
import { createMetaFunction } from "~/utils/meta";

export const loader: LoaderFunction = async ({ request }) => {
 return ProfileController.getProfile(request);
};

export const action: ActionFunction = async ({ request }) => {
 return ProfileController.updateProfile(request);
};

export const meta = createMetaFunction({
 title: "Profile | Remix Boilerplate",
 description: "Manage your profile settings"
});

export default function Profile() {
 const { user } = useLoaderData<typeof loader>();
 const actionData = useActionData<typeof action>();
 const [isEditing, setIsEditing] = useState(false);

 // JSX bleibt unverändert
 return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                type="button"
              >
                Edit Profile
              </button>
            )}
          </div>

          {actionData?.error && (
            <div className="mb-4 text-red-600">{actionData.error}</div>
          )}

          {actionData?.success && (
            <div className="mb-4 text-green-600">Profile updated successfully</div>
          )}

          {isEditing ? (
            <Form method="post" className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  defaultValue={user.email}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </Form>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1 text-sm text-gray-900">{user.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Role</h3>
                <p className="mt-1 text-sm text-gray-900">{user.role}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {user.verified ? 'Verified' : 'Not Verified'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

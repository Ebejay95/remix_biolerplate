import { useState } from 'react';
import { Form, Link, useLocation } from '@remix-run/react';
import { ChevronDown, LogOut, UserCircle, Settings } from 'lucide-react';
import type { AuthenticatedUser } from '~/controllers/auth.server';

interface ProfileMenuProps {
  user: AuthenticatedUser | null;
}

export function ProfileMenu({ user }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname: currentPath } = useLocation();

  if (!user) {
    return (
      <div>
        {currentPath !== "/login" ? (
          <div className="btn-group">
            <Link to="/register" className="btn-primary">
              Sign up
            </Link>
            <Link
              to="/login"
              className="btn-primary inline-flex items-center gap-2"
            >
              <UserCircle className="w-5 h-5" />
              Login
            </Link>
          </div>
        ) : ('')}
      </div>
    );
  }

  const isAdmin = user.role === 'admin' || user.role === 'master';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
      >
        <UserCircle className="w-5 h-5" />
        <div className="flex flex-col items-start">
          <span>{user.email}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {user.role}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:ring-gray-700">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {isAdmin && (
              <Link
                to="/profile"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-700"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="w-4 h-4" />
                Profile Settings
              </Link>
            )}

            <Form
              action="/logout"
              method="post"
              onSubmit={() => setIsOpen(false)}
            >
              <button
                type="submit"
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}

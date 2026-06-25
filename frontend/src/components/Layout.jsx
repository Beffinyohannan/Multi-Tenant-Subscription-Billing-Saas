import { useAuthStore } from '../store';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  const { user, logout } = useAuthStore();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="bg-white shadow">
          <div className="flex items-center justify-end gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <span className="text-sm text-gray-500">
              {user?.name}
              <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                {user?.role}
              </span>
            </span>
            <button
              onClick={logout}
              className="rounded-lg bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-300"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

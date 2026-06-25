import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { getUsers, deleteUser } from '../api/users';

export default function Users() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    getUsers()
      .then((res) => setUsers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(fetchUsers, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      alert('Failed to delete user.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <button
          onClick={() => navigate('/users/create')}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Create User
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow">
          <p className="text-gray-500">No users yet.</p>
          <Link to="/users/create" className="mt-2 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500">Create your first user</Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-gray-500">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">Created</th>
                <th className="px-6 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{u.name}</td>
                  <td className="px-6 py-4 text-gray-700">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {u.id !== user?.id && (
                      <button
                        onClick={() => handleDelete(u.id)}
                        disabled={deleting === u.id}
                        className="rounded px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        {deleting === u.id ? 'Deleting...' : 'Delete'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

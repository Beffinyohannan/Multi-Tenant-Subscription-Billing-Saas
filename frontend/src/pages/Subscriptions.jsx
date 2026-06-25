import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSubscriptions } from '../api/subscriptions';
import Pagination from '../components/Pagination';

const STATUS_STYLES = {
  ACTIVE: 'bg-green-100 text-green-700',
  EXPIRED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-gray-100 text-gray-700',
};

export default function Subscriptions() {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    getSubscriptions({ page, limit: 10 })
      .then((res) => {
        setSubscriptions(res.data);
        setTotalPages(res.pagination.totalPages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
        <button
          onClick={() => navigate('/subscriptions/create')}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Assign Plan
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow">
          <p className="text-gray-500">No subscriptions yet.</p>
          <Link to="/subscriptions/create" className="mt-2 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500">Assign your first plan</Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-gray-500">
                <th className="px-6 py-3 font-medium">User</th>
                <th className="px-6 py-3 font-medium">Plan</th>
                <th className="px-6 py-3 font-medium">Price</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Start</th>
                <th className="px-6 py-3 font-medium">End</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {subscriptions.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{s.user_name}</div>
                    <div className="text-gray-500">{s.user_email}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{s.plan_name}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(s.price)}
                    <span className="ml-1 text-xs text-gray-400">/{s.billing_interval}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[s.status] || 'bg-gray-100 text-gray-700'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(s.start_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {s.end_date ? new Date(s.end_date).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </>
  );
}

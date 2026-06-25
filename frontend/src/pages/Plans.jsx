import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPlans, deletePlan } from '../api/plans';
import Pagination from '../components/Pagination';

export default function Plans() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPlans = (p = page) => {
    setLoading(true);
    getPlans({ page: p, limit: 10 })
      .then((res) => {
        setPlans(res.data);
        setTotalPages(res.pagination.totalPages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPlans(page); }, [page]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this plan? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await deletePlan(id);
      setPlans((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert('Failed to delete plan.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Plans</h1>
        <button
          onClick={() => navigate('/plans/create')}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Create Plan
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      ) : plans.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow">
          <p className="text-gray-500">No plans yet.</p>
          <Link to="/plans/create" className="mt-2 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500">Create your first plan</Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-gray-500">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Price</th>
                <th className="px-6 py-3 font-medium">Billing Interval</th>
                <th className="px-6 py-3 font-medium">Created</th>
                <th className="px-6 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {plans.map((plan) => (
                <tr key={plan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{plan.name}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(plan.price)}
                  </td>
                  <td className="px-6 py-4 capitalize text-gray-700">{plan.billing_interval}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(plan.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(plan.id)}
                      disabled={deleting === plan.id}
                      className="rounded px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      {deleting === plan.id ? 'Deleting...' : 'Delete'}
                    </button>
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

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createSubscription } from '../api/subscriptions';
import { getUsers } from '../api/users';
import { getPlans } from '../api/plans';

export default function CreateSubscription() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ userId: '', planId: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([getUsers({ page: 1, limit: 1000 }), getPlans({ page: 1, limit: 1000 })])
      .then(([u, p]) => {
        setUsers(u.data);
        setPlans(p.data);
      })
      .catch(() => setServerError('Failed to load users or plans.'))
      .finally(() => setLoading(false));
  }, []);

  const update = (field) => (e) => {
    const next = { ...form, [field]: e.target.value };
    setForm(next);
    const errs = {};
    if (!next.userId) errs.userId = 'Please select a user';
    if (!next.planId) errs.planId = 'Please select a plan';
    setErrors(errs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.userId) errs.userId = 'Please select a user';
    if (!form.planId) errs.planId = 'Please select a plan';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setServerError('');
    setSubmitting(true);
    try {
      await createSubscription(form);
      navigate('/subscriptions');
    } catch (err) {
      setServerError(err.response?.data?.error || err.message || 'Failed to assign plan');
    } finally {
      setSubmitting(false);
    }
  };

  const invalid = !form.userId || !form.planId;

  const selectClass = (field) =>
    `mt-1 block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 ${
      errors[field]
        ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
    }`;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Assign Plan</h1>
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl bg-white p-8 shadow">
          {serverError && (
            <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-700">{serverError}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">User</label>
              <select
                required
                value={form.userId}
                onChange={update('userId')}
                className={selectClass('userId')}
              >
                <option value="">Select a user...</option>
                {users.filter((u) => u.role !== 'ADMIN').map((u) => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
              {errors.userId && <p className="mt-1 text-xs text-red-600">{errors.userId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Plan</label>
              <select
                required
                value={form.planId}
                onChange={update('planId')}
                className={selectClass('planId')}
              >
                <option value="">Select a plan...</option>
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p.price)}/{p.billing_interval}
                  </option>
                ))}
              </select>
              {errors.planId && <p className="mt-1 text-xs text-red-600">{errors.planId}</p>}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting || invalid}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {submitting ? 'Assigning...' : 'Assign Plan'}
              </button>
              <Link
                to="/subscriptions"
                className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

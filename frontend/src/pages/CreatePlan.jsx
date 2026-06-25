import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPlan } from '../api/plans';

const INTERVALS = ['weekly', 'monthly', 'yearly'];

export default function CreatePlan() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    price: '',
    billingInterval: 'monthly',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setFieldErrors((p) => ({ ...p, [field]: '' }));
  };

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Plan name is required';
    if (!form.price) errors.price = 'Price is required';
    else if (isNaN(form.price) || parseFloat(form.price) <= 0) errors.price = 'Price must be a positive number';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      await createPlan({ ...form, price: parseFloat(form.price) });
      navigate('/plans');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const cls = (field) =>
    `mt-1 block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 ${
      fieldErrors[field]
        ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
    }`;

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Create Plan</h1>
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl bg-white p-8 shadow">
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">Plan Name</label>
              <input
                type="text"
                value={form.name}
                onChange={update('name')}
                placeholder="e.g. Pro Plan"
                className={cls('name')}
              />
              {fieldErrors.name && <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Price (USD)</label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={update('price')}
                placeholder="9.99"
                className={cls('price')}
              />
              {fieldErrors.price && <p className="mt-1 text-xs text-red-600">{fieldErrors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Billing Interval</label>
              <select
                value={form.billingInterval}
                onChange={update('billingInterval')}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {INTERVALS.map((i) => (
                  <option key={i} value={i}>{i.charAt(0).toUpperCase() + i.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {submitting ? 'Creating...' : 'Create Plan'}
              </button>
              <Link
                to="/plans"
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

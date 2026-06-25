import { useState, useEffect } from 'react';
import { getAdminDashboard, getExpiringSubscriptions } from '../api/dashboard';
import { useAuthStore } from '../store';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];

function StatCard({ label, value, format }) {
  const display = format === 'currency'
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
    : value;
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{display}</p>
    </div>
  );
}

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expiring, setExpiring] = useState([]);
  const [expiringLoading, setExpiringLoading] = useState(true);

  useEffect(() => {
    getAdminDashboard()
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    getExpiringSubscriptions()
      .then((res) => setExpiring(res.data))
      .catch(() => {})
      .finally(() => setExpiringLoading(false));
  }, []);

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Billing Dashboard</h1>

      {user && (
        <div className="mb-6 rounded-xl bg-white p-6 shadow">
          <p className="text-sm font-medium text-gray-500">Logged in as</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">{user.name}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
          <span className="mt-2 inline-block rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
            {user.role}
          </span>
        </div>
      )}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      ) : data ? (
        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Users" value={data.totalUsers} />
            <StatCard label="Revenue" value={data.totalRevenue} format="currency" />
            <StatCard label="Active Subscriptions" value={data.activeSubscriptions} />
            <StatCard label="Expired Subscriptions" value={data.expiredSubscriptions} />
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Plan Distribution</h2>
            {data.planDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.planDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" name="Subscriptions" radius={[4, 4, 0, 0]}>
                    {data.planDistribution.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-8 text-center text-sm text-gray-400">No subscriptions yet.</p>
            )}
          </div>

          <div className="overflow-hidden rounded-xl bg-white shadow">
            <div className="border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Subscriptions Expiring Soon</h2>
              <p className="text-sm text-gray-500">Active subscriptions expiring within the next 7 days</p>
            </div>
            {expiringLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
              </div>
            ) : expiring.length > 0 ? (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-500">
                    <th className="px-6 py-3 font-medium">User Name</th>
                    <th className="px-6 py-3 font-medium">Plan Name</th>
                    <th className="px-6 py-3 font-medium">Subscription</th>
                    <th className="px-6 py-3 font-medium">Days Remaining</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {expiring.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{s.user_name}</td>
                      <td className="px-6 py-4 text-gray-700">{s.plan_name}</td>
                      <td className="px-6 py-4 text-gray-700">
                        {s.subscription_name}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                          {s.days_remaining} {s.days_remaining === 1 ? 'day' : 'days'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="px-6 py-8 text-center text-sm text-gray-400">
                No subscriptions expiring soon.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-white p-6 text-center shadow">
          <p className="text-gray-500">Failed to load dashboard data.</p>
        </div>
      )}
    </>
  );
}

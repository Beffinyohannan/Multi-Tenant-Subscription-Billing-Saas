import { useState, useEffect } from 'react';
import { runBilling, getBillingLogs } from '../api/billing';

const STATUS_STYLES = {
  SUCCESS: 'bg-green-100 text-green-700',
  FAILED: 'bg-red-100 text-red-700',
};

export default function Billing() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const fetchLogs = () => {
    setLoading(true);
    getBillingLogs()
      .then((res) => setLogs(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(fetchLogs, []);

  const handleRunBilling = async () => {
    setRunning(true);
    setError('');
    setResult(null);
    try {
      const res = await runBilling();
      setResult(res.data);
      fetchLogs();
    } catch (err) {
      setError(err.message);
    } finally {
      setRunning(false);
    }
  };

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Billing</h1>

      <div className="mb-8 rounded-xl bg-white p-6 shadow">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Run Billing</h2>
            <p className="mt-1 text-sm text-gray-500">Process all active subscriptions for the current billing period.</p>
          </div>
          <button
            onClick={handleRunBilling}
            disabled={running}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {running ? 'Running...' : 'Run Billing'}
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        {result && (
          <div className="mt-4 grid grid-cols-4 gap-4">
            <div className="rounded-lg bg-gray-50 p-3 text-center">
              <p className="text-2xl font-bold text-gray-900">{result.processed}</p>
              <p className="text-xs text-gray-500">Processed</p>
            </div>
            <div className="rounded-lg bg-green-50 p-3 text-center">
              <p className="text-2xl font-bold text-green-700">{result.generated}</p>
              <p className="text-xs text-green-600">Generated</p>
            </div>
            <div className="rounded-lg bg-red-50 p-3 text-center">
              <p className="text-2xl font-bold text-red-700">{result.expired}</p>
              <p className="text-xs text-red-600">Expired</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 text-center">
              <p className="text-2xl font-bold text-gray-900">{result.skipped}</p>
              <p className="text-xs text-gray-500">Skipped</p>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Billing Logs</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          </div>
        ) : logs.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">No billing logs yet. Run billing to generate them.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-gray-500">
                <th className="px-6 py-3 font-medium">User</th>
                <th className="px-6 py-3 font-medium">Plan</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Period</th>
                <th className="px-6 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{log.user_name}</div>
                    <div className="text-gray-500">{log.user_email}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{log.plan_name}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(log.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[log.status] || 'bg-gray-100 text-gray-700'}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{log.billing_period}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(log.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

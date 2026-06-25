import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import { useAuthStore } from '../store';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s\-+.()]{7,20}$/;

export default function Register() {
  const [form, setForm] = useState({ companyName: '', name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  const update = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setFieldErrors((p) => ({ ...p, [field]: '' }));
  };

  const validate = () => {
    const errors = {};
    if (!form.companyName.trim()) errors.companyName = 'Company name is required';
    if (!form.name.trim()) errors.name = 'Your name is required';
    if (!form.email.trim()) errors.email = 'Email is required';
    else if (!EMAIL_RE.test(form.email)) errors.email = 'Enter a valid email address';
    if (!form.phone.trim()) errors.phone = 'Phone number is required';
    else if (!PHONE_RE.test(form.phone)) errors.phone = 'Enter a valid phone number';
    if (!form.password) errors.password = 'Password is required';
    else if (form.password.length < 8) errors.password = 'Password must be at least 8 characters';
    else if (!/[A-Z]/.test(form.password)) errors.password = 'Password must include an uppercase letter';
    else if (!/[a-z]/.test(form.password)) errors.password = 'Password must include a lowercase letter';
    else if (!/[0-9]/.test(form.password)) errors.password = 'Password must include a number';
    else if (!/[^A-Za-z0-9]/.test(form.password)) errors.password = 'Password must include a special character';
    if (!form.confirmPassword) errors.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await register(form);
      setUser(res.data);
      navigate('/');
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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Register your company</h1>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Company name</label>
            <input
              type="text"
              value={form.companyName}
              onChange={update('companyName')}
              placeholder="Acme Inc."
              className={cls('companyName')}
            />
            {fieldErrors.companyName && <p className="mt-1 text-xs text-red-600">{fieldErrors.companyName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Your name</label>
            <input
              type="text"
              value={form.name}
              onChange={update('name')}
              placeholder="Jane Doe"
              className={cls('name')}
            />
            {fieldErrors.name && <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={update('email')}
              placeholder="jane@acme.com"
              className={cls('email')}
            />
            {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={update('phone')}
              placeholder="+1 555-123-4567"
              className={cls('phone')}
            />
            {fieldErrors.phone && <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={update('password')}
              placeholder="Min. 8 chars, upper, lower, number &amp; special"
              className={cls('password')}
            />
            {fieldErrors.password && <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm password</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={update('confirmPassword')}
              placeholder="Repeat your password"
              className={cls('confirmPassword')}
            />
            {fieldErrors.confirmPassword && <p className="mt-1 text-xs text-red-600">{fieldErrors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {submitting ? 'Registering company...' : 'Register company'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

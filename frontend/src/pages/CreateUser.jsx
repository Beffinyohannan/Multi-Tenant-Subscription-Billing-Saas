import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUser } from '../api/users';

function validateField(field, value) {
  switch (field) {
    case 'name':
      if (!value.trim()) return 'Name is required';
      return '';
    case 'email':
      if (!value.trim()) return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
      return '';
    case 'password':
      if (!value) return 'Password is required';
      if (value.length < 8) return 'Password must be at least 8 characters';
      if (!/[A-Z]/.test(value)) return 'Password must include an uppercase letter';
      if (!/[a-z]/.test(value)) return 'Password must include a lowercase letter';
      if (!/[0-9]/.test(value)) return 'Password must include a number';
      if (!/[^A-Za-z0-9]/.test(value)) return 'Password must include a special character';
      return '';
    default:
      return '';
  }
}

export default function CreateUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER',
  });
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fieldError = (field) => {
    if (!touched[field]) return '';
    return validateField(field, form[field]);
  };

  const update = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const blur = (field) => () => {
    setTouched({ ...touched, [field]: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = { name: true, email: true, password: true };
    setTouched(allTouched);

    const errs = ['name', 'email', 'password']
      .map((f) => validateField(f, form[f]))
      .filter(Boolean);
    if (errs.length) return;

    setServerError('');
    setSubmitting(true);
    try {
      await createUser(form);
      navigate('/users');
    } catch (err) {
      setServerError(err.response?.data?.error || err.message || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  const hasError = ['name', 'email', 'password'].some(
    (f) => touched[f] && validateField(f, form[f])
  );
  const isEmpty = !form.name.trim() || !form.email.trim() || !form.password;
  const invalid = hasError || isEmpty;

  const input = (field, type, placeholder) => {
    const err = fieldError(field);
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
        <input
          type={type}
          required
          value={form[field]}
          onChange={update(field)}
          onBlur={blur(field)}
          placeholder={placeholder}
          className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 ${
            err
              ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
          }`}
        />
        {err && <p className="mt-1 text-xs text-red-600">{err}</p>}
      </div>
    );
  };

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Create User</h1>
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl bg-white p-8 shadow">
          {serverError && (
            <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-700">{serverError}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {input('name', 'text', 'e.g. Jane Doe')}
            {input('email', 'email', 'jane@example.com')}
            {input('password', 'password', 'Min. 8 chars, upper, lower, number & special')}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting || invalid}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {submitting ? 'Creating...' : 'Create User'}
              </button>
              <Link
                to="/users"
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

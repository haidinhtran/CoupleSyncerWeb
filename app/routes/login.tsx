import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../apiConfig';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState<{ username?: string; password?: string }>({
    username: undefined,
    password: undefined,
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldError({});
    let hasError = false;
    const newFieldError: { username?: string; password?: string } = {};
    if (!form.username) {
      newFieldError.username = 'Username is required';
      hasError = true;
    }
    if (!form.password) {
      newFieldError.password = 'Password is required';
      hasError = true;
    }
    if (hasError) {
      setFieldError(newFieldError);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.token) {
        if (data.message && data.message.toLowerCase().includes('username')) {
          setFieldError({ username: data.message });
        } else if (data.message && data.message.toLowerCase().includes('password')) {
          setFieldError({ password: data.message });
        } else {
          setError(data.message || 'Login failed');
        }
      } else {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <form
        onSubmit={handleSubmit}
        className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'
      >
        <h2 className='text-3xl font-extrabold mb-8 text-center text-gray-900'>
          Sign In
        </h2>
        <div className='mb-4'>
          <label
            htmlFor='username'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Username
          </label>
          <input
            id='username'
            name='username'
            value={form.username}
            onChange={handleChange}
            placeholder='Enter your username'
            className={`form-input block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${fieldError.username ? 'border-red-500' : 'border-gray-300'}`}
            autoComplete='username'
          />
          {fieldError.username && (
            <div className='mt-1 text-xs text-red-600 flex items-center'>
              <span className='font-bold mr-1'>*</span>
              {fieldError.username}
            </div>
          )}
        </div>
        <div className='mb-4'>
          <label
            htmlFor='password'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Password
          </label>
          <input
            id='password'
            name='password'
            value={form.password}
            onChange={handleChange}
            type='password'
            placeholder='Enter your password'
            className={`form-input block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${fieldError.password ? 'border-red-500' : 'border-gray-300'}`}
            autoComplete='current-password'
          />
          {fieldError.password && (
            <div className='mt-1 text-xs text-red-600 flex items-center'>
              <span className='font-bold mr-1'>*</span>
              {fieldError.password}
            </div>
          )}
        </div>
        {error && (
          <div className='text-red-500 text-sm mb-2'>{error}</div>
        )}
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center'>
            <input
              type='checkbox'
              id='remember'
              className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
            />
            <label
              htmlFor='remember'
              className='ml-2 block text-sm text-gray-700'
            >
              Remember me
            </label>
          </div>
          <a href='#' className='text-sm text-blue-600 hover:underline'>
            Forgot password?
          </a>
        </div>
        <button
          type='submit'
          className='w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-semibold transition-colors duration-150 mb-4 disabled:opacity-50 cursor-pointer'
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <div className='flex flex-col gap-2 mb-4'>
          <button
            type='button'
            className='w-full flex items-center justify-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-md font-medium transition-colors duration-150 cursor-pointer'
            // onClick={handleGoogleLogin}
          >
            Sign in with Google
          </button>
          <button
            type='button'
            className='w-full flex items-center justify-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-md font-medium transition-colors duration-150 cursor-pointer'
            // onClick={handleAppleLogin}
          >
            Sign in with Apple
          </button>
        </div>
        <div className='text-center text-sm text-gray-600 mb-2'>
          Don't have an account?{' '}
          <a
            href='/register'
            className='text-blue-600 hover:underline font-medium'
          >
            Sign Up
          </a>
        </div>
        <div className='text-center text-sm text-gray-600'>
          <a href='/' className='text-blue-600 hover:underline font-medium'>
            Back to Home
          </a>
        </div>
      </form>
    </div>
  );
}

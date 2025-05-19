import React, { useState } from 'react';
import { API_BASE_URL } from '../apiConfig';

function validateUsername(username: string) {
  // Chỉ cho phép chữ cái, số, dấu gạch dưới, 4-20 ký tự
  return /^[a-zA-Z0-9_]{4,20}$/.test(username);
}
function validateEmail(email: string) {
  // Regex kiểm tra email hợp lệ
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePassword(password: string) {
  // 8-32 ký tự, ít nhất 1 ký tự đặc biệt, 1 số, 1 chữ in hoa
  return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,32}$/.test(
    password
  );
}

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const validate = () => {
    const newErrors: { [k: string]: string } = {};
    if (!validateUsername(form.username)) {
      newErrors.username =
        'Username must be 4-20 characters, no special characters except _';
    }
    if (!validateEmail(form.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!validatePassword(form.password)) {
      newErrors.password =
        'Password must be 8-32 chars, 1 special, 1 number, 1 uppercase';
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setError(Object.values(newErrors).join('\n'));
      return;
    }
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch(`${API_BASE_URL}/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.id) {
        setError(data.message || 'Registration failed');
      } else {
        // Đăng ký thành công, tự động đăng nhập
        const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: form.username,
            password: form.password,
          }),
        });
        const loginData = await loginRes.json();
        if (loginRes.ok && loginData.token) {
          localStorage.setItem('token', loginData.token);
          setSuccess(true);
          setForm({
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
          });
          window.location.href = '/dashboard';
        } else {
          setSuccess(true);
          setForm({
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
          });
        }
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
          Sign Up
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
            className={`form-input block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              error.includes('Username') ? 'border-red-500' : 'border-gray-300'
            }`}
            autoComplete='username'
          />
          {error.includes('Username') && (
            <div className="mt-1 text-xs text-red-600 flex items-center"><span className="font-bold mr-1">*</span>Username must be 4-20 characters, no special characters except _</div>
          )}
        </div>
        <div className='mb-4'>
          <label
            htmlFor='email'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Email
          </label>
          <input
            id='email'
            name='email'
            value={form.email}
            onChange={handleChange}
            placeholder='Enter your email'
            className={`form-input block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              error.includes('email') ? 'border-red-500' : 'border-gray-300'
            }`}
            autoComplete='email'
          />
          {error.includes('email') && (
            <div className="mt-1 text-xs text-red-600 flex items-center"><span className="font-bold mr-1">*</span>Invalid email address</div>
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
            className={`form-input block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              error.includes('Password') ? 'border-red-500' : 'border-gray-300'
            }`}
            autoComplete='new-password'
          />
          {error.includes('Password must be 8-32') && (
            <div className="mt-1 text-xs text-red-600 flex items-center"><span className="font-bold mr-1">*</span>Password must be 8-32 chars, 1 special, 1 number, 1 uppercase</div>
          )}
        </div>
        <div className='mb-4'>
          <label
            htmlFor='confirmPassword'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Confirm Password
          </label>
          <input
            id='confirmPassword'
            name='confirmPassword'
            value={form.confirmPassword}
            onChange={handleChange}
            type='password'
            placeholder='Confirm your password'
            className={`form-input block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              error.includes('confirm') ? 'border-red-500' : 'border-gray-300'
            }`}
            autoComplete='new-password'
          />
          {error.includes('Passwords do not match') && (
            <div className="mt-1 text-xs text-red-600 flex items-center"><span className="font-bold mr-1">*</span>Passwords do not match</div>
          )}
        </div>
        <button
          type='submit'
          className='w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-semibold transition-colors duration-150 mb-4 disabled:opacity-50 cursor-pointer'
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Sign Up'}
        </button>
        <div className='flex items-center my-4'>
          <div className='flex-grow h-px bg-gray-300' />
          <span className='mx-3 text-gray-500 text-sm font-medium'>or</span>
          <div className='flex-grow h-px bg-gray-300' />
        </div>
        <div className='flex flex-row gap-2 mb-4'>
          <button
            type='button'
            className='w-1/2 flex items-center justify-center border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-md font-medium transition-colors duration-150 cursor-pointer'
          >
            Sign up with Google
          </button>
          <button
            type='button'
            className='w-1/2 flex items-center justify-center border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-md font-medium transition-colors duration-150 cursor-pointer'
          >
            Sign up with Apple
          </button>
        </div>
        <div className='text-center text-sm text-gray-600 mb-2'>
          Already have an account?{' '}
          <a
            href='/login'
            className='text-blue-600 hover:underline font-medium'
          >
            Sign In
          </a>
        </div>
        <div className='text-center text-sm text-gray-600 mb-2'>
          <a href='/' className='text-blue-600 hover:underline font-medium'>
            Back to Home
          </a>
        </div>
      </form>
    </div>
  );
}

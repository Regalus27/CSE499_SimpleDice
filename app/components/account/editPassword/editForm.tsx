'use client';

import { FormEvent, useState } from 'react';

export default function EditPasswordForm() {
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setCurrentPasswordError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setServerError('');
    setSuccessMessage('');

    let valid = true;

    if (!username.trim()) {
      setServerError('Enter your username.');
      valid = false;
    }

    if (!currentPassword) {
      setCurrentPasswordError('Enter your current password.');
      valid = false;
    }

    if (password.length < 6) {
      setPasswordError('New password must contain at least 6 characters.');
      valid = false;
    }

    if (password === currentPassword && password.length > 0) {
      setPasswordError('Choose a password different from your current one.');
      valid = false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      valid = false;
    }

    if (!valid) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('/api/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          currentPassword,
          newPassword: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setServerError(data.error || 'Unable to update password.');
        return;
      }

      setSuccessMessage('Password updated successfully.');

      setCurrentPassword('');
      setPassword('');
      setConfirmPassword('');
    } catch {
      setServerError('Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-5'>
      <div>
        <label
          htmlFor='username'
          className='block text-sm font-semibold text-[var(--text)] mb-2'
        >
          Username
        </label>
        <input
          id='username'
          type='text'
          autoComplete='username'
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder='Enter your username'
          className='w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--text)] outline-none focus:border-[var(--primary)]'
        />
      </div>

      {/* CURRENT PASSWORD */}
      <div>
        <label
          htmlFor='currentPassword'
          className='block text-sm font-semibold text-[var(--text)] mb-2'
        >
          Current Password
        </label>
        <input
          id='currentPassword'
          type='password'
          autoComplete='current-password'
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          placeholder='Enter your current password'
          className='w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--text)] outline-none focus:border-[var(--primary)]'
        />
        {currentPasswordError && (
          <p className='mt-1 text-sm text-red-500'>{currentPasswordError}</p>
        )}
      </div>

      {/* NEW PASSWORD */}
      <div>
        <label
          htmlFor='password'
          className='block text-sm font-semibold text-[var(--text)] mb-2'
        >
          New Password
        </label>

        <div className='relative'>
          <input
            id='password'
            type={showPassword ? 'text' : 'password'}
            autoComplete='new-password'
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder='Enter a new password'
            className='w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 pr-16 text-[var(--text)] outline-none focus:border-[var(--primary)]'
          />

          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-3 top-3 text-sm font-semibold text-[var(--primary)]'
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        {passwordError && (
          <p className='mt-1 text-sm text-red-500'>{passwordError}</p>
        )}
      </div>

      {/* CONFIRM New Password */}
      <div>
        <label
          htmlFor='confirmPassword'
          className='block text-sm font-semibold text-[var(--text)] mb-2'
        >
          Confirm New Password
        </label>

        <input
          id='confirmPassword'
          type={showPassword ? 'text' : 'password'}
          autoComplete='new-password'
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder='Confirm your password'
          className='w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-4 py-3 text-[var(--text)] outline-none focus:border-[var(--primary)]'
        />

        {confirmPasswordError && (
          <p className='mt-1 text-sm text-red-500'>{confirmPasswordError}</p>
        )}
      </div>

      {/* SERVER ERROR */}
      {serverError && <div className='error-message'>{serverError}</div>}

      {/* SUCCESS */}
      {successMessage && (
        <div className='success-message'>{successMessage}</div>
      )}

      {/* UPDATE PASSWORD BUTTON */}
      <button
        type='submit'
        disabled={loading}
        className='w-full rounded-lg bg-[var(--primary)] py-3 font-bold text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60'
      >
        {loading ? 'Updating password...' : 'Update password'}
      </button>
    </form>
  );
}

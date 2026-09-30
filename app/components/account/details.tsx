import Link from 'next/link';

export default function AccountDetails() {
  return (
    <section>
      <h2 className='text-2xl font-bold text-[var(--text)]'>Account Credentials</h2>
      <div className='mt-6 space-y-4 text-[var(--text)]'>
        <p>Update the password for your existing SimpleDice account.</p>
        <Link
          href='/edit'
          className='font-medium text-[var(--primary)] hover:underline'
        >
          Update Password
        </Link>
      </div>
    </section>
  );
}

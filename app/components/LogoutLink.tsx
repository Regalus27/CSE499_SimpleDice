'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LogoutLink() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Re-check on every route change so the link updates right after login/logout.
  useEffect(() => {
    let isActive = true;

    fetch('/api/session')
      .then((response) => {
        if (isActive) setIsLoggedIn(response.ok);
      })
      .catch(() => {
        if (isActive) setIsLoggedIn(false);
      });

    return () => {
      isActive = false;
    };
  }, [pathname]);

  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' });
    setIsLoggedIn(false);
    router.push('/login');
    router.refresh();
  }

  if (!isLoggedIn) return null;

  return (
    <button
      type='button'
      onClick={handleLogout}
      className='rounded-lg px-3 py-2 text-white/90 transition hover:bg-white/10 hover:text-white'
    >
      Logout
    </button>
  );
}

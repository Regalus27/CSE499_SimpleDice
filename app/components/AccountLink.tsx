'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AccountLink() {
  const pathname = usePathname();
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

  return (
    <Link
      href={isLoggedIn ? '/account' : '/login'}
      className='rounded-lg px-3 py-2 text-white/90 transition hover:bg-white/10 hover:text-white'
    >
      {isLoggedIn ? 'Account' : 'Login'}
    </Link>
  );
}
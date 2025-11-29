// app/auth/callback/page.js
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (token) {
      localStorage.setItem('authToken', token);
      router.push('/dashboard');
    } else if (error) {
      router.push('/signup?error=' + encodeURIComponent(error));
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">Completing signup...</h2>
        <p>Please wait while we authenticate your account.</p>
      </div>
    </div>
  );
}
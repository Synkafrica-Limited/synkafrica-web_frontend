// app/auth/callback/page.js
"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (token) {
      // Store token and redirect to dashboard
      localStorage.setItem('authToken', token);
      router.push('/dashboard');
    } else if (error) {
      // Handle error
      router.push('/signup?error=' + encodeURIComponent(error));
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">Completing signup...</h2>
        <p>Please wait while we authenticate your account.</p>
      </div>
    </div>
  );
}
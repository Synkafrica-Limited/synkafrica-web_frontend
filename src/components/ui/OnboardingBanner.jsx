"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Info, CheckCircle, X } from 'lucide-react';
import { useBusiness } from '@/context/BusinessContext';

export default function OnboardingBanner({ className = '' }) {
  const router = useRouter();
  const { business, loading } = useBusiness();
  const [dismissed, setDismissed] = useState(false);

  // Check if banner was dismissed in current session
  useEffect(() => {
    const sessionKey = 'onboarding_banner_session_dismissed';
    const sessionDismissed = sessionStorage.getItem(sessionKey);
    if (sessionDismissed === '1') {
      setDismissed(true);
    }
  }, []);

  // Auto-dismiss after 10 seconds
  useEffect(() => {
    if (loading || business || dismissed) return;
    
    const timer = setTimeout(() => {
      handleDismiss();
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, [loading, business, dismissed]);

  // Only show when business is not present, not loading, and not dismissed
  if (loading) return null;
  if (business) return null;
  if (dismissed) return null;

  const handleDismiss = () => {
    const sessionKey = 'onboarding_banner_session_dismissed';
    sessionStorage.setItem(sessionKey, '1');
    setDismissed(true);
  };

  const startOnboarding = () => {
    router.push('/business/onboarding');
  };

  const goToSettings = () => {
    router.push('/dashboard/business/settings');
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 ${className}`}>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-4 animate-in fade-in duration-500">
        <div className="p-2 rounded-full bg-yellow-100 text-yellow-700">
          <Info className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-yellow-800">Complete your business onboarding</p>
              <p className="text-sm text-yellow-700 mt-1">Set up your business profile to start listing services and receiving bookings.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={startOnboarding}
                className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-md text-sm font-medium hover:bg-yellow-700 transition"
              >
                <CheckCircle className="w-4 h-4" />
                Complete Onboarding
              </button>
              <button
                onClick={goToSettings}
                className="text-sm text-yellow-700 hover:underline"
              >
                Update in Settings
              </button>
              <button
                onClick={handleDismiss}
                className="text-yellow-600 hover:text-yellow-800 transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

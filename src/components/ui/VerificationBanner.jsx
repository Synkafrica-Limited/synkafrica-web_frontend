"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Info, CheckCircle } from 'lucide-react';
import verificationService from '@/services/verification.service';
import { useBusiness } from '@/context/BusinessContext';

export default function VerificationBanner({ className = '' }) {
  const router = useRouter();
  const { business, loading } = useBusiness();
  const [status, setStatus] = useState(null);
  const [progress, setProgress] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // respect a per-business dismissed flag in localStorage
    if (!business || !business.id) return;
    try {
      const key = `verification_banner_dismissed_${business.id}`;
      const v = localStorage.getItem(key);
      if (v === '1') setDismissed(true);
    } catch (e) {
      // ignore
    }
  }, [business]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!business || !business.id) return;
      try {
        const p = await verificationService.getProgress(business.id);
        if (!mounted) return;
        setStatus(p.status);
        setProgress(p.progress || 0);
      } catch (err) {
        console.warn('VerificationBanner: failed to load progress', err);
      }
    };

    load();

    // Also refresh when business changes (e.g., after update)
    return () => { mounted = false; };
  }, [business]);

  if (loading) return null;
  if (!business) return null;
  if (dismissed) return null;

  // Hide banner when verified or 100% progress
  if (status === 'verified' || (progress && progress >= 100)) return null;

  const goToVerify = () => {
    // Navigate to Account Settings where verification is managed
    router.push('/dashboard/business/settings');
  };

  const goToSettings = () => {
    router.push('/dashboard/business/settings');
  };

  const dismiss = () => {
    try {
      const key = `verification_banner_dismissed_${business.id}`;
      localStorage.setItem(key, '1');
    } catch (e) {
      // ignore
    }
    setDismissed(true);
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 ${className}`}>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-4">
        <div className="p-2 rounded-full bg-blue-100 text-blue-700">
          <Info className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-blue-800">Get Verified</p>
              <p className="text-sm text-blue-700 mt-1">Complete verification to build trust and unlock premium features. Verification progress: <strong>{progress}%</strong></p>
              <ul className="text-xs text-blue-700 mt-2 list-disc list-inside">
                <li>Build customer trust and credibility</li>
                <li>Access premium features and listings</li>
                <li>Higher visibility in search results</li>
                <li>Priority customer support</li>
              </ul>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={goToVerify}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
              >
                <CheckCircle className="w-4 h-4" />
                Complete Verification
              </button>
              <button onClick={goToSettings} className="text-sm text-blue-700 hover:underline">Update in Settings</button>
              <button onClick={dismiss} className="text-sm text-blue-600 hover:underline">Dismiss</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';

const CONVENIENCE_TYPES = ['makeup', 'laundry', 'photography', 'cleaning', 'styling', 'tailoring', 'events', 'fitness', 'spa'];

export default function ConvenienceListingGuidance({ businessType, businessId }) {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!businessType || !businessId) return;
    
    const isConvenience = CONVENIENCE_TYPES.includes(businessType?.toLowerCase());
    if (!isConvenience) return;

    const storageKey = `convenience_guidance_${businessId}`;
    const alreadyDismissed = localStorage.getItem(storageKey);
    
    if (alreadyDismissed) {
      setDismissed(true);
      return;
    }

    setShow(true);
  }, [businessType, businessId]);

  const handleDismiss = () => {
    if (businessId) {
      localStorage.setItem(`convenience_guidance_${businessId}`, 'true');
    }
    setShow(false);
    setDismissed(true);
  };

  if (!show || dismissed) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-fadeIn">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Important: Listing Instructions</h3>
              <p className="text-sm text-gray-600">Your business type requires specific setup</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-orange-900 mb-2">
                  All your service listings must be created using the Convenience Service flow
                </p>
                <p className="text-sm text-orange-800">
                  To create listings for your business, navigate to <strong>Listings → Create New → Convenience Service</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Why?</strong> Your business type ({businessType}) requires the Convenience Service category to ensure proper booking management and customer experience.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handleDismiss}
              className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

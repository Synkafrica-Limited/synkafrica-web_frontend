"use client";

import { useState, useEffect } from "react";
import { X, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

export function ProfileCompletionBanner({ progress = 0, onDismiss }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show banner only if profile is less than 100% complete
    if (progress < 100) {
      setIsVisible(true);
    }
  }, [progress]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  if (!isVisible || progress >= 100) return null;

  return (
    <div className="relative bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 shadow-sm animate-in slide-in-from-top-2 duration-300">
      {/* Dismiss Button */}
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex items-start gap-4 pr-8">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            Complete Your Business Profile
          </h3>
          <p className="text-sm text-gray-700 mb-3">
            Your profile is <span className="font-semibold text-amber-700">{progress}% complete</span>. 
            Complete your profile to unlock all features and increase your visibility to customers.
          </p>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-gray-600">Profile completion</span>
              <span className="text-xs font-semibold text-amber-700">{progress}%</span>
            </div>
            <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
              />
            </div>
          </div>

          {/* Action Button */}
          <Link
            href="/dashboard/business/profile"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            Complete Profile
            <CheckCircle className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function VerificationBanner({ verificationStatus = "not_started", onDismiss }) {
  const [isVisible, setIsVisible] = useState(false);
  const [loginCount, setLoginCount] = useState(0);

  useEffect(() => {
    // Get login count from localStorage
    const storedCount = typeof window !== "undefined" 
      ? parseInt(localStorage.getItem("vendor_login_count") || "0", 10)
      : 0;
    
    setLoginCount(storedCount);

    // Show banner only for first login and if not verified
    // After second login, hide the banner
    if (storedCount < 2 && verificationStatus !== "verified" && verificationStatus !== "pending") {
      setIsVisible(true);
    }
  }, [verificationStatus]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  if (!isVisible) return null;

  const getBannerConfig = () => {
    switch (verificationStatus) {
      case "pending":
        return {
          bgColor: "from-blue-50 to-indigo-50",
          borderColor: "border-blue-200",
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          titleColor: "text-blue-900",
          textColor: "text-blue-700",
          buttonBg: "bg-blue-600 hover:bg-blue-700",
          title: "Verification Pending",
          message: "Your verification documents are being reviewed. We'll notify you once the review is complete.",
          showButton: false,
        };
      case "rejected":
        return {
          bgColor: "from-red-50 to-pink-50",
          borderColor: "border-red-200",
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
          titleColor: "text-red-900",
          textColor: "text-red-700",
          buttonBg: "bg-red-600 hover:bg-red-700",
          title: "Verification Action Required",
          message: "Your verification was not approved. Please review the feedback and resubmit your documents.",
          showButton: true,
          buttonText: "Update Verification",
        };
      default: // not_started
        return {
          bgColor: "from-purple-50 to-indigo-50",
          borderColor: "border-purple-200",
          iconBg: "bg-purple-100",
          iconColor: "text-purple-600",
          titleColor: "text-purple-900",
          textColor: "text-purple-700",
          buttonBg: "bg-purple-600 hover:bg-purple-700",
          title: "Verify Your Business",
          message: "Get verified to build trust with customers and unlock premium features. The verification process takes just a few minutes.",
          showButton: true,
          buttonText: "Start Verification",
        };
    }
  };

  const config = getBannerConfig();

  return (
    <div className={`relative bg-gradient-to-r ${config.bgColor} border ${config.borderColor} rounded-xl p-4 shadow-sm animate-in slide-in-from-top-2 duration-300`}>
      {/* Dismiss Button */}
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex items-start gap-4 pr-8">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className={`w-10 h-10 ${config.iconBg} rounded-full flex items-center justify-center`}>
            <AlertCircle className={`w-6 h-6 ${config.iconColor}`} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className={`text-base font-semibold ${config.titleColor} mb-1`}>
            {config.title}
          </h3>
          <p className={`text-sm ${config.textColor} mb-3`}>
            {config.message}
          </p>

          {/* Action Button */}
          {config.showButton && (
            <Link
              href="/dashboard/business/settings"
              className={`inline-flex items-center gap-2 px-4 py-2 ${config.buttonBg} text-white text-sm font-medium rounded-lg transition-colors shadow-sm`}
            >
              {config.buttonText}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

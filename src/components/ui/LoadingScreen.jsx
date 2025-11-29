"use client";

import React from "react";

export default function LoadingScreen({
  message = "Loading...",
  subtitle = "Please wait",
  size = "default"
}) {
  const sizeClasses = {
    small: "min-h-[200px]",
    default: "min-h-[400px]",
    large: "min-h-screen"
  };

  return (
    <div className={`flex items-center justify-center ${sizeClasses[size]}`}>
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">{message}</h2>
          <p className="text-gray-600">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

// Simple loading components for common use cases
export function PageLoadingScreen({ message = "Loading..." }) {
  return <LoadingScreen message={message} size="default" />;
}

export function AuthLoadingScreen({ message = "Authenticating..." }) {
  return <LoadingScreen message={message} subtitle="Verifying your credentials" size="large" />;
}

export function DashboardLoadingScreen({ message = "Loading Dashboard..." }) {
  return <LoadingScreen message={message} subtitle="Preparing your business overview" size="default" />;
}
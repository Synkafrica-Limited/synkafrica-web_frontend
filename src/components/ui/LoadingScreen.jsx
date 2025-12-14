"use client";

import React from "react";

export default function LoadingScreen({
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
      </div>
    </div>
  );
}

// Simple loading components for common use cases
export function PageLoadingScreen() {
  return <LoadingScreen size="default" />;
}

export function AuthLoadingScreen() {
  return <LoadingScreen size="large" />;
}

export function DashboardLoadingScreen() {
  return <LoadingScreen size="default" />;
}
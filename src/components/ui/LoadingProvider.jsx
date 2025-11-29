"use client";

import React, { createContext, useContext, useState } from "react";

const LoadingContext = createContext(null);

export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoading must be used within LoadingProvider");
  return ctx;
}

export default function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("Loading...");

  const showLoading = (msg = "Loading...") => {
    setMessage(msg);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
    setMessage("Loading...");
  };

  return (
    <LoadingContext.Provider value={{ isLoading, message, showLoading, hideLoading }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm mx-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">{message}</p>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
}

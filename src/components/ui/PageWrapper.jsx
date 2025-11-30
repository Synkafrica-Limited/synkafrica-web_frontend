"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import authService from "@/services/authService";
import { PageLoadingScreen } from "@/components/ui/LoadingScreen";

/**
 * SimplePageWrapper - Simplified page wrapper for consistent loading and authentication
 * @param {Object} props
 * @param {React.Component} props.children - Page content
 * @param {boolean} props.requireAuth - Whether authentication is required (default: false)
 * @param {string} props.redirectTo - Where to redirect if auth check fails
 * @param {string} props.loadingMessage - Loading message to display
 */
export default function SimplePageWrapper({
  children,
  requireAuth = false,
  redirectTo = "/business/login",
  loadingMessage = "Loading..."
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = authService.getAccessToken();

        if (requireAuth && !token) {
          router.replace(redirectTo);
          return;
        }

        if (!requireAuth && token) {
          // User is authenticated but shouldn't be (e.g., login page)
          router.replace("/dashboard/business");
          return;
        }

        setIsAuthenticated(!!token);
      } catch (error) {
        console.error("Auth check failed:", error);
        if (requireAuth) {
          router.replace(redirectTo);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [requireAuth, redirectTo, router]);

  if (isLoading) {
    return <PageLoadingScreen message={loadingMessage} />;
  }

  return <>{children}</>;
}

// Simplified wrappers for common use cases
export function AuthPage({ children, redirectTo = "/dashboard/business" }) {
  return (
    <SimplePageWrapper
      requireAuth={false}
      redirectTo={redirectTo}
      loadingMessage="Checking authentication..."
    >
      {children}
    </SimplePageWrapper>
  );
}

export function ProtectedPage({ children, redirectTo = "/business/login" }) {
  return (
    <SimplePageWrapper
      requireAuth={true}
      redirectTo={redirectTo}
      loadingMessage="Loading..."
    >
      {children}
    </SimplePageWrapper>
  );
}

export function PublicPage({ children }) {
  return <>{children}</>;
}

// Legacy aliases for backward compatibility
export const PageWrapper = SimplePageWrapper;
export const AuthPageWrapper = AuthPage;
export const ProtectedPageWrapper = ProtectedPage;
export const PublicPageWrapper = PublicPage;
// Example usage of the simplified loading provider
// This shows how to use the new hooks consistently across pages

"use client";

import { ProtectedPage } from "@/components/ui/PageWrapper";
import { useDataLoader } from "@/hooks/useDataLoader";
import { PageLoadingScreen } from "@/components/ui/LoadingScreen";

function ExampleDashboardPage() {
  // Load dashboard data using the consistent hook
  const {
    data: dashboardData,
    loading,
    error,
    refetch
  } = useDataLoader(
    async () => {
      // Your data fetching logic here
      const response = await fetch('/api/dashboard');
      return response.json();
    },
    [], // dependencies
    {
      onError: (error) => {
        console.error('Failed to load dashboard:', error);
        // Handle error (toast, etc.)
      }
    }
  );

  // Show loading only when actively fetching
  if (loading) {
    return <PageLoadingScreen message="Loading dashboard..." />;
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Dashboard</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={refetch} className="px-4 py-2 bg-primary-500 text-white rounded-lg">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Render your page content
  return (
    <div>
      {/* Your dashboard content */}
      <h1>Dashboard</h1>
      {dashboardData && <pre>{JSON.stringify(dashboardData, null, 2)}</pre>}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedPage>
      <ExampleDashboardPage />
    </ProtectedPage>
  );
}
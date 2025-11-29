"use client";

import { useEffect, useState } from "react";
import dashboardService from "@/services/dashboardService";
import { useToast } from "@/components/ui/ToastProvider";

export function useVendorStats(range) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [revenueChart, setRevenueChart] = useState(null);
  const [bookingsStats, setBookingsStats] = useState(null);
  const { addToast } = useToast();

  // helper to map backend shape to UI-friendly vendor fields
  const adapt = (data) => {
    if (!data) return {};
    return data; // For now, just return the data as-is
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [statsData, chartData, bookingsData] = await Promise.all([
          dashboardService.getVendorStats(range),
          dashboardService.getRevenueChart(range),
          dashboardService.getBookingsStats()
        ]);
        setStats(adapt(statsData) || {});
        setRevenueChart(chartData || []);
        setBookingsStats(bookingsData || {});
      } catch (err) {
        try {
          addToast({ message: err.message || "Failed to load stats", type: "error" });
        } catch {}
        setStats({});
        setRevenueChart([]);
        setBookingsStats({});
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [range, addToast]);

  // expose a refresh method to re-fetch stats
  const refresh = async () => {
    setLoading(true);
    try {
      const [statsData, chartData, bookingsData] = await Promise.all([
        dashboardService.getVendorStats(range),
        dashboardService.getRevenueChart(range),
        dashboardService.getBookingsStats()
      ]);
      setStats(adapt(statsData) || {});
      setRevenueChart(chartData || []);
      setBookingsStats(bookingsData || {});
    } catch (err) {
      try { addToast({ message: err.message || "Failed to refresh stats", type: "error" }); } catch {}
    } finally {
      setLoading(false);
    }
  };

  return { loading, stats, revenueChart, bookingsStats, refresh };
}

export default useVendorStats;

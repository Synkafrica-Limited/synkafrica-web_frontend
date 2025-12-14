// hooks/customer/useUserProfile.js
"use client";

import { useState, useCallback } from "react";

const PROFILE_URL = "https://synkkafrica-backend-core.onrender.com/api/users/profile";

export const useUserProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userProfile, setUserProfile] = useState(null);

  /**
   * fetchUserProfile
   * @returns {Promise<Object|null>}
   */
  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const accessToken = localStorage.getItem("customerToken");
      
      if (!accessToken) {
        setError("No authentication token found");
        return null;
      }

      const response = await fetch(PROFILE_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
      });

      let data = {};
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Failed to parse response JSON", parseError);
        setError("Failed to parse server response");
        return null;
      }

      if (!response.ok) {
        setError(data?.message || "Failed to fetch user profile");
        return null;
      }

      // Success - set the user profile and update localStorage
      const user = data.user || data;
      setUserProfile(user);
      
      // Update localStorage with user data for consistency
      try {
        localStorage.setItem("customerUser", JSON.stringify(user));
        if (user.id) {
          localStorage.setItem("customerUserId", user.id);
        }
      } catch (e) {
        console.error("Failed to update localStorage with user data:", e);
      }

      return user;
    } catch (err) {
      console.error("Profile fetch error:", err);
      setError(
        err.message || "Unable to reach server. Please try again later."
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * updateUserProfile
   * @param {Object} updates - Profile fields to update
   * @returns {Promise<boolean>}
   */
  const updateUserProfile = useCallback(async (updates) => {
    setLoading(true);
    setError("");

    try {
      const accessToken = localStorage.getItem("customerToken");
      
      if (!accessToken) {
        setError("No authentication token found");
        return false;
      }

      const response = await fetch(PROFILE_URL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(updates),
      });

      let data = {};
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Failed to parse response JSON", parseError);
        setError("Failed to parse server response");
        return false;
      }

      if (!response.ok) {
        setError(data?.message || "Failed to update profile");
        return false;
      }

      // Success - update local state and localStorage
      const updatedData = data.user || data;
      setUserProfile(prev => ({ ...prev, ...updatedData }));
      
      // Update localStorage with updated user data
      try {
        const currentUserData = localStorage.getItem("customerUser");
        if (currentUserData) {
          const user = JSON.parse(currentUserData);
          const updatedUser = { ...user, ...updatedData };
          localStorage.setItem("customerUser", JSON.stringify(updatedUser));
        } else {
          localStorage.setItem("customerUser", JSON.stringify(updatedData));
        }
      } catch (e) {
        console.error("Failed to update localStorage with user data:", e);
      }

      // Trigger storage event for cross-tab sync
      window.dispatchEvent(new Event("storage"));

      return true;
    } catch (err) {
      console.error("Profile update error:", err);
      setError(
        err.message || "Unable to reach server. Please try again later."
      );
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * refreshUserProfile
   * Force refresh the user profile from server
   * @returns {Promise<Object|null>}
   */
  const refreshUserProfile = useCallback(async () => {
    return await fetchUserProfile();
  }, [fetchUserProfile]);

  /**
   * clearUserProfile
   * Clear the user profile from state (useful on logout)
   */
  const clearUserProfile = useCallback(() => {
    setUserProfile(null);
    setError("");
  }, []);

  return {
    // State
    userProfile,
    loading,
    error,
    
    // Actions
    fetchUserProfile,
    updateUserProfile,
    refreshUserProfile,
    clearUserProfile,
    
    // Convenience getters
    isProfileComplete: userProfile?.firstName && userProfile?.lastName && userProfile?.phoneNumber,
    hasEmailVerified: userProfile?.isEmailVerified || userProfile?.emailVerified,
    userRole: userProfile?.role,
  };
};
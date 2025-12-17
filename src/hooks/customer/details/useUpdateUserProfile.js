// hooks/customer/useUpdateProfile.js
"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";
import logger from "@/utils/logger";

export const useUpdateProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { addToast } = useToast();

  /**
   * updateProfile
   * @param {Object} profileData - User profile data to update
   * @param {string} profileData.firstName
   * @param {string} profileData.lastName
   * @param {string} profileData.phoneNumber
   * @param {string} profileData.address
   * @param {string} profileData.city
   * @param {string} profileData.state
   * @param {string} profileData.country
   * @param {string} profileData.profilePicture
   * @returns {Promise<boolean>}
   */
  const updateProfile = async (profileData) => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("customerToken");
      
      if (!token) {
        setError("No authentication token found. Please log in again.");
        return false;
      }

      const response = await fetch(
        "https://synkkafrica-backend-core.onrender.com/api/users/profile",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profileData),
        }
      );

      let data = {};
      try {
        data = await response.json();
      } catch (parseError) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Failed to parse response JSON", parseError);
        }
      }

      if (!response.ok) {
        setError(data?.message || "Failed to update profile");
        return false;
      }

      // Update stored user data with new profile information
      try {
        const userData = localStorage.getItem("customerUser");
        if (userData) {
          const user = JSON.parse(userData);
          const updatedUser = {
            ...user,
            ...profileData,
            // Ensure we don't overwrite critical fields with empty strings
            firstName: profileData.firstName || user.firstName,
            lastName: profileData.lastName || user.lastName,
          };
          localStorage.setItem("customerUser", JSON.stringify(updatedUser));
        }
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Failed to update local user data:", e);
        }
      }

      // Trigger storage event for session sync
      window.dispatchEvent(new Event("storage"));

      return true;
    } catch (err) {
      logger.error('Profile update failed:', err);
      const msg = err.message || "Unable to reach server. Please try again later.";
      setError(msg);
      addToast({ message: msg, type: "error" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateProfile,
    loading,
    error,
    setError,
  };
};
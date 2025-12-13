// hooks/customer/useGetName.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export const useGetName = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * submitName
   * @param {string} firstName
   * @param {string} lastName
   * @returns {Promise<boolean>}
   */
  const submitName = async (firstName, lastName) => {
    setLoading(true);
    setError("");

    // Validate inputs
    if (!firstName.trim() || !lastName.trim()) {
      setError("Both first name and last name are required");
      setLoading(false);
      return false;
    }

    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      setError("Both names must be at least 2 characters long");
      setLoading(false);
      return false;
    }

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
          body: JSON.stringify({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phoneNumber: "",
            address: "",
            city: "",
            state: "",
            country: "",
            profilePicture: "",
          }),
        }
      );

      let data = {};
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Failed to parse response JSON", parseError);
        setError("Failed to parse server response");
        return false;
      }

      if (!response.ok) {
        setError(data?.message || "Failed to save name");
        return false;
      }

      // Update localStorage with new user data
      try {
        const userData = localStorage.getItem("customerUser");
        if (userData) {
          const user = JSON.parse(userData);
          const updatedUser = {
            ...user,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
          };
          localStorage.setItem("customerUser", JSON.stringify(updatedUser));
        }
      } catch (e) {
        console.error("Failed to update localStorage with user data:", e);
      }

      // Trigger storage event for cross-tab sync
      window.dispatchEvent(new Event("storage"));

      // Success - redirect to customer dashboard
      router.push("/dashboard/"); 
      return true;
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Unable to reach server. Please try again later."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitName,
    loading,
    error,
    setError,
  };
};
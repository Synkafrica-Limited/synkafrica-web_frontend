"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/layout/AuthLayout";
import Buttons from "@/components/ui/Buttons";
import { useUpdateProfile } from "@/hooks/customer/details/useUpdateUserProfile";
export default function NameInputScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [isFirstNameTouched, setIsFirstNameTouched] = useState(false);
  const [isLastNameTouched, setIsLastNameTouched] = useState(false);

  // Use the update profile hook
  const { updateProfile, loading, error: serverError } = useUpdateProfile();

  const validateName = (name) => {
    return name.trim().length >= 2;
  };

  const handleFirstNameChange = (e) => {
    const value = e.target.value;
    setFirstName(value);

    if (isFirstNameTouched) {
      if (!value.trim()) {
        setFirstNameError("First name is required");
      } else if (!validateName(value)) {
        setFirstNameError("First name must be at least 2 characters");
      } else {
        setFirstNameError("");
      }
    }
  };

  const handleLastNameChange = (e) => {
    const value = e.target.value;
    setLastName(value);

    if (isLastNameTouched) {
      if (!value.trim()) {
        setLastNameError("Last name is required");
      } else if (!validateName(value)) {
        setLastNameError("Last name must be at least 2 characters");
      } else {
        setLastNameError("");
      }
    }
  };

  const handleFirstNameBlur = () => {
    setIsFirstNameTouched(true);

    if (!firstName.trim()) {
      setFirstNameError("First name is required");
    } else if (!validateName(firstName)) {
      setFirstNameError("First name must be at least 2 characters");
    } else {
      setFirstNameError("");
    }
  };

  const handleLastNameBlur = () => {
    setIsLastNameTouched(true);

    if (!lastName.trim()) {
      setLastNameError("Last name is required");
    } else if (!validateName(lastName)) {
      setLastNameError("Last name must be at least 2 characters");
    } else {
      setLastNameError("");
    }
  };

  const isFormValid =
    firstName.trim() &&
    lastName.trim() &&
    validateName(firstName) &&
    validateName(lastName) &&
    !firstNameError &&
    !lastNameError;

  const handleContinue = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    const success = await updateProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    });

    if (success) {
      router.push("/dashboard");
    }
  };



  return (
    <AuthLayout
      title="What's your name?"
      subtitle={
        <>
          Match your account name to the ID you use when
          <br className="hidden sm:block" />
          traveling, like a passport or license.
        </>
      }
      bgGradient="bg-linear-to-br from-blue-400 via-blue-500 to-purple-800"
      cancelHref="/signin"
    >
      <form onSubmit={handleContinue} className="space-y-6">
        {/* Server Error */}
        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{serverError}</p>
          </div>
        )}

        {/* First Name Input */}
        <div className="space-y-2">
          <div className="relative">
            <input
              type="text"
              value={firstName}
              onChange={handleFirstNameChange}
              onBlur={handleFirstNameBlur}
              placeholder="First name"
              className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-0 transition-colors text-gray-900 placeholder-gray-400 ${
                firstNameError
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-gray-900"
              }`}
            />
            {firstNameError && (
              <p className="mt-2 text-sm text-red-600">{firstNameError}</p>
            )}
          </div>
        </div>

        {/* Last Name Input */}
        <div className="space-y-2">
          <div className="relative">
            <input
              type="text"
              value={lastName}
              onChange={handleLastNameChange}
              onBlur={handleLastNameBlur}
              placeholder="Last name"
              className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-0 transition-colors text-gray-900 placeholder-gray-400 ${
                lastNameError
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-gray-900"
              }`}
            />
            {lastNameError && (
              <p className="mt-2 text-sm text-red-600">{lastNameError}</p>
            )}
          </div>
        </div>

        {/* Continue Button */}
        <Buttons
          type="submit"
          disabled={!isFormValid || loading}
          className={`w-full py-4 px-4 rounded-xl font-medium text-white transition-all duration-200 ${
            isFormValid && !loading
              ? "bg-linear-to-r from-primary-400 to-primary-300 hover:from-primary-500 hover:to-primary-400 shadow-md"
              : "bg-primary-200 cursor-not-allowed"
          }`}
        >
          {loading ? "Updating..." : "Continue"}
        </Buttons>
      </form>
    </AuthLayout>
  );
}
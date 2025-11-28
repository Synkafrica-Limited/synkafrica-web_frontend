"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function NameInputScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isFirstNameFocused, setIsFirstNameFocused] = useState(false);
  const [isLastNameFocused, setIsLastNameFocused] = useState(false);
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [isFirstNameTouched, setIsFirstNameTouched] = useState(false);
  const [isLastNameTouched, setIsLastNameTouched] = useState(false);

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
    setIsFirstNameFocused(false);
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
    setIsLastNameFocused(false);
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

  const handleContinue = () => {
    if (isFormValid) {
      // Handle name submission
      console.log("Name submitted:", {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6 bg-white">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Link href="/verify-email">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
        </button>
        {/* Logo */}
        <Image
          src="/images/brand/synkafrica-logo-single.png"
          alt="Synk Africa Logo"
          width={80}
          height={30}
        />
        <div className="w-10"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-8 max-w-md mx-auto w-full">
        <div className="w-full space-y-8">
          {/* Title and Description */}
          <div className="text-center space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              What's your name?
            </h1>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Match your account name to the ID you use when
              <br className="hidden sm:block" />
              traveling, like a passport or license.
            </p>
          </div>

          {/* Name Form */}
          <div className="space-y-6">
            {/* First Name Input */}
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  value={firstName}
                  onChange={handleFirstNameChange}
                  onFocus={() => setIsFirstNameFocused(true)}
                  onBlur={handleFirstNameBlur}
                  placeholder="First name"
                  className={`w-full px-4 py-3.5 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 ${
                    firstNameError
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
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
                  onFocus={() => setIsLastNameFocused(true)}
                  onBlur={handleLastNameBlur}
                  placeholder="Last name"
                  className={`w-full px-4 py-3.5 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 ${
                    lastNameError
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {lastNameError && (
                  <p className="mt-2 text-sm text-red-600">{lastNameError}</p>
                )}
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              disabled={!isFormValid}
              className={`w-full py-3.5 px-4 rounded-lg font-medium transition-all duration-200 ${
                isFormValid
                  ? "bg-orange-500 hover:bg-orange-600 text-white shadow-sm"
                  : "bg-orange-300 text-white cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

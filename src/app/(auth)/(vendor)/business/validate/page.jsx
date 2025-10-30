"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function VendorEmailValidationScreen() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [touched, setTouched] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // In real flow, read from query or context
  const email = "your-business@email.com";

  const validateCode = (v) => /^\d{6}$/.test(v);

  const onChange = (e) => {
    const v = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(v);
    if (touched) setCodeError(!v ? "Code is required" : !validateCode(v) ? "Enter a valid 6‑digit code" : "");
  };

  const onBlur = () => {
    setTouched(true);
    setCodeError(!code ? "Code is required" : !validateCode(code) ? "Enter a valid 6‑digit code" : "");
  };

  const isValid = code && validateCode(code) && !codeError;

  const handleContinue = () => {
    if (!isValid) return;
    // After successful verification, take vendors to onboarding
    router.push("/dashboard/business/onboarding");
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      // Call resend OTP API here
      await new Promise((r) => setTimeout(r, 800));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6 bg-white">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Link href="/auth/(vendor)/signup">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
        </button>
        <Image src="/images/brand/synkafrica-logo-single.png" alt="Synk Africa Logo" width={80} height={30} />
        <div className="w-10" />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-8 max-w-md mx-auto w-full">
        <div className="w-full space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Verify your email</h1>
            <p className="text-gray-600 text-sm sm:text-base">Enter the 6‑digit code we sent to <span className="font-medium text-gray-900">{email}</span>.</p>
          </div>

          <div className="space-y-6">
            <div>
              <input
                type="text"
                inputMode="numeric"
                value={code}
                onChange={onChange}
                onBlur={onBlur}
                placeholder="6-digit code"
                maxLength={6}
                className={`w-full px-4 py-3.5 border rounded-lg text-center text-lg tracking-wider focus:ring-2 focus:border-transparent transition-all duration-200 ${
                  codeError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {codeError && <p className="mt-2 text-sm text-red-600">{codeError}</p>}
            </div>

            <button
              onClick={handleContinue}
              disabled={!isValid}
              className={`w-full py-3.5 px-4 rounded-lg font-medium transition-all duration-200 ${
                isValid ? "bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white shadow-sm" : "bg-gray-200 text-white cursor-not-allowed"
              }`}
            >
              Continue
            </button>

            <div className="text-center">
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline disabled:opacity-50"
              >
                {isResending ? "Sending..." : "Resend Code"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

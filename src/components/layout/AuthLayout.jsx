"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LottiePlayer from "./LottiePlayer";

/**
 * Reusable authentication layout component with split design
 * 
 * @example
 * // Basic usage for vendor login
 * <AuthLayout title="Sign in" subtitle="Welcome to the vendor dashboard.">
 *   <div className="space-y-5">
 *     <input type="email" placeholder="Email" className="..." />
 *     <button>Log in</button>
 *   </div>
 * </AuthLayout>
 * 
 * @example
 * // Usage with custom gradient for customer auth
 * <AuthLayout 
 *   title="Welcome Back" 
 *   subtitle="Sign in to your account"
 *   bgGradient="bg-linear-to-br from-blue-400 via-blue-500 to-purple-800"
 *   cancelHref="/"
 * >
 *   {children}
 * </AuthLayout>
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Form content to render on the right side
 * @param {string} props.title - Main heading text
 * @param {string} props.subtitle - Subtitle/description text
 * @param {string} [props.illustrationSrc] - Path to illustration image (defaults to logo)
 * @param {string} [props.illustrationAlt] - Alt text for illustration
 * @param {string} [props.bgGradient] - Custom gradient classes (default: orange to gray gradient)
 * @param {string} [props.cancelHref] - URL for cancel/back button (default: "/")
 * @param {string} [props.cancelLabel] - Label for cancel button (default: "Cancel")
 * @param {boolean} [props.showCancel] - Whether to show cancel button (default: true)
 */
export default function AuthLayout({
  children,
  title,
  subtitle,
  illustrationSrc = "/images/brand/synkafrica-logo-single.png",
  illustrationAlt = "Synkkafrica Illustration",
  bgGradient = "bg-linear-to-br from-orange-400 via-orange-500 to-gray-800",
  cancelHref = "/",
  cancelLabel = "Cancel",
  showCancel = true,
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden relative">
        {/* Cancel Button - Top Left */}
        {showCancel && (
          <Link 
            href={cancelHref}
            className="absolute top-6 left-6 z-10 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <div className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium hidden sm:inline">{cancelLabel}</span>
          </Link>
        )}

        <div className="grid md:grid-cols-2 min-h-[600px]">
          {/* Left side - Illustration */}
          <div 
            className={`hidden md:flex items-center justify-center p-12 `}
          >
            <div className="w-full max-w-md">
              <LottiePlayer
                src="/animations/loading.lottie"
                loop
                autoplay
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          </div>

          {/* Right side - Form */}
          <div className="flex flex-col items-center justify-center p-8 md:p-12 lg:p-16">
            <div className="w-full max-w-md space-y-8">
              {/* Logo and Header */}
              <div className="text-center space-y-4">
                <div className="flex justify-center mb-6">
                  <Image 
                    src="/images/brand/synkafrica-logo-single.png" 
                    alt="Synk Africa Logo" 
                    width={60} 
                    height={60}
                    className="w-16 h-16"
                  />
                </div>
                <h1 className="text-xl md:text-3xl font-bold text-gray-900">{title}</h1>
                <p className="text-gray-600 text-sm">{subtitle}</p>
              </div>

              {/* Form Content */}
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

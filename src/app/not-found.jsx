"use client";
import Link from "next/link";
import { HiOutlineExclamationCircle } from "react-icons/hi";

// Update the path below to your actual logo file location if different
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-12">
      {/* Synkafrica Logo at the top */}
      <div className="w-full flex justify-center mb-8">
        <Image
          src="/images/brand/synkafrica-logo-w-text.png"
          alt="Synkkafrica Logo"
          width={250}
          height={100}
          className="transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <HiOutlineExclamationCircle className="text-[#E26A3D] mb-6" style={{ fontSize: 100 }} />
      <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
      <p className="text-gray-600 text-lg mb-6 text-center max-w-md">
        Sorry, the page you are looking for may still be in development or does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="bg-[#E26A3D] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#c2552e] transition"
      >
        Go back home
      </Link>
    </div>
  );
}
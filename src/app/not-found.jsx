"use client";
import Link from "next/link";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-12">
      <HiOutlineExclamationCircle className="text-[#E26A3D] mb-6" style={{ fontSize: 100 }} />
      <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
      <p className="text-gray-600 text-lg mb-6 text-center max-w-md">
        Sorry, the page you are looking for does not exist or has been moved.
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
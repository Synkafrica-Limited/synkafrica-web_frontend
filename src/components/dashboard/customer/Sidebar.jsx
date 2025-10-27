// src/components/dashboard/Sidebar.jsx
"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  IoGlobeOutline,
  IoPersonOutline,
  IoLogOutOutline,
  IoDocumentTextOutline,
  IoChatbubbleEllipsesOutline,
  IoCashOutline,
  IoCloseOutline,
  IoMenu,
  IoHomeOutline,
} from "react-icons/io5"

const menu = [
  { label: "Home", icon: <IoHomeOutline />, href: "/" },
  { label: "My Profile", icon: <IoPersonOutline />, href: "dashboard/" },
  { label: "Bookings",   icon: <IoDocumentTextOutline />, href: "dashboard/bookings" },
  { label: "Feedback",    icon: <IoChatbubbleEllipsesOutline />, href: "/dashboard/feedback" },
  { label: "Log Out", icon: <IoLogOutOutline />, href: "/log-out" },
]

export default function Sidebar({ active }) {
  const [open, setOpen] = useState(false)

  // Prevent background scroll when nav is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  return (
    <>
      {/* ── MOBILE HAMBURGER (aligned with navbar style) ────────────────── */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-all duration-200"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <IoMenu className="h-6 w-6" />
      </button>

      {/* ── MOBILE BACKDROP (navbar style) ──────────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── MOBILE DRAWER (match navbar: width, shadow, transitions) ───── */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-80 bg-white shadow-xl
          transform transition-transform duration-300 ease-in-out z-50 md:hidden
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
        aria-hidden={!open}
      >
        {/* Header row matches navbar drawer */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center">
              <IoGlobeOutline className="text-orange-500 text-sm" />
            </div>
            <span className="font-medium text-gray-900">USD</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-all duration-200"
            aria-label="Close menu"
          >
            <IoCloseOutline className="h-6 w-6" />
          </button>
        </div>

        {/* Links area mirrors navbar link styling */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {menu.map(({ label, icon, href }) => {
              const isActive = active === href
              return (
                <Link
                  key={href + label}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={[
                    "flex items-center gap-3 px-6 py-4 rounded-lg transition-all duration-200 border-b border-gray-100",
                    isActive
                      ? "bg-primary-50 text-primary-600 font-semibold"
                      : "text-gray-900 hover:px-9 hover:bg-primary-50 hover:text-primary-600",
                  ].join(" ")}
                >
                  <span className={`text-xl ${isActive ? "text-primary-600" : "text-gray-700"}`}>
                    {icon}
                  </span>
                  <span>{label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </aside>

      {/* ── DESKTOP SIDEBAR (unchanged) ─────────────────────────────────── */}
      <aside className="hidden md:flex md:flex-col md:w-60 bg-white border-r border-gray-200 min-h-screen">
        <div className="px-8 py-6">
          <Link href="/">
            <Image
              src="/images/brand/synkafrica-logo-w-text.png"
              alt="Synkkafrica Logo"
              width={120}
              height={40}
              priority
            />
          </Link>
        </div>
        <nav className="flex-1 px-4 py-2 space-y-1">
          {menu.map(({ label, icon, href }) => {
            const isActive = active === href
            return (
              <Link
                key={href + label}
                href={href}
                className={`
                  flex space-x-3 py-4 hover:px-9 text-gray-900 font-normal hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-all duration- border-gray-100
                  ${isActive
                    ? "text-primary-600 font-semibold bg-primary-50"
                    : "text-gray-700 hover:bg-gray-50 hover:text-primary-600"}
                  group
                `}
              >
                {isActive && (
                  <span className="absolute right-0 top-2 bottom-2 h-40 w-3.5 rounded-l bg-primary-500 transition-all duration-300" />
                )}
                <span className={`text-xl transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-primary-600" : ""}`}>{icon}</span>
                <span className={`transition-colors duration-200 ${isActive ? "text-primary-600" : ""}`}>{label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}

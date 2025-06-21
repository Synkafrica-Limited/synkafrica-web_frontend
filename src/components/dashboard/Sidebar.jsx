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
  IoCloseOutline,
  IoMenu
} from "react-icons/io5"

const menu = [
  { label: "My Profile", icon: <IoPersonOutline />, href: "/dashboard/customer/" },
  { label: "Bookings",   icon: <IoDocumentTextOutline />, href: "/dashboard/customer/bookings" },
  { label: "Reviews",    icon: <IoChatbubbleEllipsesOutline />, href: "/dashboard/customer/reviews" },
  { label: "Sign Out",   icon: <IoLogOutOutline />, href: "/logout" },
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
      {/* ── MOBILE HAMBURGER (fixed top-left) ───────────────────────────── */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden p-2 text-2xl text-primary-500"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <IoMenu />
      </button>

      {/* ── MOBILE BACKDROP ─────────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── MOBILE DRAWER ─────────────────────────────── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-3/4 max-w-xs bg-white shadow-2xl rounded-tr-3xl rounded-br-3xl
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:hidden
        `}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b">
          {/* Currency selector */}
          <div className="flex items-center space-x-2">
            <IoGlobeOutline className="text-xl text-gray-600" />
            <span className="text-sm font-medium text-gray-800">USD</span>
          </div>
          {/* Close button */}
          <button
            onClick={() => setOpen(false)}
            className="text-2xl text-gray-600"
            aria-label="Close menu"
          >
            <IoCloseOutline />
          </button>
        </div>
        <nav className="px-4 py-6 flex flex-col space-y-4">
          {menu.map(({ label, icon, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition"
            >
              <span className="text-xl text-gray-700">{icon}</span>
              <span className="font-medium text-gray-800">{label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* ── DESKTOP SIDEBAR ─────────────────────────────── */}
      <aside className="hidden md:flex md:flex-col md:w-60 bg-white border-r border-gray-200 min-h-screen">
        <div className="px-8 py-6">
          <Link href="/">
            <Image
              src="/images/brand/synkafrica-logo-w-text.png"
              alt="Synkafrica Logo"
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
                key={href}
                href={href}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition relative
                  ${isActive
                    ? "text-primary-600 font-semibold bg-primary-50"
                    : "text-gray-700 hover:bg-gray-50"}
                `}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute right-0 top-2 bottom-2 w-1.5 rounded-l bg-primary-500" />
                )}
                <span className="text-xl">{icon}</span>
                <span>{label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}

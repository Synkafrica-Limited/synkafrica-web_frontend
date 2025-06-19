// src/components/dashboard/Sidebar.jsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  IoPersonOutline,
  IoLogOutOutline,
  IoDocumentTextOutline,
  IoChatbubbleEllipsesOutline,
  IoMenu,
} from "react-icons/io5";

const menu = [
  { label: "Profile", icon: <IoPersonOutline />, href: "/dashboard" },
  { label: "Bookings", icon: <IoDocumentTextOutline />, href: "/dashboard/bookings" },
  { label: "Reviews", icon: <IoChatbubbleEllipsesOutline />, href: "/dashboard/reviews" },
  { label: "Log Out", icon: <IoLogOutOutline />, href: "/logout" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* mobile hamburger */}
      <button onClick={() => setOpen(!open)} className="md:hidden p-4 text-2xl text-primary-500">
        <IoMenu />
      </button>

      <aside
        className={`
          fixed inset-x-0 top-0 z-40 bg-white rounded-b-3xl shadow-lg transition-transform
          ${open ? "translate-y-0" : "-translate-y-full"}
          md:static md:translate-y-0 md:rounded-r-3xl md:rounded-b-none md:shadow md:w-[220px]
        `}
        style={{ maxHeight: open ? "90vh" : 0, overflow: open ? "auto" : "hidden" }}
      >
        <div className="flex justify-center p-6">
          <Link href="/dashboard">
            <Image src="/images/brand/synkafrica-logo-w-text.png" width={120} height={40} alt="Logo"/>
          </Link>
        </div>
        <nav className="flex flex-col">
          {menu.map(({ label, icon, href }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-8 py-3 text-base font-medium hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              <span className="text-xl">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {open && <div className="fixed inset-0 bg-black/20 z-30" onClick={() => setOpen(false)} />}
    </>
  );
}

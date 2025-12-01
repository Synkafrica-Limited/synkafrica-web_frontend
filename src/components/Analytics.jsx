"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!GA_ID) return;
    // ensure dataLayer and gtag exist
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);} 
    window.gtag = window.gtag || gtag;

    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { page_path: pathname });
  }, [pathname]);

  return null;
}

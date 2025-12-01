import { Montserrat, Montserrat_Alternates } from "next/font/google";
import "../styles/globals.css"; 
import ToastProvider from "@/components/ui/ToastProvider";
import LoadingProvider from "@/components/ui/LoadingProvider";
import { Providers } from "@/components/Providers";
import Analytics from '@/components/Analytics';


const montserratAlternates = Montserrat_Alternates({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-montserrat-alternates",
});


const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
});


export const metadata = {
  metadataBase: new URL('https://synkkafrica.com'),
  title: {
    default: 'SynKKafrica',
    template: '%s | SynKKafrica',
  },
  description: 'Empowering mobility across Africa — discover and book services, vendors and transport across the continent.',
  keywords: ['SynKKafrica', 'Africa', 'transport', 'bookings', 'vendors', 'mobility'],
  authors: [{ name: 'SynKKafrica' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/Group 287.png',
    apple: '/icons/Group 287.png',
    other: [
      { rel: 'icon', url: '/icons/Group 287.png' },
      { rel: 'shortcut icon', url: '/icons/Group 287.png' },
    ],
  },
  openGraph: {
    title: 'SynKKafrica',
    description: 'Empowering mobility across Africa — discover and book services, vendors and transport across the continent.',
    url: 'https://synkkafrica.com',
    siteName: 'SynKKafrica',
    images: [
      {
        url: '/images/brand/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SynKKafrica',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SynKKafrica',
    description: 'Empowering mobility across Africa — discover and book services, vendors and transport across the continent.',
    images: ['/images/brand/og-image.svg'],
    site: '@synkkafrica',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
       <body className="font-sans bg-(--background) text-(--foreground)">
          <LoadingProvider>
            <ToastProvider>
              <Analytics />
              {children}
            </ToastProvider>
          </LoadingProvider>
        </body>
    </html>
  );
}

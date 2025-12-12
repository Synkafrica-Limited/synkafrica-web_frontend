export default function Head() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SynKKafrica",
    "url": "https://synkkafrica.com",
    "logo": "https://synkkafrica.com/images/brand/synkafrica-logo-w-text.png",
    "sameAs": [
      "https://www.facebook.com/synkkafrica",
      "https://twitter.com/synkkafrica"
    ]
  };

  return (
    <>
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#0b5cff" />
      <link rel="icon" href="/icons/Group 287.png" />
      <link rel="apple-touch-icon" href="/icons/Group 287.png" />
      <link rel="canonical" href="https://synkkafrica.com" />
      <meta name="robots" content="index,follow" />
      {/* Optional Google Search Console verification: set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION in env */}
      {process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && (
        <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION} />
      )}

      {/* Open Graph preview image preconnect & preload */}
      <link rel="preload" as="image" href="/images/brand/og-image.png" />

      <script type="application/ld+json">{JSON.stringify(ld)}</script>

      {/* Google Analytics (GA4) - set NEXT_PUBLIC_GA_ID to enable */}
      {process.env.NEXT_PUBLIC_GA_ID && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}></script>
          <script dangerouslySetInnerHTML={{ __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', { page_path: window.location.pathname });` }} />
        </>
      )}
    </>
  );
}

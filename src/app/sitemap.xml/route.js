export async function GET() {
  const BASE_URL = process.env.SITE_BASE_URL || 'https://synkkafrica.com';

  const staticPages = [
    { url: '/', priority: 1.0, changefreq: 'daily' },
    { url: '/notifications', priority: 0.6, changefreq: 'weekly' },
    { url: '/business', priority: 0.8, changefreq: 'daily' },
    { url: '/dashboard/business/profile', priority: 0.5, changefreq: 'monthly' },
    { url: '/privacy-policy', priority: 0.3, changefreq: 'yearly' },
    { url: '/terms', priority: 0.3, changefreq: 'yearly' },
  ];

  // Optionally fetch dynamic entries if you expose an API endpoint for listings
  let dynamicEntries = [];
  try {
    const apiUrl = process.env.SITEMAP_API_URL;
    if (apiUrl) {
      const res = await fetch(`${apiUrl}/sitemap-listings`);
      if (res.ok) {
        const data = await res.json();
        // expected: [{ path: '/service/TYPE/ID', priority: 0.6, changefreq: 'weekly' }, ...]
        dynamicEntries = Array.isArray(data) ? data : [];
      }
    }
  } catch (e) {
    // ignore network errors; sitemap will contain static routes
    // eslint-disable-next-line no-console
    console.debug('sitemap dynamic fetch failed', e);
  }

  const all = [...staticPages, ...dynamicEntries];

  const urls = all.map((p) => `  <url>\n    <loc>${BASE_URL}${p.url}</loc>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=0, s-maxage=3600'
    }
  });
}

import { useRouter } from 'next/router';

export default function LaundryServicePage() {
  const router = useRouter();
  const { id } = router.query;
  
  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-4">Laundry Services</h1>
        <p className="text-gray-600">Explore our laundry services available in Lagos.</p>
        {/* Add your laundry service components here */}
      </div>
    </main>
  );
}
// This is a placeholder for the laundry service page.
// You can replace this with your actual content or components related to laundry services.
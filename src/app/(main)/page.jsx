import { redirect } from 'next/navigation';

export default function HomePage() {
  // Temporarily point root (/) to the public customer landing for testing
  redirect('/landing_page');
}

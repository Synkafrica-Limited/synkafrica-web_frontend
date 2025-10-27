// src/app/dashboard/(customer)/order-details/page.jsx
export default async function OrderDetailsIndex() {
  // (Server Component) fetch orders here
  const orders = [
    { id: "TR001234", type: "transportation" },
    { id: "RES001234", type: "restaurant" },
    { id: "BCH001234", type: "beach" },
  ];

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      <ul className="space-y-2">
        {orders.map(o => (
          <li key={o.id}>
            <a
              className="text-blue-600 underline"
              href={`/dashboard/(customer)/order-details/${o.type}/${o.id}`}
            >
              {o.type} — {o.id}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}

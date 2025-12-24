import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function TrendingSection() {
  const items = [
    {
      id: 1,
      title: "Have fun experience in Lagos",
      image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2088&auto=format&fit=crop", // Lagos / Africa vibe
      link: "/result?location=Lagos&service=experience"
    },
    {
      id: 2,
      title: "Find personal service in Lagos",
      image: "https://img.freepik.com/free-photo/beautiful-african-woman-resting-relaxing-with-sea-salt-back-spa-salon_176420-13944.jpg?t=st=1766423326~exp=1766426926~hmac=d5445c67cd40d27ab040985770d87c051de6f77d6fec45ad90dec687ba9bd2c6", // Service / Concierge
      link: "/result?location=Lagos&service=convenience"
    },
    {
      id: 3,
      title: "Great resorts to visit in Lagos",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop", // Resort
      link: "/result?location=Lagos&service=resorts"
    },
    {
      id: 4,
      title: "Want to eat out?",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop", // Restaurant
      link: "/result?service=restaurant"
    }
  ];

  return (
    <div className="bg-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Trending destinations</h2>
        <p className="text-sm text-gray-600 mb-6">Most popular choices for travellers from Nigeria</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <Link 
              href={item.link} 
              key={item.id}
              className="group relative h-[240px] rounded-lg overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute inset-0">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              </div>
              <div className="absolute top-4 left-4 right-4">
                 <div className="flex items-center gap-2">
                    <h3 className="text-white text-xl font-bold drop-shadow-md">{item.title}</h3>
                    {item.title.includes("Lagos") && (
                        <span className="text-2xl">🇳🇬</span>
                    )}
                 </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

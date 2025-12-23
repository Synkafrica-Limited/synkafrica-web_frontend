"use client";

import React from "react";
import Image from "next/image";

export default function CustomerReviewsSection() {
  const reviews = [
    {
      id: 1,
      name: "Sarah J.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
      text: "Shopping here is a breeze!",
      pillColor: "bg-[#FFE8E8]" // Light pink/red
    },
    {
      id: 2,
      name: "Mike C.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
      text: "Safe, fast, and reliable.",
      pillColor: "bg-[#E8F4FF]" // Light blue
    },
    {
      id: 3,
      name: "Amara O.",
      avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=150&auto=format&fit=crop",
      text: "Trusted and great experience.",
      pillColor: "bg-[#E6FFFA]" // Light teal
    },
    {
      id: 4,
      name: "James W.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
      text: "Income increased 100x!",
      pillColor: "bg-[#F3E8FF]" // Light purple
    },
    {
      id: 5,
      name: "Elena R.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
      text: "Best local finds ever.",
      pillColor: "bg-[#FFFACD]" // Light yellow
    },
    {
      id: 6,
      name: "David K.",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop",
      text: "Hidden gems everywhere.",
      pillColor: "bg-[#FFE4E1]" // Misty rose
    },
     {
      id: 7,
      name: "Lisa W.",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop",
      text: "So easy for family trips.",
      pillColor: "bg-[#E0E7FF]" // Indigo
    },
    {
      id: 8,
      name: "Rob T.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
      text: "I use this daily in Lagos.",
      pillColor: "bg-[#F0FFF4]" // Green
    },
    {
      id: 9,
      name: "Sophia M.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
      text: "Totally comfortable & safe.",
      pillColor: "bg-[#FFF5F5]" // Red
    }
  ];

  // Split reviews into 3 rows
  const row1 = reviews.slice(0, 3);
  const row2 = reviews.slice(3, 6);
  const row3 = reviews.slice(6, 9);

  const ReviewCard = ({ review }) => (
    <div className="w-[350px] bg-white p-5 rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none flex-shrink-0 mx-4 transition-transform hover:-translate-y-1 duration-300">
      <p className="text-gray-700 font-medium text-[14px] mb-6">
        {review.text}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
             <svg 
                key={i}
                className="w-4 h-4 text-yellow-400 fill-current" 
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        <div className={`flex items-center gap-2 pl-3 pr-1.5 py-1 rounded-full ${review.pillColor}`}>
             <span className="text-xs font-bold text-gray-700">{review.name}</span>
             <div className="relative w-7 h-7 rounded-full overflow-hidden border-2 border-white">
                <Image
                    src={review.avatar}
                    alt={review.name}
                    fill
                    className="object-cover"
                />
             </div>
        </div>
      </div>
    </div>
  );

  const MarqueeRow = ({ items, duration = "40s" }) => (
    <div className="flex overflow-hidden py-3 group">
      <div 
        className="flex animate-marquee"
        style={{ 
            animationDuration: duration,
        }}
      >
        {items.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
        {items.map((review) => (
          <ReviewCard key={`dup-${review.id}`} review={review} />
        ))}
         {items.map((review) => (
          <ReviewCard key={`dup2-${review.id}`} review={review} />
        ))}
         {items.map((review) => (
          <ReviewCard key={`dup3-${review.id}`} review={review} />
        ))}
      </div>
      
       <div 
        className="flex animate-marquee"
        style={{ 
            animationDuration: duration,
        }}
      >
        {items.map((review) => (
          <ReviewCard key={`sec-${review.id}`} review={review} />
        ))}
         {items.map((review) => (
          <ReviewCard key={`sec-dup-${review.id}`} review={review} />
        ))}
         {items.map((review) => (
          <ReviewCard key={`sec-dup2-${review.id}`} review={review} />
        ))}
        {items.map((review) => (
          <ReviewCard key={`sec-dup3-${review.id}`} review={review} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white py-20 overflow-hidden relative">
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee linear infinite;
        }
      `}</style>
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#f8f9fa_1px,transparent_1px)] [background-size:20px_20px] opacity-50 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mb-16 text-left relative z-10">
         <h2 className="text-[24px] font-bold text-gray-900 mb-4">Loved by Travelers</h2>
          <p className="text-gray-500 text-[14px]">
            Join the community of happy explorers
          </p>
      </div>

      <div className="relative z-10 space-y-2">
        {/* All rows scrolling right-to-left as requested */}
        <MarqueeRow items={row1} duration="45s" />
        <MarqueeRow items={row2} duration="55s" />
        <MarqueeRow items={row3} duration="50s" />
      </div>

       {/* Gradient fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 md:w-60 bg-gradient-to-r from-white to-transparent z-20"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 md:w-60 bg-gradient-to-l from-white to-transparent z-20"></div>
    </div>
  );
}

import React from "react";
import Button from "@/components/ui/Buttons";
import { ArrowRight } from 'lucide-react';

const experiences = [
  {
    title: "Beach Experiences",
    desc: "Relax and unwind with our premium beach services.",
    img: "/images/beach_exp.jpg", // Replace with your actual image path
  },
  {
    title: "Dining Reservations",
    desc: "Your VIP pass to the city’s best spot, without the wait.",
    img: "/images/dining_reserv.png", // Replace with your actual image path
  },
  {
    title: "Convenience Services",
    desc: "Discover ultimate convenience services at your fingertips.",
    img: "/images/convenience_services.png", // Replace with your actual image path
  },
];

export default function ExperiencesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-1">Experiences</h2>
      <p className="text-gray-500 mb-6">Explore popular amazing experiences</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {experiences.map((exp) => (
          <div
            key={exp.title}
            className="bg-white rounded-xl shadow border border-gray-100 flex flex-col overflow-hidden"
          >
            <img
              src={exp.img}
              alt={exp.title}
              className="h-36 w-full object-cover"
            />
            <div className="p-4 flex flex-col flex-1">
              <div className="font-semibold text-lg mb-1">{exp.title}</div>
              <div className="text-gray-500 text-sm mb-4 flex-1">{exp.desc}</div>
              <Button
                variant="filled"
                icon={<ArrowRight />}
                size="md"
                className="w-full mb-4"
              >View Details</Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
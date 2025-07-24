"use client";

import { useRouter } from "next/navigation";
import ServiceDetails from "@/components/service_detail/ServiceDetail";

export default function DiningServiceDetailPage() {
    const router = useRouter();

    // TODO: this data should be fetched from an API or database
    // TODO: Handle loading state and errors
    const diningServiceDetail = {
        id: "Dining001",
        name: "Gourmet Dining Experience",
        tagline: "Savor exquisite flavors in an elegant setting",
        serviceType: "dining",
        rating: 4.7,
        reviewCount: 21,
        location: "Victoria Island, Lag, NG",
        price: 18000,
        currency: "₦",
        mainImage: "/api/placeholder/600/400?dining",
        address: {
            street: "12 Gourmet Avenue",
            city: "Victoria Island",
            state: "Lagos State",
            country: "Nigeria",
            zipCode: "101241",
        },
        workingHours: {
            monday: { open: "12:00 PM", close: "11:00 PM" },
            tuesday: { open: "12:00 PM", close: "11:00 PM" },
            wednesday: { open: "12:00 PM", close: "11:00 PM" },
            thursday: { open: "12:00 PM", close: "11:00 PM" },
            friday: { open: "12:00 PM", close: "12:00 AM" },
            saturday: { open: "12:00 PM", close: "12:00 AM" },
            sunday: { open: "12:00 PM", close: "10:00 PM" },
        },
        services: [
            {
                title: "Fine Dining",
                description:
                    "Enjoy a curated menu of international and local dishes prepared by top chefs.",
            },
            {
                title: "Private Dining Rooms",
                description:
                    "Book exclusive spaces for intimate gatherings or business meetings.",
            },
            {
                title: "Wine & Beverage Selection",
                description:
                    "Choose from an extensive list of wines, cocktails, and non-alcoholic drinks.",
            },
            {
                title: "Live Music Evenings",
                description:
                    "Experience live performances from talented local artists on weekends.",
            },
            {
                title: "Event Catering",
                description:
                    "Custom catering services for birthdays, anniversaries, and corporate events.",
            },
        ],
        portfolio: [
            "/api/placeholder/300/200?dining1",
            "/api/placeholder/300/200?dining2",
            "/api/placeholder/300/200?dining3",
            "/api/placeholder/300/200?dining4",
        ],
        reviews: [
            {
                id: 1,
                name: "Ngozi",
                location: "Lagos, Nigeria",
                rating: 5,
                timeAgo: "2 days ago",
                comment:
                    "The ambiance was perfect and the food was absolutely delicious. Highly recommend!",
            },
            {
                id: 2,
                name: "Tunde",
                location: "Ibadan, Nigeria",
                rating: 4.5,
                timeAgo: "5 days ago",
                comment:
                    "Great service and a wonderful selection of wines. Will visit again.",
            },
        ],

        menu: [
            {
                name: "Appetizers",
                items: [
                    {
                        name: "Peppered Snail",
                        description: "Fresh snails in spicy pepper sauce with onions",
                        ingredients: "Snails, scotch bonnet, onions, ginger, garlic",
                        price: 3500
                    },
                    {
                        name: "Suya Platter",
                        description: "Grilled beef skewers with traditional spices",
                        ingredients: "Beef, suya spice, onions, tomatoes, cucumber",
                        price: 2800
                    },
                    {
                        name: "Plantain Chips & Dip",
                        description: "Crispy plantain chips served with spicy pepper dip",
                        ingredients: "Plantain, pepper sauce, groundnuts",
                        price: 1500
                    }
                ]
            },
            {
                name: "Main Courses",
                items: [
                    {
                        name: "Jollof Rice with Grilled Chicken",
                        description: "Our signature jollof rice with perfectly grilled chicken",
                        ingredients: "Rice, tomatoes, chicken, onions, bell peppers, spices",
                        price: 4500
                    },
                    {
                        name: "Pounded Yam & Egusi",
                        description: "Traditional pounded yam with rich egusi soup",
                        ingredients: "Yam, melon seeds, spinach, assorted meat, stockfish",
                        price: 5200
                    },
                    {
                        name: "Grilled Fish with Coconut Rice",
                        description: "Fresh grilled tilapia with aromatic coconut rice",
                        ingredients: "Tilapia, coconut milk, rice, vegetables, herbs",
                        price: 6800
                    },
                    {
                        name: "Beef Pepper Soup",
                        description: "Spicy beef soup with traditional herbs",
                        ingredients: "Beef, pepper soup spice, scent leaves, onions",
                        price: 3800
                    }
                ]
            },
            {
                name: "Desserts",
                items: [
                    {
                        name: "Chin Chin Ice Cream",
                        description: "Vanilla ice cream topped with crunchy chin chin",
                        ingredients: "Ice cream, chin chin, chocolate sauce",
                        price: 2200
                    },
                    {
                        name: "Puff Puff with Honey",
                        description: "Traditional puff puff served with local honey",
                        ingredients: "Flour, honey, nutmeg, oil",
                        price: 1800
                    }
                ]
            },
            {
                name: "Beverages",
                items: [
                    {
                        name: "Fresh Palm Wine",
                        description: "Naturally fermented palm wine",
                        price: 1200
                    },
                    {
                        name: "Zobo Drink",
                        description: "Refreshing hibiscus drink with fruits",
                        ingredients: "Hibiscus leaves, pineapple, cucumber, ginger",
                        price: 800
                    },
                    {
                        name: "Chapman",
                        description: "Nigerian cocktail with fruits and grenadine",
                        ingredients: "Fanta, Sprite, grenadine, fruits, bitters",
                        price: 1500
                    },
                    {
                        name: "House Wine (Red/White)",
                        description: "Selection of local and imported wines",
                        price: 4500
                    }
                ]
            }
        ],
        // Updated policies for dining
        policies: {
            cancellation: "Cancel your reservation at least 2 hours before your booking time for a full refund.",
            completion: "A confirmation email will be sent to your registered email upon successful reservation."
        }
    };

    // TODO: Implement reservation logic - go to a booking page or open a modal
    const handleReserve = (id) => {
        router.push(`/dining-reservations/reserve/${id}`);
    };

    return (
        <ServiceDetails
            service={diningServiceDetail}
            onReserve={() => handleReserve(diningServiceDetail.id)}
            platformName="Synkafrica"
            platformTheme={{
                primary: "bg-primary-500",
                primaryHover: "bg-primary-600",
            }}
        />
    );
}
import React from "react";
import Buttons from "@/components/ui/Buttons";
import {
	ArrowRight,
	MapPin,
	Users,
	Fuel,
	Settings,
	Star,
	Clock,
	Filter,

	X,
} from "lucide-react";
import Link from "next/link";

const cars = [
	{
		label: "Great Deal",
		labelColor: "bg-purple-700",
		title: "Luxury Package",
		desc: "Toyota Land Cruiser V8",
		img: "/images/car1.png", // Replace with your actual image path
		features: [
			{ icon: <Users className="w-4 h-4 text-gray-400" />, text: "Chauffeur" },
			{ icon: <Clock className="w-4 h-4 text-gray-400" />, text: "A/C" },
			{ icon: <Fuel className="w-4 h-4 text-gray-400" />, text: "Unlimited mileage" },
		],
		price: "₦45,000",
		per: "/d",
	},
	{
		label: "Great Deal",
		labelColor: "bg-purple-700",
		title: "Star Package",
		desc: "Lexus GX 460",
		img: "/images/car2.png",
		features: [
			{ icon: <Users className="w-4 h-4 text-gray-400" />, text: "Chauffeur" },
			{ icon: <Clock className="w-4 h-4 text-gray-400" />, text: "A/C" },
			{ icon: <Fuel className="w-4 h-4 text-gray-400" />, text: "Unlimited mileage" },
		],
		price: "₦16,000",
		per: "/d",
	},
	{
		label: "Great Deal",
		labelColor: "bg-purple-700",
		title: "Luxury Package",
		desc: "Cardillac Escalade ESV",
		img: "/images/car3.png",
		features: [
			{ icon: <Users className="w-4 h-4 text-gray-400" />, text: "Chauffeur" },
			{ icon: <Clock className="w-4 h-4 text-gray-400" />, text: "A/C" },
			{ icon: <Fuel className="w-4 h-4 text-gray-400" />, text: "Unlimited mileage" },
		],
		price: "₦35,000",
		per: "/d",
	},
	{
		label: "Great Deal",
		labelColor: "bg-purple-700",
		title: "Sun Package",
		desc: "Mercedes-Benz GLE Coupe 4MATIC",
		img: "/images/car4.png",
		features: [
			{ icon: <Users className="w-4 h-4 text-gray-400" />, text: "Chauffeur" },
			{ icon: <Clock className="w-4 h-4 text-gray-400" />, text: "A/C" },
			{ icon: <Fuel className="w-4 h-4 text-gray-400" />, text: "Unlimited mileage" },
		],
		price: "₦45,000",
		per: "/d",
	},
];

export default function ExploreCarsSection() {
	return (
		<section className="max-w-7xl mx-auto px-4 py-8">
			<div className="flex justify-between items-center mb-1">
				<div>
					<h2 className="text-2xl font-semibold">Explore cars</h2>
					<p className="text-gray-500 text-sm">
						Explore our car services, fast and tailored to get you where you need
						to be Hassle free.
					</p>
				</div>
				<Link href={"/car-rental"}>
					<Buttons
						variant="outline"
						size="sm"
						className="border border-primary-500 text-primary-500 px-4 py-2 rounded-md font-medium text-sm hover:bg-primary-50 transition"

					>
						See all cars
					</Buttons>
				</Link>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-4">
				{cars.map((car, idx) => (
					<div
						key={car.title + idx}
						className="bg-white rounded-xl shadow border border-gray-100 flex flex-col overflow-hidden"
					>
						<div className="p-4 pb-0">
							<img
								src={car.img}
								alt={car.title}
								className="h-28 w-full object-contain mb-2"
							/>
						</div>
						<div className="px-4 flex flex-col flex-1">
							<span
								className={`inline-block px-3 py-1 rounded-full w-[90px] text-xs font-semibold text-white mb-2 ${car.labelColor}`}
							>
								{car.label}
							</span>
							<div className="font-semibold text-base mb-1">{car.title}</div>
							<div className="text-gray-500 text-xs mb-2">{car.desc}</div>
							<div className="flex items-center gap-1 text-xs text-gray-700 mb-2">
								{car.features.map((f, i) => (
									<span key={i} className="flex items-center gap-1">
										<span>{f.icon}</span>
										<span>{f.text}</span>
									</span>
								))}
							</div>
							<div className="flex items-center justify-between mt-auto mb-4">
								<div className="flex items-end gap-1">
									<span className="font-bold text-lg">{car.price}</span>
									<span className="text-xs text-gray-500">{car.per}</span>
								</div>
							</div>
							<Link
								href="/car-rental"
								className="w-full mb-4"
							>
								<Buttons
									variant="filled"
									icon={<ArrowRight />}
									size="md"
									className="w-full"
								>
									Reserve
								</Buttons>
							</Link>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
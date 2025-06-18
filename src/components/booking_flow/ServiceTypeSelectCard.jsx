import { 
  MdCameraAlt, MdOutlineRestaurantMenu, MdFastfood, MdSpa, MdOutlineRoomService, MdOutlineNailCare,
  MdOutlinePerson, MdOutlineWatchLater, MdFace, MdContentCut, MdOutlineLocalDining
} from "react-icons/md";
import { FaUserTie } from "react-icons/fa";
import { GiChefToque } from "react-icons/gi";
import { BiSolidDrink } from "react-icons/bi";
import { TbMassage } from "react-icons/tb";
import { PiCookingPotBold } from "react-icons/pi";

const SERVICES = [
  { label: "Photography", value: "photography", icon: <MdCameraAlt className="text-xl" /> },
  { label: "Chefs", value: "chefs", icon: <GiChefToque className="text-xl" /> },
  { label: "Prepared meals", value: "meals", icon: <MdFastfood className="text-xl" /> },
  { label: "Massage", value: "massage", icon: <TbMassage className="text-xl" /> },
  { label: "Training", value: "training", icon: <MdOutlineWatchLater className="text-xl" /> },
  { label: "Makeup", value: "makeup", icon: <MdFace className="text-xl" /> },
  { label: "Hair", value: "hair", icon: <MdContentCut className="text-xl" /> },
  { label: "Spa treatments", value: "spa", icon: <MdSpa className="text-xl" /> },
  { label: "Catering", value: "catering", icon: <PiCookingPotBold className="text-xl" /> },
  { label: "Nails", value: "nails", icon: <MdOutlineNailCare className="text-xl" /> },
];

export default function ServiceTypeSelectCard({ value, onChange }) {
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow flex flex-wrap gap-3 justify-center items-center">
      {SERVICES.map((s) => (
        <button
          key={s.value}
          type="button"
          className={`
            flex items-center gap-2 px-5 py-2 rounded-full border
            text-base font-medium transition
            ${value === s.value
              ? "border-black bg-white shadow-[0_0_0_2px_rgba(0,0,0,0.08)]"
              : "border-gray-200 bg-white hover:border-black"}
            focus:outline-none
          `}
          style={{ minWidth: 140 }}
          onClick={() => onChange(s.value)}
        >
          {s.icon}
          {s.label}
        </button>
      ))}
    </div>
  );
}
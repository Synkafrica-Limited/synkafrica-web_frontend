"use client";
import { useState } from "react";
import ProfileCard from "@/components/dashboard/customer/profile/ProfileCard";
import ProfileProgress from "@/components/dashboard/customer/profile/ProfileProgress";
import ProfileDetails from "@/components/dashboard/customer/profile/ProfileDetails";
import {EditProfileModal} from "@/components/dashboard/customer/profile/EditProfileModal";
import { useToast } from '@/components/ui/ToastProvider';

// --- Main Profile Page ---
const initialUser = {
  initials: "TM",
  name: "Temi Femi",
  email: "emmanuelmobalaji01@gmail.com",
  title: "",
  travelerType: "",
  firstName: "Temi",
  lastName: "Femi",
  middleName: "",
  gender: "",
  dob: "",
  phone: "",
  nationality: "",
  national_identity: "",
  expiry: "",
};

export default function ProfilePage() {
  const [user, setUser] = useState(initialUser);
  const [showEdit, setShowEdit] = useState(false);
  const toast = useToast();

  // Calculate profile completion (simple logic, adjust as needed)
  const requiredFields = [
    "title", "travelerType", "firstName", "lastName", "gender", "dob", "email", "phone", "nationality", "national_identity", "expiry"
  ];
  const completed = requiredFields.filter((f) => user[f] && user[f].toString().trim() !== "").length;
  const progress = Math.round((completed / requiredFields.length) * 100);

  // For ProfileCard initials and name
  const cardUser = {
    initials: (user.firstName?.[0] || "") + (user.lastName?.[0] || ""),
    name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
    email: user.email,
    profileImage: user.profileImage, // ensure profile image is passed
  };

  // Example handlers for the other buttons
  const handleSaveBookingInfo = () => {
    // Navigate to or open booking info section/modal
    toast?.info?.("Navigate to Save Booking Information page or modal.");
  };
  const handleCompleteBooking = () => {
    // Navigate to or open booking completion section/modal
    toast?.info?.("Navigate to Complete a Booking page or modal.");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F6]">
      {/* Navbar */}
      {/* <Navbar1 /> */}
      {/* Dashboard Main Content */}
      <div className="flex-1 flex flex-col w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Content */}
        <section className="flex-1 flex flex-col gap-6 py-6 px-2 sm:px-4 md:px-8 lg:px-16">
          <div className="flex flex-col md:flex-row gap-6 w-full">
            {/* Stack ProfileCard and ProfileProgress vertically on mobile, side by side on md+ */}
            <div className="flex flex-col gap-4 w-full md:w-auto md:max-w-xs">
              <ProfileCard user={cardUser} />
            </div>
            <div className="flex-1">
              <ProfileProgress
                progress={progress}
                onEdit={() => setShowEdit(true)}
                onSaveBookingInfo={handleSaveBookingInfo}
                onCompleteBooking={handleCompleteBooking}
              />
            </div>
          </div>
          <div className="w-full">
            <ProfileDetails user={user} onEdit={() => setShowEdit(true)} />
          </div>
        </section>
      </div>
      {/* Edit Profile Modal */}
      {showEdit && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEdit(false)}
          onSave={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
        />
      )}
      {/* Footer */}
      {/* <Footer /> */}
      <style jsx global>{`
        @media (max-width: 768px) {
          section {
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}

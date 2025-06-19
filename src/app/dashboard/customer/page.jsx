"use client";
import ProfileCard from "@/components/dashboard/ProfileCard";
import ProfileProgress from "@/components/dashboard/ProfileProgress";
import ProfileDetails from "@/components/dashboard/ProfileDetails";

const user = {
  initials: "TM",
  name: "Temi Femi",
  email: "emmanuelmobalaji01@gmail.com",
  // …etc
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F6]">
      {/* Navbar */}
      {/* <Navbar1 /> */}
      
      {/* Dashboard Main Content */}
      <div className="flex-1 flex flex-col md:flex-row w-full h-full">

        {/* Dashboard Content */}
        <section className="flex-1 flex flex-col gap-6 py-8 px-2 sm:px-6 md:px-10 lg:px-16">
          <div className="flex flex-col md:flex-row gap-6 w-full">
            <ProfileCard user={user} />
            <ProfileProgress />
          </div>
          <ProfileDetails user={user} onEdit={() => {}} />
        </section>
      </div>

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
}

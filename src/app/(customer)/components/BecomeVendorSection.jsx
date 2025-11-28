import React from "react";

export default function VendorBanner() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12">
      <div className="relative rounded-3xl overflow-hidden shadow-lg">
        {/* Gradient Background with Shapes */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#DF5D3D]/20 via-[#FFC0B1]/20 to-[#FFE6D4]/20">
          {/* Decorative Circles */}
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#DF5D3D]/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-[#FF9F7F]/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#FFC0B1]/20 rounded-full blur-2xl"></div>
        </div>

        {/* Content */}
        <div className="relative px-6 md:px-12 py-16 md:py-20 flex justify-start">
          <div className="bg-[#DF5D3D] rounded-2xl p-8 md:p-10 shadow-xl max-w-lg w-full">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Become a Vendor
            </h2>
            <p className="text-white text-lg mb-8 opacity-95 leading-relaxed">
              Create & list your business, and earn extra with Synkkafrica.
            </p>
            <button className="w-full md:w-auto border-2 border-white text-white hover:bg-white hover:text-[#DF5D3D] py-3.5 px-8 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2">
              List your business
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

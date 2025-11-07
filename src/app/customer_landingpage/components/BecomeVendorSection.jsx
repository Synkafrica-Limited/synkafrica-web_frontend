export default function VendorBanner() {
  return (
    <div className="w-full px-4 py-12">
      <div className="relative rounded-3xl overflow-hidden shadow-lg">
        {/* Gradient Background with Shapes */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-100 via-blue-100 to-orange-100">
          {/* Decorative Circles */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full opacity-60 blur-3xl"></div>
          <div className="absolute bottom-0 right-1/3 w-[32rem] h-[32rem] bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-50 blur-3xl"></div>
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full opacity-40 blur-2xl"></div>
          
          {/* Small accent circles */}
          <div className="absolute top-8 right-1/3 w-6 h-6 bg-blue-400 rounded-full opacity-60"></div>
          <div className="absolute bottom-1/3 right-1/4 w-8 h-8 bg-teal-400 rounded-full opacity-50"></div>
        </div>

        {/* Content */}
        <div className="relative px-8 md:px-12 py-16 md:py-20">
          <div className="max-w-xl">
            <div className="bg-orange-500 rounded-2xl p-8 md:p-10 shadow-xl">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Become a vendor
              </h2>
              <p className="text-white text-lg mb-8 opacity-95">
                Create & list your business, and earn with Synkkafrica.
              </p>
              <button className="w-full md:w-auto border-2 border-white text-white hover:bg-white hover:text-orange-500 py-3.5 px-8 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2">
                List your business
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
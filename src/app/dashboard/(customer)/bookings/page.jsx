// src/app/dashboard/bookings/page.jsx
"use client"

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontal } from 'lucide-react';

const BookingsPage = () => {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Sample booking data - in real app this would come from API/state management
  const [bookings, setBookings] = useState([
    {
      id: 1,
      service: 'Car rental',
      type: 'Mercedes-Benz',
      startDate: 'Aug 11',
      endDate: 'Aug 14',
      amount: '$125',
      serviceType: 'transportation'
    },
    // Uncomment to test with more bookings
    // {
    //   id: 2,
    //   service: 'Restaurant',
    //   type: 'Fine Dining',
    //   startDate: 'Aug 15',
    //   endDate: 'Aug 15',
    //   amount: '$85',
    //   serviceType: 'restaurant'
    // }
  ]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(null);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showDropdown]);

  const handleBookingClick = (booking) => {
    // Don't navigate if dropdown is open
    if (showDropdown) return;
    
    // Navigate to details page based on service type
    const detailsPath = `/bookings/${booking.serviceType}/${booking.id}`;
    router.push(detailsPath);
  };

  const handleDropdownClick = (e, bookingId) => {
    e.stopPropagation();
    e.preventDefault();
    setShowDropdown(showDropdown === bookingId ? null : bookingId);
  };

  const handleBookAgain = (e, booking) => {
    e.stopPropagation();
    e.preventDefault();
    // Logic to rebook the same service
    console.log('Book again:', booking);
    setShowDropdown(null);
  };

  const handleGiveReview = (e, booking) => {
    e.stopPropagation();
    e.preventDefault();
    // Logic to give review
    console.log('Give review:', booking);
    setShowDropdown(null);
    router.push(`/review`);
  };

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="text-sm text-gray-500">
          <span>Profile</span>
          <span className="mx-2">›</span>
          <span className="text-gray-400">Bookings</span>
        </nav>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
        Your bookings
      </h1>

      {/* Completed Bookings Section */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-visible">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Completed bookings
          </h2>
        </div>

        {bookings.length === 0 ? (
          /* Empty State */
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">
              You have not completed any booking yet.
            </p>
          </div>
        ) : (
          /* Bookings Content */
          <div className="relative overflow-visible">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto overflow-y-visible">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleBookingClick(booking)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.service}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.startDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.endDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div 
                          ref={showDropdown === booking.id ? dropdownRef : null}
                          className="relative"
                        >
                          <button
                            onClick={(e) => handleDropdownClick(e, booking.id)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="More actions"
                          >
                            <MoreHorizontal className="w-4 h-4 text-gray-600" />
                          </button>
                          
                          {/* Dropdown Menu */}
                          {showDropdown === booking.id && (
                            <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-md shadow-xl border border-gray-200 z-[9999]">
                              <div className="py-1">
                                <button
                                  onClick={(e) => handleBookAgain(e, booking)}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                  Book again
                                </button>
                                <button
                                  onClick={(e) => handleGiveReview(e, booking)}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                  Give a review
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors last:border-b-0 relative"
                  onClick={() => handleBookingClick(booking)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-gray-900 truncate">
                          {booking.service}
                        </h3>
                        <div 
                          ref={showDropdown === booking.id ? dropdownRef : null}
                          className="relative ml-2 flex-shrink-0"
                          style={{ zIndex: showDropdown === booking.id ? 101 : 'auto' }}
                        >
                          <button
                            onClick={(e) => handleDropdownClick(e, booking.id)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
                            aria-label="More actions"
                            style={{ 
                              WebkitTapHighlightColor: 'transparent',
                              minHeight: '44px',
                              minWidth: '44px'
                            }}
                          >
                            <MoreHorizontal className="w-4 h-4 text-gray-600" />
                          </button>
                          
                          {/* Mobile Dropdown Menu */}
                          {showDropdown === booking.id && (
                            <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-md shadow-xl border border-gray-200 z-[9999]">
                              <div className="py-1">
                                <button
                                  onClick={(e) => handleBookAgain(e, booking)}
                                  className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors touch-manipulation"
                                  style={{ 
                                    WebkitTapHighlightColor: 'transparent',
                                    minHeight: '44px'
                                  }}
                                >
                                  Book again
                                </button>
                                <button
                                  onClick={(e) => handleGiveReview(e, booking)}
                                  className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors touch-manipulation"
                                  style={{ 
                                    WebkitTapHighlightColor: 'transparent',
                                    minHeight: '44px'
                                  }}
                                >
                                  Give a review
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {booking.type}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Start: </span>
                          <span className="text-gray-900">{booking.startDate}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">End: </span>
                          <span className="text-gray-900">{booking.endDate}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <span className="font-semibold text-gray-900">
                          {booking.amount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
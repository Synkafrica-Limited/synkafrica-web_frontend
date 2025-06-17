'use client'

import { useState, useRef } from 'react'
import {
  IoLocationSharp,
  IoLocationOutline,
  IoCalendarOutline,
  IoPersonCircle,
  IoChevronDown
} from 'react-icons/io5'
import Button from '@/components/ui/Buttons'
import Heading from '@/components/ui/Heading'
import PopularDestinationsCard from './PopularDestinationsCard'
import CalendarCard from './CalendarCard'
import TimeSelectCard from './TimeSelectCard'

const SERVICES = [
  'Cars',
  'Flight',
  'Beach',
  'Dining',
  'Convenience Services'
]

const CAR_TABS = ['Rental Cars', 'Airport Transportation']

const popularDestinations = [
  { city: "Lagos", airport: "Murtala Muhammed Intl. Nigeria" },
  { city: "Abuja", airport: "Nnamdi Azikiwe Intl." },
]

export default function BookingFlow() {
  const [activeService, setActiveService] = useState('Cars')
  const [activeCarTab, setActiveCarTab] = useState('Rental Cars')
  const [pickup, setPickup] = useState('');
  const [pickupSub, setPickupSub] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [dropoffSub, setDropoffSub] = useState('');
  const [date, setDate] = useState('')
  const [time, setTime] = useState('10:00')
  const [pickupFocused, setPickupFocused] = useState(false)
  const [dropoffFocused, setDropoffFocused] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [timeSelectOpen, setTimeSelectOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ start: null, end: null })
  const [pickupTime, setPickupTime] = useState('');
  const [dropoffTime, setDropoffTime] = useState('');
  const pickupRef = useRef(null)

  // Helper to format date
  const formatDate = (date) =>
    date ? new Date(date).toLocaleString('en-US', { month: 'short', day: 'numeric' }) : '--'

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Service Tabs */}
      <div className="flex space-x-6 pb-2 justify-center">
        {SERVICES.map((svc) => (
          <Button
            variant={activeService === svc ? "filled" : "none"}
            key={svc}
            onClick={() => setActiveService(svc)}
            size="md"
            className="px-4 py-1 text-sm font-medium transition"
          >
            {svc}
          </Button>
        ))}
      </div>

      {/* Cars Sub-Tabs */}
      {activeService === 'Cars' && (
        <div className="mt-2 flex space-x-4 text-sm">
          {CAR_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveCarTab(tab)}
              className={`transition
                ${activeCarTab === tab
                  ? 'text-primary-500 font-semibold underline underline-offset-4'
                  : 'text-gray-400 hover:text-primary-500'}
              `}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* Booking Form */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-5 gap-3">
        {/* Pick-up */}
        <div className="relative">
          <label className="sr-only">Pick-up</label>
          <div
            className={`flex items-center border rounded-md px-3 py-2 h-[55px] bg-white cursor-pointer transition
              ${pickupFocused ? "border-blue-500 shadow-[0_0_0_2px_rgba(37,99,235,0.2)]" : "border-gray-300"}
            `}
            onClick={() => {
              setPickupFocused(true);
              setDropoffFocused(false);
            }}
            tabIndex={0}
          >
            <IoLocationOutline className="text-gray-400 mr-2" />
            <div className="flex flex-col w-full overflow-hidden">
              <span className="text-xs text-gray-500">Pick up</span>
              <span className="text-sm text-gray-900 truncate">
                {pickup || <span className="text-gray-400">Select location</span>}
              </span>
              {pickupSub && (
                <span className="text-xs text-gray-400 truncate">{pickupSub}</span>
              )}
            </div>
          </div>
          {pickupFocused && (
            <PopularDestinationsCard
              destinations={popularDestinations}
              onSelect={(dest) => {
                setPickup(dest.city);
                setPickupSub(dest.airport);
                setPickupFocused(false);
              }}
            />
          )}
        </div>

        {/* Drop-off */}
        <div className="relative">
          <label className="sr-only">Drop-off</label>
          <div
            className={`flex items-center border rounded-md px-3 py-2 h-[55px] bg-white cursor-pointer transition
              ${dropoffFocused ? "border-blue-500 shadow-[0_0_0_2px_rgba(37,99,235,0.2)]" : "border-gray-300"}
            `}
            onClick={() => {
              setDropoffFocused(true);
              setPickupFocused(false);
            }}
            tabIndex={0}
          >
            <IoLocationSharp className="text-gray-400 mr-2" />
            <div className="flex flex-col w-full overflow-hidden">
              <span className="text-xs text-gray-500">Drop-off</span>
              <span className="text-sm text-gray-900 truncate">
                {dropoff || <span className="text-gray-400">Select location</span>}
              </span>
              {dropoffSub && (
                <span className="text-xs text-gray-400 truncate">{dropoffSub}</span>
              )}
            </div>
          </div>
          {dropoffFocused && (
            <PopularDestinationsCard
              title="Going to?"
              destinations={popularDestinations}
              onSelect={(dest) => {
                setDropoff(dest.city);
                setDropoffSub(dest.airport);
                setDropoffFocused(false);
              }}
            />
          )}
        </div>

        {/* Date */}
        <div className="relative">
          <label className="sr-only">Date</label>
          <button
            type="button"
            className="w-full h-md flex items-start flex-col justify-center border border-gray-300 rounded-md px-3 py-2 bg-white text-left focus:outline-none"
            onClick={() => setCalendarOpen(true)}
          >
            <div className="flex items-center">
              <IoCalendarOutline className="text-gray-700 mr-2 text-xl" />
              <div>
                <div className="text-xs text-gray-700">Date</div>
                <div className="text-sm font-medium text-gray-900">
                  {dateRange.start ? formatDate(dateRange.start) : 'Select'}
                  {dateRange.end ? ` - ${formatDate(dateRange.end)}` : ''}
                </div>
              </div>
            </div>
          </button>
          {calendarOpen && (
            <CalendarCard
              start={dateRange.start}
              end={dateRange.end}
              onChange={setDateRange}
              onClose={() => setCalendarOpen(false)}
            />
          )}
        </div>

        {/* Time */}
        <div className="relative">
          <label className="sr-only">Time</label>
          <div
            className="flex items-center border border-gray-300 rounded-md px-3 py-2 h-lg bg-white cursor-pointer"
            tabIndex={0}
            onClick={() => setTimeSelectOpen(true)}
          >
            <IoPersonCircle className="text-gray-400 mr-2 text-2xl" />
            <div className="flex-1">
              <div className="text-xs text-gray-500 leading-tight">Pick-up/Drop off</div>
              <div className="text-sm font-medium text-gray-900">
                {pickupTime ? pickupTime : "--:--"}/{dropoffTime ? dropoffTime : "--:--"}
              </div>
            </div>
            <IoChevronDown className="text-gray-400 ml-2" />
          </div>
          {timeSelectOpen && (
            <TimeSelectCard
              pickupTime={pickupTime}
              dropoffTime={dropoffTime}
              onPickupSelect={setPickupTime}
              onDropoffSelect={setDropoffTime}
              onDone={() => setTimeSelectOpen(false)}
              onClose={() => setTimeSelectOpen(false)}
            />
          )}
        </div>

        {/* Search Button */}
        <div>
          <Button
            variant="filled"
            size="md"
            className="w-full h-[55px] flex items-center justify-center bg-primary-500 text-white rounded-md hover:bg-primary-600 transition"
            onClick={() => console.log({ pickup, dropoff, date, time })}
          >
            Search <span className="ml-2">→</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

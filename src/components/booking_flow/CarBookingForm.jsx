// src/components/booking_flow/CarBookingForm.jsx
'use client'

import { useState, useRef } from 'react'
import {
  IoLocationOutline,
  IoLocationSharp,
  IoCalendarOutline,
  IoPersonCircle,
  IoChevronDown
} from 'react-icons/io5'
import Buttons from '@/components/ui/Buttons'
import PopularDestinationsCard from './PopularDestinationsCard'
import CalendarCard from './CalendarCard'
import TimeSelectCard from './TimeSelectCard'

// helper
export const formatDate = d =>
  d ? new Date(d).toLocaleString('en-US',{month:'short',day:'numeric'}) : '--'

export default function CarBookingForm({
  popularDestinations = [],
  onSearch = () => {}
}) {
  // all the local state
  const [pickup, setPickup]           = useState('')
  const [pickupSub, setPickupSub]     = useState('')
  const [dropoff, setDropoff]         = useState('')
  const [dropoffSub, setDropoffSub]   = useState('')
  const [dateRange, setDateRange]     = useState({ start:null,end:null })
  const [pickupTime, setPickupTime]   = useState('')
  const [dropoffTime, setDropoffTime] = useState('')
  const [pickupFocused, setPickupFocused]   = useState(false)
  const [dropoffFocused, setDropoffFocused] = useState(false)
  const [calendarOpen, setCalendarOpen]     = useState(false)
  const [timeSelectOpen, setTimeSelectOpen] = useState(false)

  const pickupRef = useRef(null)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
      {/* Pick-up */}
      <div className="relative">
        <label className="sr-only">Pick-up</label>
        <div
          ref={pickupRef}
          tabIndex={0}
          className={`flex items-center border rounded-md px-3 py-2 h-[55px] bg-white cursor-pointer transition
            ${pickupFocused
              ? 'border-blue-500 shadow-[0_0_0_2px_rgba(37,99,235,0.2)]'
              : 'border-gray-300'
            }`}
          onClick={()=>{
            setPickupFocused(true)
            setDropoffFocused(false)
          }}
        >
          <IoLocationOutline className="text-gray-400 mr-2" />
          <div className="flex flex-col w-full overflow-hidden">
            <span className="text-xs text-gray-500">Pick up</span>
            <span className="text-sm text-gray-900 truncate">
              {pickup || <span className="text-gray-400">Select location</span>}
            </span>
            {pickupSub && (
              <span className="text-xs text-gray-400 truncate">
                {pickupSub}
              </span>
            )}
          </div>
        </div>
        {pickupFocused && (
          <PopularDestinationsCard
            destinations={popularDestinations}
            onSelect={dest=>{
              setPickup(dest.city)
              setPickupSub(dest.airport)
              setPickupFocused(false)
            }}
          />
        )}
      </div>

      {/* Drop-off */}
      <div className="relative">
        <label className="sr-only">Drop-off</label>
        <div
          tabIndex={0}
          className={`flex items-center border rounded-md px-3 py-2 h-[55px] bg-white cursor-pointer transition
            ${dropoffFocused
              ? 'border-blue-500 shadow-[0_0_0_2px_rgba(37,99,235,0.2)]'
              : 'border-gray-300'
            }`}
          onClick={()=>{
            setDropoffFocused(true)
            setPickupFocused(false)
          }}
        >
          <IoLocationSharp className="text-gray-400 mr-2" />
          <div className="flex flex-col w-full overflow-hidden">
            <span className="text-xs text-gray-500">Drop-off</span>
            <span className="text-sm text-gray-900 truncate">
              {dropoff || <span className="text-gray-400">Select location</span>}
            </span>
            {dropoffSub && (
              <span className="text-xs text-gray-400 truncate">
                {dropoffSub}
              </span>
            )}
          </div>
        </div>
        {dropoffFocused && (
          <PopularDestinationsCard
            title="Going to?"
            destinations={popularDestinations}
            onSelect={dest=>{
              setDropoff(dest.city)
              setDropoffSub(dest.airport)
              setDropoffFocused(false)
            }}
          />
        )}
      </div>

      {/* Date */}
      <div className="relative">
        <label className="sr-only">Date</label>
        <button
          type="button"
          className="w-full flex flex-col items-start justify-center border border-gray-300 rounded-md px-3 py-2 bg-white text-left h-[55px]"
          onClick={()=>setCalendarOpen(true)}
        >
          <div className="flex items-center">
            <IoCalendarOutline className="text-gray-700 mr-2 text-xl" />
            <div>
              <div className="text-xs text-gray-700">Date</div>
              <div className="text-sm font-medium text-gray-900">
                {dateRange.start ? formatDate(dateRange.start) : 'Select'}
                {dateRange.end   ? ` - ${formatDate(dateRange.end)}` : ''}
              </div>
            </div>
          </div>
        </button>
        {calendarOpen && (
          <CalendarCard
            start={dateRange.start}
            end={dateRange.end}
            onChange={setDateRange}
            onClose={()=>setCalendarOpen(false)}
          />
        )}
      </div>

      {/* Time */}
      <div className="relative">
        <label className="sr-only">Time</label>
        <div
          tabIndex={0}
          className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white h-[55px] cursor-pointer"
          onClick={()=>setTimeSelectOpen(true)}
        >
          <IoPersonCircle className="text-gray-400 mr-2 text-2xl" />
          <div className="flex-1">
            <div className="text-xs text-gray-500">Pick-up / Drop-off</div>
            <div className="text-sm font-medium text-gray-900">
              {pickupTime||'--:--'} / {dropoffTime||'--:--'}
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
            onDone={()=>setTimeSelectOpen(false)}
            onClose={()=>setTimeSelectOpen(false)}
          />
        )}
      </div>

      {/* Search */}
      <div>
        <Buttons
          variant="filled"
          size="md"
          className="w-full h-[55px] flex items-center justify-center"
          onClick={()=>
            onSearch({
              pickup,pickupSub,
              dropoff,dropoffSub,
              dateRange,
              pickupTime,dropoffTime
            })
          }
        >
          Search <span className="ml-2">→</span>
        </Buttons>
      </div>
    </div>
  )
}

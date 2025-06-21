'use client'
import { useState, useRef } from 'react'
import { IoLocationOutline, IoCalendarOutline, IoPersonCircle, IoChevronDown } from 'react-icons/io5';
import Button from '@/components/ui/Buttons';
import CalendarCard from './CalendarCard';
import TimeSelectCard from './TimeSelectCard';
import PopularDestinationsCard from './PopularDestinationsCard';
import Input from '../ui/input';

// helper
export const formatDate = d =>
  d ? new Date(d).toLocaleString('en-US',{month:'short',day:'numeric'}) : '--'

export default function DiningBookingForm({
  popularDestinations = [],
  onSearch = () => {}
}) {
  // all the local state
  const [pickup, setPickup] = useState('')
  const [pickupSub, setPickupSub] = useState('')
  const [dateRange, setDateRange] = useState({ start:null,end:null })
  const [pickupTime, setPickupTime] = useState('')
  const [dropoffTime, setDropoffTime] = useState('')
  const [pickupFocused, setPickupFocused] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [timeSelectOpen, setTimeSelectOpen] = useState(false)
  const [guests, setGuests] = useState(1)

  const pickupRef = useRef(null);
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 w-full">
      {/* Restaurant input */}
      <div className="relative">
        <label className="sr-only">Restaurants</label>
        <div
          ref={pickupRef}
          tabIndex={0}
          className={`flex items-center border rounded-md px-3 py-2 h-[55px] bg-white cursor-pointer transition
            ${pickupFocused
              ? 'border-blue-500 shadow-[0_0_0_2px_rgba(37,99,235,0.2)]'
              : 'border-gray-300'
            }`}
          onClick={()=>{ setPickupFocused(true) }}
        >
          <IoLocationOutline className="text-gray-400 mr-2" />
          <div className="flex flex-col w-full overflow-hidden">
            <span className="text-xs text-gray-500">Going to?</span>
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
      <div className="relative w-full flex-1">
        <div
          tabIndex={0}
          className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white h-[55px] w-full cursor-pointer min-w-0"
          onClick={()=>setTimeSelectOpen(true)}
        >
          <IoPersonCircle className="text-gray-400 mr-2 text-2xl" />
          <div className="flex-1">
            <div className="text-[8px] text-gray-500">Reservations</div>
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
            onDone={() => setTimeSelectOpen(false)}
            onClose={() => setTimeSelectOpen(false)}
            times={[
              "12:00pm", "12:30pm", "1:00pm", "1:30pm", "2:00pm", "2:30pm", "3:00pm", "3:30pm", "4:00pm"
            ]}
            labels={{ pickup: "Entry", dropoff: "Exit" }}
          />
        )}
      </div>

      {/* Guests */}
      <div>
        <Input
          type="number"
          min={1}
          className="px-3 py-2 w-full h-[55px] rounded-md border border-gray-300"
          placeholder="Guests"
          value={guests}
          onChange={e => setGuests(+((e && e.target) ? e.target.value : e))}
        />
      </div>

      {/* Search */}
      <div>
        <Button
          variant="filled"
          size="md"
          className="w-full h-[55px] flex items-center justify-center"
          onClick={() => onSearch({ pickup, pickupSub, dateRange, pickupTime, guests })}
        >
          Search →
        </Button>
      </div>
    </div>
  );
}

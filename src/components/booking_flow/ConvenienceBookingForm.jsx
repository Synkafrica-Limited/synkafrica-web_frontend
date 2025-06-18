'use client'

import { useState, useRef } from 'react'
import { IoCalendarOutline, IoPersonCircle, IoChevronDown, IoChevronUp } from 'react-icons/io5'
import Button from '@/components/ui/Buttons'
import CalendarCard from './CalendarCard'
import TimeSelectCard from './TimeSelectCard'
import { formatDate } from './CarBookingForm'

const SERVICE_CATEGORIES = [
  { label: "Laundry service", value: "laundry", icon: <span className="text-2xl">🧺</span> },
  { label: "Errand", value: "errand", icon: <span className="text-2xl">🛒</span> },
  { label: "Grocery", value: "grocery", icon: <span className="text-2xl">🥦</span> },
  { label: "Parcel", value: "parcel", icon: <span className="text-2xl">📦</span> },
  // Add more main categories as needed
]

const POPULAR_SERVICES = {
  laundry: ["Washing & Ironing", "Iron", "Washing"],
  errand: ["Pick up", "Drop off"],
  grocery: ["Supermarket", "Market"],
  parcel: ["Send", "Receive"],
}

export default function ConvenienceBookingForm({ onSearch = () => {} }) {
  const [mainService, setMainService] = useState(SERVICE_CATEGORIES[0].value)
  const [mainServiceOpen, setMainServiceOpen] = useState(false)
  const [serviceTypeOpen, setServiceTypeOpen] = useState(false)
  const [selectedServiceType, setSelectedServiceType] = useState("")
  const [date, setDate] = useState(null)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [pickupTime, setPickupTime] = useState("10:00am")
  const [dropoffTime, setDropoffTime] = useState("11:00am")
  const [timeSelectOpen, setTimeSelectOpen] = useState(false)
  const [pickupFocused, setPickupFocused] = useState(false)
  const [dropoffFocused, setDropoffFocused] = useState(false)
  const [dateRange, setDateRange] = useState({ start: null, end: null })
  const [pickupSub, setPickupSub] = useState('')
  const [dropoffSub, setDropoffSub] = useState('')
  
  const pickupRef = useRef(null)

  const mainServiceObj = SERVICE_CATEGORIES.find(s => s.value === mainService)

  return (
    <form
      className="w-full"
      onSubmit={e => {
        e.preventDefault()
        onSearch({
          mainService,
          serviceType: selectedServiceType,
          date,
          pickupTime
        })
      }}
    >
      <div className="flex flex-col gap-3 w-full md:flex-row md:items-end">
        {/* Main Service Dropdown */}
        <div className="relative w-full md:max-w-xs flex-1">
          <button
            type="button"
            className={`flex items-center gap-2 border rounded-md px-4 py-3 h-[55px] w-full bg-white text-base font-medium transition
              ${mainServiceOpen ? "border-primary-500 shadow-[0_0_0_2px_rgba(37,99,235,0.2)]" : "border-gray-300"}
            `}
            tabIndex={0}
            style={{ minWidth: 180 }}
            onClick={() => setMainServiceOpen(v => !v)}
          >
            <span className="text-sm">{mainServiceObj.icon}</span>
            <span className="text-sm">{mainServiceObj.label}</span>
            {mainServiceOpen ? <IoChevronUp className="ml-auto" /> : <IoChevronDown className="ml-auto" />}
          </button>
          {mainServiceOpen && (
            <div className="absolute left-0 top-[60px] w-[260px] bg-white border border-gray-100 rounded-2xl shadow-lg z-20 p-2">
              {SERVICE_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  className={`flex items-center gap-2 w-full px-3 py-2 rounded-md text-base hover:bg-gray-50 ${
                    mainService === cat.value ? "bg-gray-100 font-semibold" : ""
                  }`}
                  onClick={() => {
                    setMainService(cat.value)
                    setMainServiceOpen(false)
                    setSelectedServiceType("") // reset service type on main change
                  }}
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span className="text-sm">{cat.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Service Type Dropdown */}
        <div className="relative w-full md:max-w-xs flex-1">
          <button
            type="button"
            className={`flex items-center gap-2 border rounded-md px-4 py-3 h-[55px] w-full bg-white text-md font-medium transition
              ${serviceTypeOpen ? "border-primary-500 shadow-[0_0_0_2px_rgba(37,99,235,0.2)]" : "border-gray-300"}
            `}
            onClick={() => setServiceTypeOpen(v => !v)}
            tabIndex={0}
            style={{ minWidth: 180 }}
          >
            <span className="text-md">👤</span>
            {selectedServiceType ? selectedServiceType : "Service type"}
            {serviceTypeOpen ? <IoChevronUp className="ml-auto" /> : <IoChevronDown className="ml-auto" />}
          </button>
          {serviceTypeOpen && (
            <div className="absolute left-0 top-[60px] w-[260px] bg-white border border-gray-100 rounded-2xl shadow-lg z-20 p-4">
              <div className="font-bold text-base mb-2">Popular services</div>
              <ul>
                {(POPULAR_SERVICES[mainService] || []).map((s, idx) => (
                  <li
                    key={s}
                    className="py-2 px-2 text-sm rounded cursor-pointer text-base text-gray-800 hover:bg-gray-50"
                    onClick={() => {
                      setSelectedServiceType(s)
                      setServiceTypeOpen(false)
                    }}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
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

        {/* Pick-up/Drop off Time */}
        <div className="relative w-full md:max-w-xs flex-1">
          <button
            type="button"
            className="flex items-center gap-2 border rounded-md px-4 py-3 h-[55px] w-full bg-white text-base font-medium border-gray-300"
            onClick={() => setTimeSelectOpen(true)}
            tabIndex={0}
            style={{ minWidth: 180 }}
          >
            <IoPersonCircle className="text-xl" />
            <span className='ml-2 text-xs text-gray-700'>Pick-up/Drop off</span>
            <span className="ml-1">{pickupTime}</span>
            <IoChevronDown className="ml-1 text-gray-400" />
          </button>
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

        {/* Search */}
        <div className="w-full md:max-w-[140px] flex-1">
          <Button
            variant="filled"
            size="md"
            className="w-full h-[55px] flex items-center justify-center bg-[#E26A3D] hover:bg-[#d45c2e] text-white"
            type="submit"
          >
            Search →
          </Button>
        </div>
      </div>
    </form>
  )
}
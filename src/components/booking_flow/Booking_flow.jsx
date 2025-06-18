// src/components/booking_flow/BookingFlow.jsx
'use client'

import { useState } from 'react'
import Button from '@/components/ui/Buttons'

import CarBookingForm         from './CarBookingForm'
import BeachBookingForm       from './BeachBookingForm'
import DiningBookingForm      from './DiningBookingForm'
import ConvenienceBookingForm from './ConvenienceBookingForm'
// import FlightBookingForm   from './FlightBookingForm'

const SERVICES = [
  'Cars',
  'Flight',
  'Beach',
  'Dining',
  'Convenience Services'
]

export default function BookingFlow() {
  const [activeService, setActiveService] = useState('Cars')

  function handleSearch(params) {
    console.log('🚀 search params:', params)
    // e.g. call your API or navigate
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Tabs */}
      <div className="flex justify-center space-x-4 mb-4">
        {SERVICES.map(svc => (
          <Button
            key={svc}
            variant={activeService === svc ? 'filled' : 'none'}
            size="sm"
            onClick={() => setActiveService(svc)}
          >
            {svc}
          </Button>
        ))}
      </div>

      {/* Form */}
      {activeService === 'Cars' && (
        <CarBookingForm
          popularDestinations={[
            { city: 'Lagos', location: 'Murtala Muhammed Intl.' },
            { city: 'Abuja', location: 'Nnamdi Azikiwe Intl.' },
          ]}
          onSearch={handleSearch}
        />
      )}

      {activeService === 'Beach' && (
        <BeachBookingForm
          popularDestinations={[
            { city: 'Lagos', location: 'Oniru private beach' },
            { city: 'Lagos', location: 'Elegushi beach' },
            { city: 'Lagos', location: 'Jadi Lake Resorts' },
            { city: 'Port Harcourt', location: 'Port City beach' },
            { city: 'Lagos', location: 'Lekki Leisure Lake' },
          ]}
          onSearch={handleSearch}
        />
      )}

      {activeService === 'Dining' && (
        <DiningBookingForm
          popularDestinations={[
            { city: 'Abuja', location: 'See Restaurant' },
            { city: 'Lagos', location: '234 Restaurant' },
            { city: 'Lagos Island', location: 'The enclave restaurant' },
            { city: 'Port Harcourt', location: 'Hungry belly' },
          ]}
        onSearch={handleSearch} />
      )}

      {activeService === 'Convenience Services' && (
        <ConvenienceBookingForm
          onSearch={handleSearch}
        />
      )}

      {/* {activeService === 'Flight' && <FlightBookingForm onSearch={handleSearch} />} */}
    </div>
  )
}

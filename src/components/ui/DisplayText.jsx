// src/components/ui/DisplayText.jsx
import React from 'react'

export default function DisplayText({ className = '', children, ...props }) {
  return (
    <p className={`font-bold text-display ${className}`} {...props}>
      {children}
    </p>
  )
}

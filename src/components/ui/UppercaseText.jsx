// src/components/ui/UppercaseText.jsx
import React from 'react'

export default function UppercaseText({ className = '', children, ...props }) {
  return (
    <span
      className={`text-body uppercase tracking-caps ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}

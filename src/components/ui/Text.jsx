// src/components/ui/Text.jsx
import React from 'react'

export default function Text({ className = '', children, ...props }) {
  return (
    <p className={`text-body ${className}`} {...props}>
      {children}
    </p>
  )
}

// src/components/ui/Caption.jsx
import React from 'react'

export default function Caption({ className = '', children, ...props }) {
  return (
    <span className={`text-caption text-gray-500 ${className}`} {...props}>
      {children}
    </span>
  )
}

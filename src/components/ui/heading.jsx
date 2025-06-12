// src/components/ui/Heading.jsx
import React from 'react'

/**
 * @param {1|2|3|4|5|6} level  Heading level (h1–h6)
 * @param {string} className  Additional classes
 */
export default function Heading({ level = 1, className = '', children, ...props }) {
  const Tag = `h${level}`
  return (
    <Tag
      className={`font-bold text-h${level} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}

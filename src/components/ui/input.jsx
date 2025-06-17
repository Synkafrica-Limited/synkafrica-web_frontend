import React from 'react'

/**
 * @param {JSX.Element} icon    Optional leading icon
 * @param {string} placeholder  Input placeholder text
 * @param {string} value        Controlled value
 * @param {function} onChange   Change handler (e => e.target.value)
 * @param {object} rest         Any other <input> props
 */
export default function Input({ icon, placeholder, value, onChange, ...rest }) {
  return (
    <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 
                    focus-within:ring-2 focus-within:ring-primary-500 
                    bg-white">
      {icon && <span className="text-gray-500 mr-2">{icon}</span>}
      <input
        type="text"
        className="flex-1 bg-transparent focus:outline-none text-body text-gray-800"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
      />
    </div>
  )
}

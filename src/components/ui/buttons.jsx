// src/components/ui/Button.jsx
import React from 'react'

/**
 * @param {'filled'|'outline'} variant
 * @param {'sm'|'md'|'lg'}        size
 * @param {boolean}               disabled
 * @param {React.ReactNode}       children
 * @param {string}                className  extra classes
 * @param {object}                props
 */
export default function Button({
  variant = "filled",
  size = "md",
  disabled = false,
  children,
  className = "",
  ...props
}) {
  const base = [
    "inline-flex items-center justify-center font-medium transition-colors",
    "rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-300",
  ].join(" ")

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  }

  const variants = {
    filled: [
      // default
      "bg-primary-500 text-white",
      // hover & active
      "hover:bg-primary-400 active:bg-primary-600",
      // disabled
      "disabled:bg-primary-200 disabled:text-white disabled:cursor-not-allowed",
    ].join(" "),
    outline: [
      // default
      "border-2 border-primary-500 text-primary-500 bg-transparent",
      // hover & active
      "hover:bg-primary-50 active:bg-primary-100",
      // disabled
      "disabled:border-primary-200 disabled:text-primary-200 disabled:cursor-not-allowed",
    ].join(" "),
  }

  return (
    <button
      type="button"
      disabled={disabled}
      className={[
        base,
        sizes[size],
        variants[variant],
        className
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  )
}

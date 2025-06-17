// src/components/ui/Button.jsx
import React from 'react'
// Example: import { ArrowRight } from 'lucide-react' or import { FaArrowRight } from 'react-icons/fa'

/**
 * @param {'filled'|'outline'|'icon'} variant
 * @param {'sm'|'md'|'lg'}        size
 * @param {boolean}               disabled
 * @param {React.ReactNode}       children
 * @param {React.ReactNode}       icon
 * @param {'left'|'right'}        iconPosition
 * @param {string}                className  extra classes
 * @param {object}                props
 */
export default function Button({
  variant = "filled",
  size = "md",
  disabled = false,
  children,
  icon,
  iconPosition = "right",
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
      "bg-primary-500 text-white",
      "hover:bg-primary-400 active:bg-primary-600",
      "disabled:bg-primary-200 disabled:text-white disabled:cursor-not-allowed",
    ].join(" "),
    outline: [
      "border-2 border-primary-500 text-primary-500 bg-transparent",
      "hover:bg-primary-50 active:bg-primary-100",
      "disabled:border-primary-200 disabled:text-primary-200 disabled:cursor-not-allowed",
    ].join(" "),
    icon: [
      "bg-primary-500 text-white p-2",
      "hover:bg-primary-400 active:bg-primary-600",
      "disabled:bg-primary-200 disabled:text-white disabled:cursor-not-allowed",
      "rounded-full",
      "w-10 h-10 justify-center",
    ].join(" "),
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        disabled={disabled}
        className={[base, variants.icon, className].join(" ")}
        {...props}
      >
        {icon}
      </button>
    )
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
      {icon && iconPosition === "left" && (
        <span className="mr-2 flex items-center">{icon}</span>
      )}
      {children}
      {icon && iconPosition === "right" && (
        <span className="ml-2 flex items-center">{icon}</span>
      )}
    </button>
  )
}

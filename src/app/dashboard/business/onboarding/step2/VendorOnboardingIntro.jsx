import React from 'react';
import Link from 'next/link';

/**
 * VendorOnboardingIntro
 * 
 * @param {Object} props
 * @param {string} [props.title] - Main heading/title
 * @param {Array} [props.steps] - Array of { title, description }
 * @param {string} [props.ctaLabel] - Call-to-action button label
 * @param {string} [props.ctaHref] - Call-to-action button link
 * @param {React.ReactNode} [props.cta] - Custom CTA node (optional, overrides ctaLabel/ctaHref)
 */
function VendorOnboardingIntro({
  title = "It’s easy to get\nstarted on Synkkafrica",
  steps = [
    {
      title: "1. Tell us about your business",
      description: "Share some basic info, like your business names and registration number"
    },
    {
      title: "2. Make it stand out",
      description: "Add 5 or more photos plus a title and description—we’ll help you out."
    },
    {
      title: "3. Finish up and publish",
      description: "Choose a starting price, verify a few details, then publish your listing."
    }
  ],
}) {
  return (
    <div className="flex flex-col px-2 sm:px-6 py-8">
      <div className="max-w-8xl w-full flex flex-col md:flex-row items-center justify-between flex-1">
        {/* Left: Main Title */}
        <div className="flex-1 flex flex-col justify-center md:mr-40 md:pl-12 mt-16 md:mt-0 mb-10 md:mb-0">
          <h2 className="text-4xl sm:text-4xl md:text-5xl font-bold mb-8 leading-tight whitespace-pre-line">
            {title}
          </h2>
        </div>
        {/* Right: Steps */}
        <div className="flex-1 flex flex-col gap-12 md:gap-16 max-w-xl w-full md:pr-12">
          {steps.map((step, idx) => (
            <div key={idx}>
              <div className="text-xl sm:text-2xl font-bold mb-2">{step.title}</div>
              <div className="text-gray-500 text-base sm:text-lg">
                {step.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VendorOnboardingIntro;
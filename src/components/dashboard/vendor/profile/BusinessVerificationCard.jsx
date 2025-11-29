"use client";
import React from "react";
import { Shield, CheckCircle, Clock, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

function BusinessVerificationCard({
  verificationState = "not_started",
  verificationPercent = 0,
  onVerify,
}) {
  const getStatusConfig = (status) => {
    switch (status) {
      case "verified":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          title: "Verified Business",
          description: "Your business is fully verified and trusted",
          badge: "Verified",
          badgeColor: "bg-green-100 text-green-800",
        };
      case "pending":
        return {
          icon: Clock,
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          title: "Verification Pending",
          description: "Your documents are under review",
          badge: "Under Review",
          badgeColor: "bg-yellow-100 text-yellow-800",
        };
      case "rejected":
        return {
          icon: AlertCircle,
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          title: "Verification Required",
          description: "Additional information needed",
          badge: "Action Required",
          badgeColor: "bg-red-100 text-red-800",
        };
      default:
        return {
          icon: Shield,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          title: "Get Verified",
          description: "Complete verification to build trust",
          badge: "Not Started",
          badgeColor: "bg-gray-100 text-gray-800",
        };
    }
  };

  const config = getStatusConfig(verificationState);
  const Icon = config.icon;

  const verificationSteps = [
    { name: "Business Information", completed: verificationPercent >= 25 },
    { name: "Legal Documents", completed: verificationPercent >= 50 },
    { name: "Banking Details", completed: verificationPercent >= 75 },
    { name: "Review & Submit", completed: verificationPercent >= 100 },
  ];

  return (
    <div className={`bg-white rounded-2xl shadow-lg border-2 ${config.borderColor} overflow-hidden`}>
      {/* Header */}
      <div className={`${config.bgColor} px-6 py-4 border-b ${config.borderColor}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${config.bgColor} border ${config.borderColor} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${config.color}`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{config.title}</h3>
              <p className="text-sm text-gray-600">{config.description}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${config.badgeColor}`}>
            {config.badge}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {verificationState === "verified" ? (
          /* Verified State */
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Congratulations!</h4>
            <p className="text-gray-600 mb-4">
              Your business is verified and trusted by customers. You now have access to premium features.
            </p>
            <Link
              href="/dashboard/business/verification"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              View Certificate
            </Link>
          </div>
        ) : verificationState === "pending" ? (
          /* Pending State */
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Review in Progress</h4>
            <p className="text-gray-600 mb-4">
              We're reviewing your verification documents. This usually takes 2-3 business days.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                <strong>What happens next?</strong><br />
                We'll notify you via email once the review is complete.
              </p>
            </div>
          </div>
        ) : (
          /* Not Started or Rejected State */
          <div>
            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Verification Progress</span>
                <span className="text-sm text-gray-500">{verificationPercent}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${verificationPercent}%` }}
                />
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-3 mb-6">
              {verificationSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    step.completed
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span className={`text-sm ${
                    step.completed ? 'text-green-700 font-medium' : 'text-gray-600'
                  }`}>
                    {step.name}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="flex gap-3">
              <Link
                href="/dashboard/business/verification"
                className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all font-medium shadow-lg hover:shadow-xl"
              >
                {verificationState === "rejected" ? "Update Information" : "Complete Verification"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            {/* Benefits */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
              <h5 className="text-sm font-semibold text-gray-900 mb-2">Verification Benefits:</h5>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Build customer trust and credibility</li>
                <li>• Access to premium features and listings</li>
                <li>• Higher visibility in search results</li>
                <li>• Priority customer support</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BusinessVerificationCard;
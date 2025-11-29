"use client";

import { useEffect, useState, useRef } from "react";
import businessService from "@/services/business.service";
import verificationService from "@/services/verification.service";
import authService from "@/services/authService";
import { useToast } from "@/components/ui/ToastProvider";
import { useRouter } from 'next/navigation';
import { useBusiness } from '@/context/BusinessContext';
import {
  Building2,
  FileText,
  CreditCard,
  CheckCircle2,
  Upload,
  ArrowRight,
  ArrowLeft,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { PageLoadingScreen } from "@/components/ui/LoadingScreen";

const STEPS = [
  {
    id: 1,
    title: "Business",
    description: "Basic information",
    icon: Building2,
    color: "bg-blue-500"
  },
  {
    id: 2,
    title: "Registration",
    description: "Legal documents",
    icon: FileText,
    color: "bg-green-500"
  },
  {
    id: 3,
    title: "Bank",
    description: "Payment details",
    icon: CreditCard,
    color: "bg-purple-500"
  },
  {
    id: 4,
    title: "Review",
    description: "Submit for review",
    icon: CheckCircle2,
    color: "bg-orange-500"
  },
];


export default function VerificationPage() {
  const [step, setStep] = useState(1);
  const [businessId, setBusinessId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const toast = useToast();
  const router = useRouter();

  // Diagnostic / control states
  const [noBusiness, setNoBusiness] = useState(false);
  const [noBusinessMsg, setNoBusinessMsg] = useState("");
  const { business: contextBusiness, refresh: contextRefresh, setBusiness: setContextBusiness } = useBusiness();

  const [form, setForm] = useState({
    businessType: "",
    companyName: "",
    registrationNumber: "",
    bankName: "",
    accountName: "",
    accountNumber: "",
  });
  const [certificate, setCertificate] = useState(null);
  const [certificateName, setCertificateName] = useState("");
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef();

  useEffect(() => {
    let mounted = true;

    // If business available from context, use it; otherwise prefer query param, otherwise fetch.
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const queryBusinessId = params?.get('businessId');

    if (contextBusiness && contextBusiness.id) {
      console.debug('[verification.page] using business from context:', contextBusiness.id);
      setBusinessId(contextBusiness.id);
      // check verification status
      (async () => {
        try {
          const verificationStatus = await verificationService.getStatus(contextBusiness.id);
          if (verificationStatus?.status === 'verified') {
            toast?.info?.("Your business is already verified!");
            setTimeout(() => {
              if (router && router.push) router.push('/dashboard/business/profile');
              else window.location.href = '/dashboard/business/profile';
            }, 1500);
          } else if (verificationStatus?.status === 'pending') {
            toast?.info?.("Your verification is under review. We'll notify you once it's complete.");
          }
        } catch (verificationError) {
          console.warn('No existing verification found for context business', verificationError);
        } finally {
          if (mounted) setLoading(false);
        }
      })();
    } else if (queryBusinessId) {
      console.debug('[verification.page] businessId provided via query:', queryBusinessId);
      setBusinessId(queryBusinessId);
      (async () => {
        try {
          const verificationStatus = await verificationService.getStatus(queryBusinessId);
          if (verificationStatus?.status === 'verified') {
            toast?.info?.("Your business is already verified!");
            setTimeout(() => {
              if (router && router.push) router.push('/dashboard/business/profile');
              else window.location.href = '/dashboard/business/profile';
            }, 1500);
          } else if (verificationStatus?.status === 'pending') {
            toast?.info?.("Your verification is under review. We'll notify you once it's complete.");
          }
        } catch (verificationError) {
          console.warn('No existing verification found for provided businessId', verificationError);
        } finally {
          if (mounted) setLoading(false);
        }
      })();
    } else {
      // fallback to fetching via context helper
      console.debug('[verification.page] no context/query businessId, using fetchBusiness');
      (async () => {
        try {
          const token = (typeof window !== 'undefined' && authService && authService.getAccessToken)
            ? authService.getAccessToken()
            : null;
          console.debug('[verification.page] fetchBusiness - token present:', !!token, token ? `${String(token).slice(0,8)}...` : null);

          const res = await (contextRefresh ? contextRefresh() : businessService.getMyBusinesses());
          console.debug('[verification.page] getMyBusinesses response:', res);

          if (!mounted) return;

          if (res) {
            const id = res.id || res._id || null;
            setBusinessId(id);
            setContextBusiness && setContextBusiness(res);
            try {
              const verificationStatus = await verificationService.getStatus(id);
              if (verificationStatus?.status === 'verified') {
                toast?.info?.("Your business is already verified!");
                setTimeout(() => {
                  if (router && router.push) router.push('/dashboard/business/profile');
                  else window.location.href = '/dashboard/business/profile';
                }, 1500);
              } else if (verificationStatus?.status === 'pending') {
                toast?.info?.("Your verification is under review. We'll notify you once it's complete.");
              }
            } catch (verificationError) {
              console.log('No existing verification found');
            }
          } else {
            console.warn('[verification.page] No business returned from getMyBusinesses');
            setNoBusiness(true);
            setNoBusinessMsg('No business found. Please create your business profile first.');
            toast?.info?.('No business found. Please create a business first.');
          }
        } catch (err) {
          console.error("Failed to load business:", err);
          setNoBusiness(true);
          setNoBusinessMsg('Failed to load business data. Please try again or contact support.');
          toast?.danger?.('Failed to load business data. Please try again or contact support.');
        } finally {
          if (mounted) setLoading(false);
        }
      })();
    }

    return () => (mounted = false);
  }, [router, toast]);

  function next() {
    if (validateStep(step)) {
      setStep((s) => Math.min(4, s + 1));
      setErrors({});
    }
  }

  function back() {
    setStep((s) => Math.max(1, s - 1));
    setErrors({});
  }

  function validateStep(stepNum) {
    const newErrors = {};

    if (stepNum === 1) {
      if (!form.businessType) newErrors.businessType = "Business type is required";
      if (!form.companyName.trim()) newErrors.companyName = "Business name is required";
    } else if (stepNum === 2) {
      if (!form.registrationNumber.trim()) newErrors.registrationNumber = "Registration number is required";
      if (!certificate) newErrors.certificate = "Registration certificate is required";
    } else if (stepNum === 3) {
      if (!form.bankName.trim()) newErrors.bankName = "Bank name is required";
      if (!form.accountName.trim()) newErrors.accountName = "Account name is required";
      if (!form.accountNumber.trim()) newErrors.accountNumber = "Account number is required";
      else if (!/^\d{10}$/.test(form.accountNumber)) newErrors.accountNumber = "Account number must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (f) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(f.type)) {
        setErrors({ certificate: "Please upload a PDF or image file (JPG, PNG)" });
        return;
      }
      // Validate file size (5MB max)
      if (f.size > 5 * 1024 * 1024) {
        setErrors({ certificate: "File size must be less than 5MB" });
        return;
      }
      setCertificate(f);
      setCertificateName(f.name);
      setErrors({});
    }
  }

  async function handleSubmit() {
    console.log('handleSubmit called');
    console.log('businessId:', businessId);
    console.log('form:', form);
    console.log('certificate:', certificate);

    if (!businessId) {
      toast?.danger?.("No business found — create a business first.");
      return;
    }

    if (!validateStep(4)) {
      toast?.danger?.("Please complete all required fields before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      // Validate form data
      const validation = verificationService.validateFormData({
        ...form,
        business_certificate: certificate
      });

      console.log('validation result:', validation);

      if (!validation.isValid) {
        setErrors(validation.errors);
        toast?.danger?.('Please fix the errors in the form');
        return;
      }


      // Prepare and submit verification. If Cloudinary is configured, upload files directly
      const cloudConfigured = !!(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

      let result;
      if (cloudConfigured && certificate) {
        // pass a plain object with files array — verificationService.submit will upload and send URLs to backend
        console.debug('[verification.page] using cloudinary direct upload');
        result = await verificationService.submit(businessId, { ...form, files: [certificate] });
      } else {
        // Prepare form data (multipart)
        const fd = verificationService.prepareFormData({
          ...form,
          business_certificate: certificate
        });
        console.log('submitting verification...');
        result = await verificationService.submit(businessId, fd);
      }

      console.log('submission result:', result);
      toast?.success?.("Verification submitted successfully! We'll review your documents within 2-3 business days.");
      setSubmitted(true);

      // Optionally refresh the page or redirect
      setTimeout(() => {
        window.location.href = '/dashboard/business/profile';
      }, 3000);

    } catch (err) {
      console.error("Verification submission error:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "Submission failed. Please try again.";
      toast?.danger?.(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <PageLoadingScreen message="Loading verification form..." />;
  }

  if (noBusiness) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-lg text-center bg-white rounded-lg shadow p-8">
          <h2 className="text-xl font-semibold mb-2">No Business Found</h2>
          <p className="text-gray-600 mb-4">{noBusinessMsg || 'No business was found for your account.'}</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                if (router && router.push) router.push('/dashboard/business');
                else window.location.href = '/dashboard/business';
              }}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg"
            >
              Create Business
            </button>
            <button
              onClick={async () => {
                // re-run the fetch via context helper when possible
                try {
                  setLoading(true);
                  setNoBusiness(false);
                  setNoBusinessMsg('');
                  try {
                    const res = contextRefresh ? await contextRefresh() : await businessService.getMyBusinesses();
                    // if refresh returned a business, update local state
                    if (res) {
                      const id = res.id || res._id || null;
                      setBusinessId(id);
                      setContextBusiness && setContextBusiness(res);
                      setNoBusiness(false);
                    } else {
                      setNoBusiness(true);
                      setNoBusinessMsg('No business found after retry.');
                    }
                  } catch (err) {
                    console.error('Retry fetch failed', err);
                    setNoBusiness(true);
                    setNoBusinessMsg('Retry failed. Check console for details.');
                  }
                } catch (err) {
                  console.error('Retry fetch failed', err);
                  setNoBusiness(true);
                  setNoBusinessMsg('Retry failed. Check console for details.');
                } finally {
                  setLoading(false);
                }
              }}
              className="px-4 py-2 border rounded-lg"
            >
              Retry
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-3">Diagnostics: check DevTools Console and Network for token and API response logs.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-primary-500 to-primary-600 rounded-2xl shadow-lg mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Verification</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Complete your business verification to unlock premium features and build trust with customers
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            {STEPS.map((s, index) => {
              const Icon = s.icon;
              const isActive = s.id === step;
              const isCompleted = s.id < step;
              const isPending = s.id > step;

              return (
                <div key={s.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? 'bg-green-500 text-white shadow-lg'
                        : isActive
                        ? `${s.color} text-white shadow-lg scale-110`
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <div className="text-center mt-3">
                      <div className={`text-sm font-semibold transition-colors ${
                        isActive ? 'text-gray-900' : isCompleted ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        {s.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{s.description}</div>
                    </div>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 transition-colors ${
                      s.id < step ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step Content */}
          <div className="min-h-[400px]">
            {/* Step 1: Business */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Building2 className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Business Information</h2>
                  <p className="text-gray-600">Tell us about your business</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.businessType}
                      onChange={(e) => setForm((p) => ({ ...p, businessType: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                        errors.businessType ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select your business type</option>
                      <option>Hotel</option>
                      <option>Restaurant</option>
                      <option>Car Rental</option>
                      <option>Resort</option>
                      <option>Convenience Store</option>
                      <option>Other</option>
                    </select>
                    {errors.businessType && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.businessType}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={form.companyName}
                      onChange={(e) => setForm((p) => ({ ...p, companyName: e.target.value }))}
                      placeholder="Enter your registered business name"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                        errors.companyName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.companyName && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.companyName}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Registration */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <FileText className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Registration Documents</h2>
                  <p className="text-gray-600">Upload your legal registration documents</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={form.registrationNumber}
                      onChange={(e) => setForm((p) => ({ ...p, registrationNumber: e.target.value }))}
                      placeholder="e.g., RC1234567 or BN123456789"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                        errors.registrationNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.registrationNumber && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.registrationNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Certificate <span className="text-red-500">*</span>
                    </label>
                    <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                      certificate ? 'border-green-300 bg-green-50' : errors.certificate ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-primary-400'
                    }`}>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.jpg,.png,.jpeg"
                        onChange={handleFile}
                        className="hidden"
                      />
                      {certificate ? (
                        <div className="space-y-3">
                          <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
                          <div>
                            <p className="font-medium text-gray-900">{certificateName}</p>
                            <p className="text-sm text-gray-600">
                              {(certificate.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                          >
                            Change file
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                          <div>
                            <p className="font-medium text-gray-900">Upload Registration Certificate</p>
                            <p className="text-sm text-gray-600">PDF, JPG, or PNG (max 5MB)</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
                          >
                            Choose File
                          </button>
                        </div>
                      )}
                    </div>
                    {errors.certificate && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.certificate}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Bank */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <CreditCard className="w-12 h-12 text-purple-500 mx-auto mb-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Banking Information</h2>
                  <p className="text-gray-600">Provide your business bank account details</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={form.bankName}
                      onChange={(e) => setForm((p) => ({ ...p, bankName: e.target.value }))}
                      placeholder="e.g., Access Bank, Zenith Bank"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                        errors.bankName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.bankName && (
                      <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.bankName}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={form.accountName}
                        onChange={(e) => setForm((p) => ({ ...p, accountName: e.target.value }))}
                        placeholder="Account holder name"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                          errors.accountName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {errors.accountName && (
                        <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.accountName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={form.accountNumber}
                        onChange={(e) => setForm((p) => ({ ...p, accountNumber: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                        placeholder="1234567890"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                          errors.accountNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {errors.accountNumber && (
                        <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.accountNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <CheckCircle2 className="w-12 h-12 text-orange-500 mx-auto mb-3" />
                  <h2 className="text-xl font-semibold text-gray-900">Review & Submit</h2>
                  <p className="text-gray-600">Please review your information before submitting</p>
                </div>

                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-700 mb-2">Verification Submitted!</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Thank you for submitting your verification documents. Our team will review them within 2-3 business days and notify you of the outcome.
                    </p>
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <p className="text-blue-800 text-sm">
                        <strong>What happens next?</strong><br />
                        We'll verify your documents and may contact you if we need additional information. Once approved, you'll have access to premium features.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-linear-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      Verification Summary
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Business Type:</span>
                          <span className="font-medium text-gray-900">{form.businessType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Business Name:</span>
                          <span className="font-medium text-gray-900">{form.companyName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Registration:</span>
                          <span className="font-medium text-gray-900">{form.registrationNumber}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Certificate:</span>
                          <span className="font-medium text-gray-900">{certificateName || "Not uploaded"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bank:</span>
                          <span className="font-medium text-gray-900">{form.bankName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Account:</span>
                          <span className="font-medium text-gray-900">****{form.accountNumber.slice(-4)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          {!submitted && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={back}
                disabled={step === 1}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <div className="flex items-center gap-3">
                {step < 4 ? (
                  <button
                    onClick={next}
                    className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Submit Verification
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

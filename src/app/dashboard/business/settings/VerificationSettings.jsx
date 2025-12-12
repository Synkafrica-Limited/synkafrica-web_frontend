"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import verificationService from "@/services/verification.service";
import { useToast } from "@/components/ui/ToastProvider";
import { useBusiness } from '@/context/BusinessContext';
import ngBanks from 'ng-banks';
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

export default function VerificationSettings() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState(null);
    const toast = useToast();
    const { business } = useBusiness();

    const banks = useMemo(() => {
        try {
            const bankList = ngBanks.getBanks();
            if (!bankList || bankList.length === 0) {
                toast?.danger?.('Failed to load bank list');
                return [];
            }
            return bankList.sort((a, b) => a.name.localeCompare(b.name));
        } catch (error) {
            console.error('Error loading banks:', error);
            toast?.danger?.('Failed to load bank list');
            return [];
        }
    }, [toast]);

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
        if (business?.id) {
            loadVerificationStatus();
            const savedForm = localStorage.getItem(`verification_form_${business.id}`);
            if (savedForm) {
                try {
                    const parsed = JSON.parse(savedForm);
                    setForm(prev => ({ ...prev, ...parsed }));
                } catch (e) {
                    console.error('Failed to parse saved form:', e);
                }
            } else {
                setForm(prev => ({
                    ...prev,
                    companyName: business.businessName || prev.companyName,
                    businessType: business.businessType || prev.businessType,
                    registrationNumber: business.registrationNumber || prev.registrationNumber,
                    bankName: business.bankName || prev.bankName,
                    accountName: business.accountName || prev.accountName,
                    accountNumber: business.accountNumber || prev.accountNumber,
                }));
            }
        } else {
            setLoading(false);
        }
    }, [business?.id]);

    useEffect(() => {
        if (business?.id && (form.companyName || form.registrationNumber)) {
            localStorage.setItem(`verification_form_${business.id}`, JSON.stringify(form));
        }
    }, [form, business?.id]);

    const loadVerificationStatus = async () => {
        try {
            const status = await verificationService.getStatus(business.id);
            setVerificationStatus(status);
            if (status?.status === 'verified') {
                setSubmitted(true);
            }
        } catch (error) {
            console.error("Failed to load verification status:", error);
        } finally {
            setLoading(false);
        }
    };

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
            if (!certificate && !verificationStatus?.documents?.length) newErrors.certificate = "Registration certificate is required";
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
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(f.type)) {
                setErrors({ certificate: "Please upload a PDF or image file (JPG, PNG)" });
                return;
            }
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
        if (!business?.id) {
            toast?.danger?.("No business found");
            return;
        }

        if (!validateStep(4)) {
            toast?.danger?.("Please complete all required fields");
            return;
        }

        setSubmitting(true);
        try {
            const validation = verificationService.validateFormData({
                ...form,
                business_certificate: certificate || (verificationStatus?.documents?.length ? 'existing' : null)
            });

            // Skip certificate validation if we have existing documents and no new file
            if (!certificate && verificationStatus?.documents?.length) {
                delete validation.errors.certificate;
                if (Object.keys(validation.errors).length === 0) validation.isValid = true;
            }

            if (!validation.isValid) {
                setErrors(validation.errors);
                toast?.danger?.('Please fix the errors in the form');
                return;
            }

            // Prepare FormData - backend handles file upload
            const fd = verificationService.prepareFormData({
                ...form,
                business_certificate: certificate
            });

            const result = await verificationService.submit(business.id, fd);

            toast?.success?.("Verification submitted successfully!");
            setSubmitted(true);
            localStorage.removeItem(`verification_form_${business.id}`);

            setTimeout(async () => {
                const status = await verificationService.getStatus(business.id);
                setVerificationStatus(status);
                if (window.__BUSINESS_CONTEXT_REFRESH__) {
                    window.__BUSINESS_CONTEXT_REFRESH__();
                }
            }, 1000);
        } catch (err) {
            console.error("Verification submission error:", err);
            toast?.danger?.(err?.message || "Submission failed");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        );
    }

    // Verified State
    if (verificationStatus?.status === 'verified') {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-green-700 mb-2">Business Verified</h3>
                    <p className="text-gray-600 mb-6">
                        Your business has been successfully verified. You have access to all premium features.
                    </p>
                    <div className="bg-green-50 rounded-lg p-4 max-w-md mx-auto text-left">
                        <h4 className="font-semibold text-green-800 mb-2">Verification Details</h4>
                        <div className="space-y-2 text-sm text-green-700">
                            <div className="flex justify-between">
                                <span>Status:</span>
                                <span className="font-medium uppercase">Verified</span>
                            </div>
                            {verificationStatus.submittedAt && (
                                <div className="flex justify-between">
                                    <span>Submitted:</span>
                                    <span className="font-medium">{new Date(verificationStatus.submittedAt).toLocaleDateString()}</span>
                                </div>
                            )}
                            {verificationStatus.reviewedAt && (
                                <div className="flex justify-between">
                                    <span>Verified On:</span>
                                    <span className="font-medium">{new Date(verificationStatus.reviewedAt).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    {verificationStatus.documents && verificationStatus.documents.length > 0 && (
                        <div className="mt-6">
                            <h4 className="font-semibold text-gray-800 mb-2">Documents</h4>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {verificationStatus.documents.map((doc, idx) => (
                                    <a
                                        key={idx}
                                        href={doc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                                    >
                                        <FileText className="w-4 h-4" />
                                        View Certificate
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Pending State
    if (verificationStatus?.status === 'pending') {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Loader2 className="w-8 h-8 text-yellow-600 animate-spin" />
                    </div>
                    <h3 className="text-xl font-bold text-yellow-700 mb-2">Verification Pending</h3>
                    <p className="text-gray-600 mb-6">
                        Your verification documents are currently under review. This usually takes 2-3 business days.
                    </p>
                    <div className="bg-yellow-50 rounded-lg p-4 max-w-md mx-auto text-left border border-yellow-200">
                        <h4 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            What's Next?
                        </h4>
                        <ul className="space-y-2 text-sm text-yellow-700">
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>Our team is reviewing your documents</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>You'll receive an email notification once reviewed</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>Check back here for status updates</span>
                            </li>
                        </ul>
                        {verificationStatus.submittedAt && (
                            <div className="mt-4 pt-4 border-t border-yellow-200">
                                <div className="flex justify-between text-xs">
                                    <span className="text-yellow-600">Submitted:</span>
                                    <span className="font-medium text-yellow-800">
                                        {new Date(verificationStatus.submittedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                    {verificationStatus.documents && verificationStatus.documents.length > 0 && (
                        <div className="mt-6">
                            <h4 className="font-semibold text-gray-800 mb-2 text-sm">Submitted Documents</h4>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {verificationStatus.documents.map((doc, idx) => (
                                    <a
                                        key={idx}
                                        href={doc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                                    >
                                        <FileText className="w-4 h-4" />
                                        View Document
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Rejected State
    if (verificationStatus?.status === 'rejected') {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-red-700 mb-2">Verification Rejected</h3>
                    <p className="text-gray-600 mb-6">
                        Unfortunately, your verification was not approved. Please review the reason below and resubmit.
                    </p>
                    {verificationStatus.rejectionReason && (
                        <div className="bg-red-50 rounded-lg p-4 max-w-md mx-auto text-left border border-red-200 mb-6">
                            <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5" />
                                Rejection Reason
                            </h4>
                            <p className="text-sm text-red-700">{verificationStatus.rejectionReason}</p>
                        </div>
                    )}
                    <button
                        onClick={() => {
                            setVerificationStatus({ ...verificationStatus, status: 'not_started' });
                            setStep(1);
                        }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-sm"
                    >
                        <ArrowRight className="w-5 h-5" />
                        Resubmit Verification
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-blue-50 rounded-lg">
                    <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Business Verification</h2>
                    <p className="text-gray-600 text-sm">Complete verification to build trust and unlock features</p>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {STEPS.map((s, index) => {
                        const Icon = s.icon;
                        const isActive = s.id === step;
                        const isCompleted = s.id < step;

                        return (
                            <div key={s.id} className="flex items-center flex-1">
                                <div className="flex flex-col items-center relative z-10">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted
                                        ? 'bg-green-500 text-white'
                                        : isActive
                                            ? `${s.color} text-white scale-110 shadow-md`
                                            : 'bg-gray-100 text-gray-400'
                                        }`}>
                                        {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                    </div>
                                    <div className="hidden sm:block text-center mt-2">
                                        <div className={`text-xs font-semibold ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                                            {s.title}
                                        </div>
                                    </div>
                                </div>
                                {index < STEPS.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-2 -mt-6 ${s.id < step ? 'bg-green-500' : 'bg-gray-200'}`} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Step Content */}
            <div className="min-h-[300px]">
                {step === 1 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Business Type *</label>
                            <select
                                value={form.businessType}
                                onChange={(e) => setForm((p) => ({ ...p, businessType: e.target.value }))}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.businessType ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">Select type</option>
                                <option>Hotel</option>
                                <option>Restaurant</option>
                                <option>Car Rental</option>
                                <option>Resort</option>
                                <option>Convenience Store</option>
                                <optgroup label="Convenience Services">
                                  <option value="makeup">Makeup & Beauty</option>
                                  <option value="laundry">Laundry & Dry Cleaning</option>
                                  <option value="photography">Photography & Videography</option>
                                  <option value="cleaning">Home & Office Cleaning</option>
                                  <option value="styling">Fashion Styling</option>
                                  <option value="tailoring">Tailoring & Stitching</option>
                                  <option value="events">Event Services (MC, DJ, Decorators)</option>
                                  <option value="fitness">Fitness Training</option>
                                  <option value="spa">Spa & Wellness</option>
                                </optgroup>
                                <option>Other</option>
                            </select>
                            {errors.businessType && <p className="text-red-500 text-xs mt-1">{errors.businessType}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
                            <input
                                value={form.companyName}
                                onChange={(e) => setForm((p) => ({ ...p, companyName: e.target.value }))}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.companyName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                placeholder="Registered business name"
                            />
                            {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number *</label>
                            <input
                                value={form.registrationNumber}
                                onChange={(e) => setForm((p) => ({ ...p, registrationNumber: e.target.value }))}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.registrationNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                placeholder="RC Number or Business Number"
                            />
                            {errors.registrationNumber && <p className="text-red-500 text-xs mt-1">{errors.registrationNumber}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Certificate *</label>
                            <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${certificate ? 'border-green-300 bg-green-50' : errors.certificate ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-primary-400'
                                }`}>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.jpg,.png,.jpeg"
                                    onChange={handleFile}
                                    className="hidden"
                                />
                                {certificate ? (
                                    <div className="flex flex-col items-center">
                                        <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                                        <p className="font-medium text-sm">{certificateName}</p>
                                        <button onClick={() => fileInputRef.current?.click()} className="text-xs text-primary-600 mt-2 hover:underline">Change</button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                        <p className="text-sm font-medium text-gray-700">Upload Certificate</p>
                                        <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                                    </div>
                                )}
                            </div>
                            {errors.certificate && <p className="text-red-500 text-xs mt-1">{errors.certificate}</p>}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name *</label>
                            <select
                                value={form.bankName}
                                onChange={(e) => setForm((p) => ({ ...p, bankName: e.target.value }))}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.bankName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">Select Bank</option>
                                {banks.map((bank) => (
                                    <option key={bank.code} value={bank.name}>{bank.name}</option>
                                ))}
                            </select>
                            {errors.bankName && <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Account Name *</label>
                                <input
                                    value={form.accountName}
                                    onChange={(e) => setForm((p) => ({ ...p, accountName: e.target.value }))}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.accountName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    placeholder="Account Name"
                                />
                                {errors.accountName && <p className="text-red-500 text-xs mt-1">{errors.accountName}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Account Number *</label>
                                <input
                                    value={form.accountNumber}
                                    onChange={(e) => setForm((p) => ({ ...p, accountNumber: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.accountNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    placeholder="10 digits"
                                />
                                {errors.accountNumber && <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>}
                            </div>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <h3 className="font-medium text-gray-900 mb-3">Summary</h3>
                            <dl className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <dt className="text-gray-500">Business</dt>
                                    <dd className="font-medium">{form.companyName} ({form.businessType})</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-500">Registration</dt>
                                    <dd className="font-medium">{form.registrationNumber}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-500">Bank</dt>
                                    <dd className="font-medium">{form.bankName}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-500">Account</dt>
                                    <dd className="font-medium">****{form.accountNumber.slice(-4)}</dd>
                                </div>
                            </dl>
                        </div>
                        {submitted && (
                            <div className="p-4 bg-green-50 text-green-700 rounded-lg text-sm flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Verification submitted successfully!
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Actions */}
            {!submitted && (
                <div className="flex justify-between pt-6 border-t border-gray-100">
                    <button
                        onClick={back}
                        disabled={step === 1}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg disabled:opacity-50"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>

                    {step < 4 ? (
                        <button
                            onClick={next}
                            className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 shadow-sm"
                        >
                            Next <ArrowRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm disabled:opacity-70"
                        >
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                            Submit Verification
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

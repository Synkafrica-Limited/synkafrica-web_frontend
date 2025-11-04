// src/app/dashboard/business/onboarding/components/step4/BusinessDetailsStep.jsx
"use client";
import { useState } from "react";
import { AddBusinessEmail } from "./AddBusinessEmail";
import { AddBusinessNumber } from "./AddBusinessNumber";
import AddBusinessPayment from "./AddBusinessPayment";

export default function BusinessDetailsStep() {
  const [show, setShow] = useState(null); // "email" | "number" | "payment" | null
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  // Store payment as an object
  const [payment, setPayment] = useState({ bank: "", accountNumber: "", accountName: "" });

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-xl mx-auto">
        <div className="text-gray-400 text-base mb-2 mt-4">Step 4</div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Add your business details</h2>
        <p className="text-gray-500 mb-6">Help us to know you, guests won’t see this</p>
        <div className="flex flex-col gap-4">
          {/* Email */}
          <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between cursor-pointer" onClick={() => setShow("email")}>
            <div>
              <div className="font-semibold">Add your business email</div>
              {email && <div className="text-gray-500 text-sm mt-1">{email}</div>}
            </div>
            <span className="text-2xl text-primary-500 font-bold">+</span>
          </div>
          {show === "email" && (
            <AddBusinessEmail
              value={email}
              onSave={(val) => {
                setEmail(val);
                setShow(null);
              }}
              onCancel={() => setShow(null)}
            />
          )}
          {/* Number */}
          <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between cursor-pointer" onClick={() => setShow("number")}>
            <div>
              <div className="font-semibold">Add your business number</div>
              {number && <div className="text-gray-500 text-sm mt-1">{number}</div>}
            </div>
            <span className="text-2xl text-primary-500 font-bold">+</span>
          </div>
          {show === "number" && (
            <AddBusinessNumber
              value={number}
              onSave={(val) => {
                setNumber(val);
                setShow(null);
              }}
              onCancel={() => setShow(null)}
            />
          )}
          {/* Payment */}
          <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between cursor-pointer" onClick={() => setShow("payment")}>
            <div>
              <div className="font-semibold">Add your business payment details</div>
              {/* Show payment summary if available */}
              {payment.bank && payment.accountNumber && payment.accountName && (
                <div className="text-gray-500 text-sm mt-1">
                  {payment.bank} - {payment.accountNumber} <br />{payment.accountName}
                </div>
              )}
            </div>
            <span className="text-2xl text-primary-500 font-bold">+</span>
          </div>
          {show === "payment" && (
            <AddBusinessPayment
              value={payment}
              onSave={(val) => {
                setPayment(val);
                setShow(null);
              }}
              onCancel={() => setShow(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
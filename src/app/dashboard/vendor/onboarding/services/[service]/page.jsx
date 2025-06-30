"use client";

import { useParams } from "next/navigation";
import QuestionStep from "@/components/dashboard/vendor/QuestionStep";

export default function ServiceQuestionPage() {
  const { service } = useParams();

  return (
    <QuestionStep
      title={`Step 1 — Tell us about your ${service}`}
      description="Share some basic info, like your business name and registration number"
    >
    </QuestionStep>
  );
}

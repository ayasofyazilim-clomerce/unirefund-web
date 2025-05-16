import React from "react";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";

interface SuccessModalProps {
  onRestart: () => void;
  languageData: SSRServiceResource;
}

const SuccessModal: React.FC<SuccessModalProps> = ({languageData}) => {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-10 w-10 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-bold text-gray-900">{languageData.LivenessVerificationSuccessful}</h3>
        <p className="mb-6 text-gray-600">{languageData.AllExpressionTestsCompleted}</p>
      </div>
    </div>
  );
};

export default SuccessModal;

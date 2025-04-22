"use client";

import React from "react";

interface ScanPassportProps {
  onScanClick: (type: "passport" | "id") => void;
}

export function ScanPassport({onScanClick}: ScanPassportProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-8 text-center">
        <h1 className="text-primary mb-4 text-2xl font-bold">HELLO</h1>
        <p className="text-gray-700">
          Scan your passport or ID card to find your tax free transactions and add a payment method.
        </p>
      </div>

      <div className="mb-8 flex justify-center">
        <div className="relative mx-auto aspect-[4/3] w-full max-w-xs">
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <img
              alt="Passport placeholder"
              className="h-auto max-h-full w-3/4 object-contain"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="150" viewBox="0 0 100 150"><rect width="100%" height="100%" fill="whitesmoke"/><rect x="25" y="35" width="50" height="60" fill="lightgray"/><circle cx="50" cy="55" r="15" fill="darkgray"/><rect x="30" y="100" width="40" height="5" fill="darkgray"/><rect x="20" y="110" width="60" height="5" fill="darkgray"/><rect x="20" y="120" width="60" height="5" fill="darkgray"/></svg>';
              }}
              src="/passport-placeholder.png"
            />
          </div>
          <div className="absolute inset-0 rounded-lg border-2 border-red-400">
            <div className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-red-400" />
            <div className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-red-400" />
            <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-red-400" />
            <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-red-400" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <button
          className="bg-primary hover:bg-primary/90 flex w-full items-center justify-center rounded-lg px-4 py-3 font-medium text-white transition-colors"
          onClick={() => {
            onScanClick("passport");
          }}>
          Scan passport
        </button>

        <button
          className="flex w-full items-center justify-center rounded-lg border border-gray-200 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          onClick={() => {
            onScanClick("id");
          }}>
          Scan ID Card
        </button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Unable to find your transactions?{" "}
          <a className="text-primary" href="/refund-tracker">
            Refund Tracker
          </a>
        </p>
      </div>
    </div>
  );
}

"use client";

import React from "react";

interface TaxFormInputProps {
  docId: string;
  amount: string;
  onDocIdChange: (value: string) => void;
  onAmountChange: (value: string) => void;
}

export function TaxFormInput({docId, amount, onDocIdChange, onAmountChange}: TaxFormInputProps) {
  const isFormValid = Boolean(docId) && Boolean(amount);

  return (
    <form className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-6">
        <label className="mb-2 block font-medium text-gray-700" htmlFor="docId">
          Tax Free Form Number (Doc-ID)
        </label>
        <input
          className="focus:ring-primary/50 w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2"
          id="docId"
          onChange={(e) => {
            onDocIdChange(e.target.value);
          }}
          placeholder="Enter document ID"
          type="text"
          value={docId}
        />
        <p className="mt-1 text-sm text-gray-500">The Doc-ID is the number written below the barcode of your form.</p>
      </div>

      <div className="mb-6">
        <label className="mb-2 block font-medium text-gray-700" htmlFor="amount">
          Purchase Amount
        </label>
        <input
          className="focus:ring-primary/50 w-full rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2"
          id="amount"
          onChange={(e) => {
            onAmountChange(e.target.value);
          }}
          placeholder="Enter amount"
          type="text"
          value={amount}
        />
        <p className="mt-1 text-sm text-gray-500">
          We need this so that we can prevent unauthorized access to your transactions.
        </p>
      </div>

      <button
        className="flex w-full items-center justify-center rounded-lg bg-green-500 py-3 font-medium text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!isFormValid}
        type="submit">
        Next
      </button>
    </form>
  );
}

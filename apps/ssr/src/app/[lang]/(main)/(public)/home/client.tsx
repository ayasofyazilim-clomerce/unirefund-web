"use client";

import {useState} from "react";
import {ScanButton} from "../_components/scan-button";
import {TaxFormInput} from "../_components/tax-form-input";

export default function HomeClient() {
  const [docId, setDocId] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-6">
        <div className="mb-6">
          <ScanButton />
        </div>

        <TaxFormInput amount={amount} docId={docId} onAmountChange={setAmount} onDocIdChange={setDocId} />
      </main>

      <footer className="bg-primary py-3 text-white">
        <div className="mx-auto flex max-w-lg justify-center space-x-6 px-4">
          <a className="text-sm hover:underline" href="/about">
            About us
          </a>
          <a className="text-sm hover:underline" href="/privacy">
            Privacy
          </a>
          <a className="text-sm hover:underline" href="/help">
            Help
          </a>
        </div>
      </footer>
    </div>
  );
}

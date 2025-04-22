"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {ScanPassport} from "../_components/scan-password";

export default function SearchTransactionClient() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [scanType, setScanType] = useState<"passport" | "id" | null>(null);

  const handleScanClick = (type: "passport" | "id") => {
    setScanType(type);
    setIsScanning(true);

    // In a real implementation, this would initiate the camera for scanning
    // For now, we'll just simulate a successful scan after a short delay
    setTimeout(() => {
      handleScanComplete();
    }, 2000);
  };

  const handleScanComplete = () => {
    // In a real implementation, this would process the scan result
    // For now, we'll just navigate back to the main page
    router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="bg-primary flex items-center px-4 py-4 text-white">
        {isScanning ? (
          <button
            className="mr-4 text-white"
            onClick={() => {
              setIsScanning(false);
            }}>
            Back
          </button>
        ) : null}
        <h1 className="mx-auto text-xl font-medium">{isScanning ? "Scanning" : "Find Transactions"}</h1>
        <div className="w-10" /> {/* Spacer for alignment */}
      </header>

      <main className="mx-auto w-full max-w-md flex-1 px-4 py-6">
        {isScanning ? (
          <div className="rounded-lg bg-white p-6 text-center shadow-sm">
            <div className="mb-6 animate-pulse">
              <div className="mx-auto flex h-64 w-64 items-center justify-center rounded-lg bg-gray-200">
                <div className="text-gray-500">Camera activating...</div>
              </div>
            </div>
            <p className="mb-4 text-gray-700">Scanning {scanType === "passport" ? "passport" : "ID card"}...</p>
            <button
              className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700"
              onClick={() => {
                setIsScanning(false);
              }}>
              Cancel
            </button>
          </div>
        ) : (
          <ScanPassport onScanClick={handleScanClick} />
        )}
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

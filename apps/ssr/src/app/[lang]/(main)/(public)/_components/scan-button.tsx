"use client";

import React from "react";
import {Camera} from "lucide-react";

export function ScanButton() {
  return (
    <button
      className="border-primary text-primary hover:bg-primary/5 flex w-full items-center justify-center gap-2 rounded-lg border p-4 transition-colors"
      type="button">
      <Camera className="h-6 w-6" />
      <span className="font-medium">Scan Tax Free Form</span>
    </button>
  );
}

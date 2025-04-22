"use client";

import Link from "next/link";
import {useState} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {CreditCard, Camera, ArrowLeft} from "lucide-react";

export default function SearchTransactionClient() {
  const [docId, setDocId] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-gray-50 ">
      <div className="flex w-full max-w-md flex-col items-center justify-center gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Find Your Transaction</h1>
          <p className="mt-2 text-sm text-gray-600">Search for your tax-free refunds using your form details</p>
        </div>

        <Card className="flex w-full flex-col items-center justify-center rounded-lg bg-white p-6 shadow-md">
          <CardHeader className="w-full pt-0 text-center">
            <CardTitle className="text-xl font-semibold">Enter Form Details</CardTitle>
            <CardDescription>Provide your tax free form information</CardDescription>
          </CardHeader>
          <CardContent className="w-full p-0">
            <form className="w-full space-y-4">
              <div className="space-y-2">
                <Label className="text-sm" htmlFor="docId">
                  Tax Free Form Number (Doc-ID)
                </Label>
                <Input
                  className="border-input"
                  id="docId"
                  onChange={(e) => {
                    setDocId(e.target.value);
                  }}
                  placeholder="e.g. 1234567890"
                  required
                  value={docId}
                />
                <p className="text-muted-foreground text-xs">The Doc-ID is printed below the barcode on your form</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm" htmlFor="purchaseAmount">
                  Purchase Amount
                </Label>
                <div className="relative">
                  <CreditCard className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                  <Input
                    className="pl-10"
                    id="purchaseAmount"
                    onChange={(e) => {
                      setPurchaseAmount(e.target.value);
                    }}
                    placeholder="e.g. 100.00"
                    required
                    value={purchaseAmount}
                  />
                </div>
                <p className="text-muted-foreground text-xs">Verify your identity with the exact purchase amount</p>
              </div>

              <div className="flex w-full flex-col gap-3">
                <Button className="bg-primary hover:bg-primary/90 flex-1" type="submit">
                  Next
                </Button>
                <Button className="flex items-center justify-center gap-2" type="button" variant="outline">
                  <Camera className="h-4 w-4" />
                  Scan Tax Free Form
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <Link
          className="text-primary hover:text-primary/90 flex items-center justify-center gap-2 text-center text-sm font-medium"
          href="/home">
          <ArrowLeft className="h-5 w-5" />
          Go Home Page
        </Link>
      </div>
    </div>
  );
}

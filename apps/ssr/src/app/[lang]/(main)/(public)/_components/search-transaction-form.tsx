"use client";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {CreditCard, Camera} from "lucide-react";
import {useState} from "react";

export default function SearchTransactionForm() {
  const [docId, setDocId] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");

  return (
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
  );
}

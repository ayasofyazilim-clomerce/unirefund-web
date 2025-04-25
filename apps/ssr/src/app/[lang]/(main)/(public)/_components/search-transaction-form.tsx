"use client";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {CreditCard, Camera} from "lucide-react";
import {useState} from "react";
import {useParams} from "next/navigation";
import {getResourceDataClient} from "src/language-data/core/Default";

export default function SearchTransactionForm() {
  const [docId, setDocId] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");

  // URL'den dil parametresini al
  const params = useParams();
  const lang = params.lang as string;

  // Dil kaynaklarını istemci tarafında al
  const languageData = getResourceDataClient(lang);

  return (
    <form className="w-full space-y-4">
      <div className="space-y-2">
        <Label className="text-sm" htmlFor="docId">
          {languageData.TaxFreeFormNumber}
        </Label>
        <Input
          className="border-input"
          id="docId"
          onChange={(e) => {
            setDocId(e.target.value);
          }}
          placeholder={languageData.DocIdPlaceholder}
          required
          value={docId}
        />
        <p className="text-muted-foreground text-xs">{languageData.DocIdHelp}</p>
      </div>

      <div className="space-y-2">
        <Label className="text-sm" htmlFor="purchaseAmount">
          {languageData.PurchaseAmount}
        </Label>
        <div className="relative">
          <CreditCard className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            className="pl-10"
            id="purchaseAmount"
            onChange={(e) => {
              setPurchaseAmount(e.target.value);
            }}
            placeholder={languageData.AmountPlaceholder}
            required
            value={purchaseAmount}
          />
        </div>
        <p className="text-muted-foreground text-xs">{languageData.PurchaseAmountHelp}</p>
      </div>

      <div className="flex w-full flex-col gap-3">
        <Button className="bg-primary hover:bg-primary/90 flex-1" type="submit">
          {languageData.Next}
        </Button>
        <Button className="flex items-center justify-center gap-2" type="button" variant="outline">
          <Camera className="h-4 w-4" />
          {languageData.ScanTaxFreeForm}
        </Button>
      </div>
    </form>
  );
}

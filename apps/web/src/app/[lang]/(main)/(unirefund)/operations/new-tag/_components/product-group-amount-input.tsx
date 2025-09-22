import {Input} from "@/components/ui/input";
import React, {type Dispatch, type SetStateAction} from "react";
import type {TagServiceResource} from "src/language-data/unirefund/TagService";

function ProductGroupAmountInput({
  productGroupIds,
  productGroupList,
  languageData,
  setInvoiceLines,
  isPending,
}: {
  productGroupIds: string[];
  productGroupList: {productGroupId: string; productGroupName: string; vatRate: number}[];
  languageData: TagServiceResource;
  setInvoiceLines: Dispatch<
    SetStateAction<Record<string, {taxRate: number; taxAmount: number; amount: number; taxBase: number}>>
  >;
  isPending: boolean;
}) {
  if (productGroupIds.length === 0) return null;

  return (
    <div className="grid items-center gap-1.5">
      <div>{languageData.ProductGroups}</div>
      <div className="grid gap-1.5">
        {productGroupList
          .filter((productGroup) => productGroupIds.includes(productGroup.productGroupId))
          .map((productGroup, index) => (
            <div className="grid grid-cols-2 items-center gap-1.5 border-t px-4 py-1" key={productGroup.productGroupId}>
              <div className="grid">
                <div>{productGroup.productGroupName}</div>
                <div className="text-sm">%{productGroup.vatRate}</div>
              </div>
              <div className="grid gap-1">
                <div className="text-sm">Total Amount</div>
                <Input
                  data-testid={`product_group_amount_input_${index}`}
                  disabled={isPending}
                  onChange={(e) => {
                    setInvoiceLines((prev) => {
                      const taxAmount =
                        parseFloat(e.target.value) - parseFloat(e.target.value) / (1 + productGroup.vatRate / 100);
                      return {
                        ...prev,
                        [productGroup.productGroupId]: {
                          taxRate: productGroup.vatRate, //Vergi oranı
                          taxBase: parseFloat(e.target.value) - taxAmount, // Vergi hariç tutar
                          amount: parseFloat(e.target.value), //Vergi dahil tutar
                          taxAmount, //Vergi tutarı
                        },
                      };
                    });
                  }}
                  type="number"
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ProductGroupAmountInput;

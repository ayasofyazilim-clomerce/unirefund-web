"use client";
import type {
  UniRefund_CRMService_Merchants_MerchantDetailDto as MerchantDetailDto,
  PagedResultDto_MerchantProfileDto as MerchantPagedListDto,
  UniRefund_CRMService_Merchants_MerchantProfileDto as MerchantProfileDto,
} from "@ayasofyazilim/saas/CRMService";

import AutoForm, {createReadonlyFieldConfig} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import {createZodObject} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import {$UniRefund_CRMService_Organizations_OrganizationDto as OrganizationSchema} from "@ayasofyazilim/saas/CRMService";
import {Label} from "@repo/ayasofyazilim-ui/atoms/label";
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from "@repo/ayasofyazilim-ui/atoms/select";
import {cn} from "../utils";
export default function SelectMerchant({
  merchantDetails,
  merchantList,
  handleMerchantChange,
  placeholder,
  label = "Merchant",
}: {
  merchantDetails: MerchantDetailDto | undefined;
  merchantList: MerchantPagedListDto | undefined;
  handleMerchantChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}) {
  const organizationIncludes = ["taxpayerId", "legalStatusCode", "customerNumber"];
  return (
    <div
      className={
        merchantList ? "pointer-events-auto space-y-4 opacity-100" : "pointer-events-none cursor-not-allowed opacity-50"
      }>
      <div>
        <Label>{label}</Label>
        <Select onValueChange={handleMerchantChange}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {merchantList?.items?.map((merchant: MerchantProfileDto) => {
              return (
                <SelectItem key={merchant.id} value={merchant.id || ""}>
                  {merchant.name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      <AutoForm
        className={cn(
          merchantDetails
            ? "pointer-events-auto space-y-4 opacity-100"
            : "pointer-events-none cursor-not-allowed opacity-50",
        )}
        fieldConfig={{
          ...createReadonlyFieldConfig(organizationIncludes),
          customerNumber: {
            containerClassName: "col-span-2",
            inputProps: {
              disabled: true,
            },
          },
        }}
        formSchema={createZodObject(OrganizationSchema, organizationIncludes)}
        values={merchantDetails?.merchant?.entityInformations?.[0].organizations?.[0]}
      />
    </div>
  );
}

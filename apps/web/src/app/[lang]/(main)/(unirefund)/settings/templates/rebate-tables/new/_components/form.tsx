"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, useFieldArray, useForm } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Switch } from "@/components/ui/switch";
import { Combobox } from "@repo/ayasofyazilim-ui/molecules/combobox";

import { Label } from "@/components/ui/label";
import type { ContractServiceResource } from "@/language-data/unirefund/ContractService";
import { getBaseLink } from "@/utils";
import { getRebateTableHeadersByIdApi } from "@repo/actions/unirefund/ContractService/action";
import { postRebateTableHeadersApi } from "@repo/actions/unirefund/ContractService/post-actions";
import { zodResolver } from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import { ActionList } from "@repo/ayasofyazilim-ui/molecules/action-button";
import type {
  UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderListDto as RebateTableHeaderListDto
} from "@repo/saas/ContractService";
import type { UniRefund_CRMService_Merchants_MerchantListResponseDto as MerchantProfileDto } from "@repo/saas/CRMService";
import { handlePostResponse } from "@repo/utils/api";
import { Asterisk, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { z } from "zod";
import { createRebateTableFormSchemas } from "../../_components/schema";

type RefundMethod = 'Cash' | 'CreditCard' | 'BankTransfer' | 'Wallet' | 'CashViaPartner' | 'All';
const refundMethod: RefundMethod[] = ['Cash', 'CreditCard', 'BankTransfer', 'Wallet', 'CashViaPartner', 'All'];


export default function RebateTableHeaderCreateForm({
  languageData,
  merchants,
  rebateTables,
}: {
  languageData: ContractServiceResource;
  merchants: MerchantProfileDto[];
  rebateTables: RebateTableHeaderListDto[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { createFormSchema } = createRebateTableFormSchemas({ languageData })

  const form = useForm<z.infer<typeof createFormSchema>>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      name: "Default",
      rebateTableDetails: [],
    },
  });

  const rebateTableFieldArray = useFieldArray({
    control: form.control,
    name: "rebateTableDetails",
  });
  const processingFeeFieldArray = useFieldArray({
    control: form.control,
    name: "processingFeeDetails",
  });
  const rebateTableDetailValues = form.watch("rebateTableDetails") ?? [];
  const hasAll = rebateTableDetailValues.some(row => row.refundMethod === "All");
  const isTemplate = form.watch("isTemplate")

  function handleRebateTableAddRow() {
    if (hasAll) {
      toast.error(languageData["RebateTable.Form.rebateTableDetails.cannotAddRowWhenAllRefundMethodSelected"]);
      return;
    }
    const availableOptions = getRefundMethodOptions(rebateTableFieldArray.fields.length);
    const firstAvailable = availableOptions.find(opt => !opt.disabled);

    if (!firstAvailable) {
      toast.error(languageData["RebateTable.Form.rebateTableDetails.allRefundMethodsAlreadyUsed"]);
      return;
    }

    rebateTableFieldArray.append({
      fixedFeeValue: 0,
      percentFeeValue: 0,
      refundMethod: firstAvailable.value,
      variableFee: "PercentOfGC"
    });
  }
  function handleProcessingFeeAddRow() {
    processingFeeFieldArray.append({
      name: languageData["RebateTable.Form.processingFeeDetails.name.default"],
      amount: 0,
    });
  }
  function getRefundMethodOptions(rowIndex: number) {
    const rowIsAll = rebateTableDetailValues[rowIndex]?.refundMethod === "All";
    const selectedMethods = rebateTableDetailValues.map(row => row.refundMethod);

    return refundMethod.map(method => {
      const isSelectedInAnotherRow =
        selectedMethods.includes(method) &&
        rebateTableDetailValues[rowIndex]?.refundMethod !== method;

      return {
        value: method,
        disabled:
          (method === "All" && (!rowIsAll && rebateTableDetailValues.length > 1)) ||
          (method !== "All" && isSelectedInAnotherRow),
      };
    });
  }

  function onSubmit(values: z.infer<typeof createFormSchema>) {
    startTransition(() => {
      void postRebateTableHeadersApi({ requestBody: values }).then((response) => {
        handlePostResponse(response, router, {
          prefix: getBaseLink("/settings/templates/rebate-tables"),
          identifier: "id",
        });
      });
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-12 grid-flow-dense h-full overflow-hidden gap-4">
        <div className="col-span-3 p-px flex flex-col h-full overflow-hidden gap-4">
          <div className="space-y-4 h-max">
            <ActionList className="mx-auto w-full rounded-none border-0 border-b p-0 pb-4">
              <Combobox<RebateTableHeaderListDto>
                classNames={{ container: "w-full " }}
                emptyValue={languageData["Select.EmptyValue"]}
                label={languageData["Contracts.FillFrom"]}
                list={rebateTables}
                onValueChange={(rebateTable: RebateTableHeaderListDto | null | undefined) => {
                  if (!rebateTable) return;
                  startTransition(() => {
                    void getRebateTableHeadersByIdApi(rebateTable.id).then((response) => {
                      if (response.type === "success") {
                        form.reset(response.data)
                      } else {
                        toast.error(response.message);
                      }
                    });
                  });
                }}
                disabled={isPending}
                searchPlaceholder={languageData["Select.Placeholder"]}
                searchResultLabel={languageData["Select.ResultLabel"]}
                selectIdentifier="id"
                selectLabel="name"
              />
            </ActionList>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>{languageData["RebateTable.Form.name"]}<Asterisk className="size-3 inline-flex mb-2 text-destructive" /></FormLabel>
                  <FormControl>
                    <Input disabled={isPending} placeholder={languageData["RebateTable.Form.name.default"]} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="calculateNetCommissionInsteadOfRefund"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>{languageData["RebateTable.Form.calculateNetCommissionInsteadOfRefund"]}</FormLabel>
                    <FormDescription>{languageData["RebateTable.Form.calculateNetCommissionInsteadOfRefund.description"]}</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      disabled={isPending}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isTemplate"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>{languageData["RebateTable.Form.isTemplate"]}</FormLabel>
                    <FormDescription>{languageData["RebateTable.Form.isTemplate.description"]}</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      disabled={isPending}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {!isTemplate && <FormField
              control={form.control}
              name="merchantId"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>{languageData["RebateTable.Form.merchantId"]}</FormLabel>
                  <FormControl>
                    <Combobox<MerchantProfileDto>
                      aria-describedby="merchants-help"
                      disabled={isPending}
                      id="merchants-combobox"
                      list={merchants}
                      emptyValue={languageData["Select.EmptyValue"]}
                      searchPlaceholder={languageData["Select.Placeholder"]}
                      searchResultLabel={languageData["Select.ResultLabel"]}
                      onValueChange={(val) => {
                        field.onChange(val?.id || "")
                      }}
                      selectIdentifier="id"
                      selectLabel="name"
                      value={merchants.find((mr) => mr.id === field.value || "")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />}
          </div>
          <div className="h-full overflow-auto">
            <div className="flex items-end justify-between sticky top-0 bg-white pb-4 z-10">
              <Label>{languageData["RebateTable.Form.processingFeeDetails"]}</Label>
              <Button
                disabled={isPending}
                type="button"
                variant="outline"
                onClick={handleProcessingFeeAddRow}
              >
                {languageData["Table.Add"]}
              </Button>
            </div>
            <div className="flex rounded-md bg-border border flex-col gap-px [&>div:last-child>div:first-child>input]:rounded-bl-md [&>div:last-child>:last-child]:rounded-br-md [&>div:last-child>:first-child]:rounded-bl-md group">
              <div className="flex gap-px overflow-hidden rounded-t-md">
                <span className="bg-white px-3 h-9 text-sm font-medium w-full flex items-center">{languageData["RebateTable.Form.processingFeeDetails.name"]}</span>
                <span className="bg-white px-3 h-9 text-sm font-medium w-full flex items-center">{languageData["RebateTable.Form.processingFeeDetails.amount"]}</span>
                <span className="ring ring-white h-9 min-w-10 bg-white rounded-md"></span>
              </div>
              {processingFeeFieldArray.fields.map((field, index) => (
                <div key={field.id} className="flex gap-px bg-border row-item">
                  <FormField
                    control={form.control}
                    name={`processingFeeDetails.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <Input disabled={isPending} type="text" className="bg-white border-0 rounded-none shadow-none" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`processingFeeDetails.${index}.amount`}
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <Input disabled={isPending} type="number" step="any" className="bg-white border-0 rounded-none shadow-none" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    disabled={isPending}
                    variant="outline"
                    className="bg-white border-0 rounded-none shadow-none px-3"
                    onClick={() => processingFeeFieldArray.remove(index)}
                  >
                    <Trash2 className="w-4 min-w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="border-l col-span-9 pl-4 pt-2 h-full overflow-hidden flex flex-col gap-4">
          <div className="flex flex-col h-full overflow-auto">
            <div className="flex items-end justify-between sticky top-0 bg-white pb-4 z-10">
              <Label>{languageData["RebateTable.Form.rebateTableDetails"]}</Label>
              <Button
                type="button"
                variant="outline"
                onClick={handleRebateTableAddRow}
                disabled={isPending || hasAll}
              >
                {languageData["Table.Add"]}
              </Button>
            </div>
            <div className="flex rounded-md bg-border border flex-col gap-px [&>div:last-child>div:first-child>input]:rounded-bl-md [&>div:last-child>:last-child]:rounded-br-md [&>div:last-child>:first-child]:rounded-bl-md group">
              <div className="flex gap-px overflow-hidden rounded-t-md">
                <span className="bg-white px-3 h-9 text-sm font-medium min-w-52 flex items-center">{languageData["RebateTable.Form.rebateTableDetails.fixedFeeValue"]}</span>
                <span className="bg-white px-3 h-9 text-sm font-medium min-w-52 flex items-center">{languageData["RebateTable.Form.rebateTableDetails.percentFeeValue"]}</span>
                <span className="bg-white px-3 h-9 text-sm font-medium w-full max-w-60 flex items-center">{languageData["RebateTable.Form.rebateTableDetails.refundMethod"]}</span>
                <span className="bg-white px-3 h-9 text-sm font-medium w-full flex items-center">{languageData["RebateTable.Form.rebateTableDetails.variableFee"]}</span>
              </div>
              {rebateTableFieldArray.fields.map((field, index) => (
                <div key={field.id} className="flex gap-px bg-border row-item">
                  <FormField
                    control={form.control}
                    name={`rebateTableDetails.${index}.fixedFeeValue`}
                    render={({ field }) => (
                      <FormItem className="space-y-0 min-w-52">
                        <FormControl>
                          <Input disabled={isPending} type="number" step="any" className="bg-white border-0 rounded-none shadow-none" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`rebateTableDetails.${index}.percentFeeValue`}
                    render={({ field }) => (
                      <FormItem className="space-y-0 min-w-52">
                        <FormControl>
                          <Input disabled={isPending} type="number" step="any" className="bg-white border-0 rounded-none shadow-none" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`rebateTableDetails.${index}.refundMethod`}
                    render={({ field }) => (
                      <FormItem className="space-y-0 w-full max-w-60">
                        <FormControl>
                          <Select
                            disabled={isPending}
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="bg-white border-0 rounded-none shadow-none">
                              <SelectValue placeholder="Select Refund Method" />
                            </SelectTrigger>
                            <SelectContent>
                              {
                                getRefundMethodOptions(index).map(({ value, disabled }) =>
                                  <SelectItem key={value} value={value} disabled={disabled}>{languageData[`RebateTable.Form.rebateTableDetails.refundMethod.${value}` as keyof ContractServiceResource]}</SelectItem>
                                )
                              }
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`rebateTableDetails.${index}.variableFee`}
                    render={({ field }) => (
                      <FormItem className="space-y-0 w-full">
                        <FormControl>
                          <Select
                            disabled={isPending}
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="bg-white border-0 rounded-none shadow-none">
                              <SelectValue placeholder="Select Variable Fee" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PercentOfGC">{languageData["RebateTable.Form.rebateTableDetails.variableFee.PercentOfGC"]}</SelectItem>
                              <SelectItem value="PercentOfGcWithoutVAT">{languageData["RebateTable.Form.rebateTableDetails.variableFee.PercentOfGcWithoutVAT"]}</SelectItem>
                              <SelectItem value="PercentOfVAT">{languageData["RebateTable.Form.rebateTableDetails.variableFee.PercentOfSIS"]}</SelectItem>
                              <SelectItem value="PercentOfSIS">{languageData["RebateTable.Form.rebateTableDetails.variableFee.PercentOfVAT"]}</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    disabled={isPending}
                    variant="outline"
                    className="bg-white border-0 rounded-none shadow-none px-3"
                    onClick={() => rebateTableFieldArray.remove(index)}
                  >
                    <Trash2 className="w-4 min-w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <Button disabled={isPending} className="max-w-lg mx-auto w-full"> {languageData.Save}</Button>
        </div>
      </form>
    </Form>
  );
}
"use client";

import {Button} from "@/components/ui/button";
import type {UseFormReturn} from "@/components/ui/form";
import {FormControl, FormField, FormItem, FormMessage, useFieldArray} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {toast} from "@/components/ui/sonner";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Plus, Trash2} from "lucide-react";
import type {z} from "zod";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";
import {createRebateTableFormSchemas} from "./schema";

const {createFormSchema} = createRebateTableFormSchemas({});
type RefundMethod = "Cash" | "CreditCard" | "BankTransfer" | "Wallet" | "CashViaPartner" | "All";
const refundMethod: RefundMethod[] = ["Cash", "CreditCard", "BankTransfer", "Wallet", "CashViaPartner", "All"];

export function RebateTableDetailsTable({
  languageData,
  form,
  isPending,
}: {
  languageData: ContractServiceResource;
  form: UseFormReturn<z.infer<typeof createFormSchema>>;
  isPending: boolean;
}) {
  const rebateTableFieldArray = useFieldArray({
    control: form.control,
    name: "rebateTableDetails",
  });
  const rebateTableDetailValues = form.watch("rebateTableDetails") ?? [];
  const hasAll = rebateTableDetailValues.some((row) => row.refundMethod === "All");

  function handleRebateTableAddRow() {
    if (hasAll) {
      toast.error(languageData["RebateTable.Form.rebateTableDetails.cannotAddRowWhenAllRefundMethodSelected"]);
      return;
    }
    const availableOptions = getRefundMethodOptions(rebateTableFieldArray.fields.length);
    const firstAvailable = availableOptions.find((opt) => !opt.disabled);

    if (!firstAvailable) {
      toast.error(languageData["RebateTable.Form.rebateTableDetails.allRefundMethodsAlreadyUsed"]);
      return;
    }

    rebateTableFieldArray.append({
      fixedFeeValue: 0,
      percentFeeValue: 0,
      refundMethod: firstAvailable.value,
      variableFee: "PercentOfGC",
    });
  }
  function getRefundMethodOptions(rowIndex: number) {
    const rowIsAll = rebateTableDetailValues[rowIndex]?.refundMethod === "All";
    const selectedMethods = rebateTableDetailValues.map((row) => row.refundMethod);

    return refundMethod.map((method) => {
      const isSelectedInAnotherRow =
        selectedMethods.includes(method) && rebateTableDetailValues[rowIndex]?.refundMethod !== method;

      return {
        value: method,
        disabled:
          (method === "All" && !rowIsAll && rebateTableDetailValues.length > 1) ||
          (method !== "All" && isSelectedInAnotherRow),
      };
    });
  }
  return (
    <div className="flex h-full flex-col overflow-auto">
      <div className="sticky top-0 z-10 flex items-end justify-between bg-white pb-4">
        <Label data-testid="rebateTable.rebateTableDetails.label">
          {languageData["RebateTable.Form.rebateTableDetails"]}
        </Label>
        <Button
          data-testid="rebateTable.rebateTableDetails.addRowButton"
          disabled={isPending || hasAll}
          onClick={handleRebateTableAddRow}
          size="sm"
          type="button"
          variant="outline">
          <Plus className="mr-1 h-4 w-4" />
          {languageData["Table.Add"]}
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="divide-x [&_*]:text-black">
              <TableHead className="min-w-52">
                {languageData["RebateTable.Form.rebateTableDetails.fixedFeeValue"]}
              </TableHead>
              <TableHead className="min-w-52">
                {languageData["RebateTable.Form.rebateTableDetails.percentFeeValue"]}
              </TableHead>
              <TableHead className="w-full max-w-60">
                {languageData["RebateTable.Form.rebateTableDetails.refundMethod"]}
              </TableHead>
              <TableHead className="w-full min-w-52">
                {languageData["RebateTable.Form.rebateTableDetails.variableFee"]}
              </TableHead>
              <TableHead className="w-9 border-none" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rebateTableFieldArray.fields.length > 0 ? (
              rebateTableFieldArray.fields.map((arrayField, index) => (
                <TableRow className="divide-x" key={arrayField.id}>
                  <TableCell className="p-px">
                    <FormField
                      control={form.control}
                      name={`rebateTableDetails.${index}.fixedFeeValue`}
                      render={({field}) => (
                        <FormItem className="space-y-0">
                          <FormControl>
                            <Input
                              className="rounded-none border-0 shadow-none"
                              data-testid={`rebateTableDetails.${index}.fixedFeeValue`}
                              disabled={isPending}
                              min={0}
                              step="any"
                              type="number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell className="p-px">
                    <FormField
                      control={form.control}
                      name={`rebateTableDetails.${index}.percentFeeValue`}
                      render={({field}) => (
                        <FormItem className="space-y-0">
                          <FormControl>
                            <Input
                              className="rounded-none border-0 shadow-none"
                              data-testid={`rebateTableDetails.${index}.percentFeeValue`}
                              disabled={isPending}
                              min={0}
                              step="any"
                              type="number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell className="p-px">
                    <FormField
                      control={form.control}
                      name={`rebateTableDetails.${index}.refundMethod`}
                      render={({field}) => (
                        <FormItem className="space-y-0">
                          <FormControl>
                            <Select disabled={isPending} onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger
                                className="rounded-none border-0 shadow-none"
                                data-testid={`rebateTableDetails.${index}.refundMethod`}>
                                <SelectValue placeholder="Select Refund Method" />
                              </SelectTrigger>
                              <SelectContent>
                                {getRefundMethodOptions(index).map(({value, disabled}) => (
                                  <SelectItem disabled={disabled} key={value} value={value}>
                                    {
                                      languageData[
                                        `RebateTable.Form.rebateTableDetails.refundMethod.${value}` as keyof ContractServiceResource
                                      ]
                                    }
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell className="p-px">
                    <FormField
                      control={form.control}
                      name={`rebateTableDetails.${index}.variableFee`}
                      render={({field}) => (
                        <FormItem className="space-y-0">
                          <FormControl>
                            <Select disabled={isPending} onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger
                                className="rounded-none border-0 shadow-none"
                                data-testid={`rebateTableDetails.${index}.variableFee`}>
                                <SelectValue placeholder="Select Variable Fee" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PercentOfGC">
                                  {languageData["RebateTable.Form.rebateTableDetails.variableFee.PercentOfGC"]}
                                </SelectItem>
                                <SelectItem value="PercentOfGcWithoutVAT">
                                  {
                                    languageData[
                                      "RebateTable.Form.rebateTableDetails.variableFee.PercentOfGcWithoutVAT"
                                    ]
                                  }
                                </SelectItem>
                                <SelectItem value="PercentOfVAT">
                                  {languageData["RebateTable.Form.rebateTableDetails.variableFee.PercentOfSIS"]}
                                </SelectItem>
                                <SelectItem value="PercentOfSIS">
                                  {languageData["RebateTable.Form.rebateTableDetails.variableFee.PercentOfVAT"]}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell className="p-px">
                    <Button
                      className="size-full h-9 rounded-none"
                      data-testid={`rebateTableDetails.removeRow.${index}`}
                      disabled={isPending}
                      onClick={() => {
                        rebateTableFieldArray.remove(index);
                      }}
                      size="sm"
                      type="button"
                      variant="ghost">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="text-muted-foreground text-center" colSpan={4}>
                  No rebate table details added
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

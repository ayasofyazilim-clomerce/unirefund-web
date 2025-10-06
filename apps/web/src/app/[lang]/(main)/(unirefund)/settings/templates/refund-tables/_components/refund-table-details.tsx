"use client";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import type {UseFormReturn} from "@/components/ui/form";
import {FormControl, FormField, FormItem, useFieldArray} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {cn} from "@/lib/utils";
import type {z} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import {ChevronLeft, ChevronRight, Equal, Plus, Trash2} from "lucide-react";
import React from "react";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";
import {createRefundTableFormSchemas} from "./schema";

const {createFormSchema} = createRefundTableFormSchemas({});

export function RefundTableDetailsTable({
  languageData,
  form,
  isPending,
}: {
  languageData: ContractServiceResource;
  form: UseFormReturn<z.infer<typeof createFormSchema>>;
  isPending: boolean;
}) {
  const {fields, append, remove} = useFieldArray({
    control: form.control,
    name: "refundTableDetails",
  });
  const watchedDetails = form.watch("refundTableDetails") || [];

  // Get form errors for each row
  const getRowErrors = (index: number) => {
    const errors = form.formState.errors.refundTableDetails?.[index];
    if (!errors) return null;

    // Return all error messages for this row
    const errorMessages = Object.values(errors)
      .filter(Boolean)
      .map((error) => {
        if (typeof error === "string") return error;
        if (typeof error === "object" && "message" in error) return error.message;
        return "Unknown error";
      })
      .filter(Boolean);

    return errorMessages.length > 0 ? errorMessages : null;
  };

  const addRow = () => {
    const lastRow = watchedDetails.at(-1);
    if (lastRow)
      append({
        minValue: lastRow.maxValue,
        maxValue: lastRow.maxValue + 100,
        vatRate: 0,
        refundAmount: 0,
        refundPercent: 0,
        isLoyalty: false,
      });
    else
      append({
        minValue: 0,
        maxValue: 100,
        vatRate: 0,
        refundAmount: 0,
        refundPercent: 0,
        isLoyalty: false,
      });
  };

  const removeRow = (index: number) => {
    remove(index);
  };

  return (
    <div className="flex h-full flex-col overflow-auto">
      <div className="sticky top-0 z-10 flex items-end justify-between bg-white pb-4">
        <Label data-testid="refundTable.refundTableDetails.label">
          {languageData["RefundTable.Form.refundTableDetails"]}
        </Label>
        <Button
          data-testid="refundTable.refundTableDetails.addRowButton"
          disabled={isPending}
          onClick={addRow}
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
            <TableRow className="divide-x">
              <TableHead className="text-black">
                <div className="flex items-center gap-2">
                  {languageData["RefundTable.Form.refundTableDetails.minValue"]}
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge className="text-muted-foreground h-6 w-6 p-0" variant="outline">
                        <ChevronRight className="mx-auto size-3" />
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      {languageData["RefundTable.Form.refundTableDetails.minValue.tooltip"]}
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TableHead>
              <TableHead className="text-black">
                <div className="flex items-center gap-2">
                  {languageData["RefundTable.Form.refundTableDetails.maxValue"]}
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge className="text-muted-foreground size-6 p-0" variant="outline">
                        <div className="flex">
                          <ChevronLeft className="size-3" />
                          <Equal className="-ml-1 size-3" />
                        </div>
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      {languageData["RefundTable.Form.refundTableDetails.maxValue.tooltip"]}
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TableHead>
              <TableHead className="text-black">
                {languageData["RefundTable.Form.refundTableDetails.vatRate"]}
              </TableHead>
              <TableHead className="text-black">
                {languageData["RefundTable.Form.refundTableDetails.refundAmount"]}
              </TableHead>
              <TableHead className="text-black">
                {languageData["RefundTable.Form.refundTableDetails.refundPercent"]}
              </TableHead>
              <TableHead className="w-40 text-black">
                {languageData["RefundTable.Form.refundTableDetails.isLoyalty"]}
              </TableHead>
              <TableHead className="w-[50px] border-none" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((row, index) => {
              const rowErrors = getRowErrors(index);
              const hasErrors = rowErrors && rowErrors.length > 0;

              return (
                <React.Fragment key={row.id}>
                  <TableRow
                    className={cn("h-9 divide-x", hasErrors && "[&_*]:!text-destructive bg-red-50 [&_*]:!font-bold")}>
                    <TableCell className="p-0">
                      <FormField
                        control={form.control}
                        name={`refundTableDetails.${index}.minValue`}
                        render={({field}) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                className="border-0 shadow-none focus-visible:ring-0"
                                data-testid={`refundTableDetails.${index}.minValue`}
                                step="1"
                                type="number"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(parseFloat(e.target.value) || 0);
                                }}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className="p-0">
                      <FormField
                        control={form.control}
                        name={`refundTableDetails.${index}.maxValue`}
                        render={({field}) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                className="border-0 shadow-none focus-visible:ring-0"
                                data-testid={`refundTableDetails.${index}.maxValue`}
                                step="1"
                                type="number"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(parseFloat(e.target.value) || 0);
                                }}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className="p-0">
                      <FormField
                        control={form.control}
                        name={`refundTableDetails.${index}.vatRate`}
                        render={({field}) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                className="border-0 shadow-none focus-visible:ring-0"
                                data-testid={`refundTableDetails.${index}.vatRate`}
                                disabled={isPending}
                                step="1"
                                type="number"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(parseFloat(e.target.value) || 0);
                                }}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className="p-0">
                      <FormField
                        control={form.control}
                        name={`refundTableDetails.${index}.refundAmount`}
                        render={({field}) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                className="border-0 shadow-none focus-visible:ring-0"
                                data-testid={`refundTableDetails.${index}.refundAmount`}
                                step="1"
                                type="number"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(parseFloat(e.target.value) || 0);
                                }}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className="p-0">
                      <FormField
                        control={form.control}
                        name={`refundTableDetails.${index}.refundPercent`}
                        render={({field}) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                className="border-0 shadow-none focus-visible:ring-0"
                                data-testid={`refundTableDetails.${index}.refundPercent`}
                                step="1"
                                type="number"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(parseFloat(e.target.value) || 0);
                                }}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className="p-0">
                      <FormField
                        control={form.control}
                        name={`refundTableDetails.${index}.isLoyalty`}
                        render={({field}) => (
                          <FormItem className="flex size-full h-9 items-center justify-center">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                data-testid={`refund-table-details-is-loyalty-${index}`}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className="p-0">
                      <div className="flex size-full items-center justify-center">
                        <Button
                          className="w-full rounded-none"
                          data-testid={`refundTableDetails.removeRow.${index}`}
                          disabled={isPending}
                          onClick={() => {
                            removeRow(index);
                          }}
                          type="button"
                          variant="ghost">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {hasErrors ? (
                    <TableRow>
                      <TableCell className="text-destructive bg-red-50 p-2 text-xs" colSpan={7}>
                        {rowErrors.join(". ")}
                      </TableCell>
                    </TableRow>
                  ) : null}
                </React.Fragment>
              );
            })}
            {fields.length === 0 && (
              <TableRow>
                <TableCell className="text-muted-foreground text-center" colSpan={7}>
                  {languageData["RefundTable.Form.refundTableDetails.noRecord"]}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

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
import {replacePlaceholders} from "@repo/ayasofyazilim-ui/lib/replace-placeholders";
import {ChevronLeft, ChevronRight, Equal, Plus, Trash2} from "lucide-react";
import React from "react";
import type {z} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
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
  const {refundTableDetailSchema} = createRefundTableFormSchemas({languageData});
  const {fields, append, remove} = useFieldArray({
    control: form.control,
    name: "refundTableDetails",
  });
  const watchedDetails = form.watch("refundTableDetails") || [];

  const validateRow = (
    // index: number,
    currentRow: z.infer<typeof refundTableDetailSchema>,
    allRows: z.infer<typeof refundTableDetailSchema>[],
  ): React.ReactNode | JSX.Element | null => {
    if (currentRow.maxValue <= currentRow.minValue) {
      return languageData["RefundTable.Form.refundTableDetails.maxValueMustBeGreaterThanMinValue"];
    }
    const sorted = [...allRows].sort((a, b) => a.minValue - b.minValue);
    const currentIndex = sorted.findIndex(
      (row) => row.minValue === currentRow.minValue && row.maxValue === currentRow.maxValue,
    );

    if (currentIndex === 0 && currentRow.minValue !== 0) {
      return languageData["RefundTable.Form.refundTableDetails.firstRowMustStartFromZero"];
    }

    if (currentIndex > 0) {
      const previousRow = sorted[currentIndex - 1];
      if (currentRow.minValue !== previousRow.maxValue) {
        return replacePlaceholders(
          languageData["RefundTable.Form.refundTableDetails.minValueMustBe{0}toContinueFromPreviousRow"],
          [
            {
              holder: "{0}",
              replacement: previousRow.maxValue,
            },
          ],
        );
      }
    }

    // if (currentIndex < sorted.length - 1) {
    //   const nextRow = sorted[currentIndex + 1];
    //   if (nextRow.minValue !== currentRow.maxValue) {
    //     return replacePlaceholders(languageData["RefundTable.Form.refundTableDetails.maxValueShouldBe{0}toConnectWithNextRow"], [{
    //       holder: "{0}",
    //       replacement: nextRow.minValue
    //     }])
    //   }
    // }

    // for (let i = 0; i < allRows.length; i++) {
    //   if (i === index) continue;
    //   const otherRow = allRows[i];
    //   if (currentRow.minValue < otherRow.maxValue && currentRow.maxValue > otherRow.minValue) {
    //     return replacePlaceholders(languageData["RefundTable.Form.refundTableDetails.rangeConflictsWithAnotherRow{0}-{1}"], [{
    //       holder: "{0}",
    //       replacement: otherRow.minValue
    //     },
    //     {
    //       holder: "{1}",
    //       replacement: otherRow.maxValue
    //     }])
    //   }
    // }

    return null;
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
                {languageData["RefundTable.Form.refundTableDetails.refundAmount"]}
              </TableHead>
              <TableHead className="w-40 text-black">
                {languageData["RefundTable.Form.refundTableDetails.isLoyalty"]}
              </TableHead>
              <TableHead className="w-[50px] border-none" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((row, index) => {
              const rowError = validateRow(watchedDetails[index], watchedDetails);

              return (
                <React.Fragment key={row.id}>
                  <TableRow
                    className={cn(
                      "h-9 divide-x",
                      rowError !== null && "[&_*]:!text-destructive bg-red-50 [&_*]:!font-bold",
                    )}>
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
                                step="0.01"
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
                                step="0.01"
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
                                step="0.01"
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
                                step="0.01"
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
                                step="0.01"
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
                  {rowError ? (
                    <TableRow>
                      <TableCell className="text-destructive bg-red-50 p-2 text-xs" colSpan={7}>
                        {rowError}
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

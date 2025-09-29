"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFieldArray,
  useForm,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { postRefundTableHeadersApi } from "@repo/actions/unirefund/ContractService/post-actions";
import type { z } from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import { zodResolver } from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import { Combobox } from "@repo/ayasofyazilim-ui/molecules/combobox";
import type { UniRefund_CRMService_Merchants_MerchantListResponseDto as MerchantProfileDto } from "@repo/saas/CRMService";
import { handlePostResponse } from "@repo/utils/api";
import { Asterisk, ChevronLeft, ChevronRight, Equal, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { replacePlaceholders } from "@repo/ayasofyazilim-ui/lib/replace-placeholders";
import { getBaseLink } from "@/utils";
import type { ContractServiceResource } from "@/language-data/unirefund/ContractService";
import { createRefundTableFormSchemas } from "../../_components/schema";

export default function RefundTableForm({
  languageData,
  merchants,
}: {
  languageData: ContractServiceResource;
  merchants: MerchantProfileDto[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { createFormSchema, refundTableDetailSchema } = createRefundTableFormSchemas();

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

  const form = useForm<z.infer<typeof createFormSchema>>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      name: "",
      isDefault: false,
      isBundling: false,
      isTemplate: false,
      merchantId: null,
      refundTableDetails: [],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "refundTableDetails",
  });

  const watchedRows = form.watch("refundTableDetails") || [];

  const addRow = () => {
    const lastRow = watchedRows.at(-1);
    const nextMinValue = lastRow?.maxValue || 0;

    append({
      minValue: nextMinValue,
      maxValue: nextMinValue + 1,
      vatRate: 0,
      refundAmount: 0,
      refundPercent: 0,
      isLoyalty: false,
    });
  };

  const removeRow = (index: number) => {
    remove(index);
  };
  const isTemplate = form.watch("isTemplate");

  function onSubmit(values: z.infer<typeof createFormSchema>) {
    startTransition(() => {
      void postRefundTableHeadersApi({ requestBody: values }).then((response) => {
        handlePostResponse(response, router, {
          prefix: getBaseLink("/settings/templates/refund-tables"),
          identifier: "id",
        });
      });
    });
  }

  return (
    <Form {...form}>
      <form
        className="grid h-full grid-flow-dense grid-cols-12 gap-4 overflow-hidden"
        data-testid="refund-table-create-form"
        onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}>
        <div className="col-span-3 flex h-full flex-col gap-4 overflow-hidden p-px">
          <div className="h-max space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <FormLabel>
                    {languageData["RefundTable.Form.name"]}
                    <Asterisk className="text-destructive mb-2 inline-flex size-3" />
                  </FormLabel>
                  <FormControl>
                    <Input data-testid="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>{languageData["RefundTable.Form.isDefault"]}</FormLabel>
                    <FormDescription>{languageData["RefundTable.Form.isDefault.description"]}</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} data-testid="isDefault" onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isBundling"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>{languageData["RefundTable.Form.isBundling"]}</FormLabel>
                    <FormDescription>{languageData["RefundTable.Form.isBundling.description"]}</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} data-testid="isBundling" onCheckedChange={field.onChange} />
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
                    <FormLabel>{languageData["RefundTable.Form.isTemplate"]}</FormLabel>
                    <FormDescription>{languageData["RefundTable.Form.isTemplate.description"]}</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} data-testid="isTemplate" onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            {!isTemplate && (
              <FormField
                control={form.control}
                name="merchantId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{languageData["RefundTable.Form.merchantId"]}</FormLabel>
                    <FormControl>
                      <Combobox<MerchantProfileDto>
                        aria-describedby="merchants-help"
                        data-testid="merchants-combobox"
                        disabled={isPending}
                        emptyValue={languageData["Select.EmptyValue"]}
                        id="merchants-combobox"
                        list={merchants}
                        onValueChange={(val) => {
                          field.onChange(val?.id || "");
                        }}
                        searchPlaceholder={languageData["Select.Placeholder"]}
                        searchResultLabel={languageData["Select.ResultLabel"]}
                        selectIdentifier="id"
                        selectLabel="name"
                        value={merchants.find((mr) => mr.id === field.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>
        <div className="col-span-9 flex h-full flex-col gap-4 overflow-hidden border-l pl-4 pt-2">
          <div className="flex h-full flex-col overflow-auto">
            <div className="sticky top-0 z-10 flex items-end justify-between bg-white pb-4">
              <Label data-testid="refundTable.refundTableDetails.label">
                {languageData["RefundTable.Form.refundTableDetails"]}
              </Label>
              <Button
                data-testid="refundTable.refundTableDetails.addRowButton"
                disabled={isPending}
                onClick={addRow}
                type="button"
                variant="outline">
                {languageData["Table.Add"]}
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
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
                    <TableHead>
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
                    <TableHead>{languageData["RefundTable.Form.refundTableDetails.vatRate"]}</TableHead>
                    <TableHead>{languageData["RefundTable.Form.refundTableDetails.refundAmount"]}</TableHead>
                    <TableHead>{languageData["RefundTable.Form.refundTableDetails.refundAmount"]}</TableHead>
                    <TableHead>{languageData["RefundTable.Form.refundTableDetails.isLoyalty"]}</TableHead>
                    <TableHead className="w-[50px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((row, index) => {
                    const rowError = validateRow(watchedRows[index], watchedRows);

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
                              render={({ field }) => (
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
                              render={({ field }) => (
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
                              render={({ field }) => (
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
                              render={({ field }) => (
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
                              render={({ field }) => (
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
                              render={({ field }) => (
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

          <FormField
            control={form.control}
            name="refundTableDetails"
            render={() => (
              <FormItem>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="mx-auto w-full max-w-lg" data-testid="submit-form-button" disabled={isPending}>
            {languageData.Save}
          </Button>
        </div>
      </form>
    </Form>
  );
}

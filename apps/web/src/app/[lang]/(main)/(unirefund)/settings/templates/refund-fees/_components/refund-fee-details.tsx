import type {UseFormReturn} from "@/components/ui/form";
import {Controller, useFieldArray} from "@/components/ui/form";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {AlertTriangleIcon, ChevronLeft, ChevronRight, Equal, Eye, EyeOff, Plus, Trash2} from "lucide-react";
import {useRef, useState} from "react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {cn} from "@/lib/utils";
import type {z} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";
import {RefundFeeDetailsVisualizer} from "./visualizer";
import {createRefundFeeTableSchemas} from "./schema";

const feeTypes = ["TouristFee", "TouristBonusFee", "AgentFee", "AirportFee", "EarlyRefundFee"] as const;
const refundMethods = ["Cash", "CreditCard", "BankTransfer", "Wallet", "CashViaPartner"] as const;
const {createFormSchema} = createRefundFeeTableSchemas({});

export function RefundFeeDetailsTable({
  languageData,
  form,
  isPending,
}: {
  languageData: ContractServiceResource;
  form: UseFormReturn<z.infer<typeof createFormSchema>>;
  isPending: boolean;
}) {
  const watchedDetails = form.watch("refundFeeDetails");

  const {fields, append, remove} = useFieldArray({
    control: form.control,
    name: "refundFeeDetails",
  });
  const {validateRefundFeeDetails} = createRefundFeeTableSchemas({languageData});

  const [showVisualizer, setShowVisualizer] = useState(true);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const validation = validateRefundFeeDetails(
    watchedDetails?.map((item, originalIndex) => {
      return {...item, originalIndex};
    }) || [],
  );
  const addNewRow = () => {
    const lastRow = watchedDetails?.at(-1);
    if (lastRow)
      append({
        ...lastRow,
        amountFrom: lastRow.amountTo,
        amountTo: lastRow.amountTo + 100,
        fixedFeeValue: 0,
        percentFeeValue: 0,
        minFee: 0,
        maxFee: 10,
      });
    else
      append({
        amountFrom: 0,
        amountTo: 100,
        fixedFeeValue: 0,
        percentFeeValue: 0,
        minFee: 0,
        maxFee: 10,
        feeType: "TouristFee",
        refundMethod: "Cash",
      });
  };
  const getFieldError = (fieldName: string, index: number) => {
    const errors = form.formState.errors;
    if (errors.refundFeeDetails && Array.isArray(errors.refundFeeDetails)) {
      const rowError = errors.refundFeeDetails[index] as Record<string, {message?: string}> | undefined;
      if (rowError && typeof rowError === "object") {
        return rowError[fieldName].message;
      }
    }
    const validationErrors = validation.errors.filter((error) => error.index === index && error.field === fieldName);

    if (validationErrors.length > 0) {
      return validationErrors[0].message;
    }

    return null;
  };
  const handleVisualizerCellClick = (groupKey: string, rangeIndex: number) => {
    const [feeType, refundMethod] = groupKey.split("-");

    const matchingRowIndex = fields.findIndex((field, index) => {
      const rowData = watchedDetails?.[index];
      if (!rowData) return false;

      const groupDetails = watchedDetails.filter((detail) => `${detail.feeType}-${detail.refundMethod}` === groupKey);

      const sortedDetails = groupDetails.sort((a, b) => a.amountFrom - b.amountFrom);
      const targetDetail = sortedDetails[rangeIndex];

      return (
        rowData.feeType === feeType &&
        rowData.refundMethod === refundMethod &&
        rowData.amountFrom === targetDetail.amountFrom &&
        rowData.amountTo === targetDetail.amountTo
      );
    });

    if (matchingRowIndex !== -1) {
      // Focus on the amountFrom input of the matching row
      const inputKey = `refundFeeDetails.${matchingRowIndex}.amountFrom`;
      const inputRef = inputRefs.current[inputKey];
      if (inputRef) {
        inputRef.focus();
        inputRef.scrollIntoView({behavior: "smooth", block: "center"});
      }
    }
  };
  return (
    <div className="flex h-full flex-col overflow-auto">
      <div className="sticky top-0 z-10 flex items-end justify-between bg-white pb-4">
        <Label data-testid="refundTable.refundTableDetails.label">
          {languageData["RefundFeeTable.Form.refundFeeDetails"]}
        </Label>
        <div className="flex gap-2">
          <Button
            data-testid="toggle-visualizer"
            disabled={isPending}
            onClick={() => {
              setShowVisualizer(!showVisualizer);
            }}
            size="sm"
            type="button"
            variant="outline">
            {showVisualizer ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
            {languageData["RefundFeeTable.Form.refundFeeDetails.visualizer"]}
          </Button>
          <Button
            data-testid="refundTable.refundTableDetails.addRowButton"
            disabled={isPending}
            onClick={addNewRow}
            size="sm"
            type="button"
            variant="outline">
            <Plus className="mr-1 h-4 w-4" />
            {languageData["Table.Add"]}
          </Button>
        </div>
      </div>
      <div className="mb-4 rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="divide-x [&>th]:text-black">
              <TableHead className="min-w-max text-nowrap">
                <div className="flex items-center gap-2">
                  {languageData["RefundFeeTable.Form.refundFeeDetails.amountFrom"]}
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge className="text-muted-foreground h-6 w-6 p-0" variant="outline">
                        <ChevronRight className="mx-auto size-3" />
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      {languageData["RefundFeeTable.Form.refundFeeDetails.amountFrom.tooltip"]}
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TableHead>
              <TableHead className="min-w-max text-nowrap">
                <div className="flex items-center gap-2">
                  {languageData["RefundFeeTable.Form.refundFeeDetails.amountTo"]}
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
                      {languageData["RefundFeeTable.Form.refundFeeDetails.amountTo.tooltip"]}
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TableHead>
              <TableHead className="min-w-60">{languageData["RefundFeeTable.Form.refundFeeDetails.feeType"]}</TableHead>
              <TableHead className="min-w-60">
                {languageData["RefundFeeTable.Form.refundFeeDetails.refundMethod"]}
              </TableHead>
              <TableHead>{languageData["RefundFeeTable.Form.refundFeeDetails.fixedFee"]}</TableHead>
              <TableHead>{languageData["RefundFeeTable.Form.refundFeeDetails.percentFee"]}</TableHead>
              <TableHead>{languageData["RefundFeeTable.Form.refundFeeDetails.minFee"]}</TableHead>
              <TableHead>{languageData["RefundFeeTable.Form.refundFeeDetails.maxFee"]}</TableHead>
              <TableHead className="w-[50px] border-none" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((arrayField, index) => (
              <TableRow className={cn("divide-x [&>td]:p-px")} key={arrayField.id}>
                <TableCell>
                  <Controller
                    control={form.control}
                    name={`refundFeeDetails.${index}.amountFrom`}
                    render={({field}) => {
                      const error = getFieldError("amountFrom", index);
                      return (
                        <div className="relative">
                          <Input
                            data-testid={`refundFeeDetails.${index}.amountFrom`}
                            step="1"
                            type="number"
                            {...field}
                            className={cn(
                              "rounded-none border-none shadow-none",
                              error && "bg-red-50 font-bold italic text-red-500",
                            )}
                            disabled={isPending}
                            onChange={(e) => {
                              field.onChange(parseFloat(e.target.value) || 0);
                            }}
                            ref={(el) => {
                              inputRefs.current[`refundFeeDetails.${index}.amountFrom`] = el;
                            }}
                          />
                          <FieldError error={error} />
                        </div>
                      );
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Controller
                    control={form.control}
                    name={`refundFeeDetails.${index}.amountTo`}
                    render={({field}) => {
                      const error = getFieldError("amountTo", index);
                      return (
                        <div className="relative">
                          <Input
                            data-testid={`refundFeeDetails.${index}.amountTo`}
                            step="1"
                            type="number"
                            {...field}
                            className={cn(
                              "rounded-none border-none shadow-none",
                              error && "bg-red-50 font-bold italic text-red-500",
                            )}
                            disabled={isPending}
                            onChange={(e) => {
                              field.onChange(parseFloat(e.target.value) || 0);
                            }}
                            ref={(el) => {
                              inputRefs.current[`refundFeeDetails.${index}.amountTo`] = el;
                            }}
                          />
                          <FieldError error={error} />
                        </div>
                      );
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Controller
                    control={form.control}
                    name={`refundFeeDetails.${index}.feeType`}
                    render={({field}) => (
                      <div className="relative">
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger
                            className={cn("rounded-none border-none shadow-none")}
                            data-testid={`refundFeeDetails.${index}.feeType`}
                            disabled={isPending}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {feeTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {languageData[`RefundFeeTable.Form.refundFeeDetails.feeType.${type}`]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <Controller
                    control={form.control}
                    name={`refundFeeDetails.${index}.refundMethod`}
                    render={({field}) => (
                      <div className="relative">
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger
                            className={cn("rounded-none border-none shadow-none")}
                            data-testid={`refundFeeDetails.${index}.refundMethod`}
                            disabled={isPending}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {refundMethods.map((method) => (
                              <SelectItem key={method} value={method}>
                                {languageData[`Contracts.refundMethod.${method}`]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <Controller
                    control={form.control}
                    name={`refundFeeDetails.${index}.fixedFeeValue`}
                    render={({field}) => (
                      <div className="relative">
                        <Input
                          data-testid={`refundFeeDetails.${index}.fixedFeeValue`}
                          step="1"
                          type="number"
                          {...field}
                          className={cn("rounded-none border-none shadow-none")}
                          disabled={isPending}
                          onChange={(e) => {
                            field.onChange(parseFloat(e.target.value) || 0);
                          }}
                        />
                      </div>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <Controller
                    control={form.control}
                    name={`refundFeeDetails.${index}.percentFeeValue`}
                    render={({field}) => (
                      <div className="relative">
                        <Input
                          data-testid={`refundFeeDetails.${index}.percentFeeValue`}
                          step="1"
                          type="number"
                          {...field}
                          className={cn("rounded-none border-none shadow-none")}
                          disabled={isPending}
                          onChange={(e) => {
                            field.onChange(parseFloat(e.target.value) || 0);
                          }}
                        />
                      </div>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <Controller
                    control={form.control}
                    name={`refundFeeDetails.${index}.minFee`}
                    render={({field}) => (
                      <div className="relative">
                        <Input
                          data-testid={`refundFeeDetails.${index}.minFee`}
                          step="1"
                          type="number"
                          {...field}
                          className={cn("rounded-none border-none shadow-none")}
                          disabled={isPending}
                          onChange={(e) => {
                            field.onChange(parseFloat(e.target.value) || 0);
                          }}
                        />
                      </div>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <Controller
                    control={form.control}
                    name={`refundFeeDetails.${index}.maxFee`}
                    render={({field}) => {
                      const error = getFieldError("maxFee", index);
                      return (
                        <div className="relative">
                          <Input
                            data-testid={`refundFeeDetails.${index}.maxFee`}
                            step="1"
                            type="number"
                            {...field}
                            className={cn(
                              "rounded-none border-none shadow-none",
                              error && "bg-red-50 font-bold italic text-red-500",
                            )}
                            disabled={isPending}
                            onChange={(e) => {
                              field.onChange(parseFloat(e.target.value) || 0);
                            }}
                            ref={(el) => {
                              inputRefs.current[`refundFeeDetails.${index}.maxFee`] = el;
                            }}
                          />
                          <FieldError error={error} />
                        </div>
                      );
                    }}
                  />
                </TableCell>
                <TableCell className="p-0">
                  <div className="flex size-full items-center justify-center">
                    <Button
                      className="w-full rounded-none"
                      data-testid={`refundTableDetails.removeRow.${index}`}
                      disabled={isPending}
                      onClick={() => {
                        remove(index);
                      }}
                      type="button"
                      variant="ghost">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {fields.length === 0 && (
              <TableRow>
                <TableCell className="text-muted-foreground text-center" colSpan={9}>
                  {languageData["RefundFeeTable.Form.refundFeeDetails.noRecord"]}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showVisualizer ? (
        <RefundFeeDetailsVisualizer
          details={
            watchedDetails?.map((item, idx) => {
              return {...item, originalIndex: idx};
            }) || []
          }
          languageData={languageData}
          onCellClick={handleVisualizerCellClick}
        />
      ) : null}
    </div>
  );
}

function FieldError({error}: {error: string | null | undefined}) {
  if (error)
    return (
      <Tooltip>
        <TooltipTrigger className="absolute right-0 top-0">
          <AlertTriangleIcon className="text-destructive size-4" />
        </TooltipTrigger>
        <TooltipContent>{error}</TooltipContent>
      </Tooltip>
    );
  return null;
}

"use client";
import {putRebateTableHeadersByIdApi} from "@repo/actions/unirefund/ContractService/put-actions";
import {handlePutResponse} from "@repo/utils/api";
import {Button} from "@/components/ui/button";
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
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {toast} from "@/components/ui/sonner";
import {Switch} from "@/components/ui/switch";
import {Label} from "@/components/ui/label";
import {zodResolver} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import type {UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderDto as RebateTableHeaderDto} from "@repo/saas/ContractService";
import {Asterisk, Trash2} from "lucide-react";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import type {z} from "zod";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";
import {createRebateTableFormSchemas} from "../../_components/schema";

type RefundMethod = "Cash" | "CreditCard" | "BankTransfer" | "Wallet" | "CashViaPartner" | "All";
const refundMethod: RefundMethod[] = ["Cash", "CreditCard", "BankTransfer", "Wallet", "CashViaPartner", "All"];

export default function RebateTableHeaderCreateForm({
  languageData,
  formData,
}: {
  languageData: ContractServiceResource;
  formData: RebateTableHeaderDto;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {createFormSchema} = createRebateTableFormSchemas({languageData});

  const form = useForm<z.infer<typeof createFormSchema>>({
    resolver: zodResolver(createFormSchema),
    defaultValues: formData,
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
  function handleProcessingFeeAddRow() {
    processingFeeFieldArray.append({
      name: languageData["RebateTable.Form.processingFeeDetails.name.default"],
      amount: 0,
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

  function onSubmit(values: z.infer<typeof createFormSchema>) {
    startTransition(() => {
      void putRebateTableHeadersByIdApi({
        id: formData.id,
        requestBody: values,
      }).then((response) => {
        handlePutResponse(response, router);
      });
    });
  }

  return (
    <Form {...form}>
      <form
        className="grid h-full grid-flow-dense grid-cols-12 gap-4 overflow-hidden"
        data-testid=""
        onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}>
        <div className="col-span-3 flex h-full flex-col gap-4 overflow-hidden p-px">
          <div className="h-max space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({field}) => (
                <FormItem className="space-y-0">
                  <FormLabel>
                    {languageData["RebateTable.Form.name"]}
                    <Asterisk className="text-destructive mb-2 inline-flex size-3" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      data-testid="name"
                      disabled={isPending}
                      placeholder={languageData["RebateTable.Form.name.default"]}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="calculateNetCommissionInsteadOfRefund"
              render={({field}) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>{languageData["RebateTable.Form.calculateNetCommissionInsteadOfRefund"]}</FormLabel>
                    <FormDescription>
                      {languageData["RebateTable.Form.calculateNetCommissionInsteadOfRefund.description"]}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      data-testid="calculateNetCommissionInsteadOfRefund"
                      disabled={isPending}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="h-full overflow-auto">
            <div className="sticky top-0 z-10 flex items-end justify-between bg-white pb-4">
              <Label data-testid="rebateTable.processingFee.label">
                {languageData["RebateTable.Form.processingFeeDetails"]}
              </Label>
              <Button
                data-testid="rebateTable.processingFee.addRowButton"
                disabled={isPending}
                onClick={handleProcessingFeeAddRow}
                type="button"
                variant="outline">
                {languageData["Table.Add"]}
              </Button>
            </div>
            <div className="bg-border group flex flex-col gap-px rounded-md border [&>div:last-child>:first-child]:rounded-bl-md [&>div:last-child>:last-child]:rounded-br-md [&>div:last-child>div:first-child>input]:rounded-bl-md">
              <div className="flex gap-px overflow-hidden rounded-t-md">
                <span className="flex h-9 w-full items-center bg-white px-3 text-sm font-medium">
                  {languageData["RebateTable.Form.processingFeeDetails.name"]}
                </span>
                <span className="flex h-9 w-full items-center bg-white px-3 text-sm font-medium">
                  {languageData["RebateTable.Form.processingFeeDetails.amount"]}
                </span>
                <span className="h-9 min-w-10 rounded-md bg-white ring ring-white" />
              </div>
              {processingFeeFieldArray.fields.map((arrayField, index) => (
                <div className="bg-border row-item flex gap-px" key={arrayField.id}>
                  <FormField
                    control={form.control}
                    name={`processingFeeDetails.${index}.name`}
                    render={({field}) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <Input
                            className="rounded-none border-0 bg-white shadow-none"
                            data-testid={`processingFeeDetails.${index}.name`}
                            disabled={isPending}
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`processingFeeDetails.${index}.amount`}
                    render={({field}) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <Input
                            className="rounded-none border-0 bg-white shadow-none"
                            data-testid={`processingFeeDetails.${index}.amount`}
                            disabled={isPending}
                            step="any"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    className="rounded-none border-0 bg-white px-3 shadow-none"
                    data-testid={`processingFeeFieldArray.removeRow.${index}`}
                    disabled={isPending}
                    onClick={() => {
                      processingFeeFieldArray.remove(index);
                    }}
                    type="button"
                    variant="outline">
                    <Trash2 className="w-4 min-w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-9 flex h-full flex-col gap-4 overflow-hidden border-l pl-4 pt-2">
          <div className="flex h-full flex-col overflow-auto">
            <div className="sticky top-0 z-10 flex items-end justify-between bg-white pb-4">
              <Label data-testid="rebateTable.rebateTableDetails.label">
                {languageData["RebateTable.Form.rebateTableDetails"]}
              </Label>
              <Button
                data-testid="rebateTable.rebateTableDetails.addRowButton"
                disabled={isPending || hasAll}
                onClick={handleRebateTableAddRow}
                type="button"
                variant="outline">
                {languageData["Table.Add"]}
              </Button>
            </div>
            <div className="bg-border group flex flex-col gap-px rounded-md border [&>div:last-child>:first-child]:rounded-bl-md [&>div:last-child>:last-child]:rounded-br-md [&>div:last-child>div:first-child>input]:rounded-bl-md">
              <div className="flex gap-px overflow-hidden rounded-t-md">
                <span className="flex h-9 min-w-52 items-center bg-white px-3 text-sm font-medium">
                  {languageData["RebateTable.Form.rebateTableDetails.fixedFeeValue"]}
                </span>
                <span className="flex h-9 min-w-52 items-center bg-white px-3 text-sm font-medium">
                  {languageData["RebateTable.Form.rebateTableDetails.percentFeeValue"]}
                </span>
                <span className="flex h-9 w-full max-w-60 items-center bg-white px-3 text-sm font-medium">
                  {languageData["RebateTable.Form.rebateTableDetails.refundMethod"]}
                </span>
                <span className="flex h-9 w-full items-center bg-white px-3 text-sm font-medium">
                  {languageData["RebateTable.Form.rebateTableDetails.variableFee"]}
                </span>
              </div>
              {rebateTableFieldArray.fields.map((arrayField, index) => (
                <div className="bg-border row-item flex gap-px" key={arrayField.id}>
                  <FormField
                    control={form.control}
                    name={`rebateTableDetails.${index}.fixedFeeValue`}
                    render={({field}) => (
                      <FormItem className="min-w-52 space-y-0">
                        <FormControl>
                          <Input
                            className="rounded-none border-0 bg-white shadow-none"
                            data-testid={`rebateTableDetails.${index}.fixedFeeValue`}
                            disabled={isPending}
                            step="any"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`rebateTableDetails.${index}.percentFeeValue`}
                    render={({field}) => (
                      <FormItem className="min-w-52 space-y-0">
                        <FormControl>
                          <Input
                            className="rounded-none border-0 bg-white shadow-none"
                            data-testid={`rebateTableDetails.${index}.percentFeeValue`}
                            disabled={isPending}
                            step="any"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`rebateTableDetails.${index}.refundMethod`}
                    render={({field}) => (
                      <FormItem className="w-full max-w-60 space-y-0">
                        <FormControl>
                          <Select disabled={isPending} onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger
                              className="rounded-none border-0 bg-white shadow-none"
                              data-testid={`rebateTableDetails.${index}.refundMethod`}>
                              <SelectValue placeholder="Select Refund Method" />
                            </SelectTrigger>
                            <SelectContent>
                              {getRefundMethodOptions(index).map(({value, disabled}, idx) => (
                                <SelectItem
                                  data-testid={`rebateTableDetails.${index}.refundMethod.${idx}`}
                                  disabled={disabled}
                                  key={value}
                                  value={value}>
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
                  <FormField
                    control={form.control}
                    name={`rebateTableDetails.${index}.variableFee`}
                    render={({field}) => (
                      <FormItem className="w-full space-y-0">
                        <FormControl>
                          <Select disabled={isPending} onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger
                              className="rounded-none border-0 bg-white shadow-none"
                              data-testid={`rebateTableDetails.${index}.variableFee`}>
                              <SelectValue placeholder="Select Variable Fee" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem
                                data-testid={`rebateTableDetails.${index}.variableFee.PercentOfGC`}
                                value="PercentOfGC">
                                {languageData["RebateTable.Form.rebateTableDetails.variableFee.PercentOfGC"]}
                              </SelectItem>
                              <SelectItem
                                data-testid={`rebateTableDetails.${index}.variableFee.PercentOfGcWithoutVAT`}
                                value="PercentOfGcWithoutVAT">
                                {languageData["RebateTable.Form.rebateTableDetails.variableFee.PercentOfGcWithoutVAT"]}
                              </SelectItem>
                              <SelectItem
                                data-testid={`rebateTableDetails.${index}.variableFee.PercentOfVAT`}
                                value="PercentOfVAT">
                                {languageData["RebateTable.Form.rebateTableDetails.variableFee.PercentOfSIS"]}
                              </SelectItem>
                              <SelectItem
                                data-testid={`rebateTableDetails.${index}.variableFee.PercentOfSIS`}
                                value="PercentOfSIS">
                                {languageData["RebateTable.Form.rebateTableDetails.variableFee.PercentOfVAT"]}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    className="rounded-none border-0 bg-white px-3 shadow-none"
                    data-testid={`rebateTableDetails.removeRow.${index}`}
                    disabled={isPending}
                    onClick={() => {
                      rebateTableFieldArray.remove(index);
                    }}
                    type="button"
                    variant="outline">
                    <Trash2 className="w-4 min-w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <Button className="mx-auto w-full max-w-lg" data-testid="submit-form-button" disabled={isPending}>
            {" "}
            {languageData.Save}
          </Button>
        </div>
      </form>
    </Form>
  );
}

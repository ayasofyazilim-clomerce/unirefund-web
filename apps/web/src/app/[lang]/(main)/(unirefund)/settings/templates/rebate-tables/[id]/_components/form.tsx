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
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {zodResolver} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import type {UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderDto as RebateTableHeaderDto} from "@repo/saas/ContractService";
import {Asterisk, Plus, Trash2} from "lucide-react";
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
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="divide-x [&_*]:text-black">
                    <TableHead>{languageData["RebateTable.Form.processingFeeDetails.name"]}</TableHead>
                    <TableHead>{languageData["RebateTable.Form.processingFeeDetails.amount"]}</TableHead>
                    <TableHead className="w-9 border-none" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processingFeeFieldArray.fields.length === 0 ? (
                    <TableRow>
                      <TableCell className="text-muted-foreground text-center" colSpan={3}>
                        No processing fees added yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    processingFeeFieldArray.fields.map((arrayField, index) => (
                      <TableRow className="divide-x" key={arrayField.id}>
                        <TableCell className="p-px">
                          <FormField
                            control={form.control}
                            name={`processingFeeDetails.${index}.name`}
                            render={({field}) => (
                              <FormItem className="space-y-0">
                                <FormControl>
                                  <Input
                                    className="rounded-none border-0 shadow-none"
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
                        </TableCell>
                        <TableCell className="p-px">
                          <FormField
                            control={form.control}
                            name={`processingFeeDetails.${index}.amount`}
                            render={({field}) => (
                              <FormItem className="space-y-0">
                                <FormControl>
                                  <Input
                                    className="rounded-none border-0 shadow-none"
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
                        </TableCell>
                        <TableCell className="w-9 p-px">
                          <Button
                            className="size-full h-9 rounded-none"
                            data-testid={`processingFeeFieldArray.removeRow.${index}`}
                            disabled={isPending}
                            onClick={() => {
                              processingFeeFieldArray.remove(index);
                            }}
                            size="sm"
                            type="button"
                            variant="ghost">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
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
          <Button className="mx-auto w-full max-w-lg" data-testid="submit-form-button" disabled={isPending}>
            {languageData.Save}
          </Button>
        </div>
      </form>
    </Form>
  );
}

"use client";
import {FormControl, FormField, FormItem, FormMessage, useFieldArray} from "@/components/ui/form";
import type {UseFormReturn} from "@/components/ui/form";
import type {z} from "zod";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Plus, Trash2} from "lucide-react";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";
import {createRebateTableFormSchemas} from "./schema";

const {createFormSchema} = createRebateTableFormSchemas({});

export function ProcessingFeeDetailsTable({
  languageData,
  form,
  isPending,
}: {
  languageData: ContractServiceResource;
  form: UseFormReturn<z.infer<typeof createFormSchema>>;
  isPending: boolean;
}) {
  const processingFeeFieldArray = useFieldArray({
    control: form.control,
    name: "processingFeeDetails",
  });
  function handleProcessingFeeAddRow() {
    processingFeeFieldArray.append({
      name: languageData["RebateTable.Form.processingFeeDetails.name.default"],
      amount: 0,
    });
  }
  return (
    <div className="h-full overflow-auto">
      <div className="sticky top-0 z-10 flex items-end justify-between bg-white pb-4">
        <Label data-testid="rebateTable.processingFee.label">
          {languageData["RebateTable.Form.processingFeeDetails"]}
        </Label>
        <Button
          data-testid="rebateTable.processingFee.addRowButton"
          disabled={isPending}
          onClick={handleProcessingFeeAddRow}
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
  );
}

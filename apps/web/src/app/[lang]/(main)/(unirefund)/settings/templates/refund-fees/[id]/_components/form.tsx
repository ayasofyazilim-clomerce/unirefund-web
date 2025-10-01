"use client";
import {putRefundFeeHeadersByIdApi} from "@repo/actions/unirefund/ContractService/put-actions";
import type {z} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import {zodResolver} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import type {UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderDto as RefundFeeHeaderDto} from "@repo/saas/ContractService";
import {handlePutResponse} from "@repo/utils/api";
import {Asterisk} from "lucide-react";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {Button} from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Switch} from "@/components/ui/switch";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";
import {RefundFeeDetailsTable} from "../../_components/refund-fee-details";
import {createRefundFeeTableSchemas} from "../../_components/schema";

export default function RefundFeeHeaderUpdateForm({
  formData,
  languageData,
}: {
  formData: RefundFeeHeaderDto;
  languageData: ContractServiceResource;
}) {
  const router = useRouter();
  const {updateFormSchema} = createRefundFeeTableSchemas({languageData});
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof updateFormSchema>>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      ...formData,
      refundFeeDetails: formData.refundFeeDetails?.map((rfd) => {
        return {
          ...rfd,
          refundMethod: rfd.refundMethod === "All" ? "Cash" : rfd.refundMethod,
        };
      }),
    },
    mode: "onChange",
  });
  const onSubmit = (data: z.infer<typeof updateFormSchema>) => {
    console.log("Updating refund fee table with:", data);
    startTransition(() => {
      void putRefundFeeHeadersByIdApi({
        id: formData.id,
        requestBody: data,
      }).then((response) => {
        handlePutResponse(response, router);
      });
    });
  };
  return (
    <Form {...form}>
      <form
        className="grid h-full grid-flow-dense grid-cols-12 gap-4 overflow-hidden"
        data-testid="refund-fee-table-create-form"
        onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}>
        <div className="col-span-3 flex h-full flex-col gap-4 overflow-hidden p-px">
          <FormField
            control={form.control}
            name="name"
            render={({field}) => (
              <FormItem className="space-y-0.5">
                <FormLabel>
                  {languageData["RefundFeeTable.Form.name"]}
                  <Asterisk className="text-destructive mb-2 inline-flex size-3" />
                </FormLabel>
                <FormControl>
                  <Input data-testid="name" {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isActive"
            render={({field}) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>{languageData["RefundFeeTable.Form.isActive"]}</FormLabel>
                  <FormDescription>{languageData["RefundFeeTable.Form.isActive.description"]}</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    data-testid="isActive"
                    disabled={isPending}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-9 flex h-full flex-col gap-4 overflow-hidden border-l pl-4 pt-2">
          <RefundFeeDetailsTable form={form} isPending={isPending} languageData={languageData} />
          <Button
            className="mx-auto w-full max-w-lg"
            data-testid="submit-form-button"
            disabled={isPending}
            type="submit">
            {languageData.Save}
          </Button>
        </div>
      </form>
    </Form>
  );
}

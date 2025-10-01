"use client";
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
import {putRebateTableHeadersByIdApi} from "@repo/actions/unirefund/ContractService/put-actions";
import {zodResolver} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import type {UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderDto as RebateTableHeaderDto} from "@repo/saas/ContractService";
import {handlePutResponse} from "@repo/utils/api";
import {Asterisk} from "lucide-react";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import type {z} from "zod";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";
import {ProcessingFeeDetailsTable} from "../../_components/processing-fee-details";
import {RebateTableDetailsTable} from "../../_components/rebate-table-details";
import {createRebateTableFormSchemas} from "../../_components/schema";

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
          <ProcessingFeeDetailsTable form={form} isPending={isPending} languageData={languageData} />
        </div>
        <div className="col-span-9 flex h-full flex-col gap-4 overflow-hidden border-l pl-4 pt-2">
          <RebateTableDetailsTable form={form} isPending={isPending} languageData={languageData} />
          <Button className="mx-auto w-full max-w-lg" data-testid="submit-form-button" disabled={isPending}>
            {languageData.Save}
          </Button>
        </div>
      </form>
    </Form>
  );
}

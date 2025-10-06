"use client";
import type {z} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import {zodResolver} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import {Asterisk} from "lucide-react";
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
import {postRefundFeeHeadersApi} from "@repo/actions/unirefund/ContractService/post-actions";
import {Combobox} from "@repo/ayasofyazilim-ui/molecules/combobox";
import type {UniRefund_CRMService_RefundPoints_RefundPointListResponseDto} from "@repo/saas/CRMService";
import {handlePostResponse} from "@repo/utils/api";
import {useRouter} from "next/navigation";
import {getBaseLink} from "@/utils";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";
import {RefundFeeDetailsTable} from "../../_components/refund-fee-details";
import {createRefundFeeTableSchemas} from "../../_components/schema";

export default function RefundFeeHeaderForm({
  languageData,
  refundPoints,
}: {
  languageData: ContractServiceResource;
  refundPoints: UniRefund_CRMService_RefundPoints_RefundPointListResponseDto[];
}) {
  const router = useRouter();
  const {createFormSchema} = createRefundFeeTableSchemas({languageData});
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof createFormSchema>>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      name: languageData["RefundFeeTable.Form.name.default"],
      isActive: true,
      isTemplate: false,
      refundPointId: null,
      refundFeeDetails: [
        {
          feeType: "TouristFee",
          refundMethod: "Cash",
          amountFrom: 0,
          amountTo: 100,
        },
        {
          feeType: "AgentFee",
          refundMethod: "Cash",
          amountFrom: 0,
          amountTo: 50,
        },
      ],
    },
    mode: "onChange",
  });
  const onSubmit = (data: z.infer<typeof createFormSchema>) => {
    console.log("Creating refund fee table with:", data);
    startTransition(() => {
      void postRefundFeeHeadersApi({
        requestBody: data,
      }).then((response) => {
        handlePostResponse(response, router, {
          prefix: getBaseLink("/settings/templates/refund-fees"),
          identifier: "id",
        });
      });
    });
  };
  const isTemplate = form.watch("isTemplate");
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
          <FormField
            control={form.control}
            name="isTemplate"
            render={({field}) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>{languageData["RefundFeeTable.Form.isTemplate"]}</FormLabel>
                  <FormDescription>{languageData["RefundFeeTable.Form.isTemplate.description"]}</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    data-testid="isTemplate"
                    disabled={isPending}
                    onCheckedChange={(value) => {
                      if (value) {
                        form.setValue("refundPointId", null);
                        form.clearErrors("refundPointId");
                      }
                      field.onChange(value);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {!isTemplate && (
            <FormField
              control={form.control}
              name="refundPointId"
              render={({field}) => (
                <FormItem className="space-y-0.5">
                  <FormLabel>{languageData["RefundFeeTable.Form.refundPointId"]}</FormLabel>
                  <FormControl>
                    <Combobox<UniRefund_CRMService_RefundPoints_RefundPointListResponseDto>
                      aria-describedby="refundPoints-help"
                      data-testid="refundPoints-combobox"
                      disabled={isPending}
                      emptyValue={languageData["Select.EmptyValue"]}
                      id="refundPoints-combobox"
                      list={refundPoints}
                      onValueChange={(val) => {
                        field.onChange(val?.id || "");
                      }}
                      searchPlaceholder={languageData["Select.Placeholder"]}
                      searchResultLabel={languageData["Select.ResultLabel"]}
                      selectIdentifier="id"
                      selectLabel="name"
                      value={refundPoints.find((rp) => rp.id === field.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
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

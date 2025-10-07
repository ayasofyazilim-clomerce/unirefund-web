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
import {postRefundTableHeadersApi} from "@repo/actions/unirefund/ContractService/post-actions";
import type {z} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import {zodResolver} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import {Combobox} from "@repo/ayasofyazilim-ui/molecules/combobox";
import type {UniRefund_CRMService_Merchants_MerchantListResponseDto as MerchantProfileDto} from "@repo/saas/CRMService";
import {handlePostResponse} from "@repo/utils/api";
import {Asterisk} from "lucide-react";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {getBaseLink} from "@/utils";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";
import {RefundTableDetailsTable} from "../../_components/refund-table-details";
import {createRefundTableFormSchemas} from "../../_components/schema";

export default function RefundTableForm({
  languageData,
  merchants,
}: {
  languageData: ContractServiceResource;
  merchants: MerchantProfileDto[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {createFormSchema} = createRefundTableFormSchemas({languageData});
  const form = useForm<z.infer<typeof createFormSchema>>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      name: languageData["Contracts.Default"],
      isDefault: false,
      isBundling: false,
      isTemplate: false,
      merchantId: null,
      refundTableDetails: [],
    },
    mode: "onChange",
  });
  const isTemplate = form.watch("isTemplate");

  function onSubmit(values: z.infer<typeof createFormSchema>) {
    startTransition(() => {
      void postRefundTableHeadersApi({
        requestBody: {
          ...values,
          isTemplate: values.isTemplate || false,
        },
      }).then((response) => {
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
              render={({field}) => (
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
              render={({field}) => (
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
              render={({field}) => (
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
              render={({field}) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>{languageData["RefundTable.Form.isTemplate"]}</FormLabel>
                    <FormDescription>{languageData["RefundTable.Form.isTemplate.description"]}</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      data-testid="isTemplate"
                      onCheckedChange={(value) => {
                        if (value) {
                          form.setValue("merchantId", null);
                          form.clearErrors("merchantId");
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
                name="merchantId"
                render={({field}) => (
                  <FormItem className="space-y-0.5">
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
          <RefundTableDetailsTable form={form} isPending={isPending} languageData={languageData} />
          <Button className="mx-auto w-full max-w-lg" data-testid="submit-form-button" disabled={isPending}>
            {languageData.Save}
          </Button>
        </div>
      </form>
    </Form>
  );
}

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
import {toast} from "@/components/ui/sonner";
import {Switch} from "@/components/ui/switch";
import {getRebateTableHeadersByIdApi} from "@repo/actions/unirefund/ContractService/action";
import {postRebateTableHeadersApi} from "@repo/actions/unirefund/ContractService/post-actions";
import {zodResolver} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import {ActionList} from "@repo/ayasofyazilim-ui/molecules/action-button";
import {Combobox} from "@repo/ayasofyazilim-ui/molecules/combobox";
import type {UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderListDto as RebateTableHeaderListDto} from "@repo/saas/ContractService";
import type {UniRefund_CRMService_Merchants_MerchantListResponseDto as MerchantProfileDto} from "@repo/saas/CRMService";
import {handlePostResponse} from "@repo/utils/api";
import {Asterisk} from "lucide-react";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import type {z} from "zod";
import {getBaseLink} from "@/utils";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";
import {ProcessingFeeDetailsTable} from "../../_components/processing-fee-details";
import {RebateTableDetailsTable} from "../../_components/rebate-table-details";
import {createRebateTableFormSchemas} from "../../_components/schema";

export default function RebateTableHeaderCreateForm({
  languageData,
  merchants,
  rebateTables,
}: {
  languageData: ContractServiceResource;
  merchants: MerchantProfileDto[];
  rebateTables: RebateTableHeaderListDto[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {createFormSchema} = createRebateTableFormSchemas({languageData});

  const form = useForm<z.infer<typeof createFormSchema>>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      name: "Default",
      rebateTableDetails: [],
    },
  });
  const isTemplate = form.watch("isTemplate");

  function onSubmit(values: z.infer<typeof createFormSchema>) {
    startTransition(() => {
      void postRebateTableHeadersApi({requestBody: values}).then((response) => {
        handlePostResponse(response, router, {
          prefix: getBaseLink("/settings/templates/rebate-tables"),
          identifier: "id",
        });
      });
    });
  }

  return (
    <Form {...form}>
      <form
        className="grid h-full grid-flow-dense grid-cols-12 gap-4 overflow-hidden"
        data-testid="rebate-table-header-create-form"
        onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}>
        <div className="col-span-3 flex h-full flex-col gap-4 overflow-hidden p-px">
          <div className="h-max space-y-4">
            <ActionList className="mx-auto w-full rounded-none border-0 border-b p-0 pb-4">
              <Combobox<RebateTableHeaderListDto>
                classNames={{container: "w-full "}}
                data-testid="rebate-table-list"
                disabled={isPending}
                emptyValue={languageData["Select.EmptyValue"]}
                label={languageData["Contracts.FillFrom"]}
                list={rebateTables}
                onValueChange={(rebateTable: RebateTableHeaderListDto | null | undefined) => {
                  if (!rebateTable) return;
                  startTransition(() => {
                    void getRebateTableHeadersByIdApi(rebateTable.id).then((response) => {
                      if (response.type === "success") {
                        form.reset(response.data);
                      } else {
                        toast.error(response.message);
                      }
                    });
                  });
                }}
                searchPlaceholder={languageData["Select.Placeholder"]}
                searchResultLabel={languageData["Select.ResultLabel"]}
                selectIdentifier="id"
                selectLabel="name"
              />
            </ActionList>
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
            <FormField
              control={form.control}
              name="isTemplate"
              render={({field}) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>{languageData["RebateTable.Form.isTemplate"]}</FormLabel>
                    <FormDescription>{languageData["RebateTable.Form.isTemplate.description"]}</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      data-testid="isTemplate"
                      disabled={isPending}
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
                  <FormItem className="space-y-0">
                    <FormLabel>{languageData["RebateTable.Form.merchantId"]}</FormLabel>
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

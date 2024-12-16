"use client";
import { toast } from "@/components/ui/sonner";
import type { UniRefund_CRMService_Merchants_MerchantProfileDto } from "@ayasofyazilim/saas/CRMService";
import type { UniRefund_FinanceService_Billings_CreateBillingDto } from "@ayasofyazilim/saas/FinanceService";
import { $UniRefund_FinanceService_Billings_CreateBillingDto } from "@ayasofyazilim/saas/FinanceService";
import { createZodObject } from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import AutoForm, {
  AutoFormSubmit,
  createFieldConfigWithResource,
  CustomCombobox,
} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import { useRouter } from "next/navigation";
import { postBillingApi } from "src/actions/unirefund/FinanceService/post-actions";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";
import type { FinanceServiceResource } from "src/language-data/unirefund/FinanceService";
import { getBaseLink } from "src/utils";

const billingSchema = createZodObject(
  $UniRefund_FinanceService_Billings_CreateBillingDto,
);

export default function Page({
  languageData,
  merchants,
}: {
  languageData: {
    crm: CRMServiceServiceResource;
    finance: FinanceServiceResource;
  };
  merchants: {
    success: boolean;
    data: UniRefund_CRMService_Merchants_MerchantProfileDto[];
  };
}) {
  const router = useRouter();

  async function createBilling(
    data: UniRefund_FinanceService_Billings_CreateBillingDto,
  ) {
    const response = await postBillingApi({ requestBody: data });
    if (response.type === "error" || response.type === "api-error") {
      toast.error(
        response.type +
          (response.message || languageData.finance["Billing.New.Error"]),
      );
    } else {
      toast.success([languageData.finance["Billing.New.Success"]]);
      router.push(getBaseLink(`/finance/billing`));
      router.refresh();
    }
  }

  const translatedForm = createFieldConfigWithResource({
    schema: $UniRefund_FinanceService_Billings_CreateBillingDto,
    resources: languageData.finance,
    extend: {
      number: { containerClassName: "gap-2" },
      merchantId: {
        renderer: (props) => {
          return (
            <CustomCombobox<UniRefund_CRMService_Merchants_MerchantProfileDto>
              childrenProps={props}
              disabled={!merchants.success}
              emptyValue={
                merchants.success
                  ? languageData.crm["Merchant.Select"]
                  : languageData.crm["Merchants.Fetch.Fail"]
              }
              list={merchants.data}
              searchPlaceholder={languageData.finance["Select.Placeholder"]}
              searchResultLabel={languageData.finance["Select.ResultLabel"]}
              selectIdentifier="id"
              selectLabel="name"
            />
          );
        },
      },
    },
  });

  return (
    <AutoForm
      className="grid gap-4 space-y-0 pb-4 md:grid-cols-1 lg:grid-cols-2 "
      fieldConfig={translatedForm}
      formSchema={billingSchema}
      onSubmit={(val) => {
        void createBilling(
          val as UniRefund_FinanceService_Billings_CreateBillingDto,
        );
      }}
      stickyChildren
    >
      <AutoFormSubmit className="float-right px-8 py-4">
        {languageData.finance.Save}
      </AutoFormSubmit>
    </AutoForm>
  );
}

"use client";

import type { UniRefund_CRMService_Merchants_MerchantProfileDto } from "@ayasofyazilim/saas/CRMService";
import type {
  UniRefund_FinanceService_Billings_BillingDto,
  UniRefund_FinanceService_Billings_UpdateBillingDto,
} from "@ayasofyazilim/saas/FinanceService";
import { $UniRefund_FinanceService_Billings_UpdateBillingDto } from "@ayasofyazilim/saas/FinanceService";
import { createZodObject } from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import AutoForm, {
  AutoFormSubmit,
  createFieldConfigWithResource,
  CustomCombobox,
} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import { useRouter } from "next/navigation";
import { handlePutResponse } from "src/actions/core/api-utils-client";
import { putBillingApi } from "src/actions/unirefund/FinanceService/put-actions";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";
import type { FinanceServiceResource } from "src/language-data/unirefund/FinanceService";

const updateBillingSchema = createZodObject(
  $UniRefund_FinanceService_Billings_UpdateBillingDto,
);

export default function Form({
  billingId,
  languageData,
  billingData,
  merchants,
}: {
  billingId: string;
  billingData: UniRefund_FinanceService_Billings_BillingDto;
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
  function updateBilling(
    data: UniRefund_FinanceService_Billings_UpdateBillingDto,
  ) {
    void putBillingApi({
      id: billingId,
      requestBody: data,
    }).then((response) => {
      handlePutResponse(response, router);
    });
  }

  const translatedForm = createFieldConfigWithResource({
    schema: $UniRefund_FinanceService_Billings_UpdateBillingDto,
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
      formSchema={updateBillingSchema}
      onSubmit={(formdata) => {
        updateBilling(
          formdata as UniRefund_FinanceService_Billings_UpdateBillingDto,
        );
      }}
      stickyChildren
      values={billingData}
    >
      <AutoFormSubmit className="float-right">
        {languageData.finance["Edit.Save"]}
      </AutoFormSubmit>
    </AutoForm>
  );
}

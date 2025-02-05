"use client";
import {useRouter} from "next/navigation";
import type {UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderCreateDto as RefundTableHeaderCreateDto} from "@ayasofyazilim/saas/ContractService";
import {$UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderCreateDto as $RefundTableHeaderCreateDto} from "@ayasofyazilim/saas/ContractService";
import type {UniRefund_CRMService_Merchants_MerchantProfileDto as MerchantProfileDto} from "@ayasofyazilim/saas/CRMService";
import {handlePostResponse} from "@repo/utils/api";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {DependencyType} from "@repo/ayasofyazilim-ui/organisms/schema-form/types";
import {useState} from "react";
import {postRefundTableHeadersApi} from "@/actions/unirefund/ContractService/post-actions";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";
import {RefundTableDetailsField} from "../../_components/refund-table-details-field";

export default function RefundTableHeaderCreateForm({
  languageData,
  merchants,
}: {
  languageData: ContractServiceResource;
  merchants: MerchantProfileDto[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const uiSchema = {
    "ui:className": "md:grid md:grid-cols-2",
    name: {"ui:className": ""},
    isTemplate: {
      "ui:widget": "switch",
      "ui:className": "border px-2 rounded-md h-max self-end",
    },
    isDefault: {
      "ui:widget": "switch",
      "ui:className": "border px-2 rounded-md h-max self-end",
    },
    isBundling: {
      "ui:widget": "switch",
      "ui:className": "border px-2 rounded-md h-max self-end",
    },
    merchantId: {
      "ui:className": "col-span-full",
      "ui:widget": "MerchantsWidget",
      dependencies: [
        {
          target: "isTemplate",
          when: (targetValue: boolean) => targetValue,
          type: DependencyType.HIDES,
        },
        {
          target: "isTemplate",
          when: (targetValue: boolean) => !targetValue,
          type: DependencyType.REQUIRES,
        },
      ],
    },
    refundTableDetails: {
      "ui:field": "RefundTableDetailsField",
      "ui:className": "border-none p-0 md:col-span-full",
    },
  };
  return (
    <SchemaForm<RefundTableHeaderCreateDto>
      disabled={loading}
      fields={{
        RefundTableDetailsField: RefundTableDetailsField(),
      }}
      formData={{
        name: "",
        isDefault: false,
        isBundling: false,
        isTemplate: true,
      }}
      onSubmit={({formData}) => {
        setLoading(true);
        void postRefundTableHeadersApi({requestBody: formData})
          .then((response) => {
            handlePostResponse(response, router, {
              identifier: "id",
              prefix: "./",
            });
            setLoading(false);
          })
          .finally(() => {
            setLoading(false);
          });
      }}
      schema={$RefundTableHeaderCreateDto}
      uiSchema={uiSchema}
      useDependency
      widgets={{
        MerchantsWidget: CustomComboboxWidget<MerchantProfileDto>({
          languageData,
          list: merchants,
          selectIdentifier: "id",
          selectLabel: "name",
        }),
      }}
    />
  );
}

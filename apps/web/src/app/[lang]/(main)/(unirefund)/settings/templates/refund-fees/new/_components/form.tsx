"use client";
import type { UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderCreateDto as RefundFeeHeaderCreateDto } from "@ayasofyazilim/saas/ContractService";
import { $UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderCreateDto as $RefundFeeHeaderCreateDto } from "@ayasofyazilim/saas/ContractService";
import type { UniRefund_CRMService_RefundPoints_RefundPointProfileDto as RefundPointProfileDto } from "@ayasofyazilim/saas/CRMService";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { DependencyType } from "@repo/ayasofyazilim-ui/organisms/schema-form/types";
import { CustomComboboxWidget } from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import { handlePostResponse } from "@repo/utils/api";
import { useRouter } from "next/navigation";
import { postRefundFeeHeadersApi } from "@/actions/unirefund/ContractService/post-actions";
import type { ContractServiceResource } from "@/language-data/unirefund/ContractService";
import { RefundFeeDetailsField } from "../../_components/refund-fee-details-field";

export default function RefundFeeHeaderCreateForm({
  refundPoints,
  languageData,
}: {
  refundPoints: RefundPointProfileDto[];
  languageData: ContractServiceResource;
}) {
  const router = useRouter();
  const uiSchema = {
    "ui:className": "md:grid md:grid-cols-2",
    name: { "ui:className": "" },
    isTemplate: {
      "ui:widget": "switch",
      "ui:className": "border px-2 rounded-md h-max self-end",
    },
    isActive: {
      "ui:widget": "switch",
      "ui:className": "border px-2 rounded-md h-max self-end",
    },
    refundPointId: {
      "ui:widget": "RefundPointWidget",
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
    refundFeeDetails: {
      "ui:field": "RefundFeeDetailsField",
      "ui:className": "border-none p-0 md:col-span-full",
    },
  };
  return (
    <SchemaForm<RefundFeeHeaderCreateDto>
      fields={{
        RefundFeeDetailsField: RefundFeeDetailsField(),
      }}
      formData={{
        name: "",
        isActive: true,
        isTemplate: true,
      }}
      onSubmit={({ formData }) => {
        if (!formData) return;
        void postRefundFeeHeadersApi({
          requestBody: formData,
        }).then((response) => {
          handlePostResponse(response, router, {
            prefix: "./",
            identifier: "id",
          });
        });
      }}
      schema={$RefundFeeHeaderCreateDto}
      uiSchema={uiSchema}
      useDependency
      widgets={{
        RefundPointWidget: CustomComboboxWidget<RefundPointProfileDto>({
          languageData,
          list: refundPoints,
          selectIdentifier: "id",
          selectLabel: "name",
        }),
      }}
    />
  );
}

"use client";
import type {UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderCreateDto as RefundFeeHeaderCreateDto} from "@repo/saas/ContractService";
import {$UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderCreateDto as $RefundFeeHeaderCreateDto} from "@repo/saas/ContractService";
import type {UniRefund_CRMService_RefundPoints_RefundPointListResponseDto as RefundPointProfileDto} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {DependencyType} from "@repo/ayasofyazilim-ui/organisms/schema-form/types";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {handlePostResponse} from "@repo/utils/api";
import {useRouter} from "next/navigation";
import {useState, useTransition} from "react";
import {postRefundFeeHeadersApi} from "@repo/actions/unirefund/ContractService/post-actions";
import {getBaseLink} from "@/utils";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";

export default function RefundFeeHeaderCreateForm({
  refundPoints,
  languageData,
}: {
  refundPoints: RefundPointProfileDto[];
  languageData: ContractServiceResource;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<RefundFeeHeaderCreateDto>({
    name: "",
    isActive: true,
    isTemplate: true,
    refundFeeDetails: [
      {
        amountFrom: 0,
        amountTo: 0,
        feeType: "AgentFee",
        fixedFeeValue: 0,
        maxFee: 0,
        minFee: 0,
        percentFeeValue: 0,
        refundMethod: "All",
      },
    ],
  });
  const uiSchema = createUiSchemaWithResource({
    schema: $RefundFeeHeaderCreateDto,
    name: "Contracts.Form",
    resources: languageData,
    extend: {
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
        "ui:className": "border-none p-0 w-full",
        "ui:options": {
          copyable: true,
        },
      },
    },
  });
  return (
    <SchemaForm<RefundFeeHeaderCreateDto>
      className="mx-auto flex  max-w-4xl flex-col justify-center pr-0"
      disabled={isPending}
      formData={formData}
      onChange={({formData: editedFormData}) => {
        if (!editedFormData) return;
        setFormData(editedFormData);
      }}
      onSubmit={({formData: editedFormData}) => {
        if (!editedFormData) return;
        startTransition(() => {
          void postRefundFeeHeadersApi({
            requestBody: editedFormData,
          }).then((response) => {
            handlePostResponse(response, router, {
              prefix: getBaseLink("/settings/templates/refund-fees"),
              identifier: "id",
            });
          });
        });
      }}
      schema={$RefundFeeHeaderCreateDto}
      submitText={languageData.Save}
      uiSchema={uiSchema}
      useDependency
      useTableForArrayItems
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

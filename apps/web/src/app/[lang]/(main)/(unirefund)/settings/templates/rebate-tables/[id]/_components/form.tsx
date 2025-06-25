"use client";

import type {
  UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderDto as RebateTableHeaderDto,
  UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderUpdateDto as RebateTableHeaderUpdateDto,
} from "@ayasofyazilim/saas/ContractService";
import {$UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderUpdateDto as $RebateTableHeaderUpdateDto} from "@ayasofyazilim/saas/ContractService";
import {putRebateTableHeadersByIdApi} from "@repo/actions/unirefund/ContractService/put-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {handlePutResponse} from "@repo/utils/api";
import {useParams, useRouter} from "next/navigation";
import {useTransition} from "react";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";

export default function RebateTableHeaderUpdateForm({
  languageData,
  formData,
}: {
  languageData: ContractServiceResource;
  formData: RebateTableHeaderDto;
}) {
  const {id: rebateTableHeaderId} = useParams<{id: string}>();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const uiSchema = createUiSchemaWithResource({
    resources: languageData,
    schema: $RebateTableHeaderUpdateDto,
    name: "Contracts.Form",
    extend: {
      calculateNetCommissionInsteadOfRefund: {
        "ui:widget": "switch",
        "ui:className": "border px-2 rounded-md h-max self-end",
        "ui:test": languageData.Address,
      },
      isTemplate: {
        "ui:widget": "switch",
        "ui:className": "border px-2 rounded-md h-max self-end",
      },
      rebateTableDetails: {
        "ui:field": "RebateTableDetailsField",
        "ui:className": "md:col-span-full",
        "ui:options": {
          copyable: true,
        },
      },
      processingFeeDetails: {
        "ui:field": "ProcessingFeeDetailsField",
        "ui:className": "md:col-span-full",
      },
    },
  });
  return (
    <SchemaForm<RebateTableHeaderUpdateDto>
      className="mx-auto max-w-4xl"
      disabled={isPending}
      formData={formData}
      onSubmit={({formData: editedFormData}) => {
        startTransition(() => {
          void putRebateTableHeadersByIdApi({
            id: rebateTableHeaderId,
            requestBody: editedFormData,
          }).then((response) => {
            handlePutResponse(response, router);
          });
        });
      }}
      schema={$RebateTableHeaderUpdateDto}
      submitText={languageData["Edit.Save"]}
      uiSchema={uiSchema}
      useTableForArrayItems
    />
  );
}

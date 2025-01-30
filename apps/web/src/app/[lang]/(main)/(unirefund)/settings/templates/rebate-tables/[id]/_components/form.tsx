"use client";

import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { useParams, useRouter } from "next/navigation";
import { useTransition } from "react";
import type {
  UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderDto as RebateTableHeaderDto,
  UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderUpdateDto as RebateTableHeaderUpdateDto,
} from "@ayasofyazilim/saas/ContractService";
import { $UniRefund_ContractService_Rebates_RebateTableHeaders_RebateTableHeaderUpdateDto as $RebateTableHeaderUpdateDto } from "@ayasofyazilim/saas/ContractService";
import { handlePutResponse } from "@repo/utils/api";
import { putRebateTableHeadersByIdApi } from "@/actions/unirefund/ContractService/put-actions";
import type { ContractServiceResource } from "@/language-data/unirefund/ContractService";
import { ProcessingFeeDetailsField } from "../../_components/processing-fee-details";
import { RebateTableDetailsField } from "../../_components/rebate-table-details-field";

export default function RebateTableHeaderUpdateForm({
  languageData,
  formData,
}: {
  languageData: ContractServiceResource;
  formData: RebateTableHeaderDto;
}) {
  const { id: rebateTableHeaderId } = useParams<{ id: string }>();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const uiSchema = {
    "ui:className": "grid md:grid-cols-2",
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
    },
    processingFeeDetails: {
      "ui:field": "ProcessingFeeDetailsField",
      "ui:className": "md:col-span-full",
    },
  };
  return (
    <SchemaForm<RebateTableHeaderUpdateDto>
      disabled={isPending}
      fields={{
        RebateTableDetailsField: RebateTableDetailsField(
          formData.rebateTableDetails !== null
            ? formData.rebateTableDetails
            : [],
        ),
        ProcessingFeeDetailsField: ProcessingFeeDetailsField(
          formData.processingFeeDetails !== null
            ? formData.processingFeeDetails
            : [],
        ),
      }}
      formData={formData}
      onSubmit={({ formData: editedFormData }) => {
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
      uiSchema={uiSchema}
    />
  );
}

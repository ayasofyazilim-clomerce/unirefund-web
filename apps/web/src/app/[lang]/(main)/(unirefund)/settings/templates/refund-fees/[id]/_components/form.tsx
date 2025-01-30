"use client";
import type {
  UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderDto as RefundFeeHeaderDto,
  UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderUpdateDto as RefundFeeHeaderUpdateDto,
} from "@ayasofyazilim/saas/ContractService";
import { $UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderUpdateDto as $RefundFeeHeaderUpdateDto } from "@ayasofyazilim/saas/ContractService";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { handlePutResponse } from "@repo/utils/api";
import { useParams, useRouter } from "next/navigation";
import { putRefundFeeHeadersByIdApi } from "@/actions/unirefund/ContractService/put-actions";
import { RefundFeeDetailsField } from "../../_components/refund-fee-details-field";

export default function RefundFeeHeaderUpdateForm({
  formData,
}: {
  formData: RefundFeeHeaderDto;
}) {
  const { id: refundFeeHeaderId } = useParams<{ id: string }>();
  const router = useRouter();
  const uiSchema = {
    "ui:className": "md:grid md:grid-cols-2",
    isActive: {
      "ui:widget": "switch",
      "ui:className": "border px-2 rounded-md h-max self-end",
    },
    refundFeeDetails: {
      "ui:field": "RefundFeeDetailsField",
      "ui:className": "border-none p-0 md:col-span-full",
    },
  };
  return (
    <SchemaForm<RefundFeeHeaderUpdateDto>
      fields={{
        RefundFeeDetailsField: RefundFeeDetailsField(
          formData.refundFeeDetails !== null ? formData.refundFeeDetails : [],
        ),
      }}
      formData={formData}
      onSubmit={({ formData: editedFormData }) => {
        if (!editedFormData) return;
        void putRefundFeeHeadersByIdApi({
          id: refundFeeHeaderId,
          requestBody: editedFormData,
        }).then((response) => {
          handlePutResponse(response, router);
        });
      }}
      schema={$RefundFeeHeaderUpdateDto}
      uiSchema={uiSchema}
    />
  );
}

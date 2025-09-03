"use client";
import type {
  UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderDto as RefundFeeHeaderDto,
  UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderUpdateDto as RefundFeeHeaderUpdateDto,
} from "@repo/saas/ContractService";
import {$UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderUpdateDto as $RefundFeeHeaderUpdateDto} from "@repo/saas/ContractService";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {handlePutResponse} from "@repo/utils/api";
import {useParams, useRouter} from "next/navigation";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {putRefundFeeHeadersByIdApi} from "@repo/actions/unirefund/ContractService/put-actions";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";

export default function RefundFeeHeaderUpdateForm({
  formData,
  languageData,
}: {
  formData: RefundFeeHeaderDto;
  languageData: ContractServiceResource;
}) {
  const {id: refundFeeHeaderId} = useParams<{id: string}>();
  const router = useRouter();
  const uiSchema = createUiSchemaWithResource({
    schema: $RefundFeeHeaderUpdateDto,
    name: "Contracts.Form",
    resources: languageData,
    extend: {
      isActive: {
        "ui:widget": "switch",
        "ui:className": "border px-2 rounded-md h-max self-end",
      },
      refundFeeDetails: {
        "ui:field": "RefundFeeDetailsField",
        "ui:className": "border-none p-0 md:col-span-full",
        "ui:options": {
          copyable: true,
        },
      },
    },
  });
  return (
    <SchemaForm<RefundFeeHeaderUpdateDto>
      className="mx-auto flex  max-w-4xl flex-col justify-center pr-0"
      formData={formData}
      onSubmit={({formData: editedFormData}) => {
        if (!editedFormData) return;
        void putRefundFeeHeadersByIdApi({
          id: refundFeeHeaderId,
          requestBody: editedFormData,
        }).then((response) => {
          handlePutResponse(response, router);
        });
      }}
      schema={$RefundFeeHeaderUpdateDto}
      submitText={languageData["Edit.Save"]}
      uiSchema={uiSchema}
      useTableForArrayItems
    />
  );
}

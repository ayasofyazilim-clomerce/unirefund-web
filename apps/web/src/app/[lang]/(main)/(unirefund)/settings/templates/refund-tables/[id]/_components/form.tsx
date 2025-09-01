"use client";
import type {
  UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderDto as RefundTableHeaderDto,
  UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderUpdateDto as RefundTableHeaderUpdateDto,
} from "@ayasofyazilim/saas/ContractService";
import {$UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderUpdateDto as $RefundTableHeaderUpdateDto} from "@ayasofyazilim/saas/ContractService";
import {putRefundTableHeadersByIdApi} from "@repo/actions/unirefund/ContractService/put-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {handlePutResponse} from "@repo/utils/api";
import {useParams, useRouter} from "next/navigation";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";

export default function RefundTableHeaderUpdateForm({
  languageData,
  formData,
}: {
  languageData: ContractServiceResource;
  formData: RefundTableHeaderDto;
}) {
  const router = useRouter();
  const {id: refundTableId} = useParams<{id: string}>();
  const uiSchema = createUiSchemaWithResource({
    schema: $RefundTableHeaderUpdateDto,
    resources: languageData,
    name: "Contracts.Form",
    extend: {
      isDefault: {
        "ui:widget": "switch",
        "ui:className": "border px-2 rounded-md h-max self-end",
      },
      isBundling: {
        "ui:widget": "switch",
        "ui:className": "border px-2 rounded-md h-max self-end",
      },
      refundTableDetails: {
        "ui:field": "RefundTableDetailsField",
        "ui:className": "border-none p-0 md:col-span-full",
        "ui:options": {
          copyable: true,
        },
      },
    },
  });
  return (
    <SchemaForm<RefundTableHeaderUpdateDto>
      className="mx-auto flex  max-w-4xl flex-col justify-center pr-0"
      formData={formData}
      onSubmit={({formData: editedFormData}) => {
        void putRefundTableHeadersByIdApi({
          id: refundTableId,
          requestBody: editedFormData,
        }).then((response) => {
          handlePutResponse(response, router);
        });
      }}
      schema={$RefundTableHeaderUpdateDto}
      submitText={languageData["Edit.Save"]}
      uiSchema={uiSchema}
      useDependency
      useTableForArrayItems
    />
  );
}

"use client";
import {useParams, useRouter} from "next/navigation";
import type {
  UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderDto as RefundTableHeaderDto,
  UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderUpdateDto as RefundTableHeaderUpdateDto,
} from "@ayasofyazilim/saas/ContractService";
import {$UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderUpdateDto as $RefundTableHeaderUpdateDto} from "@ayasofyazilim/saas/ContractService";
import {handlePutResponse} from "@repo/utils/api";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {putRefundTableHeadersByIdApi} from "@repo/actions/unirefund/ContractService/put-actions";
import type {ContractServiceResource} from "@/language-data/unirefund/ContractService";
import {RefundTableDetailsField} from "../../_components/refund-table-details-field";

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
      "ui:className": "md:grid md:grid-cols-1 border rounded-md p-2 my-6 md:p-6",
      name: {"ui:className": "flex justify-center items-center"},
      isDefault: {
        "ui:widget": "switch",
        "ui:className": "h-max flex justify-center items-center",
      },
      isBundling: {
        "ui:widget": "switch",
        "ui:className": "h-max flex justify-center items-center",
      },
      refundTableDetails: {
        "ui:field": "RefundTableDetailsField",
        "ui:className": "border-none p-0 md:col-span-full",
      },
    },
  });
  return (
    <SchemaForm<RefundTableHeaderUpdateDto>
      fields={{
        RefundTableDetailsField: RefundTableDetailsField({
          data: formData.refundTableDetails !== null ? formData.refundTableDetails : [],
          languageData,
        }),
      }}
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
    />
  );
}

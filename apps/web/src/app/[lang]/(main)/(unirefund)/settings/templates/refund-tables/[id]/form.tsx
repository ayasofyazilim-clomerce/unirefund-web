"use client";
import type { UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderDto } from "@ayasofyazilim/saas/ContractService";
import { $UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderUpdateDto } from "@ayasofyazilim/saas/ContractService";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { createUiSchemaWithResource } from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import { useRouter } from "next/navigation";
import { handlePutResponse } from "src/actions/core/api-utils-client";
import { putRefundTableHeadersApi } from "src/actions/unirefund/ContractService/put-actions";
import type { ContractServiceResource } from "src/language-data/unirefund/ContractService";

function Form({
  response,
  languageData,
}: {
  response: UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderDto;
  languageData: ContractServiceResource;
}) {
  const router = useRouter();
  const uiSchema = createUiSchemaWithResource({
    resources: languageData,
    schema:
      $UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderUpdateDto,
  });
  return (
    <SchemaForm
      fields={{}}
      formData={response}
      onSubmit={(data) => {
        const formData = {
          id: response.id,
          requestBody: data.formData,
        };
        void putRefundTableHeadersApi(formData).then((res) => {
          handlePutResponse(res, router);
        });
      }}
      schema={
        $UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderUpdateDto
      }
      submitText={languageData.Save}
      uiSchema={uiSchema}
    />
  );
}

export default Form;

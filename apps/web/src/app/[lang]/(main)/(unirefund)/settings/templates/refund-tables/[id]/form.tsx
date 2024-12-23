"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import type { UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderDto } from "@ayasofyazilim/saas/ContractService";
import { $UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderUpdateDto } from "@ayasofyazilim/saas/ContractService";
import ConfirmDialog from "@repo/ayasofyazilim-ui/molecules/confirm-dialog";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { createUiSchemaWithResource } from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import { ActionList } from "@repo/ui/action-button";
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
    extend: {
      "ui:className": "md:grid md:grid-cols-2 md:gap-4",
      name: {
        "ui:className": "md:col-span-full",
      },
    },
  });
  return (
    <SchemaForm
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
      uiSchema={uiSchema}
      useDefaultSubmit={false}
      withScrollArea={false}
    >
      <ActionList className="mb-4 border-0 p-0">
        <ConfirmDialog
          confirmProps={{
            onConfirm: () => {
              toast.warning(languageData.NotImplemented);

              // void deleteRefundTableHeadersById(id).then((res) => {
              //   handleDeleteResponse(res, router, "../");
              // });
            },
            closeAfterConfirm: true,
          }}
          description={languageData["RefundFees.Delete.Description"]}
          loading={false}
          title={languageData["RefundFees.Delete.Title"]}
          triggerProps={{
            variant: "outline",
            disabled: true,
            children: languageData["RefundFees.Delete"],
          }}
          type="with-trigger"
        />
        <Button>{languageData.Save}</Button>
      </ActionList>
    </SchemaForm>
  );
}

export default Form;

"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import type {
  UniRefund_ContractService_Refunds_RefundTableDetails_RefundTableDetailCreateDto,
  UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderDto,
} from "@ayasofyazilim/saas/ContractService";
import { $UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderUpdateDto } from "@ayasofyazilim/saas/ContractService";
import ConfirmDialog from "@repo/ayasofyazilim-ui/molecules/confirm-dialog";
import { tanstackTableEditableColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { TableField } from "@repo/ayasofyazilim-ui/organisms/schema-form/fields";
import { createUiSchemaWithResource } from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import { ActionList } from "@repo/ui/action-button";
import { PlusCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { handlePutResponse } from "src/actions/core/api-utils-client";
import { putRefundTableHeadersByIdApi } from "src/actions/unirefund/ContractService/put-actions";
import type { ContractServiceResource } from "src/language-data/unirefund/ContractService";

type TypeWithId<Type, IdType = string> = Type & {
  id: IdType;
};

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
      refundTableDetails: {
        "ui:className": "md:col-span-full",
        "ui:field": "RebateTable",
      },
    },
  });
  const RebateTableColumns = tanstackTableEditableColumnsByRowData<
    TypeWithId<UniRefund_ContractService_Refunds_RefundTableDetails_RefundTableDetailCreateDto>
  >({
    rows: $UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderUpdateDto
      .properties.refundTableDetails.items.properties,
    excludeColumns: ["extraProperties"],
  });
  return (
    <SchemaForm
      fields={{
        RebateTable: TableField<
          TypeWithId<UniRefund_ContractService_Refunds_RefundTableDetails_RefundTableDetailCreateDto>
        >({
          editable: true,
          columns: RebateTableColumns,
          data: response.refundTableDetails || [],
          fillerColumn: "id",
          tableActions: [
            {
              type: "create-row",
              actionLocation: "table",
              cta: languageData["RefundTables.Form.RefundTableDetails.add"],
              icon: PlusCircle,
            },
          ],
          rowActions: [
            {
              actionLocation: "row",
              cta: languageData["Rebate.Form.rebateTableDetails.delete"],
              icon: Trash2,
              type: "delete-row",
            },
          ],
        }),
      }}
      formData={response}
      onSubmit={(data) => {
        const formData = {
          id: response.id,
          requestBody: data.formData,
        };
        void putRefundTableHeadersByIdApi(formData).then((res) => {
          handlePutResponse(res, router);
        });
      }}
      schema={
        $UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderUpdateDto
      }
      uiSchema={uiSchema}
      useDefaultSubmit={false}
    >
      <ActionList className="sticky bottom-0 z-10 mb-4 border-0 bg-white p-0 py-4">
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

"use client";
import type {
  UniRefund_ContractService_Refunds_RefundTableDetails_RefundTableDetailCreateDto,
  UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderDto,
} from "@ayasofyazilim/saas/ContractService";
import { $UniRefund_ContractService_Refunds_RefundTableDetails_RefundTableDetailCreateByListDto } from "@ayasofyazilim/saas/ContractService";
import { tanstackTableEditableColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { TableField } from "@repo/ayasofyazilim-ui/organisms/schema-form/fields";
import { PlusCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { handlePostResponse } from "src/actions/core/api-utils-client";
import { postRefundTableHeadersRefundTableDetailsApi } from "src/actions/unirefund/ContractService/post-actions";
import type { ContractServiceResource } from "src/language-data/unirefund/ContractService";

type TypeWithId<Type, IdType = string> = Type & {
  id: IdType;
};

export default function RefundTableDetailsForm({
  response,
  languageData,
}: {
  response: UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderDto;
  languageData: ContractServiceResource;
}) {
  const router = useRouter();
  const RebateTableColumns = tanstackTableEditableColumnsByRowData<
    TypeWithId<UniRefund_ContractService_Refunds_RefundTableDetails_RefundTableDetailCreateDto>
  >({
    rows: $UniRefund_ContractService_Refunds_RefundTableDetails_RefundTableDetailCreateByListDto
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
              cta: languageData["Rebate.Form.rebateTableDetails.add"],
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
      formData={response.refundTableDetails || []}
      onSubmit={(data) => {
        const formData = data.formData;

        void postRefundTableHeadersRefundTableDetailsApi({
          id: response.id,
          requestBody: {
            refundTableDetails: formData,
          },
        }).then((res) => {
          handlePostResponse(res, router);
        });
      }}
      schema={
        $UniRefund_ContractService_Refunds_RefundTableDetails_RefundTableDetailCreateByListDto
          .properties.refundTableDetails
      }
      submitText={languageData["RefundTables.Create.Submit"]}
      uiSchema={{
        "ui:field": "RebateTable",
      }}
    />
  );
}

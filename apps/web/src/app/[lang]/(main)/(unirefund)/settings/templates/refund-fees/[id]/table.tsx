"use client";
import {
  $UniRefund_ContractService_Refunds_RefundFeeDetails_RefundFeeDetailCreateByListDto,
  $UniRefund_ContractService_Refunds_RefundFeeDetails_RefundFeeDetailDto,
} from "@ayasofyazilim/saas/ContractService";
import type {
  UniRefund_ContractService_Refunds_RefundFeeDetails_RefundFeeDetailDto,
  UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderDto,
} from "@ayasofyazilim/saas/ContractService";
import { tanstackTableEditableColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { TableField } from "@repo/ayasofyazilim-ui/organisms/schema-form/fields";
import { PlusCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { handlePostResponse } from "src/actions/core/api-utils-client";
import { postRefundFeeHeadersRefundFeeDetailsApi } from "src/actions/unirefund/ContractService/post-actions";
import type { ContractServiceResource } from "src/language-data/unirefund/ContractService";

type TypeWithId<Type, IdType = string> = Type & {
  id: IdType;
};

export default function RefundFeeDetailsForm({
  response,
  languageData,
}: {
  response: UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderDto;
  languageData: ContractServiceResource;
}) {
  const router = useRouter();
  const RebateFeeColumns = tanstackTableEditableColumnsByRowData<
    TypeWithId<UniRefund_ContractService_Refunds_RefundFeeDetails_RefundFeeDetailDto>
  >({
    rows: {
      ...$UniRefund_ContractService_Refunds_RefundFeeDetails_RefundFeeDetailDto.properties,
      feeType: {
        ...$UniRefund_ContractService_Refunds_RefundFeeDetails_RefundFeeDetailDto
          .properties.feeType,
        enum: $UniRefund_ContractService_Refunds_RefundFeeDetails_RefundFeeDetailDto.properties.feeType.enum.map(
          (item) => ({
            value: item,
            label: item,
          }),
        ),
      },
      refundMethod: {
        ...$UniRefund_ContractService_Refunds_RefundFeeDetails_RefundFeeDetailDto
          .properties.refundMethod,
        enum: $UniRefund_ContractService_Refunds_RefundFeeDetails_RefundFeeDetailDto.properties.refundMethod.enum.map(
          (item) => ({
            value: item,
            label: item,
          }),
        ),
      },
    },
  });
  return (
    <SchemaForm
      className="p-0"
      fields={{
        RebateTable: TableField<
          TypeWithId<UniRefund_ContractService_Refunds_RefundFeeDetails_RefundFeeDetailDto>
        >({
          editable: true,
          columns: RebateFeeColumns,
          data: response.refundFeeDetails || [],
          fillerColumn: "id",
          tableActions: [
            {
              type: "create-row",
              actionLocation: "table",
              cta: languageData["Rebate.Create"],
              icon: PlusCircle,
            },
          ],
          rowActions: [
            {
              actionLocation: "row",
              cta: languageData.Delete,
              icon: Trash2,
              type: "delete-row",
            },
          ],
          columnVisibility: {
            type: "hide",
            columns: [
              "id",
              "creationTime",
              "creatorId",
              "lastModificationTime",
              "lastModifierId",
              "isDeleted",
              "deleterId",
              "deletionTime",
              "refundFeeHeaderId",
            ],
          },
        }),
      }}
      formData={response.refundFeeDetails || []}
      onSubmit={(data) => {
        const formData = data.formData;

        void postRefundFeeHeadersRefundFeeDetailsApi({
          id: response.id,
          requestBody: {
            refundFeeDetails: formData,
          },
        }).then((res) => {
          handlePostResponse(res, router);
        });
      }}
      schema={
        $UniRefund_ContractService_Refunds_RefundFeeDetails_RefundFeeDetailCreateByListDto
          .properties.refundFeeDetails
      }
      submitText={languageData["RefundTables.Create.Submit"]}
      uiSchema={{
        "ui:field": "RebateTable",
      }}
    />
  );
}

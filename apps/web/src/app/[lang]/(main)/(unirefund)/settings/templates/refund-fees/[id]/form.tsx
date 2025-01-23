"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import type {
  UniRefund_ContractService_Refunds_RefundFeeDetails_RefundFeeDetailDto,
  UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderDto,
} from "@ayasofyazilim/saas/ContractService";
import {
  $UniRefund_ContractService_Refunds_RefundFeeDetails_RefundFeeDetailDto,
  $UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderUpdateDto,
} from "@ayasofyazilim/saas/ContractService";
import ConfirmDialog from "@repo/ayasofyazilim-ui/molecules/confirm-dialog";
import { tanstackTableEditableColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { TableField } from "@repo/ayasofyazilim-ui/organisms/schema-form/fields";
import { createUiSchemaWithResource } from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import { ActionList } from "@repo/ui/action-button";
import { PlusCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { handlePutResponse } from "src/actions/core/api-utils-client";
import { putRefundFeeHeadersByIdApi } from "src/actions/unirefund/ContractService/put-actions";
import type { ContractServiceResource } from "src/language-data/unirefund/ContractService";

type TypeWithId<Type, IdType = string> = Type & {
  id: IdType;
};

function Form({
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
  const uiSchema = createUiSchemaWithResource({
    resources: languageData,
    schema:
      $UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderUpdateDto,
    extend: {
      refundFeeDetails: {
        "ui:field": "RefundFee",
      },
    },
  });
  return (
    <SchemaForm
      className="w-full"
      fields={{
        RefundFee: TableField<
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
      formData={response}
      onSubmit={(data) => {
        const formData = {
          id: response.id,
          requestBody: data.formData,
        };
        void putRefundFeeHeadersByIdApi(formData).then((res) => {
          handlePutResponse(res, router);
        });
      }}
      schema={
        $UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderUpdateDto
      }
      uiSchema={uiSchema}
      useDefaultSubmit={false}
      withScrollArea={false}
    >
      <ActionList className="sticky bottom-0 z-10 mb-4 border-0 bg-white p-0 py-4">
        <ConfirmDialog
          confirmProps={{
            onConfirm: () => {
              toast.warning(languageData.NotImplemented);

              // void deleteRefundFeeHeadersById(id).then((res) => {
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

import type {
  UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderCreateDto,
  UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderDto,
} from "@ayasofyazilim/saas/ContractService";
import {
  $PagedResultDto_RefundFeeHeaderDto,
  $UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderCreateDto,
} from "@ayasofyazilim/saas/ContractService";
import { createZodObject } from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import type {
  TanstackTableCreationProps,
  TanstackTableLanguageDataType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import { tanstackTableCreateColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import { CheckCircle, PlusCircle, XCircle } from "lucide-react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { handlePostResponse } from "src/actions/core/api-utils-client";
import { postRefundFeeHeadersApi } from "src/actions/unirefund/ContractService/post-actions";

type RefundFeeHeaders =
  TanstackTableCreationProps<UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderDto>;

const booleanOptions = {
  options: [
    {
      value: "true",
      label: "",
      icon: CheckCircle,
      iconClassName: "text-green-700",
    },
    {
      value: "false",
      label: "",
      icon: XCircle,
      iconClassName: "text-red-700",
    },
  ],
};
const refundFeeHeadersColumns = (
  locale: string,
  languageData?: TanstackTableLanguageDataType,
) =>
  tanstackTableCreateColumnsByRowData<UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderDto>(
    {
      rows: $PagedResultDto_RefundFeeHeaderDto.properties.items.items
        .properties,
      languageData,
      config: {
        locale,
      },
      faceted: {
        isActive: booleanOptions,
      },
      links: {
        name: {
          prefix: `refund-fees`,
          targetAccessorKey: "id",
        },
      },
    },
  );

const refundFeeHeadersTable = (params: {
  languageData?: Record<string, string>;
  router: AppRouterInstance;
}) => {
  const table: RefundFeeHeaders = {
    fillerColumn: "name",
    columnVisibility: {
      type: "show",
      columns: ["name", "creationTime", "isActive", "lastModificationTime"],
    },
    columnOrder: ["name", "isActive", "creationTime", "lastModificationTime"],
    tableActions: [
      {
        type: "autoform-dialog",
        actionLocation: "table",
        cta: "New",
        icon: PlusCircle,
        submitText: "Save",
        title: "Create",
        onSubmit(row) {
          void postRefundFeeHeadersApi({
            requestBody:
              row as UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderCreateDto,
          }).then((response) => {
            handlePostResponse(response, params.router);
          });
        },
        schema: createZodObject(
          $UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderCreateDto,
        ),
      },
    ],
  };
  return table;
};

export const tableData = {
  refundFeeHeaders: {
    columns: refundFeeHeadersColumns,
    table: refundFeeHeadersTable,
  },
};

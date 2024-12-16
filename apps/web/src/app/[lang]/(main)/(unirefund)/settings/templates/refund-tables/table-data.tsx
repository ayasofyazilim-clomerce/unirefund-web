import type {
  UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderCreateDto,
  UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderDto,
} from "@ayasofyazilim/saas/ContractService";
import {
  $PagedResultDto_RefundTableHeaderDto,
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
import { postRefundTableHeadersApi } from "src/actions/unirefund/ContractService/post-actions";

type RefundTableHeaders =
  TanstackTableCreationProps<UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderDto>;

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
const refundTableHeadersColumns = (
  locale: string,
  languageData?: TanstackTableLanguageDataType,
) =>
  tanstackTableCreateColumnsByRowData<UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderDto>(
    {
      rows: $PagedResultDto_RefundTableHeaderDto.properties.items.items
        .properties,
      languageData,
      config: {
        locale,
      },
      faceted: {
        isDefault: booleanOptions,
        isBundling: booleanOptions,
      },
      links: {
        name: {
          prefix: `refund-tables`,
          targetAccessorKey: "id",
        },
      },
    },
  );

const refundTableHeadersTable = (params: {
  languageData?: Record<string, string>;
  router: AppRouterInstance;
}) => {
  const table: RefundTableHeaders = {
    fillerColumn: "name",
    columnVisibility: {
      type: "show",
      columns: [
        "name",
        "creationTime",
        "lastModificationTime",
        "isDefault",
        "isBundling",
      ],
    },
    columnOrder: [
      "name",
      "creationTime",
      "lastModificationTime",
      "isDefault",
      "isBundling",
    ],
    tableActions: [
      {
        type: "autoform-dialog",
        actionLocation: "table",
        cta: "New",
        icon: PlusCircle,
        submitText: "Save",
        title: "Create",
        onSubmit(row) {
          void postRefundTableHeadersApi({
            requestBody:
              row as UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderCreateDto,
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
  refundTableHeaders: {
    columns: refundTableHeadersColumns,
    table: refundTableHeadersTable,
  },
};

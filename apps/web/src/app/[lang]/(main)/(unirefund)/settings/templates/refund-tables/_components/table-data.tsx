import type {UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderDto} from "@ayasofyazilim/saas/ContractService";
import {$UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderDto} from "@ayasofyazilim/saas/ContractService";
import type {
  TanstackTableCreationProps,
  TanstackTableLanguageDataType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {PlusCircle} from "lucide-react";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

type RefundTableHeaders =
  TanstackTableCreationProps<UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderDto>;

const refundTableHeadersColumns = (locale: string, languageData?: TanstackTableLanguageDataType) =>
  tanstackTableCreateColumnsByRowData<UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderDto>({
    rows: $UniRefund_ContractService_Refunds_RefundTableHeaders_RefundTableHeaderDto.properties,
    languageData,
    config: {
      locale,
    },
    links: {
      name: {
        prefix: `refund-tables`,
        targetAccessorKey: "id",
      },
    },
    badges: {
      name: {
        values: [
          {
            position: "before",
            label: "Default",
            conditions: [
              {
                conditionAccessorKey: "isDefault",
                when: (value) => value === true,
              },
            ],
          },
          {
            position: "before",
            label: "Bundling",
            conditions: [
              {
                conditionAccessorKey: "isBundling",
                when: (value) => value === true,
              },
            ],
          },
          {
            position: "before",
            label: "Template",
            conditions: [
              {
                conditionAccessorKey: "isTemplate",
                when: (value) => value === true,
              },
            ],
          },
          {
            position: "before",
            label: "Assigned",
            conditions: [
              {
                conditionAccessorKey: "isAssigned",
                when: (value) => value === true,
              },
            ],
          },
          {
            position: "before",
            label: "Customized",
            conditions: [
              {
                conditionAccessorKey: "isCustomizedOverTemplate",
                when: (value) => value === true,
              },
            ],
          },
        ],
      },
    },
  });

const refundTableHeadersTable = (params: {languageData?: Record<string, string>; router: AppRouterInstance}) => {
  const table: RefundTableHeaders = {
    fillerColumn: "name",
    columnVisibility: {
      type: "show",
      columns: ["name", "creationTime", "lastModificationTime"],
    },
    columnOrder: ["name", "creationTime", "lastModificationTime"],
    tableActions: [
      {
        type: "simple",
        actionLocation: "table",
        cta: "New",
        icon: PlusCircle,
        onClick: () => {
          params.router.push("refund-tables/new");
        },
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

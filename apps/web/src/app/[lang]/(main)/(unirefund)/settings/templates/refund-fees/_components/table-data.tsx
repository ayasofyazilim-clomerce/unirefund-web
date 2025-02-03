import type { UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderDto } from "@ayasofyazilim/saas/ContractService";
import { $UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderDto } from "@ayasofyazilim/saas/ContractService";
import type {
  TanstackTableCreationProps,
  TanstackTableLanguageDataType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import { tanstackTableCreateColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type RefundFeeHeaders =
  TanstackTableCreationProps<UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderDto>;

const refundFeeHeadersColumns = (
  locale: string,
  languageData?: TanstackTableLanguageDataType,
) =>
  tanstackTableCreateColumnsByRowData<UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderDto>(
    {
      rows: $UniRefund_ContractService_Refunds_RefundFeeHeaders_RefundFeeHeaderDto.properties,
      languageData,
      config: {
        locale,
      },
      links: {
        name: {
          prefix: `refund-fees`,
          targetAccessorKey: "id",
        },
      },
      badges: {
        name: {
          values: [
            {
              position: "before",
              label: "Active",
              conditions: [
                {
                  conditionAccessorKey: "isActive",
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
      columns: ["name", "creationTime", "lastModificationTime"],
    },
    columnOrder: ["name", "creationTime", "lastModificationTime"],
    tableActions: [
      {
        type: "simple",
        cta: "New",
        actionLocation: "table",
        onClick: () => {
          params.router.push("refund-fees/new");
        },
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

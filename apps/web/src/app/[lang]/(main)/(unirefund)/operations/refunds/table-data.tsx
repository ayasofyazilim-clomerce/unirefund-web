import type { UniRefund_RefundService_Refunds_GetListAsync_RefundListItem } from "@ayasofyazilim/saas/RefundService";
import {
  $PagedResultDto_RefundListItem,
  $UniRefund_RefundService_Enums_RefundReconciliationStatus,
  $UniRefund_RefundService_Enums_RefundStatus,
  $UniRefund_TagService_Tags_RefundType,
} from "@ayasofyazilim/saas/RefundService";
import type {
  TanstackTableCreationProps,
  TanstackTableLanguageDataType,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import { tanstackTableCreateColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import { PlusCircle } from "lucide-react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import isActionGranted from "src/utils/page-policy/action-policy";
import type { ContractServiceResource } from "src/language-data/unirefund/ContractService";
import type { Policy } from "src/utils/page-policy/utils";

type RefundsTable =
  TanstackTableCreationProps<UniRefund_RefundService_Refunds_GetListAsync_RefundListItem>;

function refundsTableActions(
  languageData: ContractServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableTableActionsType[] = [];
  if (isActionGranted(["RefundService.Refunds.Create"], grantedPolicies)) {
    actions.push({
      type: "simple",
      actionLocation: "table",
      cta: languageData.New,
      icon: PlusCircle,
      onClick() {
        router.push("refunds/new");
      },
    });
  }
  return actions;
}

const refundsColumns = (
  locale: string,
  languageData?: TanstackTableLanguageDataType,
) =>
  tanstackTableCreateColumnsByRowData<UniRefund_RefundService_Refunds_GetListAsync_RefundListItem>(
    {
      rows: $PagedResultDto_RefundListItem.properties.items.items.properties,
      languageData,
      config: {
        locale,
      },
    },
  );

function refundsTable(
  languageData: ContractServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
): RefundsTable {
  const table: RefundsTable = {
    fillerColumn: "userDeviceName",
    tableActions: refundsTableActions(languageData, router, grantedPolicies),

    filters: {
      facetedFilters: {
        statusesFilterStatuses: {
          title: "Statuses",
          options: $UniRefund_RefundService_Enums_RefundStatus.enum.map(
            (x) => ({
              label: x,
              value: x,
            }),
          ),
        },
        statusesFilterReconciliationStatuses: {
          title: "ReconciliationStatuses",
          options:
            $UniRefund_RefundService_Enums_RefundReconciliationStatus.enum.map(
              (x) => ({
                label: x,
                value: x,
              }),
            ),
        },
        statusesFilterRefundsTypes: {
          title: "RefundsTypes",
          options: $UniRefund_TagService_Tags_RefundType.enum.map((x) => ({
            label: x,
            value: x,
          })),
        },
      },
      dateFilters: [
        {
          label: "Creation Time",
          startAccessorKey: "timeFilterStartDate",
          endAccessorKey: "timeFilterEndDate",
        },
      ],
    },
  };
  return table;
}
export const tableData = {
  refunds: {
    columns: refundsColumns,
    table: refundsTable,
  },
};

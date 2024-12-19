import type { UniRefund_RefundService_Refunds_GetListAsync_RefundListItem } from "@ayasofyazilim/saas/RefundService";
import {
  $PagedResultDto_RefundListItem,
  $UniRefund_RefundService_Enums_RefundReconciliationStatus,
  $UniRefund_RefundService_Enums_RefundStatus,
  $UniRefund_TagService_Tags_RefundType,
} from "@ayasofyazilim/saas/RefundService";
import type {
  TanstackTableCreationProps,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import { tanstackTableCreateColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import { PlusCircle } from "lucide-react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { TagServiceResource } from "src/language-data/unirefund/TagService";
import isActionGranted from "src/utils/page-policy/action-policy";
import type { Policy } from "src/utils/page-policy/utils";

type RefundsTable =
  TanstackTableCreationProps<UniRefund_RefundService_Refunds_GetListAsync_RefundListItem>;

function refundsTableActions(
  languageData: TagServiceResource,
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

const refundsColumns = (locale: string, languageData: TagServiceResource) =>
  tanstackTableCreateColumnsByRowData<UniRefund_RefundService_Refunds_GetListAsync_RefundListItem>(
    {
      rows: $PagedResultDto_RefundListItem.properties.items.items.properties,
      languageData: {
        refundType: languageData.RefundMethod,
        travellerDocumentNumber: languageData.TravellerDocumentNo,
        refundAmount: languageData.Amount,
        refundCurrency: languageData.Currency,
        travellerFeeAmount: languageData.TravellerFeeAmount,
        processedDate: languageData.ProcessedDate,
        paidDate: languageData.PaidDate,
        referenceNumber: languageData.ReferenceNumber,
        status: languageData.Status,
      },
      config: {
        locale,
      },
    },
  );

function refundsTable(
  languageData: TagServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
): RefundsTable {
  const table: RefundsTable = {
    fillerColumn: "referenceNumber",
    tableActions: refundsTableActions(languageData, router, grantedPolicies),
    columnVisibility: {
      type: "show",
      columns: [
        "paidDate",
        "processedDate",
        "referenceNumber",
        "refundType",
        "refundAmount",
        "refundCurrency",
        "travellerDocumentNumber",
        "travellerFeeAmount",
      ],
    },
    columnOrder: ["referenceNumber", "travellerDocumentNumber"],
    filters: {
      facetedFilters: {
        statusesFilterStatuses: {
          title: languageData.Status,
          options: $UniRefund_RefundService_Enums_RefundStatus.enum.map(
            (x) => ({
              label: x,
              value: x,
            }),
          ),
        },
        statusesFilterReconciliationStatuses: {
          title: languageData.ReconciliationStatuses,
          options:
            $UniRefund_RefundService_Enums_RefundReconciliationStatus.enum.map(
              (x) => ({
                label: x,
                value: x,
              }),
            ),
        },
        statusesFilterRefundTypes: {
          title: languageData.RefundMethod,
          options: $UniRefund_TagService_Tags_RefundType.enum.map((x) => ({
            label: x,
            value: x,
          })),
        },
      },
      dateFilters: [
        {
          label: languageData.CreationTime,
          startAccessorKey: "timeFilterStartDate",
          endAccessorKey: "timeFilterEndDate",
          canFilteredBySingleDate: true,
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

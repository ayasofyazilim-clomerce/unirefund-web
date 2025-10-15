import type {UniRefund_RefundService_Refunds_GetListAsync_RefundListItem} from "@repo/saas/RefundService";
import {
  $PagedResultDto_RefundListItem,
  $UniRefund_RefundService_Enums_RefundReconciliationStatus,
  $UniRefund_RefundService_Enums_RefundStatus,
  $UniRefund_ContractService_Enums_RefundMethod,
} from "@repo/saas/RefundService";
import type {TanstackTableCreationProps} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import type {Policy} from "@repo/utils/policies";
import {isActionGranted} from "@repo/utils/policies";
import type {TagServiceResource} from "src/language-data/unirefund/TagService";
import type {Localization} from "@/providers/tenant";

type RefundsTable = TanstackTableCreationProps<UniRefund_RefundService_Refunds_GetListAsync_RefundListItem>;

const refundsColumns = (
  localization: Localization,
  languageData: TagServiceResource,
  grantedPolicies: Record<Policy, boolean>,
) =>
  tanstackTableCreateColumnsByRowData<UniRefund_RefundService_Refunds_GetListAsync_RefundListItem>({
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
    localization,
    links: {
      referenceNumber: {
        prefix: "refunds",
        targetAccessorKey: "id",
        suffix: "tags",
        conditions: [
          {
            when: () => isActionGranted(["RefundService.Refunds", "RefundService.Refunds.Detail"], grantedPolicies),
            conditionAccessorKey: "referenceNumber",
          },
        ],
      },
    },
  });

function refundsTable(languageData: TagServiceResource): RefundsTable {
  const table: RefundsTable = {
    fillerColumn: "referenceNumber",
    columnVisibility: {
      type: "show",
      columns: [
        "paidDate",
        "processedDate",
        "referenceNumber",
        "refundTypeEnum",
        "refundAmount",
        "refundCurrency",
        "travellerDocumentNumber",
        "travellerFeeAmount",
      ],
    },
    columnOrder: [
      "referenceNumber",
      "travellerDocumentNumber",
      "refundTypeEnum",
      "refundAmount",
      "travellerFeeAmount",
      "refundCurrency",
    ],
    filters: {
      facetedFilters: {
        statusesFilterStatuses: {
          title: languageData.Status,
          options: $UniRefund_RefundService_Enums_RefundStatus.enum.map((x) => ({
            label: x,
            value: x,
          })),
        },
        statusesFilterReconciliationStatuses: {
          title: languageData.ReconciliationStatuses,
          options: $UniRefund_RefundService_Enums_RefundReconciliationStatus.enum.map((x) => ({
            label: x,
            value: x,
          })),
        },
        statusesFilterRefundTypes: {
          title: languageData.RefundMethod,
          options: $UniRefund_ContractService_Enums_RefundMethod.enum.map((x) => ({
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

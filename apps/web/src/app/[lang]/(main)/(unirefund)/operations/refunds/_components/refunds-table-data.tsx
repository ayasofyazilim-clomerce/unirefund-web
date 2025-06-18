import type {UniRefund_RefundService_Refunds_GetListAsync_RefundListItem} from "@ayasofyazilim/saas/RefundService";
import {
  $PagedResultDto_RefundListItem,
  $UniRefund_RefundService_Enums_RefundReconciliationStatus,
  $UniRefund_RefundService_Enums_RefundStatus,
  $UniRefund_TagService_Tags_Enums_RefundType,
} from "@ayasofyazilim/saas/RefundService";
import type {TanstackTableCreationProps} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import type {TagServiceResource} from "src/language-data/unirefund/TagService";

type RefundsTable = TanstackTableCreationProps<UniRefund_RefundService_Refunds_GetListAsync_RefundListItem>;

const refundsColumns = (locale: string, languageData: TagServiceResource) =>
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
    config: {
      locale,
    },
    links: {
      referenceNumber: {
        prefix: "refunds",
        targetAccessorKey: "id",
        suffix: "tags",
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
          options: $UniRefund_TagService_Tags_Enums_RefundType.enum.map((x) => ({
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

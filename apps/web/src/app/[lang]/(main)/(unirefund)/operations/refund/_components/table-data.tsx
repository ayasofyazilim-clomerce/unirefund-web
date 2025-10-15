import type {TanstackTableCreationProps} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import type {UniRefund_TagService_Tags_TagListItemDto} from "@repo/saas/TagService";
import {$UniRefund_TagService_Tags_TagListItemDto} from "@repo/saas/TagService";
import {formatCurrency} from "@repo/ui/utils";
import type {Dispatch, SetStateAction} from "react";
import type {Localization} from "@/providers/tenant";
import type {TagServiceResource} from "src/language-data/unirefund/TagService";

const statusArray = $UniRefund_TagService_Tags_TagListItemDto.properties.status.enum;

type RefundsTable = TanstackTableCreationProps<UniRefund_TagService_Tags_TagListItemDto>;

const taxFreeTagsColumns = (
  localization: Localization,
  languageData: TagServiceResource,
  setSelectedRows: Dispatch<SetStateAction<UniRefund_TagService_Tags_TagListItemDto[]>>,
) =>
  tanstackTableCreateColumnsByRowData<UniRefund_TagService_Tags_TagListItemDto>({
    rows: $UniRefund_TagService_Tags_TagListItemDto.properties,
    custom: {
      tagNumber: {
        showHeader: true,
        content(row) {
          return (
            <div>
              <div>{row.tagNumber || ""}</div>
              <div className="text-xs text-gray-500">{row.merchantTitle || ""}</div>
            </div>
          );
        },
      },
      salesAmount: {
        showHeader: true,
        content(row) {
          return formatCurrency(localization.locale, row.currency || "USD", row.salesAmount || 0);
        },
      },
      vatAmount: {
        showHeader: true,
        content(row) {
          return formatCurrency(localization.locale, row.currency || "USD", row.vatAmount || 0);
        },
      },
      grossRefund: {
        showHeader: true,
        content(row) {
          return formatCurrency(localization.locale, row.currency || "USD", row.grossRefund || 0);
        },
      },
      refundFee: {
        showHeader: true,
        content(row) {
          return formatCurrency(localization.locale, row.currency || "USD", row.refundFee || 0);
        },
      },
      refund: {
        showHeader: true,
        content(row) {
          return formatCurrency(localization.locale, row.currency || "USD", row.refund || 0);
        },
      },
    },
    languageData: {
      tagNumber: languageData.TagNumber,
      status: languageData.Status,
      salesAmount: languageData.SalesAmount,
      vatAmount: languageData.VatAmount,
      grossRefund: languageData.GrossRefund,
      refundFee: languageData.RefundFee,
      refund: languageData.Refund,
      travellerFullName: languageData.TravellerFullName,
      travellerDocumentNumber: languageData.TravellerDocumentNo,
      merchantTitle: languageData.MerchantTitle,
      issueDate: languageData.IssueDate,
      expireDate: languageData.ExpireDate,
      refundType: languageData.RefundMethod,
      invoiceNumber: languageData.InvoiceNumber,
    },
    localization,
    links: {
      tagNumber: {
        prefix: `/${localization.lang}/operations/tax-free-tags`,
        targetAccessorKey: "id",
      },
    },
    selectableRows: true,
    onSelectedRowChange: (selectedRows) => {
      setSelectedRows(selectedRows);
    },
    badges: {
      status: {
        hideColumnValue: true,
        values: statusArray.map((status) => {
          const badgeClasses = {
            None: "text-gray-200 bg-gray-100 border-gray-300", // Durum belirlenmemiş
            Open: "text-green-700 bg-green-100 border-green-300", // İşlem başladı
            Issued: "text-green-700 bg-green-100 border-green-300", // İşlem başladı
            ExportValidated: "text-green-700 bg-green-100 border-green-300", // İşlem başladı
            PreIssued: "text-yellow-400 bg-yellow-100 border-yellow-300", // Hazırlık aşaması
            WaitingGoodsValidation: "text-yellow-500 bg-yellow-100 border-yellow-400", // Bekleyen işlemler
            WaitingStampValidation: "text-yellow-500 bg-yellow-100 border-yellow-400", // Bekleyen işlemler
            Declined: "text-red-500 bg-red-100 border-red-300", // İptal edilmiş
            Cancelled: "text-red-500 bg-red-100 border-red-300", // İptal edilmiş
            Expired: "text-red-500 bg-red-100 border-red-300", // Sona ermiş
            PaymentBlocked: "text-red-400 bg-red-100 border-red-300", // Ödeme engellenmiş
            PaymentProblem: "text-red-400 bg-red-100 border-red-300", // Ödeme problemi
            PaymentInProgress: "text-blue-500 bg-blue-100 border-blue-300", // Ödeme süreci
            Paid: "text-blue-500 bg-blue-100 border-blue-300", // Ödeme tamamlanmış
            Correction: "text-blue-400 bg-blue-100 border-blue-300", // Düzeltme aşaması
            OptedOut: "text-gray-400 bg-gray-100 border-gray-300", // Durumdan çıkmış
          };
          return {
            label: status,
            badgeClassName: badgeClasses[status as keyof typeof badgeClasses],
            conditions: [
              {
                conditionAccessorKey: "status",
                when: (value) => value === status,
              },
            ],
          };
        }),
      },
    },
  });

function taxFreeTagsTable(): RefundsTable {
  const table: RefundsTable = {
    showPagination: false,
    columnOrder: ["tagNumber", "issueDate"],
    columnVisibility: {
      type: "show",
      columns: ["select", "issueDate", "tagNumber", "salesAmount", "vatAmount", "grossRefund", "refundFee", "refund"],
    },
  };
  return table;
}
export const tableData = {
  taxFreeTags: {
    columns: taxFreeTagsColumns,
    table: taxFreeTagsTable,
  },
};

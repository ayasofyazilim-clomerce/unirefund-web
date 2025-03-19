import type {UniRefund_TagService_Tags_TagListItemDto} from "@ayasofyazilim/saas/TagService";
import {$UniRefund_TagService_Tags_TagListItemDto} from "@ayasofyazilim/saas/TagService";
import type {TanstackTableCreationProps} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import type {TagServiceResource} from "src/language-data/unirefund/TagService";

const statusArray = [
  "None",
  "Open",
  "EarlyPaid",
  "PreIssued",
  "Issued",
  "WaitingGoodsValidation",
  "WaitingStampValidation",
  "Declined",
  "ExportValidated",
  "PaymentBlocked",
  "PaymentInProgress",
  "PaymentProblem",
  "Paid",
  "Cancelled",
  "Expired",
  "Correction",
  "OptedOut",
];

type RefundsTable = TanstackTableCreationProps<UniRefund_TagService_Tags_TagListItemDto>;

const taxFreeTagsColumns = (locale: string, languageData: TagServiceResource) =>
  tanstackTableCreateColumnsByRowData<UniRefund_TagService_Tags_TagListItemDto>({
    rows: $UniRefund_TagService_Tags_TagListItemDto.properties,
    languageData: {
      tagNumber: languageData.TagNumber,
      status: languageData.Status,
      travellerFullName: languageData.TravellerFullName,
      travellerDocumentNumber: languageData.TravellerDocumentNo,
      merchantTitle: languageData.MerchantTitle,
      issueDate: languageData.IssueDate,
      expireDate: languageData.ExpireDate,
      refundType: languageData.RefundMethod,
      invoiceNumber: languageData.InvoiceNumber,
    },
    config: {
      locale,
      dateOptions: {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
    },
    links: {
      tagNumber: {
        prefix: "tax-free-tags",
        targetAccessorKey: "id",
      },
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
            EarlyPaid: "text-yellow-700 bg-yellow-100 border-yellow-300",
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
    fillerColumn: "tagNumber",
    columnOrder: ["status", "tagNumber", "travellerFullName", "travellerDocumentNumber", "merchantTitle"],
    columnVisibility: {
      type: "show",
      columns: [
        "select",
        "merchantTitle",
        "status",
        "tagNumber",
        "travellerFullName",
        "travellerDocumentNumber",
        "issueDate",
      ],
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

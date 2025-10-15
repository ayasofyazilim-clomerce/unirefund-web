import type {TanstackTableCreationProps} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import type {UniRefund_TagService_Tags_TagListItemDto} from "@repo/saas/TagService";
import {$UniRefund_TagService_Tags_TagListItemDto} from "@repo/saas/TagService";
import type {Localization} from "@/providers/tenant";
import type {TagServiceResource} from "src/language-data/unirefund/TagService";

type RefundsTable = TanstackTableCreationProps<UniRefund_TagService_Tags_TagListItemDto>;

const taxFreeTagsColumns = (localization: Localization, languageData: TagServiceResource) =>
  tanstackTableCreateColumnsByRowData<UniRefund_TagService_Tags_TagListItemDto>({
    rows: $UniRefund_TagService_Tags_TagListItemDto.properties,
    languageData: {
      tagNumber: languageData.TagNumber,
      merchantTitle: languageData.MerchantTitle,
      issueDate: languageData.IssueDate,
      invoiceNumber: languageData.InvoiceNumber,
    },
    config: {
      dateOptions: {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
    },
    localization,
    links: {
      tagNumber: {
        prefix: "tax-free-tags",
        targetAccessorKey: "id",
      },
    },
  });

function taxFreeTagsTable(): RefundsTable {
  const table: RefundsTable = {
    fillerColumn: "merchantTitle",
    columnOrder: ["tagNumber", "merchantTitle", "issueDate"],
    columnVisibility: {
      type: "show",
      columns: ["tagNumber", "merchantTitle", "issueDate"],
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

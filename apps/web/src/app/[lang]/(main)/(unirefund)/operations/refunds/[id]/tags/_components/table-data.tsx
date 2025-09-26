import type {UniRefund_TagService_Tags_TagListItemDto} from "@repo/saas/TagService";
import {$UniRefund_TagService_Tags_TagListItemDto} from "@repo/saas/TagService";
import type {TanstackTableCreationProps} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import type {TagServiceResource} from "src/language-data/unirefund/TagService";
import type {Localization} from "@/providers/tenant";
import {TextWithSubText} from "../../_components/text-with-subtext";

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
    custom: {
      totals: {
        showHeader: false,
        content: (row) => {
          const totals = row.totals;
          if (!totals) return null;
          const refundIndex = totals.findIndex((t) => t.totalType === "Refund");
          const salesAmountIndex = totals.findIndex((t) => t.totalType === "SalesAmount");
          return (
            <>
              {refundIndex !== -1 && (
                <TextWithSubText
                  className="rounded-md border px-1"
                  subText={`${totals[refundIndex].amount} ${totals[refundIndex].currency}`}
                  text="Refund"
                />
              )}
              {salesAmountIndex !== -1 && (
                <TextWithSubText
                  className="rounded-md border px-1"
                  subText={`${totals[salesAmountIndex].amount} ${totals[salesAmountIndex].currency}`}
                  text="Sales Amount"
                />
              )}
            </>
          );
        },
      },
    },
  });

function taxFreeTagsTable(): RefundsTable {
  const table: RefundsTable = {
    fillerColumn: "merchantTitle",
    columnOrder: ["tagNumber", "merchantTitle", "issueDate", "totals"],
    columnVisibility: {
      type: "show",
      columns: ["tagNumber", "merchantTitle", "issueDate", "totals"],
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

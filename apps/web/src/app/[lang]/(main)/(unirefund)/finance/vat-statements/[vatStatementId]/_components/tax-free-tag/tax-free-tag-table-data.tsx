import type { UniRefund_FinanceService_VATStatementTagDetails_VATStatementTagDetailWithoutAuditedDto } from "@ayasofyazilim/saas/FinanceService";
import { $UniRefund_FinanceService_VATStatementTagDetails_VATStatementTagDetailWithoutAuditedDto } from "@ayasofyazilim/saas/FinanceService";
import type {
  TanstackTableColumnLink,
  TanstackTableCreationProps,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import { tanstackTableCreateColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import type { FinanceServiceResource } from "src/language-data/unirefund/FinanceService";
import isActionGranted from "src/utils/page-policy/action-policy";
import type { Policy } from "src/utils/page-policy/utils";

type TaxFreeTagTable =
  TanstackTableCreationProps<UniRefund_FinanceService_VATStatementTagDetails_VATStatementTagDetailWithoutAuditedDto>;

const links: Partial<
  Record<
    keyof UniRefund_FinanceService_VATStatementTagDetails_VATStatementTagDetailWithoutAuditedDto,
    TanstackTableColumnLink
  >
> = {};

function taxFreeTagColumns(
  locale: string,
  languageData: FinanceServiceResource,
  grantedPolicies: Record<Policy, boolean>,
) {
  if (isActionGranted([], grantedPolicies)) {
    links.tagNumber = {
      prefix: `/operations/details`,
      targetAccessorKey: "tagId",
    };
  }
  return tanstackTableCreateColumnsByRowData<UniRefund_FinanceService_VATStatementTagDetails_VATStatementTagDetailWithoutAuditedDto>(
    {
      rows: $UniRefund_FinanceService_VATStatementTagDetails_VATStatementTagDetailWithoutAuditedDto.properties,
      languageData: {
        languageData,
        constantKey: "Form",
      },
      config: {
        locale,
      },
      links,
    },
  );
}

function taxFreeTagTable() {
  const table: TaxFreeTagTable = {
    fillerColumn: "tagNumber",
    columnOrder: [
      "tagNumber",
      "refundDate",
      "grandTotal",
      "taxAmount",
      "refundAmount",
      "correctedAmount",
    ],
    pinColumns: ["tagNumber"],

    columnVisibility: {
      type: "hide",
      columns: ["tagId"],
    },
  };
  return table;
}

export const tableData = {
  TaxFreeTag: {
    columns: taxFreeTagColumns,
    table: taxFreeTagTable,
  },
};

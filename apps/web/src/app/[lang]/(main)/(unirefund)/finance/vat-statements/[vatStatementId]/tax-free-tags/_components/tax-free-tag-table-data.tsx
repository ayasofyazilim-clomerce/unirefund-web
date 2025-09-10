import type {UniRefund_FinanceService_VATStatementTagDetails_VATStatementTagDetailDto} from "@repo/saas/FinanceService";
import {$UniRefund_FinanceService_VATStatementTagDetails_VATStatementTagDetailDto} from "@repo/saas/FinanceService";
import type {
  TanstackTableColumnLink,
  TanstackTableCreationProps,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import type {Policy} from "@repo/utils/policies";
import {isActionGranted} from "@repo/utils/policies";
import type {FinanceServiceResource} from "src/language-data/unirefund/FinanceService";

type TaxFreeTagTable =
  TanstackTableCreationProps<UniRefund_FinanceService_VATStatementTagDetails_VATStatementTagDetailDto>;

const links: Partial<
  Record<keyof UniRefund_FinanceService_VATStatementTagDetails_VATStatementTagDetailDto, TanstackTableColumnLink>
> = {};

function taxFreeTagColumns(
  locale: string,
  languageData: FinanceServiceResource,
  grantedPolicies: Record<Policy, boolean>,
) {
  if (isActionGranted(["FinanceService.VATStatementHeaders.View"], grantedPolicies)) {
    links.tagNumber = {
      prefix: `/operations/tax-free-tags`,
      targetAccessorKey: "tagId",
    };
  }
  return tanstackTableCreateColumnsByRowData<UniRefund_FinanceService_VATStatementTagDetails_VATStatementTagDetailDto>({
    rows: $UniRefund_FinanceService_VATStatementTagDetails_VATStatementTagDetailDto.properties,
    languageData: {
      languageData,
      constantKey: "Form.VatStatement",
    },
    config: {
      locale,
    },
    links,
  });
}

function taxFreeTagTable() {
  const table: TaxFreeTagTable = {
    fillerColumn: "tagNumber",
    columnOrder: [
      "tagNumber",
      "merchantName",
      "refundDate",
      "currency",
      "taxAmount",
      "refundAmount",
      "correctedAmount",
      "grandTotalAmount",
    ],
    pinColumns: ["tagNumber"],

    columnVisibility: {
      type: "hide",
      columns: ["tagId", "id", "merchantId"],
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

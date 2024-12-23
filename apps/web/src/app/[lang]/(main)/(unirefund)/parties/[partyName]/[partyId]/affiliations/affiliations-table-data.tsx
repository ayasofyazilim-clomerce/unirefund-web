import type { UniRefund_CRMService_AffiliationCodes_AffiliationCodeDto } from "@ayasofyazilim/saas/CRMService";
import { $UniRefund_CRMService_AffiliationCodes_AffiliationCodeDto } from "@ayasofyazilim/saas/CRMService";
import type { TanstackTableCreationProps } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import { tanstackTableCreateColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";

type IndividualsTable =
  TanstackTableCreationProps<UniRefund_CRMService_AffiliationCodes_AffiliationCodeDto>;

export function affiliationsColumns(
  languageData: CRMServiceServiceResource,
  locale: string,
) {
  return tanstackTableCreateColumnsByRowData<UniRefund_CRMService_AffiliationCodes_AffiliationCodeDto>(
    {
      languageData,
      rows: $UniRefund_CRMService_AffiliationCodes_AffiliationCodeDto.properties,
      config: {
        locale,
      },
    },
  );
}

function affiliationsTable(): IndividualsTable {
  const table: IndividualsTable = {
    fillerColumn: "name",
    columnOrder: ["name", "description"],
    columnVisibility: {
      type: "show",
      columns: ["name", "description", "creationTime"],
    },
  };
  return table;
}
export const tableData = {
  affiliations: {
    columns: affiliationsColumns,
    table: affiliationsTable,
  },
};

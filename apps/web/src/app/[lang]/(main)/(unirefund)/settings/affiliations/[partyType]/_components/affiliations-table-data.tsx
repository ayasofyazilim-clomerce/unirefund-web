import type { UniRefund_CRMService_AffiliationCodes_AffiliationCodeDto } from "@ayasofyazilim/saas/CRMService";
import { $UniRefund_CRMService_AffiliationCodes_AffiliationCodeDto } from "@ayasofyazilim/saas/CRMService";
import type { GetApiIdentityRolesAssignableRolesByCurrentUserResponse } from "@ayasofyazilim/saas/IdentityService";
import type { TanstackTableCreationProps } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import { tanstackTableCreateColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import { PlusCircle } from "lucide-react";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";
import Form from "./form";

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

function affiliationsTable(
  languageData: CRMServiceServiceResource,
  assignableRoles: GetApiIdentityRolesAssignableRolesByCurrentUserResponse,
): IndividualsTable {
  const createAffilationSchema = Form({ languageData, assignableRoles });

  const table: IndividualsTable = {
    fillerColumn: "name",
    columnOrder: ["name", "description"],
    columnVisibility: {
      type: "show",
      columns: ["name", "description", "creationTime"],
    },
    tableActions: [
      {
        type: "schemaform-dialog",
        actionLocation: "table",
        cta: "New",
        icon: PlusCircle,
        title: "New Affiliation",
        ...createAffilationSchema,
      },
    ],
  };
  return table;
}
export const tableData = {
  affiliations: {
    columns: affiliationsColumns,
    table: affiliationsTable,
  },
};

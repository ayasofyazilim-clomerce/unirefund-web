import type { UniRefund_CRMService_AffiliationCodes_AffiliationCodeDto as AffiliationCodeDto } from "@ayasofyazilim/saas/CRMService";
import { $UniRefund_CRMService_AffiliationCodes_AffiliationCodeDto as $AffiliationCodeDto } from "@ayasofyazilim/saas/CRMService";
import type { GetApiIdentityRolesAssignableRolesByCurrentUserResponse } from "@ayasofyazilim/saas/IdentityService";
import type { TanstackTableCreationProps } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import { tanstackTableCreateColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import { PlusCircle } from "lucide-react";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";
import isActionGranted from "src/utils/page-policy/action-policy";
import type { Policy } from "src/utils/page-policy/utils";
import FormProps, { DetailsForm } from "./form";

type IndividualsTable = TanstackTableCreationProps<AffiliationCodeDto>;

export function affiliationsColumns(
  languageData: CRMServiceServiceResource,
  locale: string,
  grantedPolicies: Record<Policy, boolean>,
) {
  const trigger:
    | {
        expandRowTrigger?: keyof AffiliationCodeDto;
      }
    | undefined = isActionGranted(
    ["CRMService.AffiliationCodes.Edit"],
    grantedPolicies,
  )
    ? { expandRowTrigger: "name" }
    : undefined;
  return tanstackTableCreateColumnsByRowData<AffiliationCodeDto>({
    languageData,
    rows: $AffiliationCodeDto.properties,
    config: {
      locale,
    },
    ...trigger,
  });
}

function affiliationsTable(
  languageData: CRMServiceServiceResource,
  assignableRoles: GetApiIdentityRolesAssignableRolesByCurrentUserResponse,
  grantedPolicies: Record<Policy, boolean>,
): IndividualsTable {
  const table: IndividualsTable = {
    fillerColumn: "name",
    columnOrder: ["name", "description"],
    columnVisibility: {
      type: "show",
      columns: ["name", "description", "creationTime"],
    },
    expandedRowComponent: (row) => {
      if (
        isActionGranted(["CRMService.AffiliationCodes.Edit"], grantedPolicies)
      ) {
        return (
          <DetailsForm
            assignableRoles={assignableRoles}
            details={row}
            languageData={languageData}
          />
        );
      }
      return <div />;
    },
    tableActions: [
      {
        type: "schemaform-dialog",
        actionLocation: "table",
        cta: "New",
        icon: PlusCircle,
        title: "New Affiliation",
        ...FormProps({
          languageData,
          assignableRoles,
        }),
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

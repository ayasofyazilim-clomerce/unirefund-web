import type { UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto } from "@ayasofyazilim/saas/CRMService";
import { $UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto } from "@ayasofyazilim/saas/CRMService";
import type {
  TanstackTableColumnLink,
  TanstackTableCreationProps,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import { tanstackTableCreateColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import { PlusCircle } from "lucide-react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import isActionGranted from "src/utils/page-policy/action-policy";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";
import type { Policy } from "src/utils/page-policy/utils";

type TaxOfficesTable =
  TanstackTableCreationProps<UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto>;

const links: Partial<
  Record<
    keyof UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto,
    TanstackTableColumnLink
  >
> = {};

function taxOfficesTableActions(
  languageData: CRMServiceServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableTableActionsType[] = [];
  if (isActionGranted(["CRMService.TaxOffices.Create"], grantedPolicies)) {
    actions.push({
      type: "simple",
      actionLocation: "table",
      cta: languageData.New,
      icon: PlusCircle,
      onClick() {
        router.push("tax-offices/new");
      },
    });
  }
  return actions;
}
function taxOfficesColumns(
  locale: string,
  languageData: CRMServiceServiceResource,
  grantedPolicies: Record<Policy, boolean>,
) {
  if (isActionGranted(["CRMService.TaxOffices.Edit"], grantedPolicies)) {
    links.name = {
      prefix: "/parties/tax-offices",
      targetAccessorKey: "id",
    };
  }
  return tanstackTableCreateColumnsByRowData<UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto>(
    {
      rows: $UniRefund_CRMService_TaxOffices_TaxOfficeProfileDto.properties,
      languageData: {
        name: languageData.Name,
      },
      config: {
        locale,
      },
      links,
      faceted: {},
    },
  );
}

function taxOfficesTable(
  languageData: CRMServiceServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const table: TaxOfficesTable = {
    fillerColumn: "name",
    columnVisibility: {
      type: "hide",
      columns: ["id", "organizationId", "parentId"],
    },
    tableActions: taxOfficesTableActions(languageData, router, grantedPolicies),
    columnOrder: ["name"],
    filters: {
      textFilters: ["name"],
    },
  };
  return table;
}

export const tableData = {
  taxOffices: {
    columns: taxOfficesColumns,
    table: taxOfficesTable,
  },
};

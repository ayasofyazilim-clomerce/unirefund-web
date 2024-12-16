import type { UniRefund_CRMService_TaxFrees_TaxFreeProfileDto } from "@ayasofyazilim/saas/CRMService";
import { $UniRefund_CRMService_TaxFrees_TaxFreeProfileDto } from "@ayasofyazilim/saas/CRMService";
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

type TaxFreeTable =
  TanstackTableCreationProps<UniRefund_CRMService_TaxFrees_TaxFreeProfileDto>;

const links: Partial<
  Record<
    keyof UniRefund_CRMService_TaxFrees_TaxFreeProfileDto,
    TanstackTableColumnLink
  >
> = {};

function taxFreeTableActions(
  languageData: CRMServiceServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableTableActionsType[] = [];
  if (isActionGranted(["CRMService.TaxFrees.Create"], grantedPolicies)) {
    actions.push({
      type: "simple",
      actionLocation: "table",
      cta: languageData.New,
      icon: PlusCircle,
      onClick() {
        router.push("tax-free/new");
      },
    });
  }
  return actions;
}
function taxFreeColumns(
  locale: string,
  languageData: CRMServiceServiceResource,
  grantedPolicies: Record<Policy, boolean>,
) {
  if (isActionGranted(["CRMService.TaxFrees.Edit"], grantedPolicies)) {
    links.name = {
      prefix: "/parties/tax-free",
      targetAccessorKey: "id",
    };
  }

  return tanstackTableCreateColumnsByRowData<UniRefund_CRMService_TaxFrees_TaxFreeProfileDto>(
    {
      rows: $UniRefund_CRMService_TaxFrees_TaxFreeProfileDto.properties,
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
function taxFreeTable(
  languageData: CRMServiceServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const table: TaxFreeTable = {
    fillerColumn: "name",
    columnVisibility: {
      type: "hide",
      columns: ["id", "organizationId", "parentId"],
    },
    tableActions: taxFreeTableActions(languageData, router, grantedPolicies),
    columnOrder: ["name"],
    filters: {
      textFilters: ["name"],
    },
  };
  return table;
}

export const tableData = {
  taxFrees: {
    columns: taxFreeColumns,
    table: taxFreeTable,
  },
};

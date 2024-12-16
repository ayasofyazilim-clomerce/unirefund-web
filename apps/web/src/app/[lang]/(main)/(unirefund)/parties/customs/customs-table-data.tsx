import type { UniRefund_CRMService_Customss_CustomsProfileDto } from "@ayasofyazilim/saas/CRMService";
import { $UniRefund_CRMService_Customss_CustomsProfileDto } from "@ayasofyazilim/saas/CRMService";
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

type CustomsTable =
  TanstackTableCreationProps<UniRefund_CRMService_Customss_CustomsProfileDto>;

const links: Partial<
  Record<
    keyof UniRefund_CRMService_Customss_CustomsProfileDto,
    TanstackTableColumnLink
  >
> = {};

function customsTableActions(
  languageData: CRMServiceServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableTableActionsType[] = [];
  if (isActionGranted(["CRMService.Customs.Create"], grantedPolicies)) {
    actions.push({
      type: "simple",
      actionLocation: "table",
      cta: languageData.New,
      icon: PlusCircle,
      onClick() {
        router.push("customs/new");
      },
    });
  }
  return actions;
}
function customsColumns(
  locale: string,
  languageData: CRMServiceServiceResource,
  grantedPolicies: Record<Policy, boolean>,
) {
  if (isActionGranted(["CRMService.Customs.Edit"], grantedPolicies)) {
    links.name = {
      prefix: "/parties/customs",
      targetAccessorKey: "id",
    };
  }
  return tanstackTableCreateColumnsByRowData<UniRefund_CRMService_Customss_CustomsProfileDto>(
    {
      rows: $UniRefund_CRMService_Customss_CustomsProfileDto.properties,
      languageData: {
        name: languageData.Name,
      },
      config: {
        locale,
      },
      links,
    },
  );
}
function customsTable(
  languageData: CRMServiceServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const table: CustomsTable = {
    fillerColumn: "name",
    columnVisibility: {
      type: "hide",
      columns: ["id", "organizationId", "parentId"],
    },
    tableActions: customsTableActions(languageData, router, grantedPolicies),
    columnOrder: ["name"],
    filters: {
      textFilters: ["name"],
    },
  };
  return table;
}

export const tableData = {
  customs: {
    columns: customsColumns,
    table: customsTable,
  },
};

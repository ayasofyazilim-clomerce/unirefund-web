import type {Volo_Saas_Host_Dtos_EditionDto} from "@ayasofyazilim/saas/SaasService";
import {$Volo_Saas_Host_Dtos_EditionDto} from "@ayasofyazilim/saas/SaasService";
import type {
  TanstackTableColumnLink,
  TanstackTableCreationProps,
  TanstackTableRowActionsType,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {Plus, User2Icon} from "lucide-react";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import type {SaasServiceResource} from "src/language-data/core/SaasService";
import isActionGranted from "src/utils/page-policy/action-policy";
import type {Policy} from "src/utils/page-policy/utils";

type EditionsTable = TanstackTableCreationProps<Volo_Saas_Host_Dtos_EditionDto>;

const links: Partial<Record<keyof Volo_Saas_Host_Dtos_EditionDto, TanstackTableColumnLink>> = {};

function editionsTableActions(
  languageData: SaasServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableTableActionsType[] = [];
  if (isActionGranted(["Saas.Editions.Create"], grantedPolicies)) {
    actions.push({
      type: "simple",
      actionLocation: "table",
      cta: languageData["Edition.New"],
      icon: Plus,
      onClick: () => {
        router.push("editions/new");
      },
    });
  }
  return actions;
}
function editionsRowActions(
  languageData: SaasServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableRowActionsType<Volo_Saas_Host_Dtos_EditionDto>[] = [];
  if (isActionGranted(["Saas.Editions.Update"], grantedPolicies)) {
    actions.push({
      type: "simple",
      actionLocation: "row",
      condition: (row) => row.tenantCount !== 0,
      cta: languageData["Edition.MoveAllTenants"],
      icon: User2Icon,
      onClick: (row) => {
        router.push(`editions/${row.id}/move-all-tenants`);
      },
    });
  }
  return actions;
}
const editionsColumns = (
  locale: string,
  languageData: SaasServiceResource,
  grantedPolicies: Record<Policy, boolean>,
) => {
  if (isActionGranted(["Saas.Editions.Update"], grantedPolicies)) {
    links.displayName = {
      prefix: "editions",
      targetAccessorKey: "id",
    };
  }
  return tanstackTableCreateColumnsByRowData<Volo_Saas_Host_Dtos_EditionDto>({
    rows: $Volo_Saas_Host_Dtos_EditionDto.properties,
    languageData: {
      languageData,
      constantKey: "Form.Edition",
    },
    config: {
      locale,
    },
    links,
  });
};
function editionsTable(
  languageData: SaasServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const table: EditionsTable = {
    fillerColumn: "displayName",
    pinColumns: ["displayName"],
    columnVisibility: {
      type: "show",
      columns: ["displayName", "tenantCount"],
    },
    filters: {
      textFilters: ["filter"],
    },
    tableActions: editionsTableActions(languageData, router, grantedPolicies),
    rowActions: editionsRowActions(languageData, router, grantedPolicies),
  };
  return table;
}

export const tableData = {
  editions: {
    columns: editionsColumns,
    table: editionsTable,
  },
};

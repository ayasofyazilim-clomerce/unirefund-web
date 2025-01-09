import type { Volo_Abp_OpenIddict_Scopes_Dtos_ScopeDto } from "@ayasofyazilim/saas/IdentityService";
import { $Volo_Abp_OpenIddict_Scopes_Dtos_ScopeDto } from "@ayasofyazilim/saas/IdentityService";
import type {
  TanstackTableColumnLink,
  TanstackTableCreationProps,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import { tanstackTableCreateColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import { Plus } from "lucide-react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { IdentityServiceResource } from "src/language-data/core/IdentityService";
import isActionGranted from "src/utils/page-policy/action-policy";
import type { Policy } from "src/utils/page-policy/utils";

type ScopesTable =
  TanstackTableCreationProps<Volo_Abp_OpenIddict_Scopes_Dtos_ScopeDto>;

const links: Partial<
  Record<
    keyof Volo_Abp_OpenIddict_Scopes_Dtos_ScopeDto,
    TanstackTableColumnLink
  >
> = {};

function scopesTableActions(
  languageData: IdentityServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableTableActionsType[] = [];
  if (isActionGranted(["OpenIddictPro.Scope.Create"], grantedPolicies)) {
    actions.push({
      type: "simple",
      actionLocation: "table",
      cta: languageData["Scope.New"],
      icon: Plus,
      onClick: () => {
        router.push("scopes/new");
      },
    });
  }
  return actions;
}

const scopesColumns = (
  locale: string,
  languageData: IdentityServiceResource,
  grantedPolicies: Record<Policy, boolean>,
) => {
  if (isActionGranted(["OpenIddictPro.Scope.Update"], grantedPolicies)) {
    links.name = {
      prefix: "scopes",
      targetAccessorKey: "id",
    };
  }
  return tanstackTableCreateColumnsByRowData<Volo_Abp_OpenIddict_Scopes_Dtos_ScopeDto>(
    {
      rows: $Volo_Abp_OpenIddict_Scopes_Dtos_ScopeDto.properties,
      languageData: {
        languageData,
        constantKey: "Form.Scope",
      },
      config: {
        locale,
      },
      links,
    },
  );
};

function scopesTable(
  languageData: IdentityServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const table: ScopesTable = {
    fillerColumn: "name",
    pinColumns: ["name"],
    columnVisibility: {
      type: "show",
      columns: ["name", "displayName", "description"],
    },
    filters: {
      textFilters: ["filter"],
    },
    tableActions: scopesTableActions(languageData, router, grantedPolicies),
  };
  return table;
}

export const tableData = {
  scopes: {
    columns: scopesColumns,
    table: scopesTable,
  },
};

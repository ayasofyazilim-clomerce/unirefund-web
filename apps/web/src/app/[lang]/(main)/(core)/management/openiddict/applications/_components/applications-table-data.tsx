import type { Volo_Abp_OpenIddict_Applications_Dtos_ApplicationDto } from "@ayasofyazilim/saas/IdentityService";
import { $Volo_Abp_OpenIddict_Applications_Dtos_ApplicationDto } from "@ayasofyazilim/saas/IdentityService";
import type {
  TanstackTableColumnLink,
  TanstackTableCreationProps,
  TanstackTableRowActionsType,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import { tanstackTableCreateColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import { Plus, ShieldCheck, ToyBrick } from "lucide-react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { IdentityServiceResource } from "src/language-data/core/IdentityService";
import isActionGranted from "src/utils/page-policy/action-policy";
import type { Policy } from "src/utils/page-policy/utils";

type ApplicationsTable =
  TanstackTableCreationProps<Volo_Abp_OpenIddict_Applications_Dtos_ApplicationDto>;

const links: Partial<
  Record<
    keyof Volo_Abp_OpenIddict_Applications_Dtos_ApplicationDto,
    TanstackTableColumnLink
  >
> = {};

function applicationsTableActions(
  languageData: IdentityServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableTableActionsType[] = [];
  if (isActionGranted(["OpenIddictPro.Application.Create"], grantedPolicies)) {
    actions.push({
      type: "simple",
      actionLocation: "table",
      cta: languageData["Application.New"],
      icon: Plus,
      onClick: () => {
        router.push("applications/new");
      },
    });
  }
  return actions;
}

function tenantsRowActions(
  languageData: IdentityServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableRowActionsType<Volo_Abp_OpenIddict_Applications_Dtos_ApplicationDto>[] =
    [];
  if (
    isActionGranted(
      ["OpenIddictPro.Application.ManagePermissions"],
      grantedPolicies,
    )
  ) {
    actions.push({
      type: "simple",
      actionLocation: "row",
      cta: languageData["Application.Permissions"],
      icon: ShieldCheck,
      onClick: (row) => {
        router.push(`applications/${row.id}/permissions`);
      },
    });
  }
  if (isActionGranted(["OpenIddictPro.Application.Update"], grantedPolicies)) {
    actions.push({
      type: "simple",
      actionLocation: "row",
      cta: languageData["Application.LifeToken"],
      icon: ToyBrick,
      onClick: (row) => {
        router.push(`applications/${row.id}/life-token`);
      },
    });
  }
  return actions;
}

const applicationsColumns = (
  locale: string,
  languageData: IdentityServiceResource,
  grantedPolicies: Record<Policy, boolean>,
) => {
  if (isActionGranted(["OpenIddictPro.Application.Update"], grantedPolicies)) {
    links.displayName = {
      prefix: "applications",
      targetAccessorKey: "id",
    };
  }
  return tanstackTableCreateColumnsByRowData<Volo_Abp_OpenIddict_Applications_Dtos_ApplicationDto>(
    {
      rows: $Volo_Abp_OpenIddict_Applications_Dtos_ApplicationDto.properties,
      languageData: {
        languageData,
        constantKey: "Form.Application",
      },
      config: {
        locale,
      },
      links,
    },
  );
};

function applicationsTable(
  languageData: IdentityServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const table: ApplicationsTable = {
    fillerColumn: "displayName",
    pinColumns: ["displayName"],
    columnVisibility: {
      type: "show",
      columns: ["displayName", "clientId", "applicationType", "clientType"],
    },
    filters: {
      textFilters: ["filter"],
    },
    tableActions: applicationsTableActions(
      languageData,
      router,
      grantedPolicies,
    ),
    rowActions: tenantsRowActions(languageData, router, grantedPolicies),
  };
  return table;
}

export const tableData = {
  applications: {
    columns: applicationsColumns,
    table: applicationsTable,
  },
};

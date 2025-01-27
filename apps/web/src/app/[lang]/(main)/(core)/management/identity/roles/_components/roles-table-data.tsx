import type { Volo_Abp_Identity_IdentityRoleDto } from "@ayasofyazilim/saas/IdentityService";
import { $Volo_Abp_Identity_IdentityRoleDto } from "@ayasofyazilim/saas/IdentityService";
import type {
  TanstackTableColumnLink,
  TanstackTableCreationProps,
  TanstackTableRowActionsType,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import { tanstackTableCreateColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {
  FolderCheck,
  Layers,
  Plus,
  ShieldCheck,
  User2Icon,
} from "lucide-react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { IdentityServiceResource } from "src/language-data/core/IdentityService";
import isActionGranted from "src/utils/page-policy/action-policy";
import type { Policy } from "src/utils/page-policy/utils";

type RolesTable = TanstackTableCreationProps<Volo_Abp_Identity_IdentityRoleDto>;

const links: Partial<
  Record<keyof Volo_Abp_Identity_IdentityRoleDto, TanstackTableColumnLink>
> = {};
const badgeClassNames = {
  Public: "text-blue-500 bg-blue-100 border-blue-500",
  Default: "text-green-500 bg-green-100 border-green-500",
  Static: "text-red-500 bg-red-100 border-red-500",
};
function rolesTableActions(
  languageData: IdentityServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableTableActionsType[] = [];
  if (isActionGranted(["AbpIdentity.Roles.Create"], grantedPolicies)) {
    actions.push({
      type: "simple",
      actionLocation: "table",
      cta: languageData["Role.New"],
      icon: Plus,
      onClick: () => {
        router.push("roles/new");
      },
    });
  }
  return actions;
}
function rolesRowActions(
  languageData: IdentityServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableRowActionsType<Volo_Abp_Identity_IdentityRoleDto>[] =
    [];
  if (
    isActionGranted(["AbpIdentity.Roles.ManagePermissions"], grantedPolicies)
  ) {
    actions.push({
      type: "simple",
      actionLocation: "row",
      cta: languageData["Role.Permissions"],
      icon: ShieldCheck,
      onClick: (row) => {
        router.push(`roles/${row.id}/permissions`);
      },
    });
  }
  if (isActionGranted(["AbpIdentity.Roles.Update"], grantedPolicies)) {
    actions.push({
      type: "simple",
      actionLocation: "row",
      cta: languageData["Role.MoveAllUsers"],
      condition: (row) => row.userCount !== 0,
      icon: User2Icon,
      onClick: (row) => {
        router.push(`roles/${row.id}/move-all-users`);
      },
    });
  }
  if (isActionGranted(["AbpIdentity.Roles.Update"], grantedPolicies)) {
    actions.push({
      type: "simple",
      actionLocation: "row",
      cta: languageData["Role.Claims"],
      icon: FolderCheck,
      onClick: (row) => {
        router.push(`roles/${row.id}/claims`);
      },
    });
  }
  if (isActionGranted(["IdentityService.AssignableRoles"], grantedPolicies)) {
    actions.push({
      type: "simple",
      actionLocation: "row",
      cta: languageData["Role.Assignable"],
      icon: Layers,
      onClick: (row) => {
        router.push(`roles/${row.id}/assignable-roles`);
      },
    });
  }
  return actions;
}
const rolesColumns = (
  locale: string,
  languageData: IdentityServiceResource,
  grantedPolicies: Record<Policy, boolean>,
) => {
  if (isActionGranted(["AbpIdentity.Roles.Update"], grantedPolicies)) {
    links.name = {
      prefix: "roles",
      targetAccessorKey: "id",
    };
  }
  return tanstackTableCreateColumnsByRowData<Volo_Abp_Identity_IdentityRoleDto>(
    {
      rows: $Volo_Abp_Identity_IdentityRoleDto.properties,
      languageData: {
        languageData,
        constantKey: "Form.Role",
      },
      config: {
        locale,
      },
      links,
      badges: {
        name: {
          values: Object.keys(badgeClassNames).map((key) => ({
            position: "after",
            label:
              languageData[`Form.Role.is${key}` as keyof typeof languageData],
            badgeClassName:
              badgeClassNames[key as keyof typeof badgeClassNames],
            conditions: [
              {
                conditionAccessorKey: `is${key}`,
                when: (value) => value === true,
              },
            ],
          })),
        },
      },
    },
  );
};

function rolesTable(
  languageData: IdentityServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const table: RolesTable = {
    fillerColumn: "name",
    pinColumns: ["name"],
    columnVisibility: {
      type: "show",
      columns: ["name", "userCount"],
    },
    filters: {
      textFilters: ["filter"],
    },
    tableActions: rolesTableActions(languageData, router, grantedPolicies),
    rowActions: rolesRowActions(languageData, router, grantedPolicies),
  };
  return table;
}
export const tableData = {
  roles: {
    columns: rolesColumns,
    table: rolesTable,
  },
};

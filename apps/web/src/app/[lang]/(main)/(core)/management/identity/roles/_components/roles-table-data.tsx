import type {Volo_Abp_Identity_IdentityRoleDto} from "@ayasofyazilim/core-saas/IdentityService";
import {$Volo_Abp_Identity_IdentityRoleDto} from "@ayasofyazilim/core-saas/IdentityService";
import type {
  TanstackTableCreationProps,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import type {Policy} from "@repo/utils/policies";
import {isActionGranted} from "@repo/utils/policies";
import {Plus} from "lucide-react";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import type {Localization} from "@/providers/tenant";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";

type RolesTable = TanstackTableCreationProps<Volo_Abp_Identity_IdentityRoleDto>;

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
  const actions: TanstackTableTableActionsType<Volo_Abp_Identity_IdentityRoleDto>[] = [
    {
      type: "simple",
      actionLocation: "table",
      cta: languageData["Role.New"],
      icon: Plus,
      onClick: () => {
        router.push("roles/new");
      },
      condition: () => isActionGranted(["AbpIdentity.Roles.Create"], grantedPolicies),
    },
  ];
  return actions;
}
const rolesColumns = (
  localization: Localization,
  languageData: IdentityServiceResource,
  grantedPolicies: Record<Policy, boolean>,
) => {
  return tanstackTableCreateColumnsByRowData<Volo_Abp_Identity_IdentityRoleDto>({
    rows: $Volo_Abp_Identity_IdentityRoleDto.properties,
    languageData: {
      languageData,
      constantKey: "Form.Role",
    },
    localization,
    links: {
      name: {
        prefix: "roles",
        targetAccessorKey: "id",
        conditions: [
          {
            conditionAccessorKey: "id",
            when: () => isActionGranted(["AbpIdentity.Roles.Update"], grantedPolicies),
          },
        ],
      },
    },
    badges: {
      name: {
        values: Object.keys(badgeClassNames).map((key) => ({
          position: "after",
          label: languageData[`Form.Role.is${key}` as keyof typeof languageData],
          badgeClassName: badgeClassNames[key as keyof typeof badgeClassNames],
          conditions: [
            {
              conditionAccessorKey: `is${key}`,
              when: (value) => value === true,
            },
          ],
        })),
      },
    },
  });
};
function rolesTable(
  languageData: IdentityServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const table: RolesTable = {
    fillerColumn: "name",
    columnVisibility: {
      type: "show",
      columns: ["name", "userCount"],
    },
    filters: {
      textFilters: ["filter"],
    },
    tableActions: rolesTableActions(languageData, router, grantedPolicies),
  };
  return table;
}
export const tableData = {
  roles: {
    columns: rolesColumns,
    table: rolesTable,
  },
};

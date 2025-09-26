import type {Volo_Abp_Identity_ClaimTypeDto} from "@ayasofyazilim/core-saas/IdentityService";
import {$Volo_Abp_Identity_ClaimTypeDto} from "@ayasofyazilim/core-saas/IdentityService";
import type {
  TanstackTableColumnLink,
  TanstackTableCreationProps,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import type {Policy} from "@repo/utils/policies";
import {Plus} from "lucide-react";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {isActionGranted} from "@repo/utils/policies";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";

type ClaimTypesTable = TanstackTableCreationProps<Volo_Abp_Identity_ClaimTypeDto>;

const links: Partial<Record<keyof Volo_Abp_Identity_ClaimTypeDto, TanstackTableColumnLink>> = {};

function claimTypesTableActions(
  languageData: IdentityServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableTableActionsType<Volo_Abp_Identity_ClaimTypeDto>[] = [];
  if (isActionGranted(["AbpIdentity.ClaimTypes.Create"], grantedPolicies)) {
    actions.push({
      type: "simple",
      actionLocation: "table",
      cta: languageData["ClaimType.New"],
      icon: Plus,
      onClick: () => {
        router.push("claim-types/new");
      },
    });
  }
  return actions;
}
const claimTypesColumns = (
  locale: string,
  languageData: IdentityServiceResource,
  grantedPolicies: Record<Policy, boolean>,
) => {
  if (isActionGranted(["AbpIdentity.ClaimTypes.Update"], grantedPolicies)) {
    links.name = {
      prefix: "claim-types",
      targetAccessorKey: "id",
    };
  }
  return tanstackTableCreateColumnsByRowData<Volo_Abp_Identity_ClaimTypeDto>({
    rows: $Volo_Abp_Identity_ClaimTypeDto.properties,
    languageData: {
      languageData,
      constantKey: "Form.ClaimType",
    },
    config: {
      locale,
    },
    links,
    badges: {
      name: {
        values: [
          {
            position: "after",
            label: languageData["Form.ClaimType.required"],
            badgeClassName: "text-green-500 bg-green-100 border-green-500",
            conditions: [
              {
                when: (value) => value === true,
                conditionAccessorKey: "required",
              },
            ],
          },
          {
            position: "after",
            label: languageData["Form.ClaimType.isStatic"],
            badgeClassName: "text-green-500 bg-green-100 border-green-500",
            conditions: [
              {
                when: (value) => value === true,
                conditionAccessorKey: "isStatic",
              },
            ],
          },
        ],
      },
    },
  });
};

function claimTypesTable(
  languageData: IdentityServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const table: ClaimTypesTable = {
    fillerColumn: "name",
    pinColumns: ["name"],
    columnVisibility: {
      type: "show",
      columns: ["name", "valueType", "description", "regex"],
    },
    filters: {
      textFilters: ["filter"],
    },
    tableActions: claimTypesTableActions(languageData, router, grantedPolicies),
  };
  return table;
}

export const tableData = {
  claimTypes: {
    columns: claimTypesColumns,
    table: claimTypesTable,
  },
};

"use client";
import type { UniRefund_CRMService_Individuals_IndividualProfileDto } from "@ayasofyazilim/saas/CRMService";
import { $UniRefund_CRMService_Individuals_IndividualProfileDto } from "@ayasofyazilim/saas/CRMService";
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

const affiliationTypes = [
  "COFOUNDER",
  "PARTNER",
  "ABPUSER",
  "SUBCOMPANY",
  "ACCOUNTMANAGER",
  "Franchise",
];

const entityPartyTypeCode = [
  "CUSTOMS",
  "MERCHANT",
  "REFUNDPOINT",
  "TAXFREE",
  "TAXOFFICE",
];
type IndividualTable =
  TanstackTableCreationProps<UniRefund_CRMService_Individuals_IndividualProfileDto>;

const links: Partial<
  Record<
    keyof UniRefund_CRMService_Individuals_IndividualProfileDto,
    TanstackTableColumnLink
  >
> = {};
function individualsTableActions(
  languageData: CRMServiceServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableTableActionsType[] = [];
  if (isActionGranted(["CRMService.Individuals.Create"], grantedPolicies)) {
    actions.push({
      type: "simple",
      actionLocation: "table",
      cta: languageData.New,
      icon: PlusCircle,
      onClick() {
        router.push("individuals/new");
      },
    });
  }
  return actions;
}

function individualColumns(
  locale: string,
  languageData: CRMServiceServiceResource,
  grantedPolicies: Record<Policy, boolean>,
) {
  if (isActionGranted(["CRMService.Individuals.Edit"], grantedPolicies)) {
    links.name = {
      prefix: "/parties/individuals",
      targetAccessorKey: "id",
    };
  }

  return tanstackTableCreateColumnsByRowData<UniRefund_CRMService_Individuals_IndividualProfileDto>(
    {
      rows: $UniRefund_CRMService_Individuals_IndividualProfileDto.properties,
      languageData: {
        name: languageData.Name,
      },
      config: {
        locale,
      },
      // links: links,
    },
  );
}
function individualTable(
  languageData: CRMServiceServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const table: IndividualTable = {
    fillerColumn: "name",
    columnVisibility: {
      type: "hide",
      columns: ["id", "affiliationId"],
    },
    columnOrder: ["name"],
    tableActions: individualsTableActions(
      languageData,
      router,
      grantedPolicies,
    ),
    filters: {
      textFilters: ["name", "email", "telephone"],
      facetedFilters: {
        affiliationType: {
          title: "Type",
          options: affiliationTypes.map((x) => ({ label: x, value: x })),
        },
        entityPartyTypeCode: {
          title: "Entity Type",
          options: entityPartyTypeCode.map((x) => ({ label: x, value: x })),
        },
      },
    },
  };
  return table;
}

export const tableData = {
  individuals: {
    columns: individualColumns,
    table: individualTable,
  },
};

"use client";

import type { UniRefund_CRMService_TaxFrees_TaxFreeProfileDto } from "@ayasofyazilim/saas/CRMService";
import { $UniRefund_CRMService_TaxFrees_TaxFreeProfileDto } from "@ayasofyazilim/saas/CRMService";
import type {
  TanstackTableColumnLink,
  TanstackTableCreationProps,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import { tanstackTableCreateColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import { Building2, PlusCircle, Store } from "lucide-react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";
import isActionGranted from "src/utils/page-policy/action-policy";
import type { Policy } from "src/utils/page-policy/utils";

type SubStoreTable =
  TanstackTableCreationProps<UniRefund_CRMService_TaxFrees_TaxFreeProfileDto>;

const links: Partial<
  Record<
    keyof UniRefund_CRMService_TaxFrees_TaxFreeProfileDto,
    TanstackTableColumnLink
  >
> = {};

function subStoreTableActions(
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
        router.push("sub-stores/new");
      },
    });
  }
  return actions;
}

function subStoreColumns(
  locale: string,
  languageData: CRMServiceServiceResource,
  grantedPolicies: Record<Policy, boolean>,
) {
  if (isActionGranted(["CRMService.TaxFrees.Edit"], grantedPolicies)) {
    links.name = {
      prefix: "/parties/merchants",
      targetAccessorKey: "id",
    };
  }

  return tanstackTableCreateColumnsByRowData<UniRefund_CRMService_TaxFrees_TaxFreeProfileDto>(
    {
      rows: $UniRefund_CRMService_TaxFrees_TaxFreeProfileDto.properties,
      languageData: {
        name: languageData.Name,
        parentName: languageData["Parties.ParentOrganization"],
        typeCode: languageData["Parties.Type"],
        entityInformationTypeCode: languageData["Parties.FormationType"],
      },
      config: {
        locale,
      },
      links,
    },
  );
}

function subStoreTable(
  languageData: CRMServiceServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const table: SubStoreTable = {
    fillerColumn: "name",
    columnVisibility: {
      type: "hide",
      columns: ["id", "organizationId", "parentId"],
    },
    columnOrder: ["name"],
    tableActions: subStoreTableActions(languageData, router, grantedPolicies),
    filters: {
      textFilters: ["name"],
      facetedFilters: {
        typeCode: {
          title: languageData["Parties.Type"],
          options: [
            {
              label: "Headquarter",
              value: "HEADQUARTER",
              icon: Building2,
            },
            {
              label: "Store",
              value: "STORE",
              icon: Store,
            },
          ],
        },
      },
    },
  };
  return table;
}

export const tableData = {
  subStores: {
    columns: subStoreColumns,
    table: subStoreTable,
  },
};
"use client";
import type {UniRefund_CRMService_Merchants_MerchantProfileDto} from "@ayasofyazilim/saas/CRMService";
import {$UniRefund_CRMService_Merchants_MerchantProfileDto} from "@ayasofyazilim/saas/CRMService";
import type {
  TanstackTableColumnLink,
  TanstackTableCreationProps,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {Building2, PlusCircle, Store} from "lucide-react";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import type {Policy} from "@repo/utils/policies";
import {isActionGranted} from "@repo/utils/policies";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";

type MerchantTable = TanstackTableCreationProps<UniRefund_CRMService_Merchants_MerchantProfileDto>;

const links: Partial<Record<keyof UniRefund_CRMService_Merchants_MerchantProfileDto, TanstackTableColumnLink>> = {};

function merchantTableActions(
  languageData: CRMServiceServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableTableActionsType<UniRefund_CRMService_Merchants_MerchantProfileDto>[] = [];
  if (isActionGranted(["CRMService.Merchants.Create"], grantedPolicies)) {
    actions.push({
      type: "simple",
      actionLocation: "table",
      cta: languageData.New,
      icon: PlusCircle,
      onClick() {
        router.push("merchants/new");
      },
    });
  }
  return actions;
}

function merchantColumns(
  locale: string,
  languageData: CRMServiceServiceResource,
  grantedPolicies: Record<Policy, boolean>,
) {
  if (isActionGranted(["CRMService.Merchants.Edit"], grantedPolicies)) {
    links.name = {
      prefix: "/parties/merchants",
      targetAccessorKey: "id",
      suffix: "details/info",
    };

    links.parentName = {
      prefix: "/parties/merchants",
      targetAccessorKey: "parentId",
      suffix: "details/info",
    };
  }

  return tanstackTableCreateColumnsByRowData<UniRefund_CRMService_Merchants_MerchantProfileDto>({
    rows: $UniRefund_CRMService_Merchants_MerchantProfileDto.properties,
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
    faceted: {
      typeCode: {
        options: [
          {
            value: "HEADQUARTER",
            label: "Headquarter",
            icon: Building2,
          },
          {
            value: "STORE",
            label: "Store",
            icon: Store,
          },
        ],
      },
    },
  });
}

function merchantTable(
  languageData: CRMServiceServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const table: MerchantTable = {
    fillerColumn: "name",
    columnVisibility: {
      type: "hide",
      columns: ["id", "organizationId", "individualId", "parentId"],
    },
    columnOrder: ["name", "parentName", "typeCode", "entityInformationTypeCode"],
    tableActions: merchantTableActions(languageData, router, grantedPolicies),
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
  merchants: {
    columns: merchantColumns,
    table: merchantTable,
  },
};

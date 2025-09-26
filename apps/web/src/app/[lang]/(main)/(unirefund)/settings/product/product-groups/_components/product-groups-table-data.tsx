import type {UniRefund_SettingService_ProductGroups_ProductGroupDto} from "@ayasofyazilim/saas/SettingService";
import {
  $UniRefund_SettingService_ProductGroups_CompanyTypeCode,
  $UniRefund_SettingService_ProductGroups_ProductGroupDto,
} from "@ayasofyazilim/saas/SettingService";
import type {
  TanstackTableColumnLink,
  TanstackTableCreationProps,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {CheckCircle, Plus, XCircle} from "lucide-react";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import type {Policy} from "@repo/utils/policies";
import {isActionGranted} from "@repo/utils/policies";
import type {SettingServiceResource} from "src/language-data/unirefund/SettingService";
import type {Localization} from "@/providers/tenant";

type ProductGroupsTable = TanstackTableCreationProps<UniRefund_SettingService_ProductGroups_ProductGroupDto>;

const links: Partial<Record<keyof UniRefund_SettingService_ProductGroups_ProductGroupDto, TanstackTableColumnLink>> =
  {};

function productGroupsTableActions(
  languageData: SettingServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableTableActionsType<UniRefund_SettingService_ProductGroups_ProductGroupDto>[] = [];
  if (isActionGranted(["SettingService.ProductGroups.Add"], grantedPolicies)) {
    actions.push({
      type: "simple",
      actionLocation: "table",
      cta: languageData["ProductGroup.New"],
      icon: Plus,
      onClick: () => {
        router.push("product-groups/new");
      },
    });
  }
  return actions;
}

const productGroupsColumns = (
  localization: Localization,
  languageData: SettingServiceResource,
  grantedPolicies: Record<Policy, boolean>,
) => {
  if (isActionGranted(["SettingService.ProductGroups.Edit"], grantedPolicies)) {
    links.name = {
      prefix: "product-groups",
      targetAccessorKey: "id",
    };
    links.vatPercent = {
      prefix: "/settings/product/vats",
      targetAccessorKey: "vatId",
    };
  }
  return tanstackTableCreateColumnsByRowData<UniRefund_SettingService_ProductGroups_ProductGroupDto>({
    rows: $UniRefund_SettingService_ProductGroups_ProductGroupDto.properties,
    languageData: {
      languageData,
      constantKey: "Form.ProductGroup",
    },
    localization,
    links,
    badges: {
      name: {
        values: [
          {
            position: "after",
            conditions: [
              {
                when: (value) => value === true,
                conditionAccessorKey: "food",
              },
            ],
            label: languageData["Form.ProductGroup.food"],
          },
        ],
      },
    },
    faceted: {
      active: {
        options: [
          {
            label: "Yes",
            when: (value) => {
              return Boolean(value);
            },
            value: "true",
            icon: CheckCircle,
            iconClassName: "text-green-700",
            hideColumnValue: true,
          },
          {
            label: "No",
            when: (value) => {
              return !value;
            },
            value: "false",
            icon: XCircle,
            iconClassName: "text-red-700",
            hideColumnValue: true,
          },
        ],
      },
      companyType: {
        options: $UniRefund_SettingService_ProductGroups_CompanyTypeCode.enum.map((x) => ({
          label: languageData[`Form.ProductGroup.companyType.${x}`],
          value: x,
        })),
      },
    },
  });
};

function productGroupsTable(
  languageData: SettingServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const table: ProductGroupsTable = {
    fillerColumn: "name",
    columnVisibility: {
      type: "hide",
      columns: ["id", "food", "vatId"],
    },
    columnOrder: ["name", "vatPercent", "articleCode", "unitCode", "companyType", "active"],
    tableActions: productGroupsTableActions(languageData, router, grantedPolicies),
  };
  return table;
}

export const tableData = {
  productGroups: {
    columns: productGroupsColumns,
    table: productGroupsTable,
  },
};

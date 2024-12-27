import type { UniRefund_SettingService_ProductGroups_ProductGroupDto } from "@ayasofyazilim/saas/SettingService";
import {
  $UniRefund_SettingService_ProductGroups_CompanyTypeCode,
  $UniRefund_SettingService_ProductGroups_ProductGroupDto,
} from "@ayasofyazilim/saas/SettingService";
import type {
  TanstackTableColumnLink,
  TanstackTableCreationProps,
  TanstackTableRowActionsType,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import { tanstackTableCreateColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import { CheckCircle, Plus, Trash, XCircle } from "lucide-react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { handleDeleteResponse } from "src/actions/core/api-utils-client";
import { deleteproductGroupByIdApi } from "src/actions/unirefund/SettingService/delete-actions";
import type { SettingServiceResource } from "src/language-data/unirefund/SettingService";
import isActionGranted from "src/utils/page-policy/action-policy";
import type { Policy } from "src/utils/page-policy/utils";

type ProductGroupsTable =
  TanstackTableCreationProps<UniRefund_SettingService_ProductGroups_ProductGroupDto>;

const links: Partial<
  Record<
    keyof UniRefund_SettingService_ProductGroups_ProductGroupDto,
    TanstackTableColumnLink
  >
> = {};

function productGroupsTableActions(
  languageData: SettingServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableTableActionsType[] = [];
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
function productGroupsRowActions(
  languageData: SettingServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableRowActionsType<UniRefund_SettingService_ProductGroups_ProductGroupDto>[] =
    [];
  if (
    isActionGranted(["SettingService.ProductGroups.Delete"], grantedPolicies)
  ) {
    actions.push({
      type: "confirmation-dialog",
      cta: languageData.Delete,
      title: languageData["ProductGroup.Delete"],
      actionLocation: "row",
      confirmationText: languageData.Delete,
      cancelText: languageData.Cancel,
      description: languageData["Delete.Assurance"],
      icon: Trash,
      onConfirm: (row) => {
        void deleteproductGroupByIdApi(row.id || "").then((response) => {
          handleDeleteResponse(response, router);
        });
      },
    });
  }
  return actions;
}
const productGroupsColumns = (
  locale: string,
  languageData: SettingServiceResource,
  grantedPolicies: Record<Policy, boolean>,
) => {
  if (isActionGranted(["SettingService.ProductGroups.Edit"], grantedPolicies)) {
    links.name = {
      prefix: "product-groups",
      targetAccessorKey: "id",
    };
  }
  return tanstackTableCreateColumnsByRowData<UniRefund_SettingService_ProductGroups_ProductGroupDto>(
    {
      rows: $UniRefund_SettingService_ProductGroups_ProductGroupDto.properties,
      languageData: {
        languageData,
        constantKey: "Form",
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
              conditions: [
                {
                  when: (value) => value === true,
                  conditionAccessorKey: "food",
                },
              ],
              label: languageData["Form.food"],
            },
          ],
        },
      },
      faceted: {
        active: {
          options: [
            {
              value: "true",
              label: "",
              icon: CheckCircle,
              iconClassName: "text-green-700",
            },
            {
              value: "false",
              label: "",
              icon: XCircle,
              iconClassName: "text-red-700",
            },
          ],
        },
        companyType: {
          options:
            $UniRefund_SettingService_ProductGroups_CompanyTypeCode.enum.map(
              (x) => ({
                label: languageData[`Form.companyType.${x}`],
                value: x,
              }),
            ),
        },
      },
    },
  );
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
      columns: ["id", "food"],
    },
    columnOrder: [
      "name",
      "articleCode",
      "unitCode",
      "companyType",
      "vatId",
      "active",
    ],
    tableActions: productGroupsTableActions(
      languageData,
      router,
      grantedPolicies,
    ),
    rowActions: productGroupsRowActions(languageData, router, grantedPolicies),
  };
  return table;
}

export const tableData = {
  productGroups: {
    columns: productGroupsColumns,
    table: productGroupsTable,
  },
};

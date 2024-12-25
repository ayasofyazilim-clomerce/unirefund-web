import type { UniRefund_SettingService_Vats_VatDto } from "@ayasofyazilim/saas/SettingService";
import { $UniRefund_SettingService_Vats_VatDto } from "@ayasofyazilim/saas/SettingService";
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
import { deleteVatByIdApi } from "src/actions/unirefund/SettingService/delete-actions";
import type { SettingServiceResource } from "src/language-data/unirefund/SettingService";
import isActionGranted from "src/utils/page-policy/action-policy";
import type { Policy } from "src/utils/page-policy/utils";

type VatsTable =
  TanstackTableCreationProps<UniRefund_SettingService_Vats_VatDto>;

const links: Partial<
  Record<keyof UniRefund_SettingService_Vats_VatDto, TanstackTableColumnLink>
> = {};

function vatsTableActions(
  languageData: SettingServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableTableActionsType[] = [];
  if (isActionGranted(["SettingService.Vats.Add"], grantedPolicies)) {
    actions.push({
      type: "simple",
      actionLocation: "table",
      cta: languageData["Vat.New"],
      icon: Plus,
      onClick: () => {
        router.push("vats/new");
      },
    });
  }
  return actions;
}

function vatsRowActions(
  languageData: SettingServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableRowActionsType<UniRefund_SettingService_Vats_VatDto>[] =
    [];
  if (isActionGranted(["SettingService.Vats.Delete"], grantedPolicies)) {
    actions.push({
      type: "confirmation-dialog",
      cta: languageData.Delete,
      title: languageData["Vat.Delete"],
      actionLocation: "row",
      confirmationText: languageData.Delete,
      cancelText: languageData.Cancel,
      description: languageData["Delete.Assurance"],
      icon: Trash,
      onConfirm: (row) => {
        void deleteVatByIdApi(row.id || "").then((response) => {
          handleDeleteResponse(response, router);
        });
      },
    });
  }
  return actions;
}

const vatsColumns = (
  locale: string,
  languageData: SettingServiceResource,
  grantedPolicies: Record<Policy, boolean>,
) => {
  if (isActionGranted(["SettingService.Vats.Edit"], grantedPolicies)) {
    links.percent = {
      prefix: "vats",
      targetAccessorKey: "id",
    };
  }
  return tanstackTableCreateColumnsByRowData<UniRefund_SettingService_Vats_VatDto>(
    {
      rows: $UniRefund_SettingService_Vats_VatDto.properties,
      languageData: {
        languageData,
        constantKey: "Form",
      },
      config: {
        locale,
      },
      links,
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
      },
    },
  );
};

function vatsTable(
  languageData: SettingServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const table: VatsTable = {
    fillerColumn: "percent",
    columnVisibility: {
      type: "hide",
      columns: ["id"],
    },
    tableActions: vatsTableActions(languageData, router, grantedPolicies),
    rowActions: vatsRowActions(languageData, router, grantedPolicies),
  };
  return table;
}

export const tableData = {
  vats: {
    columns: vatsColumns,
    table: vatsTable,
  },
};

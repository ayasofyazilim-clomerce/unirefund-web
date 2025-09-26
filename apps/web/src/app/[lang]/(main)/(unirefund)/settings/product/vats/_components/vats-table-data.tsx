import type {UniRefund_SettingService_Vats_VatDto} from "@ayasofyazilim/saas/SettingService";
import {$UniRefund_SettingService_Vats_VatDto} from "@ayasofyazilim/saas/SettingService";
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

type VatsTable = TanstackTableCreationProps<UniRefund_SettingService_Vats_VatDto>;

const links: Partial<Record<keyof UniRefund_SettingService_Vats_VatDto, TanstackTableColumnLink>> = {};

function vatsTableActions(
  languageData: SettingServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableTableActionsType<UniRefund_SettingService_Vats_VatDto>[] = [];
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

const vatsColumns = (
  localization: Localization,
  languageData: SettingServiceResource,
  grantedPolicies: Record<Policy, boolean>,
) => {
  if (isActionGranted(["SettingService.Vats.Edit"], grantedPolicies)) {
    links.percent = {
      prefix: "vats",
      targetAccessorKey: "id",
    };
  }
  return tanstackTableCreateColumnsByRowData<UniRefund_SettingService_Vats_VatDto>({
    rows: $UniRefund_SettingService_Vats_VatDto.properties,
    languageData: {
      languageData,
      constantKey: "Form.Vat",
    },
    localization,
    links,
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
    },
  });
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
  };
  return table;
}

export const tableData = {
  vats: {
    columns: vatsColumns,
    table: vatsTable,
  },
};

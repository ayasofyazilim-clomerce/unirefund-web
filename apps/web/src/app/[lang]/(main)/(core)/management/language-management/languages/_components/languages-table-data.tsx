import type {Volo_Abp_LanguageManagement_Dto_LanguageDto} from "@ayasofyazilim/saas/AdministrationService";
import {$Volo_Abp_LanguageManagement_Dto_LanguageDto} from "@ayasofyazilim/saas/AdministrationService";
import type {
  TanstackTableColumnLink,
  TanstackTableCreationProps,
  TanstackTableRowActionsType,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {CheckCircle, Languages, Plus, XCircle} from "lucide-react";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {putLanguagesByIdSetAsDefaultApi} from "src/actions/core/AdministrationService/put-actions";
import {handlePutResponse} from "src/actions/core/api-utils-client";
import type {AdministrationServiceResource} from "src/language-data/core/AdministrationService";
import isActionGranted from "src/utils/page-policy/action-policy";
import type {Policy} from "src/utils/page-policy/utils";

type LanguagesTable = TanstackTableCreationProps<Volo_Abp_LanguageManagement_Dto_LanguageDto>;

const links: Partial<Record<keyof Volo_Abp_LanguageManagement_Dto_LanguageDto, TanstackTableColumnLink>> = {};

function languagesTableActions(
  languageData: AdministrationServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableTableActionsType[] = [];
  if (isActionGranted(["LanguageManagement.Languages.Create"], grantedPolicies)) {
    actions.push({
      type: "simple",
      actionLocation: "table",
      cta: languageData["Language.New"],
      icon: Plus,
      onClick: () => {
        router.push("languages/new");
      },
    });
  }
  return actions;
}
function languagesRowActions(
  languageData: AdministrationServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableRowActionsType<Volo_Abp_LanguageManagement_Dto_LanguageDto>[] = [];
  if (isActionGranted(["LanguageManagement.Languages.ChangeDefault"], grantedPolicies)) {
    actions.push({
      type: "confirmation-dialog",
      cta: languageData["Language.Default.Language"],
      title: languageData["Form.Language.isDefaultLanguage"],
      actionLocation: "row",
      confirmationText: languageData["Language.Confirm"],
      cancelText: languageData.Cancel,
      description: languageData["Language.Default.Assurance"],
      icon: Languages,
      onConfirm: (row) => {
        void putLanguagesByIdSetAsDefaultApi(row.id || "").then((response) => {
          handlePutResponse(response, router);
        });
      },
    });
  }
  return actions;
}
const languagesColumns = (
  locale: string,
  languageData: AdministrationServiceResource,
  grantedPolicies: Record<Policy, boolean>,
) => {
  if (isActionGranted(["LanguageManagement.Languages.Edit"], grantedPolicies)) {
    links.displayName = {
      prefix: "languages",
      targetAccessorKey: "id",
    };
  }
  return tanstackTableCreateColumnsByRowData<Volo_Abp_LanguageManagement_Dto_LanguageDto>({
    rows: $Volo_Abp_LanguageManagement_Dto_LanguageDto.properties,
    languageData: {
      languageData,
      constantKey: "Form.Language",
    },
    config: {
      locale,
    },
    links,
    badges: {
      displayName: {
        values: [
          {
            position: "after",
            label: languageData["Form.Language.isDefaultLanguage"],
            badgeClassName: "text-green-700 bg-green-100 border-green-500",
            conditions: [
              {
                when: (value) => value === true,
                conditionAccessorKey: "isDefaultLanguage",
              },
            ],
          },
        ],
      },
    },
    faceted: {
      isEnabled: {
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
function languagesTable(
  languageData: AdministrationServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const table: LanguagesTable = {
    fillerColumn: "displayName",
    pinColumns: ["displayName"],
    columnVisibility: {
      type: "show",
      columns: ["displayName", "cultureName", "uiCultureName", "isEnabled"],
    },
    filters: {
      textFilters: ["filter"],
    },
    tableActions: languagesTableActions(languageData, router, grantedPolicies),
    rowActions: languagesRowActions(languageData, router, grantedPolicies),
  };
  return table;
}

export const tableData = {
  languages: {
    columns: languagesColumns,
    table: languagesTable,
  },
};

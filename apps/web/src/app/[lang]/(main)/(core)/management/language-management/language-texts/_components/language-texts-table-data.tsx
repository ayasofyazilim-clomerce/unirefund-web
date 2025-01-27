import type {
  Volo_Abp_LanguageManagement_Dto_LanguageDto,
  Volo_Abp_LanguageManagement_Dto_LanguageResourceDto,
  Volo_Abp_LanguageManagement_Dto_LanguageTextDto,
} from "@ayasofyazilim/saas/AdministrationService";
import { $Volo_Abp_LanguageManagement_Dto_LanguageTextDto } from "@ayasofyazilim/saas/AdministrationService";
import type {
  TanstackTableColumnLink,
  TanstackTableCreationProps,
  TanstackTableRowActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import { tanstackTableCreateColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import { ArchiveRestore, Edit } from "lucide-react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { putLanguageTextsByResourceNameByCultureNameByNameRestoreApi } from "src/actions/core/AdministrationService/put-actions";
import { handlePutResponse } from "src/actions/core/api-utils-client";
import type { AdministrationServiceResource } from "src/language-data/core/AdministrationService";
import isActionGranted from "src/utils/page-policy/action-policy";
import type { Policy } from "src/utils/page-policy/utils";
import LanguageTextsEdit from "./language-text-edit";

type LanguageTextsTable =
  TanstackTableCreationProps<Volo_Abp_LanguageManagement_Dto_LanguageTextDto>;

const links: Partial<
  Record<
    keyof Volo_Abp_LanguageManagement_Dto_LanguageTextDto,
    TanstackTableColumnLink
  >
> = {};

function languageTextsRowActions(
  languageData: AdministrationServiceResource,
  grantedPolicies: Record<Policy, boolean>,
  router: AppRouterInstance,
) {
  const actions: TanstackTableRowActionsType<Volo_Abp_LanguageManagement_Dto_LanguageTextDto>[] =
    [];
  if (
    isActionGranted(["LanguageManagement.LanguageTexts.Edit"], grantedPolicies)
  ) {
    actions.push({
      type: "custom-dialog",
      cta: languageData["LanguageText.Edit.Value"],
      title: languageData["LanguageText.Edit.Value"],
      actionLocation: "row",
      icon: Edit,
      content: (row) => (
        <LanguageTextsEdit languageData={languageData} languageTextData={row} />
      ),
    });
  }
  if (
    isActionGranted(["LanguageManagement.LanguageTexts.Edit"], grantedPolicies)
  ) {
    actions.push({
      type: "confirmation-dialog",
      cta: languageData["LanguageText.Restore.Value"],
      title: languageData["LanguageText.Restore.Value"],
      actionLocation: "row",
      confirmationText: languageData["Language.Confirm"],
      cancelText: languageData.Cancel,
      description: languageData["LanguageText.Restore.Value.Assurance"],
      icon: ArchiveRestore,
      onConfirm: (row) => {
        void putLanguageTextsByResourceNameByCultureNameByNameRestoreApi({
          resourceName: row.resourceName || "",
          cultureName: row.cultureName || "",
          name: row.name || "",
        }).then((response) => {
          handlePutResponse(response, router);
        });
      },
    });
  }
  return actions;
}
const languageTextsColumns = (
  locale: string,
  languageData: AdministrationServiceResource,
) => {
  return tanstackTableCreateColumnsByRowData<Volo_Abp_LanguageManagement_Dto_LanguageTextDto>(
    {
      rows: $Volo_Abp_LanguageManagement_Dto_LanguageTextDto.properties,
      languageData: {
        languageData,
        constantKey: "Form.LanguageText",
      },
      config: {
        locale,
      },
      links,
    },
  );
};
function languageTextsTable(
  languageData: AdministrationServiceResource,
  languagesList: Volo_Abp_LanguageManagement_Dto_LanguageDto[],
  languagesResourcesData: Volo_Abp_LanguageManagement_Dto_LanguageResourceDto[],
  grantedPolicies: Record<Policy, boolean>,
  router: AppRouterInstance,
) {
  const table: LanguageTextsTable = {
    fillerColumn: "name",
    columnVisibility: {
      type: "show",
      columns: ["name", "baseValue", "value", "resourceName"],
    },
    columnOrder: ["name", "baseValue", "value", "resourceName"],
    filters: {
      textFilters: ["filter"],
      facetedFilters: {
        baseCultureName: {
          title: languageData["Form.LanguageText.baseCultureName"],
          options: languagesList.map((item) => ({
            label: item.displayName || "",
            value: item.cultureName || "",
          })),
        },
        targetCultureName: {
          title: languageData["Form.LanguageText.targetCultureName"],
          options: languagesList.map((item) => ({
            label: item.displayName || "",
            value: item.cultureName || "",
          })),
        },
        resourceName: {
          title: languageData["Form.LanguageText.resourceName"],
          options: languagesResourcesData.map((item) => ({
            label: item.name || "",
            value: item.name || "",
          })),
        },
        getOnlyEmptyValues: {
          title: languageData["Form.LanguageText.getOnlyEmptyValues"],
          options: [
            {
              label: languageData.Yes,
              value: "true",
            },
            {
              label: languageData.No,
              value: "false",
            },
          ],
        },
      },
    },
    rowActions: languageTextsRowActions(languageData, grantedPolicies, router),
  };
  return table;
}

export const tableData = {
  languageTexts: {
    columns: languageTextsColumns,
    table: languageTextsTable,
  },
};

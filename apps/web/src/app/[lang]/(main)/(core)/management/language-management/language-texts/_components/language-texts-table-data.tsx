import type {
  Volo_Abp_LanguageManagement_Dto_LanguageDto,
  Volo_Abp_LanguageManagement_Dto_LanguageResourceDto,
  Volo_Abp_LanguageManagement_Dto_LanguageTextDto,
} from "@ayasofyazilim/saas/AdministrationService";
import { $Volo_Abp_LanguageManagement_Dto_LanguageTextDto } from "@ayasofyazilim/saas/AdministrationService";
import type {
  TanstackTableColumnLink,
  TanstackTableCreationProps,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import { tanstackTableCreateColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import type { AdministrationServiceResource } from "src/language-data/core/AdministrationService";

type LanguageTextsTable =
  TanstackTableCreationProps<Volo_Abp_LanguageManagement_Dto_LanguageTextDto>;

const links: Partial<
  Record<
    keyof Volo_Abp_LanguageManagement_Dto_LanguageTextDto,
    TanstackTableColumnLink
  >
> = {};

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
) {
  const table: LanguageTextsTable = {
    fillerColumn: "cultureName",
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
  };
  return table;
}

export const tableData = {
  languageTexts: {
    columns: languageTextsColumns,
    table: languageTextsTable,
  },
};

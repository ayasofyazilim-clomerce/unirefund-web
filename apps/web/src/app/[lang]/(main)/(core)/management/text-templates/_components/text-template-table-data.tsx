import type {Volo_Abp_TextTemplateManagement_TextTemplates_TemplateDefinitionDto} from "@ayasofyazilim/core-saas/AdministrationService";
import {$Volo_Abp_TextTemplateManagement_TextTemplates_TemplateDefinitionDto} from "@ayasofyazilim/core-saas/AdministrationService";
import type {
  TanstackTableColumnLink,
  TanstackTableCreationProps,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {CheckCircle, XCircle} from "lucide-react";
import type {AdministrationServiceResource} from "src/language-data/core/AdministrationService";

type TextTemplateTable =
  TanstackTableCreationProps<Volo_Abp_TextTemplateManagement_TextTemplates_TemplateDefinitionDto>;

const links: Partial<
  Record<keyof Volo_Abp_TextTemplateManagement_TextTemplates_TemplateDefinitionDto, TanstackTableColumnLink>
> = {};

const textTemplateColumns = (locale: string, languageData: AdministrationServiceResource) => {
  return tanstackTableCreateColumnsByRowData<Volo_Abp_TextTemplateManagement_TextTemplates_TemplateDefinitionDto>({
    rows: $Volo_Abp_TextTemplateManagement_TextTemplates_TemplateDefinitionDto.properties,
    languageData: {
      languageData,
      constantKey: "Form.TextTemplate",
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
            label: languageData["Form.TextTemplate.isLayout"],
            badgeClassName: "text-green-500 bg-green-100 border-green-500",
            conditions: [
              {
                when: (value) => value === true,
                conditionAccessorKey: "isLayout",
              },
            ],
          },
        ],
      },
    },
    faceted: {
      isInlineLocalized: {
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

function textTemplateTable() {
  const table: TextTemplateTable = {
    fillerColumn: "name",
    pinColumns: ["name"],
    filters: {
      textFilters: ["filterText"],
    },
    columnVisibility: {
      type: "hide",
      columns: ["name", "isLayout"],
    },
    columnOrder: ["displayName", "isInlineLocalized", "layout", "defaultCultureName"],
  };
  return table;
}

export const tableData = {
  textTemplate: {
    columns: textTemplateColumns,
    table: textTemplateTable,
  },
};

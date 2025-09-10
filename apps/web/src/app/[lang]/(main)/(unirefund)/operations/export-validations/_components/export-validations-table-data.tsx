import type {UniRefund_ExportValidationService_ExportValidations_ExportValidationDto} from "@repo/saas/ExportValidationService";
import {
  $UniRefund_ExportValidationService_ExportValidations_ExportValidationDto,
  $UniRefund_ExportValidationService_ExportValidations_ExportValidationStatusCode,
  $UniRefund_ExportValidationService_ExportValidations_StampTypeCode,
} from "@repo/saas/ExportValidationService";
import type {
  TanstackTableColumnLink,
  TanstackTableCreationProps,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import type {Policy} from "@repo/utils/policies";
import {isActionGranted} from "@repo/utils/policies";
import type {ExportValidationServiceResource} from "src/language-data/unirefund/ExportValidationService";

type ExportValidationsTable =
  TanstackTableCreationProps<UniRefund_ExportValidationService_ExportValidations_ExportValidationDto>;

const links: Partial<
  Record<keyof UniRefund_ExportValidationService_ExportValidations_ExportValidationDto, TanstackTableColumnLink>
> = {};

const exportValidationsColumns = (
  locale: string,
  languageData: ExportValidationServiceResource,
  grantedPolicies: Record<Policy, boolean>,
) => {
  if (isActionGranted(["ExportValidationService.ExportValidations.Edit"], grantedPolicies)) {
    links.tagNumber = {
      prefix: "export-validations",
      targetAccessorKey: "id",
    };
  }
  return tanstackTableCreateColumnsByRowData<UniRefund_ExportValidationService_ExportValidations_ExportValidationDto>({
    rows: $UniRefund_ExportValidationService_ExportValidations_ExportValidationDto.properties,
    languageData: {
      languageData,
      constantKey: "Form.ExportValidation",
    },
    config: {
      locale,
    },
    links,
    faceted: {
      status: {
        options: $UniRefund_ExportValidationService_ExportValidations_ExportValidationStatusCode.enum.map((x) => ({
          label: languageData[`Form.ExportValidation.status.${x}`],
          value: x,
        })),
      },
      stampType: {
        options: $UniRefund_ExportValidationService_ExportValidations_StampTypeCode.enum.map((x) => ({
          label: languageData[`Form.ExportValidation.stampType.${x}`],
          value: x,
        })),
      },
    },
  });
};
function exportValidationsTable(languageData: ExportValidationServiceResource) {
  const table: ExportValidationsTable = {
    fillerColumn: "tagNumber",
    pinColumns: ["tagNumber"],
    columnVisibility: {
      type: "show",
      columns: [
        "referenceId",
        "tagNumber",
        "customsName",
        "status",
        "exportDate",
        "stampType",
        "initialValidationResult",
        "finalValidationResult",
      ],
    },
    filters: {
      textFilters: ["referenceId", "tagNumbers"],
      dateFilters: [
        {
          label: languageData["Form.ExportValidation.exportDate.StartEnd"],
          startAccessorKey: "exportDate",
          endAccessorKey: "exportDate",
        },
      ],
      facetedFilters: {
        statuses: {
          title: languageData["Form.ExportValidation.status"],
          options: $UniRefund_ExportValidationService_ExportValidations_ExportValidationDto.properties.status.enum.map(
            (x) => ({
              label: languageData[`Form.ExportValidation.status.${x}`],
              value: x,
            }),
          ),
        },
        stampTypeCodes: {
          title: languageData["Form.ExportValidation.stampType"],
          options:
            $UniRefund_ExportValidationService_ExportValidations_ExportValidationDto.properties.stampType.enum.map(
              (x) => ({
                label: languageData[`Form.ExportValidation.stampType.${x}`],
                value: x,
              }),
            ),
        },
      },
    },
  };
  return table;
}

export const tableData = {
  exportValidations: {
    columns: exportValidationsColumns,
    table: exportValidationsTable,
  },
};

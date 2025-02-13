import type {Volo_Abp_AuditLogging_EntityChangeDto} from "@ayasofyazilim/core-saas/AdministrationService";
import {
  $Volo_Abp_Auditing_EntityChangeType,
  $Volo_Abp_AuditLogging_EntityChangeDto,
} from "@ayasofyazilim/core-saas/AdministrationService";
import type {TanstackTableCreationProps} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import type {AdministrationServiceResource} from "src/language-data/core/AdministrationService";

type AuditLogsEntityChangeTable = TanstackTableCreationProps<Volo_Abp_AuditLogging_EntityChangeDto>;

const entityChangesColumns = (locale: string, languageData: AdministrationServiceResource) => {
  return tanstackTableCreateColumnsByRowData<Volo_Abp_AuditLogging_EntityChangeDto>({
    rows: $Volo_Abp_AuditLogging_EntityChangeDto.properties,
    languageData: {
      languageData,
      constantKey: "Form.Log.EntityChanges",
    },
    config: {
      locale,
    },
  });
};
function entityChangesTable(languageData: AdministrationServiceResource) {
  const table: AuditLogsEntityChangeTable = {
    fillerColumn: "entityId",
    filters: {
      textFilters: ["entityTypeFullName", "auditLogId"],
      dateFilters: [
        {
          label: languageData.StartEndTime,
          startAccessorKey: "startDate",
          endAccessorKey: "endDate",
        },
      ],
      facetedFilters: {
        changeType: {
          title: languageData["Form.Log.EntityChanges.changeType"],
          options: $Volo_Abp_Auditing_EntityChangeType.enum.map((statusCode) => ({
            value: statusCode,
            label: languageData[`Form.Log.EntityChanges.${statusCode}`],
          })),
        },
      },
    },
    columnVisibility: {
      type: "show",
      columns: ["auditLogId", "changeTime", "changeType", "tenantId", "entityTypeFullName"],
    },
    columnOrder: ["auditLogId", "changeTime", "changeType", "tenantId", "entityTypeFullName"],
  };
  return table;
}

export const tableData = {
  entityChanges: {
    columns: entityChangesColumns,
    table: entityChangesTable,
  },
};

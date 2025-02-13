import type {Volo_Abp_Identity_IdentitySecurityLogDto} from "@ayasofyazilim/core-saas/IdentityService";
import {$Volo_Abp_Identity_IdentitySecurityLogDto} from "@ayasofyazilim/core-saas/IdentityService";
import type {
  TanstackTableColumnLink,
  TanstackTableCreationProps,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";

type SecurityLogsTable = TanstackTableCreationProps<Volo_Abp_Identity_IdentitySecurityLogDto>;

const links: Partial<Record<keyof Volo_Abp_Identity_IdentitySecurityLogDto, TanstackTableColumnLink>> = {};

const securityLogsColumns = (locale: string, languageData: IdentityServiceResource) => {
  return tanstackTableCreateColumnsByRowData<Volo_Abp_Identity_IdentitySecurityLogDto>({
    rows: $Volo_Abp_Identity_IdentitySecurityLogDto.properties,
    languageData: {
      languageData,
      constantKey: "Form.SecurityLog",
    },
    config: {
      locale,
    },
    links,
  });
};

function securityLogsTable(languageData: IdentityServiceResource) {
  const table: SecurityLogsTable = {
    fillerColumn: "tenantName",
    filters: {
      textFilters: ["applicationName", "userName", "identity", "action", "clientId"],
      dateFilters: [
        {
          label: languageData.StartEndTime,
          startAccessorKey: "startTime",
          endAccessorKey: "EndTime",
        },
      ],
    },
    columnVisibility: {
      type: "hide",
      columns: ["id", "correlationId", "tenantId", "userId", "tenantName", "extraProperties"],
    },
    columnOrder: [
      "userName",
      "creationTime",
      "action",
      "applicationName",
      "clientIpAddress",
      "applicationName",
      "identity",
      "clientId",
      "browserInfo",
    ],
  };
  return table;
}

export const tableData = {
  securityLogs: {
    columns: securityLogsColumns,
    table: securityLogsTable,
  },
};

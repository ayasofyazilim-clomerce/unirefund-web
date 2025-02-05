import type {Volo_Abp_Identity_IdentitySecurityLogDto} from "@ayasofyazilim/saas/AccountService";
import {$Volo_Abp_Identity_IdentitySecurityLogDto} from "@ayasofyazilim/saas/AccountService";
import type {
  TanstackTableColumnLink,
  TanstackTableCreationProps,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import type {AccountServiceResource} from "src/language-data/core/AccountService";

type SessionsTable = TanstackTableCreationProps<Volo_Abp_Identity_IdentitySecurityLogDto>;

const links: Partial<Record<keyof Volo_Abp_Identity_IdentitySecurityLogDto, TanstackTableColumnLink>> = {};

const securityLogsColumns = (locale: string, languageData: AccountServiceResource) => {
  return tanstackTableCreateColumnsByRowData<Volo_Abp_Identity_IdentitySecurityLogDto>({
    rows: $Volo_Abp_Identity_IdentitySecurityLogDto.properties,
    languageData: {
      languageData,
      constantKey: "Form",
    },
    config: {
      locale,
    },
    links,
  });
};

function securityLogsTable(languageData: AccountServiceResource) {
  const table: SessionsTable = {
    fillerColumn: "userName",
    filters: {
      textFilters: ["applicationName", "identity", "action", "clientId"],
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
      columns: ["id", "correlationId", "tenantId", "userId", "tenantName", "userName", "extraProperties"],
    },
    columnOrder: [
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

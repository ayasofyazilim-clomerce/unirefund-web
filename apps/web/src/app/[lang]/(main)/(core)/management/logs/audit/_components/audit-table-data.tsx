import type {Volo_Abp_AuditLogging_AuditLogDto} from "@ayasofyazilim/core-saas/AdministrationService";
import {
  $System_Net_HttpStatusCode,
  $Volo_Abp_AuditLogging_AuditLogDto,
} from "@ayasofyazilim/core-saas/AdministrationService";
import type {TanstackTableCreationProps} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import type {AdministrationServiceResource} from "src/language-data/core/AdministrationService";
import type {Localization} from "@/providers/tenant";
import DetailsModal from "./details-modal";

type AuditLogsTable = TanstackTableCreationProps<Volo_Abp_AuditLogging_AuditLogDto>;

const badgeClassNames = {
  200: "text-green-500 bg-green-100 border-green-500",
  204: "text-green-500 bg-green-100 border-green-500",
  302: "text-orange-500 bg-orange-100 border-orange-500",
  400: "text-red-500 bg-red-100 border-red-500",
  401: "text-red-500 bg-red-100 border-red-500",
  403: "text-red-500 bg-red-100 border-red-500",
  404: "text-red-500 bg-red-100 border-red-500",
  500: "text-red-500 bg-red-100 border-red-500",
  POST: "text-green-500 bg-green-100 border-green-500",
  GET: "text-blue-500 bg-blue-100 border-blue-500",
  PUT: "text-orange-500 bg-orange-100 border-orange-500",
  DELETE: "text-red-500 bg-red-100 border-red-500",
};
const auditLogsColumns = (localization: Localization, languageData: AdministrationServiceResource) => {
  return tanstackTableCreateColumnsByRowData<Volo_Abp_AuditLogging_AuditLogDto>({
    rows: $Volo_Abp_AuditLogging_AuditLogDto.properties,
    languageData: {
      languageData,
      constantKey: "Form.Log.Audit",
    },
    localization,

    custom: {
      url: {
        showHeader: true,
        content: (row: Volo_Abp_AuditLogging_AuditLogDto) => {
          const {id, url, httpStatusCode, httpMethod} = row;

          if (!id || !url) {
            return (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">—</span>
              </div>
            );
          }

          const statusKey =
            httpStatusCode !== null && httpStatusCode !== undefined ? String(httpStatusCode) : undefined;
          const methodKey = httpMethod ?? undefined;

          const statusClass =
            statusKey && statusKey in badgeClassNames ? badgeClassNames[statusKey as keyof typeof badgeClassNames] : "";

          const methodClass =
            methodKey && methodKey in badgeClassNames ? badgeClassNames[methodKey as keyof typeof badgeClassNames] : "";

          const detailsLabel = (languageData as Record<string, string> | undefined)?.Details ?? "Details";

          const truncateUrl = (urlText: string, maxLength = 40) => {
            if (urlText.length <= maxLength) return urlText;
            return `${urlText.substring(0, maxLength)}...`;
          };

          const urlText = url;
          const truncatedUrl = truncateUrl(urlText);

          return (
            <div className="flex w-full min-w-0 items-center gap-2">
              {httpStatusCode !== undefined && (
                <span
                  className={`inline-flex flex-shrink-0 items-center rounded border px-2 py-0.5 text-xs ${statusClass}`}>
                  {httpStatusCode}
                </span>
              )}

              {httpMethod ? (
                <span
                  className={`inline-flex flex-shrink-0 items-center rounded border px-2 py-0.5 text-xs ${methodClass}`}>
                  {httpMethod}
                </span>
              ) : null}

              <div className="min-w-0 flex-1">
                <DetailsModal
                  id={id}
                  languageData={languageData}
                  trigger={
                    <button
                      className="m-0 block w-full max-w-full truncate border-0 bg-transparent p-0 text-left text-blue-700 underline"
                      data-testid="dialog-trigger"
                      title={urlText}>
                      {truncatedUrl || detailsLabel}
                    </button>
                  }
                />
              </div>
            </div>
          );
        },
      },
    },
    badges: {
      url: {
        values: Object.keys(badgeClassNames).map((key) => ({
          position: "before",
          label: key.toString(),
          badgeClassName: badgeClassNames[key as keyof typeof badgeClassNames],
          conditions: [
            {
              conditionAccessorKey: "httpMethod",
              when: (value) => value === key,
            },
            {
              conditionAccessorKey: "httpStatusCode",
              when: (value) => value.toString() === key,
            },
          ],
        })),
      },
    },
  });
};
function auditLogsTable(languageData: AdministrationServiceResource) {
  const table: AuditLogsTable = {
    fillerColumn: "tenantName",
    pinColumns: ["url"],
    filters: {
      textFilters: [
        "userName",
        "url",
        "applicationName",
        "clientIpAddress",
        "correlationId",
        "minExecutionDuration",
        "maxExecutionDuration",
      ],
      dateFilters: [
        {
          label: languageData.StartEndTime,
          startAccessorKey: "startTime",
          endAccessorKey: "endTime",
        },
      ],
      facetedFilters: {
        httpStatusCode: {
          title: languageData["Form.Log.Audit.httpStatusCode"],
          options: $System_Net_HttpStatusCode.enum.map((statusCode) => ({
            value: statusCode,
            label: statusCode,
          })),
        },
        httpMethod: {
          title: languageData["Form.Log.Audit.httpMethod"],
          options: [
            {value: "GET", label: "GET"},
            {value: "POST", label: "POST"},
            {value: "PUT", label: "PUT"},
            {value: "DELETE", label: "DELETE"},
            {value: "HEAD", label: "HEAD"},
            {value: "CONNECT", label: "CONNECT"},
            {value: "OPTIONS", label: "OPTIONS"},
            {value: "TRACE", label: "TRACE"},
          ],
        },
        hasException: {
          title: languageData["Form.Log.Audit.hasException"],
          options: [
            {value: "true", label: "True"},
            {value: "false", label: "False"},
          ],
        },
      },
    },
    columnVisibility: {
      type: "show",
      columns: ["url", "userName", "clientIpAddress", "executionTime", "executionDuration", "applicationName"],
    },
    columnOrder: [
      "url",
      "httpStatusCode",
      "httpMethod",
      "userName",
      "clientIpAddress",
      "executionTime",
      "executionDuration",
      "applicationName",
    ],
  };
  return table;
}

export const tableData = {
  auditLogs: {
    columns: auditLogsColumns,
    table: auditLogsTable,
  },
};

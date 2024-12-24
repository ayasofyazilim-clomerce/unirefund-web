import type { Volo_Abp_Identity_IdentitySessionDto } from "@ayasofyazilim/saas/AccountService";
import { $Volo_Abp_Identity_IdentitySessionDto } from "@ayasofyazilim/saas/AccountService";
import type {
  TanstackTableColumnLink,
  TanstackTableCreationProps,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import { tanstackTableCreateColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import { InfoIcon, Trash } from "lucide-react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { deleteSessionsByIdApi } from "src/actions/core/AccountService/delete-actions";
import { handleDeleteResponse } from "src/actions/core/api-utils-client";
import type { AccountServiceResource } from "src/language-data/core/AccountService";
import DetailsInformation from "./_components/details-information";

type SessionsTable =
  TanstackTableCreationProps<Volo_Abp_Identity_IdentitySessionDto>;

const links: Partial<
  Record<keyof Volo_Abp_Identity_IdentitySessionDto, TanstackTableColumnLink>
> = {};

const sessionsColumns = (
  locale: string,
  languageData: AccountServiceResource,
) => {
  return tanstackTableCreateColumnsByRowData<Volo_Abp_Identity_IdentitySessionDto>(
    {
      rows: $Volo_Abp_Identity_IdentitySessionDto.properties,
      languageData: {
        languageData,
        constantKey: "Form",
      },
      config: {
        locale,
      },
      links,
    },
  );
};

function sessionsTable(
  languageData: AccountServiceResource,
  router: AppRouterInstance,
) {
  const table: SessionsTable = {
    fillerColumn: "userName",
    columnVisibility: {
      type: "show",
      columns: ["device", "deviceInfo", "signedIn", "lastAccessed"],
    },
    rowActions: [
      {
        type: "custom-dialog",
        cta: languageData["Sessions.Detail"],
        title: languageData["Sessions.Details"],
        icon: InfoIcon,
        actionLocation: "row",
        content: (rowData) => (
          <DetailsInformation
            languageData={languageData}
            sessionData={rowData}
          />
        ),
      },
      {
        type: "confirmation-dialog",
        cta: languageData["Sessions.Revokes"],
        title: languageData["Sessions.Revoke"],
        actionLocation: "row",
        confirmationText: languageData["Sessions.Confirm"],
        cancelText: languageData.Cancel,
        description: languageData["Sessions.Assurance"],
        icon: Trash,
        onConfirm: (row) => {
          void deleteSessionsByIdApi(row.id || "").then((response) => {
            handleDeleteResponse(response, router);
          });
        },
      },
    ],
  };
  return table;
}

export const tableData = {
  sessions: {
    columns: sessionsColumns,
    table: sessionsTable,
  },
};

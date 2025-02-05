import type {Volo_Abp_Identity_IdentitySessionDto} from "@ayasofyazilim/saas/IdentityService";
import {$Volo_Abp_Identity_IdentitySessionDto} from "@ayasofyazilim/saas/IdentityService";
import type {
  TanstackTableColumnLink,
  TanstackTableCreationProps,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {InfoIcon, Trash} from "lucide-react";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {handleDeleteResponse} from "src/actions/core/api-utils-client";
import {deleteUserSessionsByIdApi} from "src/actions/core/IdentityService/delete-actions";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";
import DetailsInformation from "./details-information";

type SessionsTable = TanstackTableCreationProps<Volo_Abp_Identity_IdentitySessionDto>;

const links: Partial<Record<keyof Volo_Abp_Identity_IdentitySessionDto, TanstackTableColumnLink>> = {};

const sessionsColumns = (locale: string, languageData: IdentityServiceResource) => {
  return tanstackTableCreateColumnsByRowData<Volo_Abp_Identity_IdentitySessionDto>({
    rows: $Volo_Abp_Identity_IdentitySessionDto.properties,
    languageData: {
      languageData,
      constantKey: "Form.User.Session",
    },
    config: {
      locale,
    },
    links,
  });
};

function sessionsTable(languageData: IdentityServiceResource, router: AppRouterInstance) {
  const table: SessionsTable = {
    fillerColumn: "userName",
    columnVisibility: {
      type: "show",
      columns: ["device", "deviceInfo", "signedIn", "lastAccessed"],
    },
    rowActions: [
      {
        type: "custom-dialog",
        cta: languageData["User.Session.Detail"],
        title: languageData["User.Session.Details"],
        icon: InfoIcon,
        actionLocation: "row",
        content: (rowData) => <DetailsInformation languageData={languageData} sessionData={rowData} />,
      },
      {
        type: "confirmation-dialog",
        cta: languageData["User.Session.Revokes"],
        title: languageData["User.Session.Revoke"],
        actionLocation: "row",
        confirmationText: languageData["User.Session.Revokes"],
        cancelText: languageData.Cancel,
        description: languageData["User.Session.Assurance"],
        icon: Trash,
        onConfirm: (row) => {
          void deleteUserSessionsByIdApi(row.id || "").then((response) => {
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

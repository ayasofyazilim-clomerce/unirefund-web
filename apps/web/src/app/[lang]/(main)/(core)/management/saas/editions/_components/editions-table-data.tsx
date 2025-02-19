import type {Volo_Saas_Host_Dtos_EditionDto} from "@ayasofyazilim/core-saas/SaasService";
import {$Volo_Saas_Host_Dtos_EditionDto} from "@ayasofyazilim/core-saas/SaasService";
import type {
  TanstackTableColumnLink,
  TanstackTableCreationProps,
  TanstackTableRowActionsType,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {handlePutResponse} from "@repo/utils/api";
import type {Policy} from "@repo/utils/policies";
import {isActionGranted} from "@repo/utils/policies";
import {ArchiveRestore, FileSignature, Plus, User2Icon} from "lucide-react";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {deleteFeaturesApi} from "src/actions/core/AdministrationService/delete-actions";
import type {SaasServiceResource} from "src/language-data/core/SaasService";

type EditionsTable = TanstackTableCreationProps<Volo_Saas_Host_Dtos_EditionDto>;

const links: Partial<Record<keyof Volo_Saas_Host_Dtos_EditionDto, TanstackTableColumnLink>> = {};

function editionsTableActions(
  languageData: SaasServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableTableActionsType[] = [];
  if (isActionGranted(["Saas.Editions.Create"], grantedPolicies)) {
    actions.push({
      type: "simple",
      actionLocation: "table",
      cta: languageData["Edition.New"],
      icon: Plus,
      onClick: () => {
        router.push("editions/new");
      },
    });
  }
  return actions;
}
function editionsRowActions(
  languageData: SaasServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableRowActionsType<Volo_Saas_Host_Dtos_EditionDto>[] = [
    {
      type: "simple",
      actionLocation: "row",
      cta: languageData["Edition.Features"],
      icon: FileSignature,
      onClick: (row) => {
        router.push(`editions/${row.id}/features`);
      },
      condition: () => isActionGranted(["Saas.Editions.ManageFeatures"], grantedPolicies),
    },
    {
      type: "confirmation-dialog",
      actionLocation: "row",
      cta: languageData["Edition.Restore.Features"],
      title: languageData["Edition.Restore.Features"],
      confirmationText: languageData.Save,
      cancelText: languageData.Cancel,
      description: languageData["Edition.Restore.Features.Description"],
      icon: ArchiveRestore,
      onConfirm: (row) => {
        void deleteFeaturesApi({
          providerName: "E",
          providerKey: row.id,
        }).then((res) => {
          handlePutResponse(res, router);
        });
      },
      condition: () => isActionGranted(["Saas.Editions.ManageFeatures"], grantedPolicies),
    },
    {
      type: "simple",
      actionLocation: "row",
      cta: languageData["Edition.MoveAllTenants"],
      icon: User2Icon,
      onClick: (row) => {
        router.push(`editions/${row.id}/move-all-tenants`);
      },
      condition: (row) =>
        row.tenantCount !== undefined &&
        row.tenantCount > 0 &&
        isActionGranted(["Saas.Editions.Update"], grantedPolicies),
    },
  ];
  return actions;
}

const editionsColumns = (
  locale: string,
  languageData: SaasServiceResource,
  grantedPolicies: Record<Policy, boolean>,
) => {
  if (isActionGranted(["Saas.Editions.Update"], grantedPolicies)) {
    links.displayName = {
      prefix: "editions",
      targetAccessorKey: "id",
    };
  }
  return tanstackTableCreateColumnsByRowData<Volo_Saas_Host_Dtos_EditionDto>({
    rows: $Volo_Saas_Host_Dtos_EditionDto.properties,
    languageData: {
      languageData,
      constantKey: "Form.Edition",
    },
    config: {
      locale,
    },
    links,
  });
};
function editionsTable(
  languageData: SaasServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const table: EditionsTable = {
    fillerColumn: "displayName",
    pinColumns: ["displayName"],
    columnVisibility: {
      type: "show",
      columns: ["displayName", "tenantCount"],
    },
    filters: {
      textFilters: ["filter"],
    },
    tableActions: editionsTableActions(languageData, router, grantedPolicies),
    rowActions: editionsRowActions(languageData, router, grantedPolicies),
  };
  return table;
}

export const tableData = {
  editions: {
    columns: editionsColumns,
    table: editionsTable,
  },
};

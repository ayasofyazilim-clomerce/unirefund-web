import type {
  Volo_Saas_Host_Dtos_EditionLookupDto,
  Volo_Saas_Host_Dtos_SaasTenantDto,
} from "@ayasofyazilim/core-saas/SaasService";
import {$Volo_Saas_Host_Dtos_SaasTenantDto} from "@ayasofyazilim/core-saas/SaasService";
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
import {ArchiveRestore, Eye, FileSignature, Plus} from "lucide-react";
import type {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {deleteFeaturesApi} from "@repo/actions/core/AdministrationService/delete-actions";
import type {SaasServiceResource} from "src/language-data/core/SaasService";

type TenantsTable = TanstackTableCreationProps<Volo_Saas_Host_Dtos_SaasTenantDto>;
const links: Partial<Record<keyof Volo_Saas_Host_Dtos_SaasTenantDto, TanstackTableColumnLink>> = {};

function tenantsTableActions(
  languageData: SaasServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableTableActionsType<Volo_Saas_Host_Dtos_SaasTenantDto>[] = [];
  if (isActionGranted(["Saas.Tenants.Create"], grantedPolicies)) {
    actions.push({
      type: "simple",
      actionLocation: "table",
      cta: languageData["Tenant.New"],
      icon: Plus,
      onClick: () => {
        router.push("tenants/new");
      },
    });
  }
  return actions;
}
function tenantsRowActions(
  languageData: SaasServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableRowActionsType<Volo_Saas_Host_Dtos_SaasTenantDto>[] = [
    {
      type: "simple",
      actionLocation: "row",
      cta: languageData["Tenant.Features"],
      icon: FileSignature,
      onClick: (row) => {
        router.push(`tenants/${row.id}/features`);
      },
      condition: () => isActionGranted(["Saas.Tenants.ManageFeatures"], grantedPolicies),
    },
    {
      type: "confirmation-dialog",
      actionLocation: "row",
      cta: languageData["Tenant.Restore.Features"],
      title: languageData["Tenant.Restore.Features"],
      confirmationText: languageData.Save,
      cancelText: languageData.Cancel,
      description: languageData["Tenant.Restore.Features.Description"],
      icon: ArchiveRestore,
      onConfirm: (row) => {
        void deleteFeaturesApi({
          providerName: "T",
          providerKey: row.id,
        }).then((res) => {
          handlePutResponse(res, router);
        });
      },
      condition: () => isActionGranted(["Saas.Tenants.ManageFeatures"], grantedPolicies),
    },
    {
      type: "simple",
      actionLocation: "row",
      cta: languageData["Tenant.SetPassword"],
      icon: Eye,
      onClick: (row) => {
        router.push(`tenants/${row.id}/set-password`);
      },
      condition: () => isActionGranted(["Saas.Tenants.SetPassword"], grantedPolicies),
    },
  ];
  return actions;
}
const tenantsColumns = (
  locale: string,
  languageData: SaasServiceResource,
  grantedPolicies: Record<Policy, boolean>,
) => {
  if (isActionGranted(["Saas.Tenants.Update"], grantedPolicies)) {
    links.name = {
      prefix: "tenants",
      targetAccessorKey: "id",
    };
  }
  return tanstackTableCreateColumnsByRowData<Volo_Saas_Host_Dtos_SaasTenantDto>({
    rows: $Volo_Saas_Host_Dtos_SaasTenantDto.properties,
    languageData: {
      languageData,
      constantKey: "Form.Tenant",
    },
    config: {
      locale,
    },
    links,
    badges: {
      name: {
        values: [
          {
            position: "after",
            label: languageData["Form.Tenant.active"],
            badgeClassName: "text-green-700 bg-green-100 border-green-500",
            conditions: [
              {
                when: (value) => value === 0,
                conditionAccessorKey: "activationState",
              },
            ],
          },
          {
            position: "after",
            label: languageData["Form.Tenant.activeWithLimitedTime"],
            badgeClassName: "text-orange-700 bg-orange-100 border-orange-500",
            conditions: [
              {
                when: (value) => value === 1,
                conditionAccessorKey: "activationState",
              },
            ],
          },
          {
            position: "after",
            label: languageData["Form.Tenant.passive"],
            badgeClassName: "text-red-700 bg-red-100 border-red-500",
            conditions: [
              {
                when: (value) => value === 2,
                conditionAccessorKey: "activationState",
              },
            ],
          },
        ],
      },
    },
  });
};
function tenantsTable(
  languageData: SaasServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
  editionList: Volo_Saas_Host_Dtos_EditionLookupDto[],
) {
  const table: TenantsTable = {
    fillerColumn: "name",
    pinColumns: ["name"],
    columnVisibility: {
      type: "show",
      columns: ["name", "editionName", "editionEndDateUtc", "activationEndDate"],
    },
    columnOrder: ["name", "editionName", "editionEndDateUtc", "activationEndDate"],
    filters: {
      textFilters: ["filter"],
      dateFilters: [
        {
          label: languageData["Tenant.editionEndDate"],
          startAccessorKey: "expirationDateMin",
          endAccessorKey: "expirationDateMax",
        },
        {
          label: languageData["Tenant.activationEndDate"],
          startAccessorKey: "activationEndDateMin",
          endAccessorKey: "activationEndDateMax",
        },
      ],
      facetedFilters: {
        editionId: {
          title: languageData["Tenant.Edition"],
          options: editionList.map((item) => ({
            label: item.displayName || "",
            value: item.id || "",
          })),
        },
        activationState: {
          title: languageData["Tenant.activationState"],
          options: [
            {
              label: languageData["Form.Tenant.active"],
              value: "0",
            },
            {
              label: languageData["Form.Tenant.activeWithLimitedTime"],
              value: "1",
            },
            {
              label: languageData["Form.Tenant.passive"],
              value: "2",
            },
          ],
        },
        getEditionNames: {
          title: languageData["Tenant.getEditionNames"],
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
    tableActions: tenantsTableActions(languageData, router, grantedPolicies),
    rowActions: tenantsRowActions(languageData, router, grantedPolicies),
  };
  return table;
}

export const tableData = {
  tenants: {
    columns: tenantsColumns,
    table: tenantsTable,
  },
};

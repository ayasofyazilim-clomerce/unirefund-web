import type { Volo_Abp_Identity_IdentityRoleDto } from "@ayasofyazilim/saas/IdentityService";
import { $Volo_Abp_Identity_IdentityRoleDto } from "@ayasofyazilim/saas/IdentityService";
import type { TanstackTableCreationProps } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import { tanstackTableCreateColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import { SaveIcon } from "lucide-react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { handlePutResponse } from "src/actions/core/api-utils-client";
import { putOrganizationUnitsByIdRolesApi } from "src/actions/core/IdentityService/put-actions";
import type { IdentityServiceResource } from "src/language-data/core/IdentityService";

type RolesTable = TanstackTableCreationProps<Volo_Abp_Identity_IdentityRoleDto>;
const rolesColumns = (
  locale: string,
  languageData: IdentityServiceResource,
  unitRoles: Volo_Abp_Identity_IdentityRoleDto[],
) => {
  return tanstackTableCreateColumnsByRowData<Volo_Abp_Identity_IdentityRoleDto>(
    {
      rows: $Volo_Abp_Identity_IdentityRoleDto.properties,
      languageData: {
        languageData,
        constantKey: "Form.Role",
      },
      config: {
        locale,
      },
      selectableRows: true,
      disabledRowIds: unitRoles.map((role) => role.id || ""),
    },
  );
};

function rolesTable(
  languageData: IdentityServiceResource,
  selectedUnitId: string,
  router: AppRouterInstance,
) {
  const table: RolesTable = {
    fillerColumn: "name",
    columnVisibility: {
      type: "show",
      columns: ["select", "name"],
    },
    filters: {
      textFilters: ["filter"],
    },
    selectedRowAction: {
      actionLocation: "table",
      cta: languageData.Save,
      icon: SaveIcon,
      onClick: (selectedIds: string[]) => {
        void putOrganizationUnitsByIdRolesApi({
          id: selectedUnitId,
          requestBody: {
            roleIds: selectedIds,
          },
        }).then((res) => {
          handlePutResponse(res, router);
        });
      },
    },
  };
  return table;
}
export const tableData = {
  roles: {
    columns: rolesColumns,
    table: rolesTable,
  },
};

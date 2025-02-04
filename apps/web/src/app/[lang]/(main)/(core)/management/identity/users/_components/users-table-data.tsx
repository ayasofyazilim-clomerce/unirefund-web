import type {
  Volo_Abp_Identity_IdentityRoleLookupDto,
  Volo_Abp_Identity_IdentityUserDto,
  Volo_Abp_Identity_OrganizationUnitLookupDto,
} from "@ayasofyazilim/saas/IdentityService";
import { $Volo_Abp_Identity_IdentityUserDto } from "@ayasofyazilim/saas/IdentityService";
import type {
  TanstackTableColumnLink,
  TanstackTableCreationProps,
  TanstackTableRowActionsType,
  TanstackTableTableActionsType,
} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/types";
import { tanstackTableCreateColumnsByRowData } from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {
  CheckCircle,
  Eye,
  FolderCheck,
  Key,
  LockIcon,
  Plus,
  Settings,
  ShieldCheck,
  UnlockIcon,
  XCircle,
} from "lucide-react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { handlePutResponse } from "src/actions/core/api-utils-client";
import { putUsersByIdUnlockApi } from "src/actions/core/IdentityService/put-actions";
import type { IdentityServiceResource } from "src/language-data/core/IdentityService";
import isActionGranted from "src/utils/page-policy/action-policy";
import type { Policy } from "src/utils/page-policy/utils";

type UsersTable = TanstackTableCreationProps<Volo_Abp_Identity_IdentityUserDto>;

const links: Partial<
  Record<keyof Volo_Abp_Identity_IdentityUserDto, TanstackTableColumnLink>
> = {};
function usersTableActions(
  languageData: IdentityServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableTableActionsType[] = [];
  if (isActionGranted(["AbpIdentity.Users.Create"], grantedPolicies)) {
    actions.push({
      type: "simple",
      actionLocation: "table",
      cta: languageData["User.New"],
      icon: Plus,
      onClick: () => {
        router.push("users/new");
      },
    });
  }
  return actions;
}
function usersRowActions(
  languageData: IdentityServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
) {
  const actions: TanstackTableRowActionsType<Volo_Abp_Identity_IdentityUserDto>[] =
    [];
  if (
    isActionGranted(["AbpIdentity.Users.ManagePermissions"], grantedPolicies)
  ) {
    actions.push({
      type: "simple",
      actionLocation: "row",
      cta: languageData["User.Permissions"],
      icon: ShieldCheck,
      onClick: (row) => {
        router.push(`users/${row.id}/permissions`);
      },
    });
  }
  if (isActionGranted(["AbpIdentity.Users.Update"], grantedPolicies)) {
    actions.push({
      type: "simple",
      actionLocation: "row",
      cta: languageData["User.Claims"],
      icon: FolderCheck,
      onClick: (row) => {
        router.push(`users/${row.id}/claims`);
      },
    });
  }
  if (isActionGranted(["AbpIdentity.Users"], grantedPolicies)) {
    actions.push({
      type: "simple",
      actionLocation: "row",
      cta: languageData["User.Sessions"],
      icon: Settings,
      onClick: (row) => {
        router.push(`users/${row.id}/sessions`);
      },
    });
  }
  if (isActionGranted(["AbpIdentity.Users.Update"], grantedPolicies)) {
    actions.push({
      type: "simple",
      actionLocation: "row",
      cta: languageData["User.SetPassword"],
      icon: Eye,
      onClick: (row) => {
        router.push(`users/${row.id}/set-password`);
      },
    });
  }
  if (isActionGranted(["AbpIdentity.Users.Update"], grantedPolicies)) {
    actions.push({
      type: "simple",
      actionLocation: "row",
      cta: languageData["User.twoFactor"],
      icon: Key,
      onClick: (row) => {
        router.push(`users/${row.id}/two-factor`);
      },
    });
  }
  if (isActionGranted(["AbpIdentity.Users.Update"], grantedPolicies)) {
    actions.push({
      type: "simple",
      actionLocation: "row",
      cta: languageData["User.Lock"],
      condition: (row) => row.lockoutEnabled === true,
      icon: LockIcon,
      onClick: (row) => {
        router.push(`users/${row.id}/lock`);
      },
    });
  }
  if (isActionGranted(["AbpIdentity.Users.Update"], grantedPolicies)) {
    actions.push({
      type: "confirmation-dialog",
      cta: languageData["User.Unlock"],
      title: languageData["User.Unlock"],
      condition: (row) => row.isLockedOut === true,
      actionLocation: "row",
      confirmationText: languageData.Save,
      cancelText: languageData.Cancel,
      description: languageData["User.Unlock.Assurance"],
      icon: UnlockIcon,
      onConfirm: (row) => {
        void putUsersByIdUnlockApi(row.id || "").then((res) => {
          handlePutResponse(res, router);
        });
      },
    });
  }
  return actions;
}
const usersColumns = (
  locale: string,
  languageData: IdentityServiceResource,
  grantedPolicies: Record<Policy, boolean>,
) => {
  if (isActionGranted(["AbpIdentity.Users.Update"], grantedPolicies)) {
    links.userName = {
      prefix: "users",
      targetAccessorKey: "id",
    };
  }
  return tanstackTableCreateColumnsByRowData<Volo_Abp_Identity_IdentityUserDto>(
    {
      rows: $Volo_Abp_Identity_IdentityUserDto.properties,
      languageData: {
        languageData,
        constantKey: "Form.User",
      },
      config: {
        locale,
      },
      links,
      badges: {
        userName: {
          values: [
            {
              position: "after",
              label: languageData["Form.User.emailConfirmed"],
              badgeClassName: "text-green-500 bg-green-100 border-green-500",
              conditions: [
                {
                  when: (value) => value === true,
                  conditionAccessorKey: "emailConfirmed",
                },
              ],
            },
            {
              position: "after",
              label: languageData["Form.User.twoFactorEnabled"],
              badgeClassName: "text-green-500 bg-green-100 border-green-500",
              conditions: [
                {
                  when: (value) => value === true,
                  conditionAccessorKey: "twoFactorEnabled",
                },
              ],
            },
          ],
        },
      },
      custom: {
        userName: {
          content: (row) => {
            return (
              <>
                {row.userName}{" "}
                {row.isLockedOut ? (
                  <LockIcon className="h-4 w-4 text-red-500" />
                ) : null}
              </>
            );
          },
        },
      },
      faceted: {
        isActive: {
          options: [
            {
              label: "Yes",
              when: (value) => {
                return Boolean(value);
              },
              value: "true",
              icon: CheckCircle,
              iconClassName: "text-green-700",
              hideColumnValue: true,
            },
            {
              label: "No",
              when: (value) => {
                return !value;
              },
              value: "false",
              icon: XCircle,
              iconClassName: "text-red-700",
              hideColumnValue: true,
            },
          ],
        },
        lockoutEnabled: {
          options: [
            {
              label: "Yes",
              when: (value) => {
                return Boolean(value);
              },
              value: "true",
              icon: CheckCircle,
              iconClassName: "text-green-700",
              hideColumnValue: true,
            },
            {
              label: "No",
              when: (value) => {
                return !value;
              },
              value: "false",
              icon: XCircle,
              iconClassName: "text-red-700",
              hideColumnValue: true,
            },
          ],
        },
      },
    },
  );
};

function usersTable(
  languageData: IdentityServiceResource,
  router: AppRouterInstance,
  grantedPolicies: Record<Policy, boolean>,
  roleList: Volo_Abp_Identity_IdentityRoleLookupDto[],
  organizationList: Volo_Abp_Identity_OrganizationUnitLookupDto[],
) {
  const BooleanOptions = [
    {
      label: languageData.Yes,
      value: "true",
    },
    {
      label: languageData.No,
      value: "false",
    },
  ];
  const table: UsersTable = {
    fillerColumn: "userName",
    pinColumns: ["userName"],
    columnVisibility: {
      type: "show",
      columns: [
        "userName",
        "email",
        "roleNames",
        "phoneNumber",
        "name",
        "surname",
        "isActive",
        "lockoutEnabled",
        "accessFailedCount",
        "creationTime",
        "lastModificationTime",
      ],
    },
    columnOrder: [
      "userName",
      "email",
      "roleNames",
      "phoneNumber",
      "name",
      "surname",
      "isActive",
      "lockoutEnabled",
      "accessFailedCount",
      "creationTime",
      "lastModificationTime",
    ],
    filters: {
      textFilters: [
        "filter",
        "userName",
        "name",
        "surname",
        "emailAddress",
        "phoneNumber",
      ],
      dateFilters: [
        {
          label: languageData["Form.User.creationTime"],
          startAccessorKey: "minCreationTime",
          endAccessorKey: "maxCreationTime",
        },
        {
          label: languageData["Form.User.lastModificationTime"],
          startAccessorKey: "minModifitionTime",
          endAccessorKey: "maxModifitionTime",
        },
      ],
      facetedFilters: {
        roleId: {
          title: languageData["Form.User.roleNames"],
          options: roleList.map((role) => ({
            label: role.name || "",
            value: role.id || "",
          })),
        },
        organizationUnitId: {
          title: languageData["Form.User.organizationUnitIds"],
          options: organizationList.map((organization) => ({
            label: organization.displayName || "",
            value: organization.id || "",
          })),
        },
        notActive: {
          title: languageData["Form.User.notActive"],
          options: BooleanOptions,
        },
        isLockedOut: {
          title: languageData["Form.User.isLockedOut"],
          options: BooleanOptions,
        },
        emailConfirmed: {
          title: languageData["Form.User.emailConfirmed"],
          options: BooleanOptions,
        },
        isExternal: {
          title: languageData["Form.User.isExternal"],
          options: BooleanOptions,
        },
      },
    },
    tableActions: usersTableActions(languageData, router, grantedPolicies),
    rowActions: usersRowActions(languageData, router, grantedPolicies),
  };
  return table;
}

export const tableData = {
  users: {
    columns: usersColumns,
    table: usersTable,
  },
};

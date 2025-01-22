"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type {
  Volo_Abp_PermissionManagement_PermissionGroupDto as PermissionGroup,
  Volo_Abp_PermissionManagement_UpdatePermissionDto as UpdatePermissionDto,
  Volo_Abp_PermissionManagement_GetPermissionListResultDto,
  Volo_Abp_PermissionManagement_PermissionGrantInfoDto,
} from "@ayasofyazilim/saas/AdministrationService";
import {
  SectionLayout,
  SectionLayoutContent,
} from "@repo/ayasofyazilim-ui/templates/section-layout-v2";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { putPermissionsApi } from "src/actions/core/AdministrationService/put-actions";
import { handlePutResponse } from "src/actions/core/api-utils-client";
import type { IdentityServiceResource } from "src/language-data/core/IdentityService";

export default function RolePermissions({
  languageData,
  rolePermissionsData,
}: {
  languageData: IdentityServiceResource;
  rolePermissionsData: Volo_Abp_PermissionManagement_GetPermissionListResultDto;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [permissionsData, setPermissionsData] = useState<PermissionGroup[]>(
    rolePermissionsData.groups || [],
  );
  const [updatedPermissionsData] = useState<UpdatePermissionDto[]>([]);

  const permissionChange = (permissionName: string, isGranted: boolean) => {
    const existingIndex = updatedPermissionsData.findIndex(
      (p) => p.name === permissionName,
    );
    if (existingIndex >= 0) {
      updatedPermissionsData[existingIndex].isGranted = isGranted;
    } else {
      updatedPermissionsData.push({ name: permissionName, isGranted });
    }
  };

  const toggleChildren = (
    group: PermissionGroup,
    parentName: string,
    newGrant: boolean,
  ) => {
    group.permissions?.forEach((child) => {
      if (child.parentName === parentName) {
        permissionChange(child.name || "", newGrant);
        child.isGranted = newGrant;
        toggleChildren(group, child.name || "", newGrant);
      }
    });
  };

  const toggleParents = (
    group: PermissionGroup,
    childPermission: Volo_Abp_PermissionManagement_PermissionGrantInfoDto,
    newGrant: boolean,
  ) => {
    let currentParentName = childPermission.parentName;

    while (currentParentName) {
      const parentNameForIteration = currentParentName;
      const parentPermission = group.permissions?.find(
        (p) => p.name === parentNameForIteration,
      );

      if (!parentPermission) {
        currentParentName = null;
        continue;
      }

      if (newGrant) {
        permissionChange(parentPermission.name || "", true);
        parentPermission.isGranted = true;
      } else {
        const hasOtherGrantedChildren = group.permissions?.some(
          (sibling) =>
            sibling.parentName === parentNameForIteration && sibling.isGranted,
        );

        if (!hasOtherGrantedChildren) {
          permissionChange(parentPermission.name || "", false);
          parentPermission.isGranted = false;
        }
      }
      currentParentName = parentPermission.parentName || null;
    }
  };

  const togglePermission = useCallback(
    (groupName: string, permissionName: string) => {
      const updatedPermissions = permissionsData.map((group) => {
        if (group.name !== groupName) return group;

        const updatedPermissionsList = group.permissions?.map((permission) => {
          if (permission.name === permissionName) {
            const newGrant = !permission.isGranted;
            permissionChange(permissionName, newGrant);

            if (!permission.parentName) {
              if (!newGrant) {
                toggleChildren(group, permissionName, false);
              }
              return { ...permission, isGranted: newGrant };
            }
            if (!newGrant) {
              toggleChildren(group, permissionName, false);
            }
            toggleParents(group, permission, newGrant);
            return { ...permission, isGranted: newGrant };
          }
          return permission;
        });
        return { ...group, permissions: updatedPermissionsList };
      });

      setPermissionsData(updatedPermissions);
    },
    [permissionsData],
  );

  const toggleGroupPermissions = (groupName: string, isGranted: boolean) => {
    setPermissionsData((prev) =>
      prev.map((group) => {
        if (group.name !== groupName) return group;
        const updatedPermissions = group.permissions?.map((permission) => {
          permissionChange(permission.name || "", isGranted);
          return { ...permission, isGranted };
        });
        return { ...group, permissions: updatedPermissions };
      }),
    );
  };

  const toggleAllPermissions = (isGranted: boolean) => {
    setPermissionsData((prev) =>
      prev.map((group) => ({
        ...group,
        permissions: group.permissions?.map((permission) => {
          permissionChange(permission.name || "", isGranted);
          return { ...permission, isGranted };
        }),
      })),
    );
  };

  const renderPermissions = useCallback(
    (groupName: string, parentName: string | null) => {
      const group = permissionsData.find((g) => g.name === groupName);
      if (!group) return null;
      const permissions = group.permissions?.filter(
        (p) => p.parentName === parentName,
      );
      return (
        <div className={parentName ? "ml-8" : ""}>
          {permissions?.map((permission) => (
            <div className="mb-2 gap-2" key={permission.name}>
              <Checkbox
                checked={permission.isGranted || false}
                className="mr-2"
                onCheckedChange={() => {
                  togglePermission(groupName, permission.name || "");
                }}
              />
              <span>{permission.displayName}</span>
              {renderPermissions(groupName, permission.name || null)}
            </div>
          ))}
        </div>
      );
    },
    [permissionsData, togglePermission],
  );

  return (
    <div className="relative flex h-screen flex-col pb-56">
      <div className="mt-2 flex items-center gap-2 pb-2">
        <Checkbox
          checked={permissionsData.every((group) =>
            group.permissions?.every((p) => p.isGranted),
          )}
          onCheckedChange={(checked) => {
            toggleAllPermissions(checked === true);
          }}
        />
        <span>{languageData["Grant.All.Permissions"]}</span>
      </div>

      <SectionLayout
        sections={permissionsData.map((group) => ({
          name: `${group.displayName} (${group.permissions?.filter((p) => p.isGranted).length})`,
          id: group.name || "",
        }))}
        vertical
      >
        {permissionsData.map((group) => (
          <SectionLayoutContent key={group.name} sectionId={group.name || ""}>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={group.permissions?.every((p) => p.isGranted)}
                onCheckedChange={(checked) => {
                  toggleGroupPermissions(group.name || "", checked === true);
                }}
              />
              <span>{languageData["Select.All"]}</span>
            </div>
            <div className="my-2 border-t border-gray-200" />
            {renderPermissions(group.name || "", null)}
          </SectionLayoutContent>
        ))}
      </SectionLayout>
      <div className="sticky bottom-0 left-0 flex w-full justify-end bg-white pb-4 pr-12 shadow-md">
        <Button
          disabled={loading}
          onClick={() => {
            setLoading(true);
            void putPermissionsApi({
              providerKey: rolePermissionsData.entityDisplayName || "",
              providerName: "R",
              requestBody: { permissions: updatedPermissionsData },
            })
              .then((res) => {
                handlePutResponse(res, router, "..");
              })
              .finally(() => {
                setLoading(false);
              });
          }}
        >
          {languageData["Edit.Save"]}
        </Button>
      </div>
    </div>
  );
}

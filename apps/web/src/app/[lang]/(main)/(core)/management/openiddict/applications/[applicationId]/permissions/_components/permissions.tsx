"use client";

import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {Input} from "@/components/ui/input";
import type {
  Volo_Abp_PermissionManagement_PermissionGroupDto as PermissionGroup,
  Volo_Abp_PermissionManagement_UpdatePermissionDto as UpdatePermissionDto,
  Volo_Abp_PermissionManagement_GetPermissionListResultDto,
  Volo_Abp_PermissionManagement_PermissionGrantInfoDto,
} from "@ayasofyazilim/core-saas/AdministrationService";
import {SectionLayout, SectionLayoutContent} from "@repo/ayasofyazilim-ui/templates/section-layout-v2";
import {useRouter} from "next/navigation";
import {useCallback, useState, useTransition} from "react";
import {handlePutResponse} from "@repo/utils/api";
import {putPermissionsApi} from "src/actions/core/AdministrationService/put-actions";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";

export default function ApplicationPermissions({
  languageData,
  applicationPermissionsData,
}: {
  languageData: IdentityServiceResource;
  applicationPermissionsData: Volo_Abp_PermissionManagement_GetPermissionListResultDto;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [permissionsData, setPermissionsData] = useState<PermissionGroup[]>(applicationPermissionsData.groups || []);
  const [updatedPermissionsData] = useState<UpdatePermissionDto[]>([]);
  const [groupSearchTerm, setGroupSearchTerm] = useState("");
  const [permissionSearchTerms, setPermissionSearchTerms] = useState<Record<string, string>>({});

  const permissionChange = (permissionName: string, isGranted: boolean) => {
    const existingIndex = updatedPermissionsData.findIndex((p) => p.name === permissionName);
    if (existingIndex >= 0) {
      updatedPermissionsData[existingIndex].isGranted = isGranted;
    } else {
      updatedPermissionsData.push({name: permissionName, isGranted});
    }
  };

  const toggleChildren = (group: PermissionGroup, parentName: string, newGrant: boolean) => {
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
      const parentPermission = group.permissions?.find((p) => p.name === parentNameForIteration);
      if (!parentPermission) {
        currentParentName = null;
        continue;
      }
      if (newGrant) {
        permissionChange(parentPermission.name || "", true);
        parentPermission.isGranted = true;
      } else {
        const hasOtherGrantedChildren = group.permissions?.some(
          (sibling) => sibling.parentName === parentNameForIteration && sibling.isGranted,
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
              return {...permission, isGranted: newGrant};
            }
            if (!newGrant) {
              toggleChildren(group, permissionName, false);
            }
            toggleParents(group, permission, newGrant);
            return {...permission, isGranted: newGrant};
          }
          return permission;
        });
        return {...group, permissions: updatedPermissionsList};
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
          return {...permission, isGranted};
        });
        return {...group, permissions: updatedPermissions};
      }),
    );
  };

  const toggleAllPermissions = (isGranted: boolean) => {
    setPermissionsData((prev) =>
      prev.map((group) => ({
        ...group,
        permissions: group.permissions?.map((permission) => {
          permissionChange(permission.name || "", isGranted);
          return {...permission, isGranted};
        }),
      })),
    );
  };

  const permissionMatches = useCallback(
    (
      permission: Volo_Abp_PermissionManagement_PermissionGrantInfoDto,
      group: PermissionGroup,
      searchTerm: string,
    ): boolean => {
      if (!searchTerm) return true;
      if (permission.displayName?.toLowerCase().includes(searchTerm.toLowerCase())) return true;
      const children = group.permissions?.filter((p) => p.parentName === permission.name);
      return children ? children.some((child) => permissionMatches(child, group, searchTerm)) : false;
    },
    [],
  );

  const renderPermissions = useCallback(
    (groupName: string, parentName: string | null, searchTerm: string) => {
      const group = permissionsData.find((g) => g.name === groupName);
      if (!group) return null;
      const permissions = group.permissions?.filter(
        (p) => p.parentName === parentName && permissionMatches(p, group, searchTerm),
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
              {permission.isGranted
                ? permission.grantedProviders?.map((provider) => (
                    <span
                      className="ml-2 rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-600"
                      key={`${provider.providerName}-${provider.providerKey}`}>
                      {`${provider.providerName}: ${provider.providerKey}`}
                    </span>
                  ))
                : null}
              {renderPermissions(groupName, permission.name || null, searchTerm)}
            </div>
          ))}
        </div>
      );
    },
    [permissionsData, togglePermission, permissionMatches],
  );

  const filteredGroups = permissionsData.filter((group) =>
    group.displayName?.toLowerCase().includes(groupSearchTerm.toLowerCase()),
  );

  return (
    <div className="relative flex h-screen flex-col pb-56">
      <div className="mb-2 mt-2">
        <Input
          className="w-60 rounded border p-2"
          onChange={(e) => {
            setGroupSearchTerm(e.target.value);
          }}
          placeholder={languageData["Search.Groups"]}
          type="text"
          value={groupSearchTerm}
        />
      </div>

      <div className="mt-2 flex items-center gap-2 pb-2">
        <Checkbox
          checked={permissionsData.every((group) => group.permissions?.every((p) => p.isGranted))}
          onCheckedChange={(checked) => {
            toggleAllPermissions(checked === true);
          }}
        />
        <span>{languageData["Grant.All.Permissions"]}</span>
      </div>

      {filteredGroups.length > 0 && (
        <SectionLayout
          sections={filteredGroups.map((group) => ({
            name: `${group.displayName} (${group.permissions?.filter((p) => p.isGranted).length})`,
            id: group.name || "",
          }))}
          vertical>
          {filteredGroups.map((group) => {
            const groupPermissionSearch = permissionSearchTerms[group.name || ""] || "";
            return (
              <SectionLayoutContent key={group.name} sectionId={group.name || ""}>
                <div className="mb-4">
                  <Input
                    className="w-full rounded border p-2"
                    onChange={(e) => {
                      setPermissionSearchTerms((prev) => ({
                        ...prev,
                        [group.name || ""]: e.target.value,
                      }));
                    }}
                    placeholder={languageData["Search.Permissions"]}
                    type="text"
                    value={groupPermissionSearch}
                  />
                </div>
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
                {renderPermissions(group.name || "", null, groupPermissionSearch)}
              </SectionLayoutContent>
            );
          })}
        </SectionLayout>
      )}

      <div className="fixed bottom-0 left-0 flex w-full justify-end bg-white pb-4 pr-16">
        <Button
          disabled={isPending}
          onClick={() => {
            startTransition(() => {
              void putPermissionsApi({
                providerKey: applicationPermissionsData.entityDisplayName || "",
                providerName: "C",
                requestBody: {permissions: updatedPermissionsData},
              }).then((res) => {
                handlePutResponse(res, router, "..");
              });
            });
          }}>
          {languageData["Edit.Save"]}
        </Button>
      </div>
    </div>
  );
}

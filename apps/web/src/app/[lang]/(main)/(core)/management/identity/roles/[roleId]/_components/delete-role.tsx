"use client";

import {SidebarMenuButton} from "@/components/ui/sidebar";
import {deleteRoleByIdApi} from "@repo/actions/core/IdentityService/delete-actions";
import ConfirmDialog from "@repo/ayasofyazilim-ui/molecules/confirm-dialog";
import {handleDeleteResponse} from "@repo/utils/api";
import {isActionGranted, useGrantedPolicies} from "@repo/utils/policies";
import {Trash2} from "lucide-react";
import {useParams, useRouter} from "next/navigation";
import {startTransition} from "react";
import type {IdentityServiceResource} from "@/language-data/core/IdentityService";

export function DeleteRoleDialog({languageData}: {languageData: IdentityServiceResource}) {
  const router = useRouter();
  const {roleId} = useParams<{roleId: string}>();
  const {grantedPolicies} = useGrantedPolicies();
  if (!isActionGranted(["AbpIdentity.Roles", "AbpIdentity.Roles.Delete"], grantedPolicies)) return null;

  return (
    <ConfirmDialog
      closeProps={{children: languageData.Cancel}}
      confirmProps={{
        variant: "destructive",
        children: languageData.Delete,
        onConfirm: () => {
          startTransition(() => {
            void deleteRoleByIdApi(roleId).then((res) => {
              handleDeleteResponse(res, router, "../roles");
            });
          });
        },
        closeAfterConfirm: true,
      }}
      description={languageData["Delete.Assurance"]}
      title={languageData["Role.Delete"]}
      type="without-trigger">
      <SidebarMenuButton
        className="text-destructive hover:text-destructive focus-visible:text-destructive"
        tooltip={languageData["Role.Delete"]}>
        <Trash2 className="w-4" />
        <span>{languageData["Role.Delete"]}</span>
      </SidebarMenuButton>
    </ConfirmDialog>
  );
}

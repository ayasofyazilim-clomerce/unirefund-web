"use client";

import type {
  UniRefund_IdentityService_AssignableRoles_AssignableRoleDto,
  Volo_Abp_Identity_IdentityRoleDto,
  Volo_Abp_Identity_IdentityUserDto,
  Volo_Abp_Identity_OrganizationUnitDto,
  Volo_Abp_Identity_OrganizationUnitLookupDto,
} from "@ayasofyazilim/saas/IdentityService";
import { $Volo_Abp_Identity_IdentityUserUpdateDto } from "@ayasofyazilim/saas/IdentityService";
import { ActionList } from "@repo/ayasofyazilim-ui/molecules/action-button";
import ConfirmDialog from "@repo/ayasofyazilim-ui/molecules/confirm-dialog";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { createUiSchemaWithResource } from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import { CustomMultiSelectWidget } from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGrantedPolicies } from "@repo/utils/policies";
import {
  handleDeleteResponse,
  handlePutResponse,
} from "src/actions/core/api-utils-client";
import { deleteUserByIdApi } from "src/actions/core/IdentityService/delete-actions";
import { putUserApi } from "src/actions/core/IdentityService/put-actions";
import type { IdentityServiceResource } from "src/language-data/core/IdentityService";
import isActionGranted from "src/utils/page-policy/action-policy";

type UserFormDto = Volo_Abp_Identity_IdentityUserDto & {
  organizationUnitIds?: string[] | null;
};

export default function Form({
  languageData,
  userDetailsData,
  roleList,
  organizationList,
  userRoles,
  userOrganizationUnits,
}: {
  languageData: IdentityServiceResource;
  userDetailsData: Volo_Abp_Identity_IdentityUserDto;
  roleList: UniRefund_IdentityService_AssignableRoles_AssignableRoleDto[];
  organizationList: Volo_Abp_Identity_OrganizationUnitLookupDto[];
  userRoles: Volo_Abp_Identity_IdentityRoleDto[];
  userOrganizationUnits: Volo_Abp_Identity_OrganizationUnitDto[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { grantedPolicies } = useGrantedPolicies();
  const uiSchema = createUiSchemaWithResource({
    schema: $Volo_Abp_Identity_IdentityUserUpdateDto,
    resources: languageData,
    name: "Form.User",
    extend: {
      roleNames: {
        "ui:widget": "Role",
      },
      organizationUnitIds: {
        "ui:widget": "OrganizationUnit",
      },
      isActive: {
        "ui:widget": "switch",
        "ui:className": "md:col-span-2",
      },
      lockoutEnabled: {
        "ui:widget": "switch",
        "ui:className": "md:col-span-2",
      },
      phoneNumberConfirmed: {
        "ui:widget": "switch",
        "ui:className": "md:col-span-2",
      },
      shouldChangePasswordOnNextLogin: {
        "ui:widget": "switch",
        "ui:className": "md:col-span-2",
      },
      "ui:className": "md:grid md:grid-cols-2 md:gap-2",
    },
  });
  return (
    <div className="flex flex-col gap-4 overflow-auto">
      <ActionList>
        {isActionGranted(["AbpIdentity.Users.Delete"], grantedPolicies) && (
          <ConfirmDialog
            closeProps={{
              children: languageData.Cancel,
            }}
            confirmProps={{
              variant: "destructive",
              children: languageData.Delete,
              onConfirm: () => {
                setLoading(true);
                void deleteUserByIdApi(userDetailsData.id || "")
                  .then((res) => {
                    handleDeleteResponse(res, router, "../users");
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              },
              closeAfterConfirm: true,
            }}
            description={languageData["Delete.Assurance"]}
            title={languageData["User.Delete"]}
            triggerProps={{
              children: (
                <>
                  <Trash2 className="mr-2 w-4" /> {languageData.Delete}
                </>
              ),
              variant: "outline",
            }}
            type="with-trigger"
          />
        )}
      </ActionList>
      <SchemaForm<UserFormDto>
        className="flex flex-col gap-4"
        disabled={loading}
        filter={{
          type: "include",
          sort: true,
          keys: [
            "userName",
            "name",
            "surname",
            "email",
            "roleNames",
            "organizationUnitIds",
            "phoneNumber",
            "isActive",
            "lockoutEnabled",
            "phoneNumberConfirmed",
            "shouldChangePasswordOnNextLogin",
          ],
        }}
        formData={{
          ...userDetailsData,
          roleNames: userRoles.map((role) => role.name || ""),
          organizationUnitIds: userOrganizationUnits.map((org) => org.id || ""),
        }}
        onSubmit={(data) => {
          setLoading(true);
          const formData = data.formData;
          void putUserApi({
            id: userDetailsData.id || "",
            requestBody: {
              ...formData,
              userName: formData?.userName || "",
              email: formData?.email || "",
            },
          })
            .then((res) => {
              handlePutResponse(res, router);
            })
            .finally(() => {
              setLoading(false);
            });
        }}
        schema={$Volo_Abp_Identity_IdentityUserUpdateDto}
        submitText={languageData["Edit.Save"]}
        uiSchema={uiSchema}
        widgets={{
          Role: CustomMultiSelectWidget({
            optionList: roleList.map((role) => ({
              label: role.roleName || "",
              value: role.roleName || "",
            })),
          }),
          OrganizationUnit: CustomMultiSelectWidget({
            optionList: organizationList.map((organization) => ({
              label: organization.displayName || "",
              value: organization.id || "",
            })),
          }),
        }}
      />
    </div>
  );
}

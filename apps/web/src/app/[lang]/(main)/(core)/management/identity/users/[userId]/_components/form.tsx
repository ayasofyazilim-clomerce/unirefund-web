"use client";

import type {
  Volo_Abp_Identity_IdentityRoleDto,
  Volo_Abp_Identity_IdentityUserDto,
  Volo_Abp_Identity_OrganizationUnitDto,
  Volo_Abp_Identity_OrganizationUnitLookupDto,
} from "@ayasofyazilim/core-saas/IdentityService";
import {$Volo_Abp_Identity_IdentityUserUpdateDto} from "@ayasofyazilim/core-saas/IdentityService";
import {ActionList} from "@repo/ayasofyazilim-ui/molecules/action-button";
import ConfirmDialog from "@repo/ayasofyazilim-ui/molecules/confirm-dialog";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomMultiSelectWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {handleDeleteResponse, handlePutResponse} from "@repo/utils/api";
import {isActionGranted, useGrantedPolicies} from "@repo/utils/policies";
import {Trash2} from "lucide-react";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {deleteUserByIdApi} from "@repo/actions/core/IdentityService/delete-actions";
import {putUserApi} from "@repo/actions/core/IdentityService/put-actions";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";

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
  roleList: Volo_Abp_Identity_IdentityRoleDto[];
  organizationList: Volo_Abp_Identity_OrganizationUnitLookupDto[];
  userRoles: Volo_Abp_Identity_IdentityRoleDto[];
  userOrganizationUnits: Volo_Abp_Identity_OrganizationUnitDto[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {grantedPolicies} = useGrantedPolicies();

  const uiSchema = createUiSchemaWithResource({
    schema: $Volo_Abp_Identity_IdentityUserUpdateDto,
    resources: languageData,
    name: "Form.User",
    extend: {
      roleNames: {
        "ui:widget": "Role",
        "ui:className": "col-span-1",
      },
      organizationUnitIds: {
        "ui:widget": "OrganizationUnit",
        "ui:className": "col-span-1",
      },
      userName: {
        "ui:className": "col-span-1",
      },
      name: {
        "ui:className": "col-span-1",
      },
      surname: {
        "ui:className": "col-span-1",
      },
      email: {
        "ui:widget": "email",
        "ui:className": "col-span-1",
      },
      phoneNumber: {
        "ui:widget": "phone",
        "ui:className": "col-span-2  !w-1/2 mx-auto",
      },
      isActive: {
        "ui:widget": "switch",
        "ui:className": "col-span-2  !w-1/2 mx-auto",
      },
      lockoutEnabled: {
        "ui:widget": "switch",
        "ui:className": "col-span-2  !w-1/2 mx-auto",
      },
      shouldChangePasswordOnNextLogin: {
        "ui:widget": "switch",
        "ui:className": "col-span-2  !w-1/2 mx-auto",
      },
      "ui:className": "grid  gap-2 rounded-md p-2 md:p-6  border",
    },
  });
  return (
    <div className="my-6 flex flex-col gap-4 overflow-auto">
      <SchemaForm<UserFormDto>
        className="flex flex-col gap-4"
        disabled={isPending}
        filter={{
          type: "include",
          sort: true,
          keys: [
            "userName",
            "name",
            "surname",
            "email",
            "organizationUnitIds",
            "roleNames",
            "phoneNumber",
            "isActive",
            "lockoutEnabled",
            "shouldChangePasswordOnNextLogin",
          ],
        }}
        formData={{
          ...userDetailsData,
          roleNames: userRoles.map((role) => role.name || ""),
          organizationUnitIds: userOrganizationUnits.map((org) => org.id || ""),
        }}
        onSubmit={({formData}) => {
          startTransition(() => {
            void putUserApi({
              id: userDetailsData.id || "",
              requestBody: {
                ...formData,
                userName: formData?.userName || "",
                email: formData?.email || "",
              },
            }).then((res) => {
              handlePutResponse(res, router, "../users");
            });
          });
        }}
        schema={$Volo_Abp_Identity_IdentityUserUpdateDto}
        submitText={languageData["Edit.Save"]}
        uiSchema={uiSchema}
        widgets={{
          Role: CustomMultiSelectWidget({
            optionList: roleList.map((role) => ({
              label: role.name || "",
              value: role.name || "",
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
      <ActionList className="flex border-none">
        {isActionGranted(["AbpIdentity.Users.Delete"], grantedPolicies) && (
          <ConfirmDialog
            closeProps={{
              children: languageData.Cancel,
            }}
            confirmProps={{
              variant: "destructive",
              children: languageData.Delete,
              onConfirm: () => {
                startTransition(() => {
                  void deleteUserByIdApi(userDetailsData.id || "").then((res) => {
                    handleDeleteResponse(res, router, "../users");
                  });
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
              disabled: isPending,
            }}
            type="with-trigger"
          />
        )}
      </ActionList>
    </div>
  );
}

"use client";

import type {
  UniRefund_IdentityService_AssignableRoles_AssignableRoleDto,
  Volo_Abp_Identity_IdentityUserCreateDto,
  Volo_Abp_Identity_OrganizationUnitLookupDto,
} from "@ayasofyazilim/saas/IdentityService";
import { $Volo_Abp_Identity_IdentityUserCreateDto } from "@ayasofyazilim/saas/IdentityService";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { createUiSchemaWithResource } from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import { CustomMultiSelectWidget } from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { handlePostResponse } from "src/actions/core/api-utils-client";
import { postUserApi } from "src/actions/core/IdentityService/post-actions";
import type { IdentityServiceResource } from "src/language-data/core/IdentityService";

export default function Form({
  languageData,
  roleList,
  organizationList,
}: {
  languageData: IdentityServiceResource;
  roleList: UniRefund_IdentityService_AssignableRoles_AssignableRoleDto[];
  organizationList: Volo_Abp_Identity_OrganizationUnitLookupDto[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const uiSchema = createUiSchemaWithResource({
    schema: $Volo_Abp_Identity_IdentityUserCreateDto,
    resources: languageData,
    name: "Form.User",
    extend: {
      roleNames: {
        "ui:widget": "Role",
      },
      organizationUnitIds: {
        "ui:widget": "OrganizationUnit",
      },
      password: {
        "ui:widget": "password",
      },
      email: {
        "ui:widget": "email",
      },
      isActive: {
        "ui:widget": "switch",
      },
      lockoutEnabled: {
        "ui:widget": "switch",
      },
      phoneNumberConfirmed: {
        "ui:widget": "switch",
      },
      shouldChangePasswordOnNextLogin: {
        "ui:widget": "switch",
      },
      "ui:className": "md:grid md:grid-cols-2 md:gap-2",
    },
  });
  return (
    <SchemaForm<Volo_Abp_Identity_IdentityUserCreateDto>
      className="flex flex-col gap-4"
      disabled={loading}
      filter={{
        type: "include",
        sort: true,
        keys: [
          "userName",
          "name",
          "surname",
          "password",
          "email",
          "phoneNumber",
          "roleNames",
          "organizationUnitIds",
          "isActive",
          "lockoutEnabled",
          "phoneNumberConfirmed",
          "shouldChangePasswordOnNextLogin",
        ],
      }}
      onSubmit={(data) => {
        setLoading(true);
        const formData = data.formData;
        void postUserApi({
          requestBody: formData,
        })
          .then((res) => {
            handlePostResponse(res, router, "../users");
          })
          .finally(() => {
            setLoading(false);
          });
      }}
      schema={$Volo_Abp_Identity_IdentityUserCreateDto}
      submitText={languageData.Save}
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
  );
}

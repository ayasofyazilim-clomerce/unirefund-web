"use client";

import type {
  Volo_Abp_Identity_IdentityRoleDto,
  Volo_Abp_Identity_IdentityUserCreateDto,
  Volo_Abp_Identity_OrganizationUnitLookupDto,
} from "@ayasofyazilim/core-saas/IdentityService";
import {$Volo_Abp_Identity_IdentityUserCreateDto} from "@ayasofyazilim/core-saas/IdentityService";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomMultiSelectWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {handlePostResponse} from "@repo/utils/api";
import {postUserApi} from "@repo/actions/core/IdentityService/post-actions";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";

export default function Form({
  languageData,
  roleList,
  organizationList,
}: {
  languageData: IdentityServiceResource;
  roleList: Volo_Abp_Identity_IdentityRoleDto[];
  organizationList: Volo_Abp_Identity_OrganizationUnitLookupDto[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

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
      phoneNumber: {
        "ui:widget": "phone",
      },
      isActive: {
        "ui:widget": "switch",
      },
      lockoutEnabled: {
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
      disabled={isPending}
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
          "shouldChangePasswordOnNextLogin",
        ],
      }}
      onSubmit={({formData}) => {
        startTransition(() => {
          void postUserApi({
            requestBody: formData,
          }).then((res) => {
            handlePostResponse(res, router, "../users");
          });
        });
      }}
      schema={$Volo_Abp_Identity_IdentityUserCreateDto}
      submitText={languageData.Save}
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
  );
}

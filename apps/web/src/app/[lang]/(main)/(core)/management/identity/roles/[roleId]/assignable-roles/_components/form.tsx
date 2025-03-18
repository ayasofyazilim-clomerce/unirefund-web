"use client";

import type {UniRefund_IdentityService_AssignableRoles_AssignableRoleDto} from "@ayasofyazilim/core-saas/IdentityService";
import {$UniRefund_IdentityService_AssignableRoles_UpsertAssignableRoleDto} from "@ayasofyazilim/core-saas/IdentityService";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomMultiSelectWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {useParams, useRouter} from "next/navigation";
import {useTransition} from "react";
import {handlePutResponse} from "@repo/utils/api";
import {putAssignableRolesApi} from "@repo/actions/core/IdentityService/put-actions";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";

export default function Form({
  languageData,
  assignableRoleList,
}: {
  languageData: IdentityServiceResource;
  assignableRoleList: UniRefund_IdentityService_AssignableRoles_AssignableRoleDto[];
}) {
  const router = useRouter();
  const {roleId} = useParams<{roleId: string}>();
  const [isPending, startTransition] = useTransition();

  const uiSchema = createUiSchemaWithResource({
    schema: $UniRefund_IdentityService_AssignableRoles_UpsertAssignableRoleDto,
    resources: languageData,
    name: "Form.Role",
    extend: {
      targetRoleIds: {
        "ui:widget": "Role",
      },
    },
  });

  return (
    <SchemaForm
      className="flex flex-col gap-4"
      disabled={isPending}
      filter={{
        type: "include",
        sort: true,
        keys: ["targetRoleIds"],
      }}
      formData={{
        targetRoleIds: assignableRoleList.filter((role) => role.isAssignable).map((role) => role.roleId),
      }}
      onSubmit={({formData}) => {
        startTransition(() => {
          void putAssignableRolesApi({
            requestBody: {
              sourceRoleId: roleId,
              targetRoleIds: formData?.targetRoleIds,
            },
          }).then((res) => {
            handlePutResponse(res, router, "..");
          });
        });
      }}
      schema={$UniRefund_IdentityService_AssignableRoles_UpsertAssignableRoleDto}
      submitText={languageData["Edit.Save"]}
      uiSchema={uiSchema}
      widgets={{
        Role: CustomMultiSelectWidget({
          optionList: assignableRoleList.map((role) => ({
            label: role.roleName || "",
            value: role.roleId || "",
          })),
        }),
      }}
    />
  );
}

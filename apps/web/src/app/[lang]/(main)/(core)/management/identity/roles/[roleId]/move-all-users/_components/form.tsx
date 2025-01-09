"use client";

import type { Volo_Abp_Identity_IdentityRoleDto } from "@ayasofyazilim/saas/IdentityService";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { createUiSchemaWithResource } from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import { CustomComboboxWidget } from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { handlePutResponse } from "src/actions/core/api-utils-client";
import { putRolesByIdMoveAllUsersApi } from "src/actions/core/IdentityService/put-actions";
import type { IdentityServiceResource } from "src/language-data/core/IdentityService";

interface RoleParams {
  roleId: string;
}

const $Volo_Abp_Identity_UpdateMoveAllUsersDto = {
  type: "object",
  required: ["roleId"],
  properties: {
    roleId: {
      type: "string",
      maxLength: 256,
      minLength: 0,
    },
  },
};

export default function Form({
  languageData,
  roleList,
}: {
  languageData: IdentityServiceResource;
  roleList: Volo_Abp_Identity_IdentityRoleDto[];
}) {
  const router = useRouter();
  const { roleId } = useParams<{ roleId: string }>();
  const [loading, setLoading] = useState(false);
  const uiSchema = createUiSchemaWithResource({
    schema: $Volo_Abp_Identity_UpdateMoveAllUsersDto,
    resources: languageData,
    name: "Form.Role",
    extend: {
      roleId: {
        "ui:widget": "RoleWidget",
      },
    },
  });
  return (
    <SchemaForm<RoleParams>
      className="flex flex-col gap-4"
      disabled={loading}
      onSubmit={(data) => {
        setLoading(true);
        const formData = data.formData;
        if (!formData) return;
        void putRolesByIdMoveAllUsersApi({
          id: roleId,
          roleId: formData.roleId,
        })
          .then((res) => {
            handlePutResponse(res, router);
          })
          .finally(() => {
            setLoading(false);
          });
      }}
      schema={$Volo_Abp_Identity_UpdateMoveAllUsersDto}
      submitText={languageData.Save}
      uiSchema={uiSchema}
      widgets={{
        RoleWidget: CustomComboboxWidget<Volo_Abp_Identity_IdentityRoleDto>({
          languageData,
          list: roleList.filter((role) => role.id !== roleId),
          selectIdentifier: "id",
          selectLabel: "name",
        }),
      }}
    />
  );
}

"use client";

import type {Volo_Abp_Identity_IdentityRoleDto} from "@ayasofyazilim/core-saas/IdentityService";
import {$Volo_Abp_Identity_IdentityRoleUpdateDto} from "@ayasofyazilim/core-saas/IdentityService";
import {putRoleApi} from "@repo/actions/core/IdentityService/put-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {handlePutResponse} from "@repo/utils/api";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";

export default function Form({
  languageData,
  response,
}: {
  languageData: IdentityServiceResource;
  response: Volo_Abp_Identity_IdentityRoleDto;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const uiSchema = createUiSchemaWithResource({
    schema: $Volo_Abp_Identity_IdentityRoleUpdateDto,
    resources: languageData,
    name: "Form.Role",
    extend: {
      isDefault: {
        "ui:widget": "switch",
      },
      isPublic: {
        "ui:widget": "switch",
      },
    },
  });
  return (
    <SchemaForm<Volo_Abp_Identity_IdentityRoleDto>
      className="flex flex-col gap-4"
      disabled={isPending}
      filter={{
        type: "exclude",
        keys: ["concurrencyStamp"],
      }}
      formData={response}
      onSubmit={({formData}) => {
        startTransition(() => {
          void putRoleApi({
            id: response.id || "",
            requestBody: {...formData, name: formData?.name || ""},
          }).then((res) => {
            handlePutResponse(res, router, "../roles");
          });
        });
      }}
      schema={$Volo_Abp_Identity_IdentityRoleUpdateDto}
      submitText={languageData["Edit.Save"]}
      uiSchema={uiSchema}
    />
  );
}

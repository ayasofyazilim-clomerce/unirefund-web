"use client";

import type {Volo_Abp_Identity_IdentityRoleCreateDto} from "@ayasofyazilim/saas/IdentityService";
import {$Volo_Abp_Identity_IdentityRoleCreateDto} from "@ayasofyazilim/saas/IdentityService";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {handlePostResponse} from "src/actions/core/api-utils-client";
import {postRoleApi} from "src/actions/core/IdentityService/post-actions";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";

export default function Form({languageData}: {languageData: IdentityServiceResource}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const uiSchema = createUiSchemaWithResource({
    schema: $Volo_Abp_Identity_IdentityRoleCreateDto,
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
    <SchemaForm<Volo_Abp_Identity_IdentityRoleCreateDto>
      className="flex flex-col gap-4"
      disabled={loading}
      onSubmit={(data) => {
        setLoading(true);
        const formData = data.formData;
        void postRoleApi({
          requestBody: formData,
        })
          .then((res) => {
            handlePostResponse(res, router, "../roles");
          })
          .finally(() => {
            setLoading(false);
          });
      }}
      schema={$Volo_Abp_Identity_IdentityRoleCreateDto}
      submitText={languageData.Save}
      uiSchema={uiSchema}
    />
  );
}

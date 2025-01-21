"use client";

import type { Volo_Abp_OpenIddict_Scopes_Dtos_CreateScopeInput } from "@ayasofyazilim/saas/IdentityService";
import { $Volo_Abp_OpenIddict_Scopes_Dtos_CreateScopeInput } from "@ayasofyazilim/saas/IdentityService";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { createUiSchemaWithResource } from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { handlePostResponse } from "src/actions/core/api-utils-client";
import { postScopeApi } from "src/actions/core/IdentityService/post-actions";
import type { IdentityServiceResource } from "src/language-data/core/IdentityService";

export default function Form({
  languageData,
}: {
  languageData: IdentityServiceResource;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const uiSchema = createUiSchemaWithResource({
    schema: $Volo_Abp_OpenIddict_Scopes_Dtos_CreateScopeInput,
    resources: languageData,
    name: "Form.Scope",
  });
  return (
    <SchemaForm<Volo_Abp_OpenIddict_Scopes_Dtos_CreateScopeInput>
      className="flex flex-col gap-4"
      disabled={loading}
      onSubmit={(data) => {
        setLoading(true);
        const formData = data.formData;
        void postScopeApi({
          requestBody: formData,
        })
          .then((res) => {
            handlePostResponse(res, router, "../scopes");
          })
          .finally(() => {
            setLoading(false);
          });
      }}
      schema={$Volo_Abp_OpenIddict_Scopes_Dtos_CreateScopeInput}
      submitText={languageData.Save}
      uiSchema={uiSchema}
    />
  );
}

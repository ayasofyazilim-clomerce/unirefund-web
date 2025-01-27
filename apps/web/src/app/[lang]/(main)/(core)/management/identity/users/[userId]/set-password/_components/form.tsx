"use client";

import type { Volo_Abp_Identity_IdentityUserUpdatePasswordInput } from "@ayasofyazilim/saas/IdentityService";
import { $Volo_Abp_Identity_IdentityUserUpdatePasswordInput } from "@ayasofyazilim/saas/IdentityService";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { createUiSchemaWithResource } from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { handlePutResponse } from "src/actions/core/api-utils-client";
import { putUsersByIdChangePasswordApi } from "src/actions/core/IdentityService/put-actions";
import type { IdentityServiceResource } from "src/language-data/core/IdentityService";

export default function Form({
  languageData,
}: {
  languageData: IdentityServiceResource;
}) {
  const router = useRouter();
  const { userId } = useParams<{ userId: string }>();
  const [loading, setLoading] = useState(false);

  const uiSchema = createUiSchemaWithResource({
    schema: $Volo_Abp_Identity_IdentityUserUpdatePasswordInput,
    resources: languageData,
    name: "Form.User.SetPassword",
    extend: {
      newPassword: {
        "ui:widget": "password",
      },
    },
  });

  return (
    <SchemaForm<Volo_Abp_Identity_IdentityUserUpdatePasswordInput>
      className="flex flex-col gap-4"
      disabled={loading}
      onSubmit={(data) => {
        setLoading(true);
        const formData = data.formData;
        void putUsersByIdChangePasswordApi({
          id: userId || "",
          requestBody: formData,
        })
          .then((res) => {
            handlePutResponse(res, router, "..");
          })
          .finally(() => {
            setLoading(false);
          });
      }}
      schema={$Volo_Abp_Identity_IdentityUserUpdatePasswordInput}
      submitText={languageData["Edit.Save"]}
      uiSchema={uiSchema}
    />
  );
}

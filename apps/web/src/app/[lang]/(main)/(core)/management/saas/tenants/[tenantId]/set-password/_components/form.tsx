"use client";

import type { Volo_Saas_Host_Dtos_SaasTenantSetPasswordDto } from "@ayasofyazilim/saas/SaasService";
import { $Volo_Saas_Host_Dtos_SaasTenantSetPasswordDto } from "@ayasofyazilim/saas/SaasService";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { createUiSchemaWithResource } from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { handlePutResponse } from "src/actions/core/api-utils-client";
import { putTenantsByIdChangePasswordApi } from "src/actions/core/SaasService/actions";
import type { SaasServiceResource } from "src/language-data/core/SaasService";

export default function Form({
  languageData,
}: {
  languageData: SaasServiceResource;
}) {
  const router = useRouter();
  const { tenantId } = useParams<{ tenantId: string }>();
  const [loading, setLoading] = useState(false);

  const uiSchema = createUiSchemaWithResource({
    schema: $Volo_Saas_Host_Dtos_SaasTenantSetPasswordDto,
    resources: languageData,
    name: "Form.Tenant.SetPassword",
    extend: {
      password: {
        "ui:widget": "password",
      },
    },
  });

  return (
    <SchemaForm<Volo_Saas_Host_Dtos_SaasTenantSetPasswordDto>
      className="flex flex-col gap-4"
      disabled={loading}
      formData={{
        username: "admin",
      }}
      onSubmit={(data) => {
        setLoading(true);
        const formData = data.formData;
        void putTenantsByIdChangePasswordApi({
          id: tenantId || "",
          requestBody: formData,
        })
          .then((res) => {
            handlePutResponse(res, router, "..");
          })
          .finally(() => {
            setLoading(false);
          });
      }}
      schema={$Volo_Saas_Host_Dtos_SaasTenantSetPasswordDto}
      submitText={languageData["Edit.Save"]}
      uiSchema={uiSchema}
    />
  );
}

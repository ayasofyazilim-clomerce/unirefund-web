"use client";

import type { Volo_Saas_Host_Dtos_EditionCreateDto } from "@ayasofyazilim/saas/SaasService";
import { $Volo_Saas_Host_Dtos_EditionCreateDto } from "@ayasofyazilim/saas/SaasService";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { createUiSchemaWithResource } from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { handlePostResponse } from "src/actions/core/api-utils-client";
import { postEditionApi } from "src/actions/core/SaasService/post-actions";
import type { SaasServiceResource } from "src/language-data/core/SaasService";

export default function Form({
  languageData,
}: {
  languageData: SaasServiceResource;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const uiSchema = createUiSchemaWithResource({
    schema: $Volo_Saas_Host_Dtos_EditionCreateDto,
    resources: languageData,
    name: "Form.Edition",
  });
  return (
    <SchemaForm<Volo_Saas_Host_Dtos_EditionCreateDto>
      className="flex flex-col gap-4"
      disabled={loading}
      filter={{
        type: "exclude",
        keys: ["planId"],
      }}
      onSubmit={(data) => {
        setLoading(true);
        const formData = data.formData;
        void postEditionApi({
          requestBody: formData,
        })
          .then((res) => {
            handlePostResponse(res, router, "../editions");
          })
          .finally(() => {
            setLoading(false);
          });
      }}
      schema={$Volo_Saas_Host_Dtos_EditionCreateDto}
      submitText={languageData.Save}
      uiSchema={uiSchema}
    />
  );
}

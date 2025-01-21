"use client";

import type { Volo_Abp_Identity_CreateClaimTypeDto } from "@ayasofyazilim/saas/IdentityService";
import { $Volo_Abp_Identity_CreateClaimTypeDto } from "@ayasofyazilim/saas/IdentityService";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { createUiSchemaWithResource } from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { handlePostResponse } from "src/actions/core/api-utils-client";
import { postClaimTypeApi } from "src/actions/core/IdentityService/post-actions";
import type { IdentityServiceResource } from "src/language-data/core/IdentityService";

export default function Form({
  languageData,
}: {
  languageData: IdentityServiceResource;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const uiSchema = createUiSchemaWithResource({
    schema: $Volo_Abp_Identity_CreateClaimTypeDto,
    resources: languageData,
    name: "Form.ClaimType",
    extend: {
      required: {
        "ui:widget": "switch",
      },
      valueType: {
        "ui:enumNames": ["String", "Int", "Boolean", "Datetime"],
      },
    },
  });
  return (
    <SchemaForm<Volo_Abp_Identity_CreateClaimTypeDto>
      className="flex flex-col gap-4"
      disabled={loading}
      formData={{
        name: "",
        valueType: 0,
      }}
      onSubmit={(data) => {
        setLoading(true);
        const formData = data.formData;
        void postClaimTypeApi({
          requestBody: formData,
        })
          .then((res) => {
            handlePostResponse(res, router, "../claim-types");
          })
          .finally(() => {
            setLoading(false);
          });
      }}
      schema={$Volo_Abp_Identity_CreateClaimTypeDto}
      submitText={languageData.Save}
      uiSchema={uiSchema}
    />
  );
}

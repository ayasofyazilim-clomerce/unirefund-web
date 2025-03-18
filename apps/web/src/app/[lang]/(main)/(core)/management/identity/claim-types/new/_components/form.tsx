"use client";

import type {Volo_Abp_Identity_CreateClaimTypeDto} from "@ayasofyazilim/core-saas/IdentityService";
import {$Volo_Abp_Identity_CreateClaimTypeDto} from "@ayasofyazilim/core-saas/IdentityService";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {handlePostResponse} from "@repo/utils/api";
import {postClaimTypeApi} from "@repo/actions/core/IdentityService/post-actions";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";

export default function Form({languageData}: {languageData: IdentityServiceResource}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

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
      disabled={isPending}
      formData={{
        name: "",
        valueType: 0,
      }}
      onSubmit={({formData}) => {
        startTransition(() => {
          void postClaimTypeApi({
            requestBody: formData,
          }).then((res) => {
            handlePostResponse(res, router, "../claim-types");
          });
        });
      }}
      schema={$Volo_Abp_Identity_CreateClaimTypeDto}
      submitText={languageData.Save}
      uiSchema={uiSchema}
    />
  );
}

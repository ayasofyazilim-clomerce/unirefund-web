"use client";

import type {Volo_Abp_OpenIddict_Applications_Dtos_ApplicationTokenLifetimeDto} from "@ayasofyazilim/saas/IdentityService";
import {$Volo_Abp_OpenIddict_Applications_Dtos_ApplicationTokenLifetimeDto} from "@ayasofyazilim/saas/IdentityService";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {useParams, useRouter} from "next/navigation";
import {useTransition} from "react";
import {handlePutResponse} from "src/actions/core/api-utils-client";
import {putApplicationsByIdTokenLifetimeApi} from "src/actions/core/IdentityService/put-actions";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";

export default function Form({
  languageData,
  lifeTokenData,
}: {
  languageData: IdentityServiceResource;
  lifeTokenData: Volo_Abp_OpenIddict_Applications_Dtos_ApplicationTokenLifetimeDto;
}) {
  const router = useRouter();
  const {applicationId} = useParams<{applicationId: string}>();
  const [isPending, startTransition] = useTransition();

  const uiSchema = createUiSchemaWithResource({
    schema: $Volo_Abp_OpenIddict_Applications_Dtos_ApplicationTokenLifetimeDto,
    resources: languageData,
    name: "Form.Application.LifeToken",
    extend: {
      "ui:className": "md:grid md:grid-cols-2 md:gap-2",
    },
  });

  return (
    <SchemaForm<Volo_Abp_OpenIddict_Applications_Dtos_ApplicationTokenLifetimeDto>
      className="flex flex-col gap-4"
      disabled={isPending}
      formData={lifeTokenData}
      onSubmit={({formData}) => {
        startTransition(() => {
          void putApplicationsByIdTokenLifetimeApi({
            id: applicationId,
            requestBody: formData,
          }).then((res) => {
            handlePutResponse(res, router, "..");
          });
        });
      }}
      schema={$Volo_Abp_OpenIddict_Applications_Dtos_ApplicationTokenLifetimeDto}
      submitText={languageData["Edit.Save"]}
      uiSchema={uiSchema}
    />
  );
}

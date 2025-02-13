"use client";

import type {Volo_Saas_Host_Dtos_EditionCreateDto} from "@ayasofyazilim/core-saas/SaasService";
import {$Volo_Saas_Host_Dtos_EditionCreateDto} from "@ayasofyazilim/core-saas/SaasService";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {handlePostResponse} from "@repo/utils/api";
import {postEditionApi} from "src/actions/core/SaasService/post-actions";
import type {SaasServiceResource} from "src/language-data/core/SaasService";

export default function Form({languageData}: {languageData: SaasServiceResource}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const uiSchema = createUiSchemaWithResource({
    schema: $Volo_Saas_Host_Dtos_EditionCreateDto,
    resources: languageData,
    name: "Form.Edition",
  });
  return (
    <SchemaForm<Volo_Saas_Host_Dtos_EditionCreateDto>
      className="flex flex-col gap-4"
      disabled={isPending}
      filter={{
        type: "exclude",
        keys: ["planId"],
      }}
      onSubmit={({formData}) => {
        startTransition(() => {
          void postEditionApi({
            requestBody: formData,
          }).then((res) => {
            handlePostResponse(res, router, "../editions");
          });
        });
      }}
      schema={$Volo_Saas_Host_Dtos_EditionCreateDto}
      submitText={languageData.Save}
      uiSchema={uiSchema}
    />
  );
}

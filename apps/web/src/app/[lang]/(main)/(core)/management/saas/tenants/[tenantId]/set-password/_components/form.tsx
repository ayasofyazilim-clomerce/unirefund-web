"use client";

import type {Volo_Saas_Host_Dtos_SaasTenantSetPasswordDto} from "@ayasofyazilim/core-saas/SaasService";
import {$Volo_Saas_Host_Dtos_SaasTenantSetPasswordDto} from "@ayasofyazilim/core-saas/SaasService";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {handlePutResponse} from "@repo/utils/api";
import {useParams, useRouter} from "next/navigation";
import {useTransition} from "react";
import {putTenantsByIdChangePasswordApi} from "src/actions/core/SaasService/actions";
import type {SaasServiceResource} from "src/language-data/core/SaasService";

export default function Form({languageData}: {languageData: SaasServiceResource}) {
  const router = useRouter();
  const {tenantId} = useParams<{tenantId: string}>();
  const [isPending, startTransition] = useTransition();

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
      disabled={isPending}
      formData={{
        username: "admin",
      }}
      onSubmit={({formData}) => {
        startTransition(() => {
          void putTenantsByIdChangePasswordApi({
            id: tenantId || "",
            requestBody: formData,
          }).then((res) => {
            handlePutResponse(res, router, "..");
          });
        });
      }}
      schema={$Volo_Saas_Host_Dtos_SaasTenantSetPasswordDto}
      submitText={languageData["Edit.Save"]}
      uiSchema={uiSchema}
    />
  );
}

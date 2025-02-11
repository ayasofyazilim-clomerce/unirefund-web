"use client";

import type {Volo_Saas_Host_Dtos_EditionDto} from "@ayasofyazilim/saas/SaasService";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {useParams, useRouter} from "next/navigation";
import {useTransition} from "react";
import {handlePutResponse} from "src/actions/core/api-utils-client";
import {putEditionsByIdMoveAllTenantsApi} from "src/actions/core/SaasService/put-actions";
import type {SaasServiceResource} from "src/language-data/core/SaasService";

interface EditionParams {
  editionId: string;
}

const $Volo_Abp_Identity_UpdateMoveAllTenantsDto = {
  type: "object",
  required: ["editionId"],
  properties: {
    editionId: {
      type: "string",
      maxLength: 256,
      minLength: 0,
    },
  },
};

export default function Form({
  languageData,
  editionList,
}: {
  languageData: SaasServiceResource;
  editionList: Volo_Saas_Host_Dtos_EditionDto[];
}) {
  const router = useRouter();
  const {editionId} = useParams<{editionId: string}>();
  const [isPending, startTransition] = useTransition();
  const uiSchema = createUiSchemaWithResource({
    schema: $Volo_Abp_Identity_UpdateMoveAllTenantsDto,
    resources: languageData,
    name: "Form.Edition",
    extend: {
      editionId: {
        "ui:widget": "EditionWidget",
      },
    },
  });
  return (
    <SchemaForm<EditionParams>
      className="flex flex-col gap-4"
      disabled={isPending}
      onSubmit={({formData}) => {
        startTransition(() => {
          void putEditionsByIdMoveAllTenantsApi({
            id: editionId,
            editionId: formData?.editionId,
          }).then((res) => {
            handlePutResponse(res, router, "..");
          });
        });
      }}
      schema={$Volo_Abp_Identity_UpdateMoveAllTenantsDto}
      submitText={languageData["Edit.Save"]}
      uiSchema={uiSchema}
      widgets={{
        EditionWidget: CustomComboboxWidget<Volo_Saas_Host_Dtos_EditionDto>({
          languageData,
          list: editionList.filter((edition) => edition.id !== editionId),
          selectIdentifier: "id",
          selectLabel: "displayName",
        }),
      }}
    />
  );
}

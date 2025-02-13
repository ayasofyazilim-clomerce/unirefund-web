"use client";

import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {useParams, useRouter} from "next/navigation";
import {useTransition} from "react";
import {handlePutResponse} from "@repo/utils/api";
import {putUsersByIdTwoFactorByEnabledApi} from "src/actions/core/IdentityService/put-actions";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";

const $userTwoFactorSchema = {
  type: "object",
  properties: {
    twoFactorAuthenticationEnabled: {
      type: "boolean",
      optional: true,
    },
  },
};

export default function Form({languageData, response}: {languageData: IdentityServiceResource; response: boolean}) {
  const router = useRouter();
  const {userId} = useParams<{userId: string}>();
  const [isPending, startTransition] = useTransition();

  const uiSchema = createUiSchemaWithResource({
    schema: $userTwoFactorSchema,
    resources: languageData,
    name: "Form.User.TwoFactor",
    extend: {
      twoFactorAuthenticationEnabled: {
        "ui:widget": "switch",
      },
    },
  });

  return (
    <SchemaForm
      className="flex flex-col gap-4"
      disabled={isPending}
      formData={{twoFactorAuthenticationEnabled: response}}
      onSubmit={({formData}) => {
        startTransition(() => {
          void putUsersByIdTwoFactorByEnabledApi({
            id: userId || "",
            enabled: formData?.twoFactorAuthenticationEnabled || false,
          }).then((res) => {
            handlePutResponse(res, router, "..");
          });
        });
      }}
      schema={$userTwoFactorSchema}
      submitText={languageData["Edit.Save"]}
      uiSchema={uiSchema}
    />
  );
}

"use client";

import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {useParams, useRouter} from "next/navigation";
import {useTransition} from "react";
import {handlePutResponse} from "@repo/utils/api";
import {putUsersByIdLockByLockoutEndApi} from "@repo/actions/core/IdentityService/put-actions";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";

interface FormData {
  lockoutEnd: string;
}

const $lockSchema = {
  type: "object",
  required: ["lockoutEnd"],
  properties: {
    lockoutEnd: {
      type: "string",
      format: "date-time",
      nullable: true,
    },
  },
};

export default function Form({languageData}: {languageData: IdentityServiceResource}) {
  const router = useRouter();
  const {userId} = useParams<{userId: string}>();
  const [isPending, startTransition] = useTransition();

  const lockUiSchema = createUiSchemaWithResource({
    schema: $lockSchema,
    resources: languageData,
    name: "Form.User.Lock",
  });

  return (
    <SchemaForm<FormData>
      className="flex flex-col gap-4"
      disabled={isPending}
      onSubmit={({formData}) => {
        startTransition(() => {
          void putUsersByIdLockByLockoutEndApi({
            id: userId,
            lockoutEnd: formData?.lockoutEnd || "",
          }).then((res) => {
            handlePutResponse(res, router, "..");
          });
        });
      }}
      schema={$lockSchema}
      submitText={languageData["Edit.Save"]}
      uiSchema={lockUiSchema}
    />
  );
}

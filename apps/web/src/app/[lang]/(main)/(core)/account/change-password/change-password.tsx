"use client";
import type {Volo_Abp_Account_ChangePasswordInput} from "@ayasofyazilim/core-saas/AccountService";
import {$Volo_Abp_Account_ChangePasswordInput} from "@ayasofyazilim/core-saas/AccountService";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource, customPasswordValidate} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {handlePutResponse} from "@repo/utils/api";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {postPasswordChangeApi} from "src/actions/core/AccountService/post-actions";
import type {AccountServiceResource} from "src/language-data/core/AccountService";

type PasswordForm = Volo_Abp_Account_ChangePasswordInput & {
  confirmNewPassword: string;
};

const $passwordSchema = {
  required: ["currentPassword", "newPassword", "confirmNewPassword"],
  type: "object",
  properties: {
    ...$Volo_Abp_Account_ChangePasswordInput.properties,
    confirmNewPassword: {
      maxLength: 128,
      minLength: 0,
      type: "string",
    },
  },
};
export default function ChangePassword({languageData}: {languageData: AccountServiceResource}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const uiPasswordSchema = createUiSchemaWithResource({
    resources: languageData,
    schema: $passwordSchema,
    extend: {
      currentPassword: {
        "ui:widget": "password",
      },
      newPassword: {
        "ui:widget": "password",
      },
      confirmNewPassword: {
        "ui:widget": "password",
      },
    },
  });
  return (
    <SchemaForm<PasswordForm>
      className="flex flex-col gap-4"
      customValidate={(formData, errors) => {
        return customPasswordValidate<PasswordForm>({
          errorMessage: languageData["Password.Mismatch.Message"],
          formData,
          keyOne: "newPassword",
          keyTwo: "confirmNewPassword",
          errors,
        });
      }}
      disabled={isPending}
      onSubmit={({formData}) => {
        startTransition(() => {
          void postPasswordChangeApi({
            requestBody: formData,
          }).then((res) => {
            handlePutResponse(res, router);
          });
        });
      }}
      schema={$passwordSchema}
      submitText={languageData["Change.Password"]}
      uiSchema={uiPasswordSchema}
    />
  );
}

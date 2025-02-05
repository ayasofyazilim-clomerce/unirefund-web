"use client";
import type {Volo_Abp_Account_ChangePasswordInput} from "@ayasofyazilim/saas/AccountService";
import {$Volo_Abp_Account_ChangePasswordInput} from "@ayasofyazilim/saas/AccountService";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource, customPasswordValidate} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {postPasswordChangeApi} from "src/actions/core/AccountService/post-actions";
import {handlePutResponse} from "src/actions/core/api-utils-client";
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
  const [loading, setLoading] = useState(false);

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
      disabled={loading}
      onSubmit={(data) => {
        setLoading(true);
        const formData = data.formData;
        void postPasswordChangeApi({
          requestBody: formData,
        })
          .then((res) => {
            handlePutResponse(res, router);
          })
          .finally(() => {
            setLoading(false);
          });
      }}
      schema={$passwordSchema}
      submitText={languageData["Change.Password"]}
      uiSchema={uiPasswordSchema}
    />
  );
}

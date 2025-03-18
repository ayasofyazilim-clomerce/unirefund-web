"use client";
import type {Volo_Abp_Account_ProfileDto} from "@ayasofyazilim/core-saas/AccountService";
import {$Volo_Abp_Account_UpdateProfileDto} from "@ayasofyazilim/core-saas/AccountService";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {handlePutResponse} from "@repo/utils/api";
import {putPersonalInfomationApi} from "@repo/actions/core/AccountService/put-actions";
import type {AccountServiceResource} from "src/language-data/core/AccountService";

export default function PersonalInformation({
  languageData,
  personalInformationData,
}: {
  languageData: AccountServiceResource;
  personalInformationData: Volo_Abp_Account_ProfileDto;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const uiInformationSchema = createUiSchemaWithResource({
    resources: languageData,
    schema: $Volo_Abp_Account_UpdateProfileDto,
    extend: {
      email: {
        "ui:widget": "email",
      },
      phoneNumber: {
        "ui:widget": "phone",
      },
    },
  });
  return (
    <SchemaForm
      className="flex flex-col gap-4"
      disabled={isPending}
      filter={{
        type: "include",
        sort: true,
        keys: ["userName", "name", "surname", "email", "phoneNumber"],
      }}
      formData={personalInformationData}
      onSubmit={({formData}) => {
        startTransition(() => {
          void putPersonalInfomationApi({
            requestBody: {...formData, userName: formData?.userName || ""},
          }).then((res) => {
            handlePutResponse(res, router);
          });
        });
      }}
      schema={$Volo_Abp_Account_UpdateProfileDto}
      submitText={languageData["Edit.Save"]}
      uiSchema={uiInformationSchema}
    />
  );
}

"use client";
import type {Volo_Abp_Account_ProfileDto, Volo_Abp_Account_UpdateProfileDto} from "@ayasofyazilim/saas/AccountService";
import {$Volo_Abp_Account_UpdateProfileDto} from "@ayasofyazilim/saas/AccountService";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {putPersonalInfomationApi} from "src/actions/core/AccountService/put-actions";
import {handlePutResponse} from "src/actions/core/api-utils-client";
import type {AccountServiceResource} from "src/language-data/core/AccountService";

export default function PersonalInformation({
  languageData,
  personalInformationData,
}: {
  languageData: AccountServiceResource;
  personalInformationData: Volo_Abp_Account_ProfileDto;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const uiInformationSchema = createUiSchemaWithResource({
    resources: languageData,
    schema: $Volo_Abp_Account_UpdateProfileDto,
  });
  return (
    <SchemaForm
      className="flex flex-col gap-4"
      disabled={loading}
      filter={{
        type: "include",
        sort: true,
        keys: ["userName", "name", "surname", "email", "phoneNumber"],
      }}
      formData={personalInformationData}
      onSubmit={(data) => {
        setLoading(true);
        const formData = data.formData as Volo_Abp_Account_UpdateProfileDto;
        void putPersonalInfomationApi({
          requestBody: formData,
        })
          .then((res) => {
            handlePutResponse(res, router);
          })
          .finally(() => {
            setLoading(false);
          });
      }}
      schema={$Volo_Abp_Account_UpdateProfileDto}
      submitText={languageData["Edit.Save"]}
      uiSchema={uiInformationSchema}
    />
  );
}

"use client";

import type {
  Volo_Abp_LanguageManagement_Dto_CreateLanguageDto,
  Volo_Abp_LanguageManagement_Dto_CultureInfoDto,
} from "@ayasofyazilim/core-saas/AdministrationService";
import {$Volo_Abp_LanguageManagement_Dto_CreateLanguageDto} from "@ayasofyazilim/core-saas/AdministrationService";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {handlePostResponse} from "@repo/utils/api";
import {postLanguageApi} from "src/actions/core/AdministrationService/post-actions";
import type {AdministrationServiceResource} from "src/language-data/core/AdministrationService";

export default function Form({
  languageData,
  cultureList,
}: {
  languageData: AdministrationServiceResource;
  cultureList: Volo_Abp_LanguageManagement_Dto_CultureInfoDto[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const uiSchema = createUiSchemaWithResource({
    schema: $Volo_Abp_LanguageManagement_Dto_CreateLanguageDto,
    resources: languageData,
    name: "Form.Language",
    extend: {
      isEnabled: {
        "ui:widget": "switch",
      },
      cultureName: {
        "ui:widget": "CountryWidget",
      },
      uiCultureName: {
        "ui:widget": "CountryWidget",
      },
    },
  });
  return (
    <SchemaForm<Volo_Abp_LanguageManagement_Dto_CreateLanguageDto>
      className="flex flex-col gap-4"
      disabled={isPending}
      filter={{
        type: "include",
        sort: true,
        keys: ["cultureName", "uiCultureName", "displayName", "isEnabled"],
      }}
      onSubmit={({formData}) => {
        startTransition(() => {
          void postLanguageApi({
            requestBody: formData,
          }).then((res) => {
            handlePostResponse(res, router, "../languages");
          });
        });
      }}
      schema={$Volo_Abp_LanguageManagement_Dto_CreateLanguageDto}
      submitText={languageData.Save}
      uiSchema={uiSchema}
      widgets={{
        CountryWidget: CustomComboboxWidget<Volo_Abp_LanguageManagement_Dto_CultureInfoDto>({
          languageData,
          list: cultureList,
          selectIdentifier: "name",
          selectLabel: "displayName",
        }),
      }}
    />
  );
}

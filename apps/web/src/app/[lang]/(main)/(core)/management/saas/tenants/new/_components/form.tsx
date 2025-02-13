"use client";
import type {
  Volo_Saas_Host_Dtos_EditionDto,
  Volo_Saas_Host_Dtos_SaasTenantCreateDto,
} from "@ayasofyazilim/core-saas/SaasService";
import {$Volo_Saas_Host_Dtos_SaasTenantCreateDto} from "@ayasofyazilim/core-saas/SaasService";
import {createZodObject} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import AutoForm, {
  AutoFormSubmit,
  createFieldConfigWithResource,
  CustomCombobox,
  DependencyType,
} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {handlePostResponse} from "@repo/utils/api";
import {postTenantApi} from "src/actions/core/SaasService/post-actions";
import type {SaasServiceResource} from "src/language-data/core/SaasService";

const tenantCreateSchema = createZodObject($Volo_Saas_Host_Dtos_SaasTenantCreateDto, [
  "name",
  "editionId",
  "adminEmailAddress",
  "adminPassword",
  "activationState",
  "activationEndDate",
]);

export default function Page({
  languageData,
  editionList,
}: {
  languageData: SaasServiceResource;
  editionList: Volo_Saas_Host_Dtos_EditionDto[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const translatedForm = createFieldConfigWithResource({
    schema: $Volo_Saas_Host_Dtos_SaasTenantCreateDto,
    resources: languageData,
    name: "Form.Tenant",
    extend: {
      editionId: {
        renderer: (props) => (
          <CustomCombobox<Volo_Saas_Host_Dtos_EditionDto>
            childrenProps={props}
            emptyValue={languageData["Select.EmptyValue"]}
            list={editionList}
            searchPlaceholder={languageData["Select.Placeholder"]}
            searchResultLabel={languageData["Select.ResultLabel"]}
            selectIdentifier="id"
            selectLabel="displayName"
          />
        ),
      },
      adminPassword: {
        fieldType: "password",
      },
      adminEmailAddress: {
        inputProps: {
          type: "email",
        },
      },
      activationState: {
        containerClassName: "gap-2",
        renderer: (props) => {
          const options = [
            {value: 0, label: languageData["Form.Tenant.active"]},
            {
              value: 1,
              label: languageData["Form.Tenant.activeWithLimitedTime"],
            },
            {value: 2, label: languageData["Form.Tenant.passive"]},
          ];
          return (
            <CustomCombobox
              childrenProps={props}
              emptyValue={languageData["Select.EmptyValue"]}
              list={options}
              selectIdentifier="value"
              selectLabel="label"
            />
          );
        },
      },
    },
  });

  return (
    <AutoForm
      className="grid gap-4 space-y-0 pb-4 md:grid-cols-1 lg:grid-cols-2"
      dependencies={[
        {
          sourceField: "activationState",
          type: DependencyType.HIDES,
          targetField: "activationEndDate",
          when: (activationState: string) => activationState !== "1",
        },
      ]}
      fieldConfig={translatedForm}
      formSchema={tenantCreateSchema}
      onSubmit={(data) => {
        setLoading(true);
        void postTenantApi({
          requestBody: data as Volo_Saas_Host_Dtos_SaasTenantCreateDto,
        })
          .then((res) => {
            handlePostResponse(res, router, "../tenants");
          })
          .finally(() => {
            setLoading(false);
          });
      }}
      stickyChildren>
      <AutoFormSubmit className="float-right px-8 py-4" disabled={loading}>
        {languageData.Save}
      </AutoFormSubmit>
    </AutoForm>
  );
}

"use client";

import type {
  Volo_Abp_OpenIddict_Applications_Dtos_ApplicationDto,
  Volo_Abp_OpenIddict_Applications_Dtos_UpdateApplicationInput,
  Volo_Abp_OpenIddict_Scopes_Dtos_ScopeDto,
} from "@ayasofyazilim/saas/IdentityService";
import {$Volo_Abp_OpenIddict_Applications_Dtos_UpdateApplicationInput} from "@ayasofyazilim/saas/IdentityService";
import {createZodObject} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import {ActionList} from "@repo/ayasofyazilim-ui/molecules/action-button";
import ConfirmDialog from "@repo/ayasofyazilim-ui/molecules/confirm-dialog";
import {MultiSelect} from "@repo/ayasofyazilim-ui/molecules/multi-select";
import AutoForm, {
  AutoFormSubmit,
  createFieldConfigWithResource,
  createFieldTypeFieldConfig,
  CustomCombobox,
  DependencyType,
} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import {useGrantedPolicies} from "@repo/utils/policies";
import {Trash2} from "lucide-react";
import {useParams, useRouter} from "next/navigation";
import {useTransition} from "react";
import {handleDeleteResponse, handlePutResponse} from "src/actions/core/api-utils-client";
import {deleteApplicationByIdApi} from "src/actions/core/IdentityService/delete-actions";
import {putApplicationApi} from "src/actions/core/IdentityService/put-actions";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";
import isActionGranted from "src/utils/page-policy/action-policy";

interface FieldProps {
  field: {
    value?: string[];
    onChange: (newValue: string[]) => void;
  };
}

const applicationUpdateSchema = createZodObject($Volo_Abp_OpenIddict_Applications_Dtos_UpdateApplicationInput, [
  "applicationType",
  "clientId",
  "displayName",
  "clientUri",
  "logoUri",
  "clientType",
  "clientSecret",
  "allowAuthorizationCodeFlow",
  "allowImplicitFlow",
  "allowHybridFlow",
  "allowPasswordFlow",
  "allowClientCredentialsFlow",
  "allowRefreshTokenFlow",
  "allowDeviceEndpoint",
  "consentType",
  "extensionGrantTypes",
  "scopes",
  "redirectUris",
  "allowLogoutEndpoint",
  "postLogoutRedirectUris",
]);
export default function Form({
  languageData,
  scopeList,
  applicationDetailsData,
}: {
  languageData: IdentityServiceResource;
  scopeList: Volo_Abp_OpenIddict_Scopes_Dtos_ScopeDto[];
  applicationDetailsData: Volo_Abp_OpenIddict_Applications_Dtos_ApplicationDto;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {applicationId} = useParams<{applicationId: string}>();
  const {grantedPolicies} = useGrantedPolicies();

  const switches = createFieldTypeFieldConfig({
    elements: [
      "allowAuthorizationCodeFlow",
      "allowImplicitFlow",
      "allowHybridFlow",
      "allowPasswordFlow",
      "allowClientCredentialsFlow",
      "allowRefreshTokenFlow",
      "allowDeviceEndpoint",
      "allowLogoutEndpoint",
    ],
    fieldType: "switch",
  });

  const translatedForm = createFieldConfigWithResource({
    schema: $Volo_Abp_OpenIddict_Applications_Dtos_UpdateApplicationInput,
    resources: languageData,
    name: "Form.Application",
    extend: {
      ...switches,
      extensionGrantTypes: {
        renderer: (props: FieldProps) => (
          <div className="my-1">
            <label className="text-bold mb-0.5 block text-sm">
              {languageData["Form.Application.extensionGrantTypes"]}
            </label>
            <textarea
              className="w-full rounded-md border-2 border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              defaultValue={props.field.value?.join(",") || ""}
              onChange={(e) => {
                props.field.onChange(Array.from(e.target.value.split(",")));
              }}
            />
          </div>
        ),
      },
      redirectUris: {
        renderer: (props: FieldProps) => (
          <div className="my-1">
            <label className="text-bold mb-0.5 block text-sm">{languageData["Form.Application.redirectUris"]}</label>
            <textarea
              className="w-full rounded-md border-2 border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              defaultValue={props.field.value?.join(",") || ""}
              onChange={(e) => {
                props.field.onChange(Array.from(e.target.value.split(",")));
              }}
            />
          </div>
        ),
      },
      postLogoutRedirectUris: {
        renderer: (props: FieldProps) => (
          <div className="my-1">
            <label className="text-bold mb-0.5 block text-sm">
              {languageData["Form.Application.postLogoutRedirectUris"]}
            </label>
            <textarea
              className="w-full rounded-md border-2 border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              defaultValue={props.field.value?.join(",") || ""}
              onChange={(e) => {
                props.field.onChange(Array.from(e.target.value.split(",")));
              }}
            />
          </div>
        ),
      },

      scopes: {
        renderer: (props: FieldProps) => (
          <div className="my-2">
            <label className="text-bold mb-0.5 block text-sm ">{languageData["Form.Application.scopes"]}</label>
            <MultiSelect
              defaultValue={props.field.value}
              onValueChange={(e) => {
                props.field.onChange(e);
              }}
              options={scopeList.map((scope) => ({
                label: scope.name || "",
                value: scope.name || "",
              }))}
              placeholder={languageData["Select.EmptyValue"]}
            />
          </div>
        ),
      },
      applicationType: {
        renderer: (props) => {
          const options = [
            {
              value: "web",
              label: languageData["Form.Application.applicationType.web"],
            },
            {
              value: "native",
              label: languageData["Form.Application.applicationType.native"],
            },
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
      clientType: {
        renderer: (props) => {
          const options = [
            {
              value: "confidential",
              label: languageData["Form.Application.clientType.confidential"],
            },
            {
              value: "public",
              label: languageData["Form.Application.clientType.public"],
            },
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
      consentType: {
        renderer: (props) => {
          const options = [
            {
              value: "explicit",
              label: languageData["Form.Application.consentType.explicitConsent"],
            },
            {
              value: "external",
              label: languageData["Form.Application.consentType.externalConsent"],
            },
            {
              value: "implicit",
              label: languageData["Form.Application.consentType.implicitConsent"],
            },
            {
              value: "systematic",
              label: languageData["Form.Application.consentType.systematicConsent"],
            },
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
    <div className="flex flex-col gap-4 overflow-auto">
      <ActionList>
        {isActionGranted(["OpenIddictPro.Application.Delete"], grantedPolicies) && (
          <ConfirmDialog
            closeProps={{
              children: languageData.Cancel,
            }}
            confirmProps={{
              variant: "destructive",
              children: languageData.Delete,
              onConfirm: () => {
                startTransition(() => {
                  void deleteApplicationByIdApi(applicationDetailsData.id || "").then((res) => {
                    handleDeleteResponse(res, router, "../applications");
                  });
                });
              },
              closeAfterConfirm: true,
            }}
            description={languageData["Delete.Assurance"]}
            title={languageData["Application.Delete"]}
            triggerProps={{
              children: (
                <>
                  <Trash2 className="mr-2 w-4" /> {languageData.Delete}
                </>
              ),
              variant: "outline",
              disabled: isPending,
            }}
            type="with-trigger"
          />
        )}
      </ActionList>
      <AutoForm
        className="grid gap-3 space-y-0 px-2 pb-4"
        dependencies={[
          {
            sourceField: "clientType",
            type: DependencyType.HIDES,
            targetField: "clientSecret",
            when: (activationState: string) => activationState !== "confidential",
          },
          {
            sourceField: "clientType",
            type: DependencyType.HIDES,
            targetField: "allowClientCredentialsFlow",
            when: (activationState: string) => activationState === "public",
          },
          {
            sourceField: "clientType",
            type: DependencyType.HIDES,
            targetField: "allowDeviceEndpoint",
            when: (activationState: string) => activationState === "public",
          },
          {
            sourceField: "allowLogoutEndpoint",
            type: DependencyType.HIDES,
            targetField: "postLogoutRedirectUris",
            when: (activationState: boolean) => !activationState,
          },
        ]}
        fieldConfig={translatedForm}
        formSchema={applicationUpdateSchema}
        onSubmit={(data) => {
          startTransition(() => {
            void putApplicationApi({
              id: applicationId || "",
              requestBody: data as Volo_Abp_OpenIddict_Applications_Dtos_UpdateApplicationInput,
            }).then((res) => {
              handlePutResponse(res, router, "../applications");
            });
          });
        }}
        stickyChildren
        values={applicationDetailsData}>
        <AutoFormSubmit className="float-right px-8 py-4" disabled={isPending}>
          {languageData["Edit.Save"]}
        </AutoFormSubmit>
      </AutoForm>
    </div>
  );
}

"use client";

import type {
  Volo_Abp_OpenIddict_Applications_Dtos_CreateApplicationInput,
  Volo_Abp_OpenIddict_Scopes_Dtos_ScopeDto,
} from "@ayasofyazilim/core-saas/IdentityService";
import {$Volo_Abp_OpenIddict_Applications_Dtos_CreateApplicationInput} from "@ayasofyazilim/core-saas/IdentityService";
import {createZodObject} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import {MultiSelect} from "@repo/ayasofyazilim-ui/molecules/multi-select";
import AutoForm, {
  AutoFormSubmit,
  createFieldConfigWithResource,
  createFieldTypeFieldConfig,
  CustomCombobox,
  DependencyType,
} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {handlePostResponse} from "@repo/utils/api";
import {postApplicationApi} from "@repo/actions/core/IdentityService/post-actions";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";

const applicationCreateSchema = createZodObject($Volo_Abp_OpenIddict_Applications_Dtos_CreateApplicationInput, [
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
}: {
  languageData: IdentityServiceResource;
  scopeList: Volo_Abp_OpenIddict_Scopes_Dtos_ScopeDto[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
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
    schema: $Volo_Abp_OpenIddict_Applications_Dtos_CreateApplicationInput,
    resources: languageData,
    name: "Form.Application",
    extend: {
      ...switches,
      extensionGrantTypes: {
        renderer: (props) => (
          <div className="my-1">
            <label className="text-bold mb-0.5 block text-sm" data-testid="extension_grant_types_label">
              {languageData["Form.Application.extensionGrantTypes"]}
            </label>
            <textarea
              className="w-full rounded-md border-2 border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              data-testid="extension_grant_types_input"
              onChange={(e) => {
                props.field.onChange(Array.from(e.target.value.split(",")));
              }}
            />
          </div>
        ),
      },
      redirectUris: {
        renderer: (props) => (
          <div className="my-1">
            <label className="text-bold mb-0.5 block text-sm" data-testid="redirect_uris_label">
              {languageData["Form.Application.redirectUris"]}
            </label>
            <textarea
              className="w-full rounded-md border-2 border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              data-testid="redirect_uris_input"
              onChange={(e) => {
                props.field.onChange(Array.from(e.target.value.split(",")));
              }}
            />
          </div>
        ),
      },
      postLogoutRedirectUris: {
        renderer: (props) => (
          <div className="my-1">
            <label className="text-bold mb-0.5 block text-sm" data-testid="post_logout_redirect_uris_label">
              {languageData["Form.Application.postLogoutRedirectUris"]}
            </label>
            <textarea
              className="w-full rounded-md border-2 border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
              data-testid="post_logout_redirect_uris_input"
              onChange={(e) => {
                props.field.onChange(Array.from(e.target.value.split(",")));
              }}
            />
          </div>
        ),
      },
      scopes: {
        renderer: (props) => (
          <div className="my-2">
            <label className="text-bold mb-0.5 block text-sm" data-testid="scopes_label">
              {languageData["Form.Application.scopes"]}
            </label>
            <MultiSelect
              data-testid="scopes_input"
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
              id="application_type"
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
              id="client_type"
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
              id="consent_type"
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
      formSchema={applicationCreateSchema}
      onSubmit={(data) => {
        startTransition(() => {
          void postApplicationApi({
            requestBody: data as Volo_Abp_OpenIddict_Applications_Dtos_CreateApplicationInput,
          }).then((res) => {
            handlePostResponse(res, router, "../applications");
          });
        });
      }}
      stickyChildren>
      <AutoFormSubmit className="float-right px-8 py-4" disabled={isPending} id="save">
        {languageData.Save}
      </AutoFormSubmit>
    </AutoForm>
  );
}

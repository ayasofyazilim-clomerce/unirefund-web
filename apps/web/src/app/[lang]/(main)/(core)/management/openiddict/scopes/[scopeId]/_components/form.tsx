"use client";

import type {Volo_Abp_OpenIddict_Scopes_Dtos_ScopeDto} from "@ayasofyazilim/saas/IdentityService";
import {$Volo_Abp_OpenIddict_Scopes_Dtos_UpdateScopeInput} from "@ayasofyazilim/saas/IdentityService";
import {ActionList} from "@repo/ayasofyazilim-ui/molecules/action-button";
import ConfirmDialog from "@repo/ayasofyazilim-ui/molecules/confirm-dialog";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {useGrantedPolicies} from "@repo/utils/policies";
import {Trash2} from "lucide-react";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {handleDeleteResponse, handlePutResponse} from "src/actions/core/api-utils-client";
import {deleteScopeByIdApi} from "src/actions/core/IdentityService/delete-actions";
import {putScopeApi} from "src/actions/core/IdentityService/put-actions";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";
import isActionGranted from "src/utils/page-policy/action-policy";

export default function Form({
  languageData,
  response,
}: {
  languageData: IdentityServiceResource;
  response: Volo_Abp_OpenIddict_Scopes_Dtos_ScopeDto;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {grantedPolicies} = useGrantedPolicies();
  const uiSchema = createUiSchemaWithResource({
    schema: $Volo_Abp_OpenIddict_Scopes_Dtos_UpdateScopeInput,
    resources: languageData,
    name: "Form.Scope",
  });

  return (
    <div className="flex flex-col gap-4 overflow-auto">
      <ActionList>
        {isActionGranted(["OpenIddictPro.Scope.Delete"], grantedPolicies) && (
          <ConfirmDialog
            closeProps={{
              children: languageData.Cancel,
            }}
            confirmProps={{
              variant: "destructive",
              children: languageData.Delete,
              onConfirm: () => {
                startTransition(() => {
                  void deleteScopeByIdApi(response.id || "").then((res) => {
                    handleDeleteResponse(res, router, "../scopes");
                  });
                });
              },
              closeAfterConfirm: true,
            }}
            description={languageData["Delete.Assurance"]}
            title={languageData["Scope.Delete"]}
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
      <SchemaForm<Volo_Abp_OpenIddict_Scopes_Dtos_ScopeDto>
        className="flex flex-col gap-4"
        disabled={isPending}
        formData={response}
        onSubmit={({formData}) => {
          startTransition(() => {
            void putScopeApi({
              id: response.id || "",
              requestBody: {...formData, name: formData?.name || ""},
            }).then((res) => {
              handlePutResponse(res, router, "../scopes");
            });
          });
        }}
        schema={$Volo_Abp_OpenIddict_Scopes_Dtos_UpdateScopeInput}
        submitText={languageData["Edit.Save"]}
        uiSchema={uiSchema}
      />
    </div>
  );
}

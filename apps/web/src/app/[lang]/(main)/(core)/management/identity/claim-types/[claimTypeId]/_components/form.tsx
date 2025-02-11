"use client";

import type {Volo_Abp_Identity_ClaimTypeDto} from "@ayasofyazilim/saas/IdentityService";
import {$Volo_Abp_Identity_UpdateClaimTypeDto} from "@ayasofyazilim/saas/IdentityService";
import {ActionList} from "@repo/ayasofyazilim-ui/molecules/action-button";
import ConfirmDialog from "@repo/ayasofyazilim-ui/molecules/confirm-dialog";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {useGrantedPolicies} from "@repo/utils/policies";
import {Trash2} from "lucide-react";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {handleDeleteResponse, handlePutResponse} from "src/actions/core/api-utils-client";
import {deleteClaimTypeByIdApi} from "src/actions/core/IdentityService/delete-actions";
import {putClaimTypeApi} from "src/actions/core/IdentityService/put-actions";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";
import isActionGranted from "src/utils/page-policy/action-policy";

export default function Form({
  languageData,
  response,
}: {
  languageData: IdentityServiceResource;
  response: Volo_Abp_Identity_ClaimTypeDto;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {grantedPolicies} = useGrantedPolicies();
  const uiSchema = createUiSchemaWithResource({
    schema: $Volo_Abp_Identity_UpdateClaimTypeDto,
    resources: languageData,
    name: "Form.ClaimType",
    extend: {
      required: {
        "ui:widget": "switch",
      },
      valueType: {
        "ui:enumNames": ["string", "int", "boolean", "datetime"],
      },
    },
  });
  return (
    <div className="flex flex-col gap-4 overflow-auto">
      <ActionList>
        {isActionGranted(["AbpIdentity.ClaimTypes.Delete"], grantedPolicies) && (
          <ConfirmDialog
            closeProps={{
              children: languageData.Cancel,
            }}
            confirmProps={{
              variant: "destructive",
              children: languageData.Delete,
              onConfirm: () => {
                startTransition(() => {
                  void deleteClaimTypeByIdApi(response.id || "").then((res) => {
                    handleDeleteResponse(res, router, "../claim-types");
                  });
                });
              },
              closeAfterConfirm: true,
            }}
            description={languageData["Delete.Assurance"]}
            title={languageData["ClaimType.Delete"]}
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
      <SchemaForm<Volo_Abp_Identity_ClaimTypeDto>
        className="flex flex-col gap-4"
        disabled={isPending}
        filter={{
          type: "exclude",
          keys: ["concurrencyStamp"],
        }}
        formData={response}
        onSubmit={({formData}) => {
          startTransition(() => {
            void putClaimTypeApi({
              id: response.id || "",
              requestBody: {...formData, name: formData?.name || ""},
            }).then((res) => {
              handlePutResponse(res, router, "../claim-types");
            });
          });
        }}
        schema={$Volo_Abp_Identity_UpdateClaimTypeDto}
        submitText={languageData["Edit.Save"]}
        uiSchema={uiSchema}
      />
    </div>
  );
}

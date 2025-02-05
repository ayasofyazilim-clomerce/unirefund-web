"use client";

import type {Volo_Abp_Identity_IdentityRoleDto} from "@ayasofyazilim/saas/IdentityService";
import {$Volo_Abp_Identity_IdentityRoleUpdateDto} from "@ayasofyazilim/saas/IdentityService";
import {ActionList} from "@repo/ayasofyazilim-ui/molecules/action-button";
import ConfirmDialog from "@repo/ayasofyazilim-ui/molecules/confirm-dialog";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {Trash2} from "lucide-react";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {useGrantedPolicies} from "@repo/utils/policies";
import {handleDeleteResponse, handlePutResponse} from "src/actions/core/api-utils-client";
import {deleteRoleByIdApi} from "src/actions/core/IdentityService/delete-actions";
import {putRoleApi} from "src/actions/core/IdentityService/put-actions";
import type {IdentityServiceResource} from "src/language-data/core/IdentityService";
import isActionGranted from "src/utils/page-policy/action-policy";

export default function Form({
  languageData,
  response,
}: {
  languageData: IdentityServiceResource;
  response: Volo_Abp_Identity_IdentityRoleDto;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {grantedPolicies} = useGrantedPolicies();

  const uiSchema = createUiSchemaWithResource({
    schema: $Volo_Abp_Identity_IdentityRoleUpdateDto,
    resources: languageData,
    name: "Form.Role",
    extend: {
      isDefault: {
        "ui:widget": "switch",
      },
      isPublic: {
        "ui:widget": "switch",
      },
    },
  });
  return (
    <div className="flex flex-col gap-4 overflow-auto">
      <ActionList>
        {isActionGranted(["AbpIdentity.Roles.Delete"], grantedPolicies) && (
          <ConfirmDialog
            closeProps={{
              children: languageData.Cancel,
            }}
            confirmProps={{
              variant: "destructive",
              children: languageData.Delete,
              onConfirm: () => {
                setLoading(true);
                void deleteRoleByIdApi(response.id || "")
                  .then((res) => {
                    handleDeleteResponse(res, router, "../roles");
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              },
              closeAfterConfirm: true,
            }}
            description={languageData["Delete.Assurance"]}
            title={languageData["Role.Delete"]}
            triggerProps={{
              children: (
                <>
                  <Trash2 className="mr-2 w-4" /> {languageData.Delete}
                </>
              ),
              variant: "outline",
            }}
            type="with-trigger"
          />
        )}
      </ActionList>
      <SchemaForm<Volo_Abp_Identity_IdentityRoleDto>
        className="flex flex-col gap-4"
        disabled={loading}
        filter={{
          type: "exclude",
          keys: ["concurrencyStamp"],
        }}
        formData={response}
        onSubmit={(data) => {
          setLoading(true);
          const formData = data.formData;
          void putRoleApi({
            id: response.id || "",
            requestBody: {...formData, name: formData?.name || ""},
          })
            .then((res) => {
              handlePutResponse(res, router, "../roles");
            })
            .finally(() => {
              setLoading(false);
            });
        }}
        schema={$Volo_Abp_Identity_IdentityRoleUpdateDto}
        submitText={languageData["Edit.Save"]}
        uiSchema={uiSchema}
      />
    </div>
  );
}

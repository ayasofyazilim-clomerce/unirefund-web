"use client";

import type { Volo_Saas_Host_Dtos_EditionDto } from "@ayasofyazilim/saas/SaasService";
import { $Volo_Saas_Host_Dtos_EditionUpdateDto } from "@ayasofyazilim/saas/SaasService";
import { ActionList } from "@repo/ayasofyazilim-ui/molecules/action-button";
import ConfirmDialog from "@repo/ayasofyazilim-ui/molecules/confirm-dialog";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { createUiSchemaWithResource } from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGrantedPolicies } from "@repo/utils/policies";
import {
  handleDeleteResponse,
  handlePutResponse,
} from "src/actions/core/api-utils-client";
import { deleteEditionByIdApi } from "src/actions/core/SaasService/delete-actions";
import { putEditionApi } from "src/actions/core/SaasService/put-actions";
import type { SaasServiceResource } from "src/language-data/core/SaasService";
import isActionGranted from "src/utils/page-policy/action-policy";

export default function Form({
  languageData,
  response,
}: {
  languageData: SaasServiceResource;
  response: Volo_Saas_Host_Dtos_EditionDto;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { grantedPolicies } = useGrantedPolicies();

  const uiSchema = createUiSchemaWithResource({
    schema: $Volo_Saas_Host_Dtos_EditionUpdateDto,
    resources: languageData,
    name: "Form.Edition",
  });
  return (
    <div className="flex flex-col gap-4 overflow-auto">
      <ActionList>
        {isActionGranted(["Saas.Editions.Delete"], grantedPolicies) && (
          <ConfirmDialog
            closeProps={{
              children: languageData.Cancel,
            }}
            confirmProps={{
              variant: "destructive",
              children: languageData.Delete,
              onConfirm: () => {
                setLoading(true);
                void deleteEditionByIdApi(response.id || "")
                  .then((res) => {
                    handleDeleteResponse(res, router, "../editions");
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              },
              closeAfterConfirm: true,
            }}
            description={languageData["Delete.Assurance"]}
            title={languageData["Edition.Delete"]}
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
      <SchemaForm
        className="flex flex-col gap-4"
        disabled={loading}
        filter={{
          type: "exclude",
          keys: ["planId", "concurrencyStamp"],
        }}
        formData={response}
        onSubmit={(data) => {
          setLoading(true);
          const formData = data.formData;
          void putEditionApi({
            id: response.id || "",
            requestBody: {
              ...formData,
              displayName: formData?.displayName || "",
            },
          })
            .then((res) => {
              handlePutResponse(res, router, "../editions");
            })
            .finally(() => {
              setLoading(false);
            });
        }}
        schema={$Volo_Saas_Host_Dtos_EditionUpdateDto}
        submitText={languageData["Edit.Save"]}
        uiSchema={uiSchema}
      />
    </div>
  );
}

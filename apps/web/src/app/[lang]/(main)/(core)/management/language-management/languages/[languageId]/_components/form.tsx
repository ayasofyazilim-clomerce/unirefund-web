"use client";

import type {
  Volo_Abp_LanguageManagement_Dto_LanguageDto,
  Volo_Abp_LanguageManagement_Dto_UpdateLanguageDto,
} from "@ayasofyazilim/saas/AdministrationService";
import { $Volo_Abp_LanguageManagement_Dto_UpdateLanguageDto } from "@ayasofyazilim/saas/AdministrationService";
import { ActionList } from "@repo/ayasofyazilim-ui/molecules/action-button";
import ConfirmDialog from "@repo/ayasofyazilim-ui/molecules/confirm-dialog";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { createUiSchemaWithResource } from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGrantedPolicies } from "@repo/utils/policies";
import { deleteLanguageByIdApi } from "src/actions/core/AdministrationService/delete-actions";
import { putLanguageApi } from "src/actions/core/AdministrationService/put-actions";
import {
  handleDeleteResponse,
  handlePutResponse,
} from "src/actions/core/api-utils-client";
import type { AdministrationServiceResource } from "src/language-data/core/AdministrationService";
import isActionGranted from "src/utils/page-policy/action-policy";

export default function Form({
  languageData,
  languageDetailsData,
}: {
  languageData: AdministrationServiceResource;
  languageDetailsData: Volo_Abp_LanguageManagement_Dto_LanguageDto;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { grantedPolicies } = useGrantedPolicies();

  const uiSchema = createUiSchemaWithResource({
    schema: $Volo_Abp_LanguageManagement_Dto_UpdateLanguageDto,
    resources: languageData,
    name: "Form.Language",
    extend: {
      isEnabled: {
        "ui:widget": "switch",
      },
    },
  });
  return (
    <div className="flex flex-col gap-4 overflow-auto">
      <ActionList>
        {isActionGranted(
          ["LanguageManagement.Languages.Delete"],
          grantedPolicies,
        ) && (
          <ConfirmDialog
            closeProps={{
              children: languageData.Cancel,
            }}
            confirmProps={{
              variant: "destructive",
              children: languageData.Delete,
              onConfirm: () => {
                setLoading(true);
                void deleteLanguageByIdApi(languageDetailsData.id || "")
                  .then((res) => {
                    handleDeleteResponse(res);
                    if (res.type === "success") router.push(`../languages`);
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              },
              closeAfterConfirm: true,
            }}
            description={languageData["Delete.Assurance"]}
            title={languageData["Language.Delete"]}
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
      <SchemaForm<Volo_Abp_LanguageManagement_Dto_UpdateLanguageDto>
        className="flex flex-col gap-4"
        disabled={loading}
        filter={{
          type: "include",
          sort: true,
          keys: ["displayName", "isEnabled"],
        }}
        formData={languageDetailsData}
        onSubmit={(data) => {
          setLoading(true);
          const formData = data.formData;
          void putLanguageApi({
            id: languageDetailsData.id || "",
            requestBody: formData,
          })
            .then((res) => {
              handlePutResponse(res, router);
            })
            .finally(() => {
              setLoading(false);
            });
        }}
        schema={$Volo_Abp_LanguageManagement_Dto_UpdateLanguageDto}
        submitText={languageData["Edit.Save"]}
        uiSchema={uiSchema}
      />
    </div>
  );
}

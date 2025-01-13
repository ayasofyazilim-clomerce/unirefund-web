"use client";

import type {
  UniRefund_ExportValidationService_ExportValidations_ExportValidationDto,
  UniRefund_ExportValidationService_ExportValidations_UpdateExportValidationDto,
} from "@ayasofyazilim/saas/ExportValidationService";
import { $UniRefund_ExportValidationService_ExportValidations_UpdateExportValidationDto } from "@ayasofyazilim/saas/ExportValidationService";
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
import { deleteExportValidationByIdApi } from "src/actions/unirefund/ExportValidationService/delete-actions";
import { putExportValidationApi } from "src/actions/unirefund/ExportValidationService/put-actions";
import type { ExportValidationServiceResource } from "src/language-data/unirefund/ExportValidationService";
import isActionGranted from "src/utils/page-policy/action-policy";

export default function Form({
  languageData,
  exportValidationData,
}: {
  languageData: ExportValidationServiceResource;
  exportValidationData: UniRefund_ExportValidationService_ExportValidations_ExportValidationDto;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { grantedPolicies } = useGrantedPolicies();

  const uiSchema = createUiSchemaWithResource({
    schema:
      $UniRefund_ExportValidationService_ExportValidations_UpdateExportValidationDto,
    resources: languageData,
    name: "Form.ExportValidation",
    extend: {
      "ui:className": "md:grid md:grid-cols-2 md:gap-2",
    },
  });
  return (
    <div className="flex flex-col gap-4 overflow-auto">
      <ActionList>
        {isActionGranted(
          ["ExportValidationService.ExportValidations.Delete"],
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
                void deleteExportValidationByIdApi(
                  exportValidationData.id || "",
                )
                  .then((res) => {
                    handleDeleteResponse(res);
                    if (res.type === "success")
                      router.push(`../export-validations`);
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              },
              closeAfterConfirm: true,
            }}
            description={languageData["Delete.Assurance"]}
            title={languageData["ExportValidation.Delete"]}
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
      <SchemaForm<UniRefund_ExportValidationService_ExportValidations_UpdateExportValidationDto>
        className="flex flex-col gap-4"
        disabled={loading}
        filter={{
          type: "include",
          sort: true,
          keys: [
            "referenceId",
            "exportDate",
            "status",
            "stampType",
            "initialValidationResult",
            "finalValidationResult",
          ],
        }}
        formData={exportValidationData}
        onSubmit={(data) => {
          setLoading(true);
          const formData = data.formData;
          void putExportValidationApi({
            id: exportValidationData.id || "",
            requestBody: formData,
          })
            .then((res) => {
              handlePutResponse(res, router);
            })
            .finally(() => {
              setLoading(false);
            });
        }}
        schema={
          $UniRefund_ExportValidationService_ExportValidations_UpdateExportValidationDto
        }
        submitText={languageData["Edit.Save"]}
        uiSchema={uiSchema}
      />
    </div>
  );
}

"use client";
import { Button } from "@/components/ui/button";
import type {
  UniRefund_CRMService_AffiliationCodes_AffiliationCodeDto as AffiliationCodeDto,
  UniRefund_CRMService_AffiliationCodes_CreateAffiliationCodeDto,
  UniRefund_CRMService_AffiliationCodes_UpdateAffiliationCodeDto as UpdateAffiliationCodeDto,
} from "@ayasofyazilim/saas/CRMService";
import { $UniRefund_CRMService_AffiliationCodes_CreateAffiliationCodeDto } from "@ayasofyazilim/saas/CRMService";
import type {
  GetApiIdentityRolesAssignableRolesByCurrentUserResponse,
  UniRefund_IdentityService_AssignableRoles_AssignableRoleDto,
} from "@ayasofyazilim/saas/IdentityService";
import ConfirmDialog from "@repo/ayasofyazilim-ui/molecules/confirm-dialog";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { createUiSchemaWithResource } from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import { CustomComboboxWidget } from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  handleDeleteResponse,
  handlePostResponse,
  handlePutResponse,
} from "src/actions/core/api-utils-client";
import { deleteAffiliationCodeApi } from "src/actions/unirefund/CrmService/delete-actions";
import { postAffiliationsApi } from "src/actions/unirefund/CrmService/post-actions";
import { putAffiliationsApi } from "src/actions/unirefund/CrmService/put-actions";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";

interface TFormProps {
  languageData: CRMServiceServiceResource;
  assignableRoles: GetApiIdentityRolesAssignableRolesByCurrentUserResponse;
}

export default function FormProps(props: TFormProps) {
  const { languageData, assignableRoles } = props;
  const router = useRouter();
  const uiSchema = createUiSchemaWithResource({
    resources: {
      "Form.name": "Name",
    },
    extend: {
      roleId: {
        "ui:widget": "RoleWidget",
      },
    },
    schema: $UniRefund_CRMService_AffiliationCodes_CreateAffiliationCodeDto,
  });
  function onSubmit(formData?: unknown) {
    if (!formData) return;
    void postAffiliationsApi({
      requestBody: {
        ...(formData as UniRefund_CRMService_AffiliationCodes_CreateAffiliationCodeDto),
        status: "Approved",
      },
    }).then((res) => {
      handlePostResponse(res, router);
    });
  }

  return {
    uiSchema,
    onSubmit,
    submitText: languageData.Save,
    schema: $UniRefund_CRMService_AffiliationCodes_CreateAffiliationCodeDto,
    filter: {
      type: "exclude" as const,
      keys: ["status"],
    },
    widgets: {
      RoleWidget:
        CustomComboboxWidget<UniRefund_IdentityService_AssignableRoles_AssignableRoleDto>(
          {
            languageData,
            list: assignableRoles,
            selectIdentifier: "roleId",
            selectLabel: "roleName",
            disabledItems: assignableRoles
              .filter((role) => !role.isAssignable)
              .map((role) => role.roleId),
          },
        ),
    },
  };
}

export function DetailsForm({
  languageData,
  assignableRoles,
  details,
}: TFormProps & { details: AffiliationCodeDto }) {
  const router = useRouter();
  return (
    <SchemaForm<UpdateAffiliationCodeDto>
      {...FormProps({
        languageData,
        assignableRoles,
      })}
      className="bg-white"
      formData={{
        ...details,
        name: details.name || "",
        status: details.status || "Waiting",
        entityPartyTypeCode: details.entityPartyTypeCode || "CUSTOMS",
      }}
      onSubmit={({ formData }) => {
        if (!formData) return;
        void putAffiliationsApi({
          id: details.id || -1,
          requestBody: formData,
        }).then((res) => {
          handlePutResponse(res, router);
        });
      }}
      useDefaultSubmit={false}
    >
      <div className="flex-end mt-2 flex w-full items-center justify-end gap-2">
        <ConfirmDialog
          confirmProps={{
            variant: "destructive",
            children: languageData.Delete,
            onConfirm: async () => {
              const deleteResponse = await deleteAffiliationCodeApi(
                details.id || -1,
              );
              handleDeleteResponse(deleteResponse, router);
            },
            closeAfterConfirm: true,
          }}
          description={languageData["Delete.Assurance"]}
          title={languageData.Delete}
          triggerProps={{
            variant: "outline",
            children: (
              <>
                <Trash2 className="mr-2 w-4" />
                {languageData.Delete}
              </>
            ),
          }}
          type="with-trigger"
        />
        <Button type="submit">{languageData.Save}</Button>
      </div>
    </SchemaForm>
  );
}

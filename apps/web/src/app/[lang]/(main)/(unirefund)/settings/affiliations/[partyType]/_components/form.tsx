"use client";
import type { UniRefund_CRMService_AffiliationCodes_CreateAffiliationCodeDto } from "@ayasofyazilim/saas/CRMService";
import { $UniRefund_CRMService_AffiliationCodes_CreateAffiliationCodeDto } from "@ayasofyazilim/saas/CRMService";
import type {
  GetApiIdentityRolesAssignableRolesByCurrentUserResponse,
  UniRefund_IdentityService_AssignableRoles_AssignableRoleDto,
} from "@ayasofyazilim/saas/IdentityService";
import { createUiSchemaWithResource } from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import { CustomComboboxWidget } from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import { useRouter } from "next/navigation";
import { handlePostResponse } from "src/actions/core/api-utils-client";
import { postAffiliationsApi } from "src/actions/unirefund/CrmService/post-actions";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";

export default function Form({
  languageData,
  assignableRoles,
}: {
  languageData: CRMServiceServiceResource;
  assignableRoles: GetApiIdentityRolesAssignableRolesByCurrentUserResponse;
}) {
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

"use client";

import type {UniRefund_CRMService_AffiliationCodes_AffiliationCodeDto as AffiliationCodeDto} from "@ayasofyazilim/saas/CRMService";
import {$UniRefund_CRMService_AffiliationCodes_UpdateAffiliationCodeDto} from "@ayasofyazilim/saas/CRMService";
import type {UniRefund_IdentityService_AssignableRoles_AssignableRoleDto} from "@ayasofyazilim/saas/IdentityService";
import {ActionList} from "@repo/ayasofyazilim-ui/molecules/action-button";
import ConfirmDialog from "@repo/ayasofyazilim-ui/molecules/confirm-dialog";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {handleDeleteResponse, handlePutResponse} from "@repo/utils/api";
import {isActionGranted, useGrantedPolicies} from "@repo/utils/policies";
import {Trash2} from "lucide-react";
import {useRouter} from "next/navigation";
import {useState} from "react";
import type {PartyNameType} from "@repo/actions/unirefund/CrmService/types";
import {putAffiliationCodesByIdApi} from "@repo/actions/unirefund/CrmService/put-actions";
import {deleteAffiliationCodesByIdApi} from "@repo/actions/unirefund/CrmService/delete-actions";
import type {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";
import {entityPartyTypeCodeMap} from "../../_components/utils";

export default function Form({
  languageData,
  affiliationCodesDetails,
  assignableRolesData,
  affiliationId,
  partyType,
}: {
  languageData: CRMServiceServiceResource;
  affiliationCodesDetails: AffiliationCodeDto;
  assignableRolesData: UniRefund_IdentityService_AssignableRoles_AssignableRoleDto[];
  affiliationId: number;
  partyType: Exclude<PartyNameType, "individuals">;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {grantedPolicies} = useGrantedPolicies();

  const uiSchema = createUiSchemaWithResource({
    schema: $UniRefund_CRMService_AffiliationCodes_UpdateAffiliationCodeDto,
    resources: languageData,
    name: "Form.Affiliation",
    extend: {
      roleId: {
        "ui:widget": "Role",
      },
    },
  });
  return (
    <div className="flex flex-col gap-4 overflow-auto">
      <ActionList>
        {isActionGranted(["CRMService.AffiliationCodes.Delete"], grantedPolicies) && (
          <ConfirmDialog
            closeProps={{
              children: languageData.Cancel,
            }}
            confirmProps={{
              variant: "destructive",
              children: languageData.Delete,
              onConfirm: () => {
                setLoading(true);
                void deleteAffiliationCodesByIdApi(affiliationId)
                  .then((res) => {
                    handleDeleteResponse(res, router, `../${partyType}`);
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              },
              closeAfterConfirm: true,
            }}
            description={languageData["Delete.Assurance"]}
            title={languageData.Delete}
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
      <SchemaForm<AffiliationCodeDto>
        className="flex flex-col gap-4"
        disabled={loading}
        filter={{
          type: "exclude",
          sort: true,
          keys: ["status", "entityPartyTypeCode"],
        }}
        formData={affiliationCodesDetails}
        onSubmit={({formData}) => {
          setLoading(true);
          if (!formData) return;
          void putAffiliationCodesByIdApi({
            id: affiliationId,
            requestBody: {
              ...formData,
              status: "Approved",
              entityPartyTypeCode: entityPartyTypeCodeMap[partyType],
            },
          })
            .then((res) => {
              handlePutResponse(res, router, `../${partyType}`);
            })
            .finally(() => {
              setLoading(false);
            });
        }}
        schema={$UniRefund_CRMService_AffiliationCodes_UpdateAffiliationCodeDto}
        submitText={languageData["Edit.Save"]}
        uiSchema={uiSchema}
        widgets={{
          Role: CustomComboboxWidget<UniRefund_IdentityService_AssignableRoles_AssignableRoleDto>({
            languageData,
            list: assignableRolesData.filter((role) => role.isAssignable),
            selectIdentifier: "roleId",
            selectLabel: "roleName",
          }),
        }}
      />
    </div>
  );
}

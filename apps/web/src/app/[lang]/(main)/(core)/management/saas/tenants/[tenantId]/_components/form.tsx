"use client";
import type {
  Volo_Saas_Host_Dtos_EditionDto,
  Volo_Saas_Host_Dtos_SaasTenantDto,
  Volo_Saas_Host_Dtos_SaasTenantUpdateDto,
} from "@ayasofyazilim/saas/SaasService";
import { $Volo_Saas_Host_Dtos_SaasTenantUpdateDto } from "@ayasofyazilim/saas/SaasService";
import { createZodObject } from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import { ActionList } from "@repo/ayasofyazilim-ui/molecules/action-button";
import ConfirmDialog from "@repo/ayasofyazilim-ui/molecules/confirm-dialog";
import AutoForm, {
  AutoFormSubmit,
  createFieldConfigWithResource,
  CustomCombobox,
  DependencyType,
} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  handleDeleteResponse,
  handlePutResponse,
} from "src/actions/core/api-utils-client";
import { deleteTenantByIdApi } from "src/actions/core/SaasService/delete-actions";
import { putTenantApi } from "src/actions/core/SaasService/put-actions";
import type { SaasServiceResource } from "src/language-data/core/SaasService";
import { useGrantedPolicies } from "src/providers/granted-policies";
import isActionGranted from "src/utils/page-policy/action-policy";

const tenantEditSchema = createZodObject(
  $Volo_Saas_Host_Dtos_SaasTenantUpdateDto,
  ["name", "editionId", "activationState", "activationEndDate"],
);

export default function Page({
  languageData,
  editionList,
  tenantDetailsData,
}: {
  languageData: SaasServiceResource;
  editionList: Volo_Saas_Host_Dtos_EditionDto[];
  tenantDetailsData: Volo_Saas_Host_Dtos_SaasTenantDto;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { grantedPolicies } = useGrantedPolicies();

  const translatedForm = createFieldConfigWithResource({
    schema: $Volo_Saas_Host_Dtos_SaasTenantUpdateDto,
    resources: languageData,
    name: "Form.Tenant",
    extend: {
      editionId: {
        renderer: (props) => (
          <CustomCombobox<Volo_Saas_Host_Dtos_EditionDto>
            childrenProps={props}
            emptyValue={languageData["Select.EmptyValue"]}
            list={editionList}
            searchPlaceholder={languageData["Select.Placeholder"]}
            searchResultLabel={languageData["Select.ResultLabel"]}
            selectIdentifier="id"
            selectLabel="displayName"
          />
        ),
      },
      activationState: {
        containerClassName: "gap-2",
        renderer: (props) => {
          const options = [
            { value: 0, label: languageData["Form.Tenant.active"] },
            {
              value: 1,
              label: languageData["Form.Tenant.activeWithLimitedTime"],
            },
            { value: 2, label: languageData["Form.Tenant.passive"] },
          ];
          return (
            <CustomCombobox
              childrenProps={props}
              emptyValue={languageData["Select.EmptyValue"]}
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
    <div className="flex flex-col gap-4 overflow-auto">
      <ActionList>
        {isActionGranted(["Saas.Tenants.Delete"], grantedPolicies) && (
          <ConfirmDialog
            closeProps={{
              children: languageData.Cancel,
            }}
            confirmProps={{
              variant: "destructive",
              children: languageData.Delete,
              onConfirm: () => {
                setLoading(true);
                void deleteTenantByIdApi(tenantDetailsData.id || "")
                  .then((res) => {
                    handleDeleteResponse(res);
                    if (res.type === "success") router.push(`../tenants`);
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              },
              closeAfterConfirm: true,
            }}
            description={languageData["Delete.Assurance"]}
            title={languageData["Tenant.Delete"]}
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
      <AutoForm
        className="grid gap-4 space-y-0 pb-4 md:grid-cols-1 lg:grid-cols-2"
        dependencies={[
          {
            sourceField: "activationState",
            type: DependencyType.HIDES,
            targetField: "activationEndDate",
            when: (activationState: string) => activationState !== "1",
          },
        ]}
        fieldConfig={translatedForm}
        formSchema={tenantEditSchema}
        onSubmit={(data) => {
          setLoading(true);
          void putTenantApi({
            id: tenantDetailsData.id || "",
            requestBody: data as Volo_Saas_Host_Dtos_SaasTenantUpdateDto,
          })
            .then((res) => {
              handlePutResponse(res, router);
            })
            .finally(() => {
              setLoading(false);
            });
        }}
        stickyChildren
        values={{
          ...tenantDetailsData,
          activationState: tenantDetailsData.activationState?.toString(),
        }}
      >
        <AutoFormSubmit className="float-right px-8 py-4" disabled={loading}>
          {languageData["Edit.Save"]}
        </AutoFormSubmit>
      </AutoForm>
    </div>
  );
}

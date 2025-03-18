"use client";

import type {
  UniRefund_SettingService_ProductGroups_ProductGroupDto,
  UniRefund_SettingService_ProductGroups_UpdateProductGroupDto,
  UniRefund_SettingService_Vats_VatDto,
} from "@ayasofyazilim/saas/SettingService";
import {$UniRefund_SettingService_ProductGroups_UpdateProductGroupDto} from "@ayasofyazilim/saas/SettingService";
import {ActionList} from "@repo/ayasofyazilim-ui/molecules/action-button";
import ConfirmDialog from "@repo/ayasofyazilim-ui/molecules/confirm-dialog";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {handleDeleteResponse, handlePutResponse} from "@repo/utils/api";
import {useGrantedPolicies, isActionGranted} from "@repo/utils/policies";
import {Trash2} from "lucide-react";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {deleteproductGroupByIdApi} from "@repo/actions/unirefund/SettingService/delete-actions";
import {putProductGroupApi} from "@repo/actions/unirefund/SettingService/put-actions";
import type {SettingServiceResource} from "src/language-data/unirefund/SettingService";

export default function Form({
  languageData,
  response,
  vatList,
}: {
  languageData: SettingServiceResource;
  response: UniRefund_SettingService_ProductGroups_ProductGroupDto;
  vatList: UniRefund_SettingService_Vats_VatDto[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {grantedPolicies} = useGrantedPolicies();

  const uiSchema = createUiSchemaWithResource({
    schema: $UniRefund_SettingService_ProductGroups_UpdateProductGroupDto,
    resources: languageData,
    name: "Form.ProductGroup",
    extend: {
      active: {
        "ui:widget": "switch",
        "ui:className": "md:col-span-2",
      },
      food: {
        "ui:widget": "switch",
        "ui:className": "md:col-span-2",
      },
      vatId: {
        "ui:widget": "VatWidget",
        "ui:className": "md:col-span-2",
      },
      "ui:className": "md:grid md:grid-cols-2 md:gap-2",
    },
  });
  return (
    <div className="flex flex-col gap-4 overflow-auto">
      <ActionList>
        {isActionGranted(["SettingService.ProductGroups.Delete"], grantedPolicies) && (
          <ConfirmDialog
            closeProps={{
              children: languageData.Cancel,
            }}
            confirmProps={{
              variant: "destructive",
              children: languageData.Delete,
              onConfirm: () => {
                setLoading(true);
                void deleteproductGroupByIdApi(response.id || "")
                  .then((res) => {
                    handleDeleteResponse(res, router, "../product-groups");
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              },
              closeAfterConfirm: true,
            }}
            description={languageData["Delete.Assurance"]}
            title={languageData["ProductGroup.Delete"]}
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
      <SchemaForm<UniRefund_SettingService_ProductGroups_ProductGroupDto>
        className="flex flex-col gap-4"
        disabled={loading}
        filter={{
          type: "include",
          sort: true,
          keys: ["name", "articleCode", "unitCode", "companyType", "vatId", "active", "food"],
        }}
        formData={response}
        onSubmit={({formData}) => {
          setLoading(true);
          void putProductGroupApi({
            id: response.id || "",
            requestBody: formData as UniRefund_SettingService_ProductGroups_UpdateProductGroupDto,
          })
            .then((res) => {
              handlePutResponse(res, router, "../product-groups");
            })
            .finally(() => {
              setLoading(false);
            });
        }}
        schema={$UniRefund_SettingService_ProductGroups_UpdateProductGroupDto}
        submitText={languageData["Edit.Save"]}
        uiSchema={uiSchema}
        widgets={{
          VatWidget: CustomComboboxWidget<UniRefund_SettingService_Vats_VatDto>({
            languageData,
            list: vatList,
            selectIdentifier: "id",
            selectLabel: "percent",
          }),
        }}
      />
    </div>
  );
}

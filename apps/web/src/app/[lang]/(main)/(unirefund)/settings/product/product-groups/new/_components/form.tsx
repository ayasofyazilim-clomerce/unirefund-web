"use client";

import type {
  UniRefund_SettingService_ProductGroups_CreateProductGroupDto,
  UniRefund_SettingService_Vats_VatDto,
} from "@ayasofyazilim/saas/SettingService";
import {$UniRefund_SettingService_ProductGroups_CreateProductGroupDto} from "@ayasofyazilim/saas/SettingService";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {handlePostResponse} from "@repo/utils/api";
import {postProductGroupApi} from "@repo/actions/unirefund/SettingService/post-actions";
import type {SettingServiceResource} from "src/language-data/unirefund/SettingService";

export default function Form({
  languageData,
  vatList,
}: {
  languageData: SettingServiceResource;
  vatList: UniRefund_SettingService_Vats_VatDto[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const uiSchema = createUiSchemaWithResource({
    schema: $UniRefund_SettingService_ProductGroups_CreateProductGroupDto,
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
    <SchemaForm<UniRefund_SettingService_ProductGroups_CreateProductGroupDto>
      className="flex flex-col gap-4 "
      disabled={loading}
      filter={{
        type: "include",
        sort: true,
        keys: ["name", "articleCode", "unitCode", "companyType", "vatId", "active", "food"],
      }}
      onSubmit={({formData}) => {
        setLoading(true);
        void postProductGroupApi({
          requestBody: formData,
        })
          .then((res) => {
            handlePostResponse(res, router, "../product-groups");
          })
          .finally(() => {
            setLoading(false);
          });
      }}
      schema={$UniRefund_SettingService_ProductGroups_CreateProductGroupDto}
      submitText={languageData.Save}
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
  );
}

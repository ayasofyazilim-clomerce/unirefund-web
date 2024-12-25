"use client";

import type {
  UniRefund_SettingService_ProductGroups_CreateProductGroupDto,
  UniRefund_SettingService_Vats_VatDto,
} from "@ayasofyazilim/saas/SettingService";
import { $UniRefund_SettingService_ProductGroups_CreateProductGroupDto } from "@ayasofyazilim/saas/SettingService";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import type { WidgetProps } from "@repo/ayasofyazilim-ui/organisms/schema-form/types";
import { createUiSchemaWithResource } from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import { CustomCombobox } from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { handlePostResponse } from "src/actions/core/api-utils-client";
import { postProductGroupApi } from "src/actions/unirefund/SettingService/post-actions";
import type { SettingServiceResource } from "src/language-data/unirefund/SettingService";
import { getBaseLink } from "src/utils";

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
        "ui:widget": "Vat",
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
        keys: [
          "name",
          "articleCode",
          "unitCode",
          "companyType",
          "vatId",
          "active",
          "food",
        ],
      }}
      onSubmit={(data) => {
        setLoading(true);
        const formData = data.formData;
        void postProductGroupApi({
          requestBody: formData,
        })
          .then((res) => {
            handlePostResponse(res, router);
            router.push(getBaseLink(`/settings/product/product-groups`));
          })
          .finally(() => {
            setLoading(false);
          });
      }}
      schema={$UniRefund_SettingService_ProductGroups_CreateProductGroupDto}
      submitText={languageData.Save}
      uiSchema={uiSchema}
      widgets={{
        Vat: VatWidget({
          languageData,
          vatList,
        }),
      }}
    />
  );
}

const VatWidget = ({
  languageData,
  vatList,
}: {
  languageData: SettingServiceResource;
  vatList: UniRefund_SettingService_Vats_VatDto[];
}) => {
  function Widget(props: WidgetProps) {
    return (
      <CustomCombobox<UniRefund_SettingService_Vats_VatDto>
        {...props}
        emptyValue="select vat"
        list={vatList}
        searchPlaceholder={languageData["Select.Placeholder"]}
        searchResultLabel={languageData["Select.ResultLabel"]}
        selectIdentifier="id"
        selectLabel="percent"
      />
    );
  }
  return Widget;
};

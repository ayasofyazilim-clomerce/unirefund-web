"use client";

import type {UniRefund_SettingService_Vats_CreateVatDto} from "@ayasofyazilim/saas/SettingService";
import {$UniRefund_SettingService_Vats_CreateVatDto} from "@ayasofyazilim/saas/SettingService";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {handlePostResponse} from "@repo/utils/api";
import {postVatApi} from "@repo/actions/unirefund/SettingService/post-actions";
import type {SettingServiceResource} from "src/language-data/unirefund/SettingService";

export default function Form({languageData}: {languageData: SettingServiceResource}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const uiSchema = createUiSchemaWithResource({
    schema: $UniRefund_SettingService_Vats_CreateVatDto,
    resources: languageData,
    name: "Form.Vat",
    extend: {
      active: {
        "ui:widget": "switch",
      },
      "ui:className": "border rounded-md md:p-6 p-2 my-6",
    },
  });
  return (
    <SchemaForm<UniRefund_SettingService_Vats_CreateVatDto>
      className="mx-auto flex max-w-4xl flex-col pr-0"
      disabled={loading}
      id="new-vat-form"
      onSubmit={({formData}) => {
        setLoading(true);
        void postVatApi({
          requestBody: formData,
        })
          .then((res) => {
            handlePostResponse(res, router, "../vats");
          })
          .finally(() => {
            setLoading(false);
          });
      }}
      schema={$UniRefund_SettingService_Vats_CreateVatDto}
      submitText={languageData.Save}
      uiSchema={uiSchema}
    />
  );
}

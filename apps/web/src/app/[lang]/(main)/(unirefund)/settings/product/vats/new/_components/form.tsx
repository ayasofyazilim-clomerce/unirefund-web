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
    },
  });
  return (
    <SchemaForm<UniRefund_SettingService_Vats_CreateVatDto>
      className="flex flex-col gap-4"
      disabled={loading}
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

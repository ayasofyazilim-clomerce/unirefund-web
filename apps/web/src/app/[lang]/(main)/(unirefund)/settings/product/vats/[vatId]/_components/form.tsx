"use client";

import type { UniRefund_SettingService_Vats_VatDto } from "@ayasofyazilim/saas/SettingService";
import { $UniRefund_SettingService_Vats_UpdateVatDto } from "@ayasofyazilim/saas/SettingService";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { createUiSchemaWithResource } from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { handlePutResponse } from "src/actions/core/api-utils-client";
import { putVatApi } from "src/actions/unirefund/SettingService/put-actions";
import type { SettingServiceResource } from "src/language-data/unirefund/SettingService";

export default function Form({
  languageData,
  response,
}: {
  languageData: SettingServiceResource;
  response: UniRefund_SettingService_Vats_VatDto;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const uiSchema = createUiSchemaWithResource({
    schema: $UniRefund_SettingService_Vats_UpdateVatDto,
    resources: languageData,
    extend: {
      active: {
        "ui:widget": "switch",
      },
    },
  });
  return (
    <SchemaForm
      className="flex flex-col gap-4"
      disabled={loading}
      formData={response}
      onSubmit={(data) => {
        setLoading(true);
        const formData = data.formData;
        void putVatApi({
          id: response.id || "",
          requestBody: formData,
        })
          .then((res) => {
            handlePutResponse(res, router);
          })
          .finally(() => {
            setLoading(false);
          });
      }}
      schema={$UniRefund_SettingService_Vats_UpdateVatDto}
      submitText={languageData["Edit.Save"]}
      uiSchema={uiSchema}
    />
  );
}

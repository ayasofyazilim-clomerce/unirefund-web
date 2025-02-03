"use client";

import type {
  UniRefund_CRMService_NameCommonDatas_NameCommonDataDto,
  UniRefund_CRMService_NameCommonDatas_UpdateNameCommonDataDto,
} from "@ayasofyazilim/saas/CRMService";
import { $UniRefund_CRMService_NameCommonDatas_UpdateNameCommonDataDto } from "@ayasofyazilim/saas/CRMService";
import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { createUiSchemaWithResource } from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { handlePutResponse } from "src/actions/core/api-utils-client";
import { putIndividualNameApi } from "src/actions/unirefund/CrmService/put-actions";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";

function NameForm({
  languageData,
  partyId,
  individualNameData,
}: {
  languageData: CRMServiceServiceResource;
  partyId: string;
  individualNameData: UniRefund_CRMService_NameCommonDatas_NameCommonDataDto;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const uiSchema = createUiSchemaWithResource({
    schema: $UniRefund_CRMService_NameCommonDatas_UpdateNameCommonDataDto,
    resources: languageData,
    name: "Form.Individual",
  });

  return (
    <SchemaForm<UniRefund_CRMService_NameCommonDatas_NameCommonDataDto>
      className="flex flex-col gap-4 p-4"
      disabled={loading}
      formData={individualNameData}
      onSubmit={({ formData }) => {
        setLoading(true);
        void putIndividualNameApi({
          requestBody:
            formData as UniRefund_CRMService_NameCommonDatas_UpdateNameCommonDataDto,
          id: partyId,
        })
          .then((response) => {
            handlePutResponse(response, router);
          })
          .finally(() => {
            setLoading(false);
          });
      }}
      schema={$UniRefund_CRMService_NameCommonDatas_UpdateNameCommonDataDto}
      submitText={languageData["Edit.Save"]}
      uiSchema={uiSchema}
    />
  );
}

export default NameForm;

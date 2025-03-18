"use client";

import type {
  UniRefund_CRMService_PersonalSummaries_PersonalSummaryDto,
  UniRefund_CRMService_PersonalSummaries_UpdatePersonalSummaryDto,
} from "@ayasofyazilim/saas/CRMService";
import {$UniRefund_CRMService_PersonalSummaries_UpdatePersonalSummaryDto} from "@ayasofyazilim/saas/CRMService";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {handlePutResponse} from "@repo/utils/api";
import {putIndividualPersonalSummaryApi} from "@repo/actions/unirefund/CrmService/put-actions";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";

function PersonalSummaryForm({
  languageData,
  partyId,
  individualPersonalSummaryData,
}: {
  languageData: CRMServiceServiceResource;
  partyId: string;
  individualPersonalSummaryData: UniRefund_CRMService_PersonalSummaries_PersonalSummaryDto[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const uiSchema = createUiSchemaWithResource({
    schema: $UniRefund_CRMService_PersonalSummaries_UpdatePersonalSummaryDto,
    resources: languageData,
    name: "Form.Individual",
  });

  return (
    <SchemaForm<UniRefund_CRMService_PersonalSummaries_PersonalSummaryDto>
      className="flex flex-col gap-4 p-4"
      disabled={isPending}
      formData={individualPersonalSummaryData[0]}
      onSubmit={({formData}) => {
        startTransition(() => {
          void putIndividualPersonalSummaryApi({
            requestBody: formData as UniRefund_CRMService_PersonalSummaries_UpdatePersonalSummaryDto,
            id: partyId,
            personalSummaryId: individualPersonalSummaryData[0].id || "",
          }).then((response) => {
            handlePutResponse(response, router);
          });
        });
      }}
      schema={$UniRefund_CRMService_PersonalSummaries_UpdatePersonalSummaryDto}
      submitText={languageData["Edit.Save"]}
      uiSchema={uiSchema}
    />
  );
}

export default PersonalSummaryForm;

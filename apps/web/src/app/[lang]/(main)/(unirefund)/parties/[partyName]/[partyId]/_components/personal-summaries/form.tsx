"use client";

import type { UniRefund_CRMService_PersonalSummaries_PersonalSummaryDto } from "@ayasofyazilim/saas/CRMService";
import { $UniRefund_CRMService_PersonalSummaries_UpdatePersonalSummaryDto } from "@ayasofyazilim/saas/CRMService";
import { createZodObject } from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import AutoForm, {
  AutoFormSubmit,
} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import { SectionLayoutContent } from "@repo/ayasofyazilim-ui/templates/section-layout-v2";
import { useRouter } from "next/navigation";
import { handlePutResponse } from "src/actions/core/api-utils-client";
import { putCrmIndividualPersonalSummaryApi } from "src/actions/unirefund/CrmService/put-actions";
import type { IndividualPersonalSummariesUpdateDto } from "src/actions/unirefund/CrmService/types";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";

function PersonalSummariesForm({
  languageData,
  partyName,
  partyId,
  individualData,
}: {
  languageData: CRMServiceServiceResource;
  partyName: "merchants";
  partyId: string;
  individualData:
    | UniRefund_CRMService_PersonalSummaries_PersonalSummaryDto
    | undefined;
}) {
  const router = useRouter();

  const schema = createZodObject(
    $UniRefund_CRMService_PersonalSummaries_UpdatePersonalSummaryDto,
  );

  function handleSubmit(formData: IndividualPersonalSummariesUpdateDto) {
    void putCrmIndividualPersonalSummaryApi(partyName, {
      requestBody: formData,
      id: partyId,
      personalSummaryId: individualData?.id || "",
      individualId: individualData?.individualId || "",
    }).then((response) => {
      handlePutResponse(response, router);
    });
  }
  return (
    <SectionLayoutContent sectionId="personal-summaries">
      <AutoForm
        formClassName="pb-40"
        formSchema={schema}
        onSubmit={(values) => {
          handleSubmit(values as IndividualPersonalSummariesUpdateDto);
        }}
        values={individualData}
      >
        <AutoFormSubmit className="float-right">
          {languageData.Save}
        </AutoFormSubmit>
      </AutoForm>
    </SectionLayoutContent>
  );
}

export default PersonalSummariesForm;

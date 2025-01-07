"use client";

import type { UniRefund_CRMService_NameCommonDatas_NameCommonDataDto } from "@ayasofyazilim/saas/CRMService";
import { $UniRefund_CRMService_NameCommonDatas_UpdateNameCommonDataDto } from "@ayasofyazilim/saas/CRMService";
import { createZodObject } from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import AutoForm, {
  AutoFormSubmit,
} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import { SectionLayoutContent } from "@repo/ayasofyazilim-ui/templates/section-layout-v2";
import { useRouter } from "next/navigation";
import { handlePutResponse } from "src/actions/core/api-utils-client";
import { putCrmIndividualNameApi } from "src/actions/unirefund/CrmService/put-actions";
import type { IndividualNameUpdateDto } from "src/actions/unirefund/CrmService/types";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";

function NameForm({
  languageData,
  partyName,
  partyId,
  individualData,
}: {
  languageData: CRMServiceServiceResource;
  partyName: "merchants";
  partyId: string;
  individualData:
    | UniRefund_CRMService_NameCommonDatas_NameCommonDataDto
    | undefined;
}) {
  const router = useRouter();

  const nameSchema = createZodObject(
    $UniRefund_CRMService_NameCommonDatas_UpdateNameCommonDataDto,
  );

  function handleSubmit(formData: IndividualNameUpdateDto) {
    void putCrmIndividualNameApi(partyName, {
      requestBody: formData,
      id: partyId,
      nameId: individualData?.id || "",
      individualId: individualData?.individualId || "",
    }).then((response) => {
      handlePutResponse(response, router);
    });
  }
  return (
    <SectionLayoutContent sectionId="name">
      <AutoForm
        formClassName="pb-40"
        formSchema={nameSchema}
        onSubmit={(values) => {
          handleSubmit(values as IndividualNameUpdateDto);
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

export default NameForm;

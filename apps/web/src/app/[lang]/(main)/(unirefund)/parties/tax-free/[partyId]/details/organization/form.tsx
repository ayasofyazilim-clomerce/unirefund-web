"use client";

import type {
  UniRefund_CRMService_Organizations_OrganizationDto,
  UniRefund_CRMService_Organizations_UpdateOrganizationDto,
} from "@ayasofyazilim/saas/CRMService";
import {$UniRefund_CRMService_Organizations_UpdateOrganizationDto} from "@ayasofyazilim/saas/CRMService";
import {createZodObject} from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import AutoForm, {AutoFormSubmit} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {handlePutResponse} from "@repo/utils/api";
import {putTaxFreeOrganizationApi} from "@repo/actions/unirefund/CrmService/put-actions";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";

function OrganizationForm({
  languageData,
  partyId,
  organizationDetail,
}: {
  languageData: CRMServiceServiceResource;
  partyId: string;
  organizationDetail: UniRefund_CRMService_Organizations_OrganizationDto;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const schema = createZodObject($UniRefund_CRMService_Organizations_UpdateOrganizationDto, [
    "name",
    "legalStatusCode",
  ]);

  function handleSubmit(formData: UniRefund_CRMService_Organizations_UpdateOrganizationDto) {
    startTransition(() => {
      void putTaxFreeOrganizationApi({
        requestBody: formData,
        id: partyId,
        organizationId: organizationDetail.id || "",
      }).then((response) => {
        handlePutResponse(response, router);
      });
    });
  }
  return (
    <AutoForm
      formClassName="pb-40"
      formSchema={schema}
      onSubmit={(values) => {
        handleSubmit(values as UniRefund_CRMService_Organizations_UpdateOrganizationDto);
      }}
      values={organizationDetail}>
      <AutoFormSubmit className="float-right" disabled={isPending}>
        {languageData.Save}
      </AutoFormSubmit>
    </AutoForm>
  );
}

export default OrganizationForm;

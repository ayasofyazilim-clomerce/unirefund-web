"use client";

import type {GetApiCrmServiceTaxOfficesByIdEmailsResponse} from "@ayasofyazilim/saas/CRMService";
import AutoForm, {AutoFormSubmit} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import {emailSchema} from "@repo/ui/utils/table/form-schemas";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {handlePutResponse} from "@repo/utils/api";
import {putTaxOfficeEmailApi} from "@repo/actions/unirefund/CrmService/put-actions";
import type {EmailAddressUpdateDto} from "@repo/actions/unirefund/CrmService/types";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";

function EmailForm({
  languageData,
  partyId,
  emailResponse,
}: {
  languageData: CRMServiceServiceResource;
  partyId: string;
  emailResponse: GetApiCrmServiceTaxOfficesByIdEmailsResponse;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const emailValues = emailResponse[0];

  function handleSubmit(formData: EmailAddressUpdateDto) {
    startTransition(() => {
      void putTaxOfficeEmailApi({
        requestBody: formData,
        id: partyId,
        emailId: emailValues.id || "",
      }).then((response) => {
        handlePutResponse(response, router);
      });
    });
  }
  return (
    <AutoForm
      className="grid w-2/3 grid-cols-1 items-center justify-center gap-4 space-y-0 pt-6 md:grid-cols-2 [&>div]:flex [&>div]:flex-col"
      fieldConfig={{
        emailAddress: {
          inputProps: {
            type: "email",
          },
        },
      }}
      formClassName="pb-40 "
      formSchema={emailSchema}
      onSubmit={(values) => {
        handleSubmit(values as EmailAddressUpdateDto);
      }}
      values={emailValues}>
      <AutoFormSubmit className="float-right" disabled={isPending}>
        {languageData.Save}
      </AutoFormSubmit>
    </AutoForm>
  );
}

export default EmailForm;

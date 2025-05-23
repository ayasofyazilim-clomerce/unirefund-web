"use client";

import type {GetApiCrmServiceCustomsByIdEmailsResponse} from "@ayasofyazilim/saas/CRMService";
import AutoForm, {AutoFormSubmit} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import {emailSchema} from "@repo/ui/utils/table/form-schemas";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {handlePutResponse} from "@repo/utils/api";
import {putCustomEmailApi} from "@repo/actions/unirefund/CrmService/put-actions";
import type {EmailAddressUpdateDto} from "@repo/actions/unirefund/CrmService/types";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";

function EmailForm({
  languageData,
  partyId,
  emailResponse,
}: {
  languageData: CRMServiceServiceResource;
  partyId: string;
  emailResponse: GetApiCrmServiceCustomsByIdEmailsResponse;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const emailValues = emailResponse[0];

  function handleSubmit(formData: EmailAddressUpdateDto) {
    startTransition(() => {
      void putCustomEmailApi({
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

"use client";

import type {GetApiCrmServiceIndividualsByIdEmailsResponse} from "@ayasofyazilim/saas/CRMService";
import AutoForm, {AutoFormSubmit} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import {emailSchema} from "@repo/ui/utils/table/form-schemas";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {handlePutResponse} from "@repo/utils/api";
import {putIndividualEmailApi} from "@repo/actions/unirefund/CrmService/put-actions";
import type {EmailAddressUpdateDto} from "@repo/actions/unirefund/CrmService/types";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";

function EmailForm({
  languageData,
  partyId,
  emailResponse,
}: {
  languageData: CRMServiceServiceResource;
  partyId: string;
  emailResponse: GetApiCrmServiceIndividualsByIdEmailsResponse;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const emailValues = emailResponse[0];

  function handleSubmit(formData: EmailAddressUpdateDto) {
    startTransition(() => {
      void putIndividualEmailApi({
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
      className="w-full py-6 md:w-1/2 lg:w-1/3"
      fieldConfig={{
        emailAddress: {
          inputProps: {
            type: "email",
          },

          className: "w-full ",
        },
      }}
      formSchema={emailSchema}
      onSubmit={(values) => {
        handleSubmit(values as EmailAddressUpdateDto);
      }}
      stickyChildren
      values={emailValues}>
      <AutoFormSubmit className="float-right mb-2" disabled={isPending}>
        {languageData["Edit.Save"]}
      </AutoFormSubmit>
    </AutoForm>
  );
}

export default EmailForm;

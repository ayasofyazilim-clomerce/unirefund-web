"use client";

import type {GetApiCrmServiceRefundPointsByIdTelephonesResponse} from "@ayasofyazilim/saas/CRMService";
import AutoForm, {AutoFormSubmit} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import {telephoneSchema} from "@repo/ui/utils/table/form-schemas";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {handlePutResponse} from "@repo/utils/api";
import {putRefundPointTelephoneApi} from "@repo/actions/unirefund/CrmService/put-actions";
import type {TelephoneUpdateDto} from "@repo/actions/unirefund/CrmService/types";
import type {CRMServiceServiceResource} from "src/language-data/unirefund/CRMService";
import {isPhoneValid, splitPhone} from "src/utils/utils-phone";

function TelephoneForm({
  languageData,
  partyId,
  phoneResponse,
}: {
  languageData: CRMServiceServiceResource;
  partyId: string;
  phoneResponse: GetApiCrmServiceRefundPointsByIdTelephonesResponse;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const phoneValues = phoneResponse[0];

  const telephoneValues = {
    localNumber: (phoneValues.ituCountryCode || "+90") + (phoneValues.areaCode || "") + (phoneValues.localNumber || ""),
    primaryFlag: phoneValues.primaryFlag,
    typeCode: phoneValues.typeCode,
  };

  function handleSubmit(formData: TelephoneUpdateDto) {
    startTransition(() => {
      void putRefundPointTelephoneApi({
        requestBody: formData,
        id: partyId,
        telephoneId: phoneValues.id || "",
      }).then((response) => {
        handlePutResponse(response, router);
      });
    });
  }
  return (
    <AutoForm
      fieldConfig={{
        localNumber: {
          fieldType: "phone",
          displayName: "Telephone Number",
          inputProps: {
            showLabel: true,
          },
        },
      }}
      formClassName="pb-40 "
      formSchema={telephoneSchema}
      onSubmit={(values) => {
        const isValid = isPhoneValid(values.localNumber as string);
        if (!isValid) {
          return;
        }
        const splitedPhoneData = splitPhone(values.localNumber as string);
        const formData = {
          ...values,
          ...splitedPhoneData,
        } as TelephoneUpdateDto;
        handleSubmit(formData);
      }}
      values={telephoneValues}>
      <AutoFormSubmit className="float-right" disabled={isPending}>
        {languageData.Save}
      </AutoFormSubmit>
    </AutoForm>
  );
}

export default TelephoneForm;

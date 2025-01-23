"use client";

import type { GetApiCrmServiceMerchantsByIdTelephonesResponse } from "@ayasofyazilim/saas/CRMService";
import AutoForm, {
  AutoFormSubmit,
} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import { telephoneSchema } from "@repo/ui/utils/table/form-schemas";
import { useRouter } from "next/navigation";
import { handlePutResponse } from "src/actions/core/api-utils-client";
import { putMerchantTelephoneApi } from "src/actions/unirefund/CrmService/put-actions";
import type { TelephoneUpdateDto } from "src/actions/unirefund/CrmService/types";
import type { CRMServiceServiceResource } from "src/language-data/unirefund/CRMService";
import { isPhoneValid, splitPhone } from "src/utils/utils-phone";

function TelephoneForm({
  languageData,
  partyId,
  phoneData,
}: {
  languageData: CRMServiceServiceResource;
  partyId: string;
  phoneData: GetApiCrmServiceMerchantsByIdTelephonesResponse;
}) {
  const router = useRouter();
  const phoneValues = phoneData[0];

  const telephoneValues = {
    localNumber:
      (phoneValues.ituCountryCode || "+90") +
      (phoneValues.areaCode || "") +
      (phoneValues.localNumber || ""),
    primaryFlag: phoneValues.primaryFlag,
    typeCode: phoneValues.typeCode,
  };

  function handleSubmit(formData: TelephoneUpdateDto) {
    void putMerchantTelephoneApi({
      requestBody: formData,
      id: partyId,
      telephoneId: phoneValues.id || "",
    }).then((response) => {
      handlePutResponse(response, router);
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
      values={telephoneValues}
    >
      <AutoFormSubmit className="float-right">
        {languageData.Save}
      </AutoFormSubmit>
    </AutoForm>
  );
}

export default TelephoneForm;
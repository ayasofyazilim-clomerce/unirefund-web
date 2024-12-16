"use client";

import type {
  UniRefund_TravellerService_PersonalIdentificationCommonDatas_UpdatePersonalIdentificationDto,
  UniRefund_TravellerService_Travellers_TravellerDetailProfileDto,
} from "@ayasofyazilim/saas/TravellerService";
import { $UniRefund_TravellerService_PersonalIdentificationCommonDatas_UpdatePersonalIdentificationDto } from "@ayasofyazilim/saas/TravellerService";
import { createZodObject } from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import AutoForm, {
  AutoFormSubmit,
  createFieldConfigWithResource,
  CustomCombobox,
} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import { useRouter } from "next/navigation";
import { handlePutResponse } from "src/actions/core/api-utils-client";
import type { CountryDto } from "src/actions/unirefund/LocationService/types";
import { putTravellerPersonalIdentificationApi } from "src/actions/unirefund/TravellerService/put-actions";
import type { TravellerServiceResource } from "src/language-data/unirefund/TravellerService";

const updateTravellerIdentificationSchema = createZodObject(
  $UniRefund_TravellerService_PersonalIdentificationCommonDatas_UpdatePersonalIdentificationDto,
  [
    "travelDocumentNumber",
    "firstName",
    "middleName",
    "lastName",
    "birthDate",
    "issueDate",
    "expirationDate",
    "nationalityCountryCode2",
    "residenceCountryCode2",
    "identificationType",
  ],
);

export default function Form({
  languageData,
  travellerId,
  travellerData,
  countryList,
  identificationId,
}: {
  languageData: TravellerServiceResource;
  travellerId: string;
  identificationId: string;
  travellerData: UniRefund_TravellerService_Travellers_TravellerDetailProfileDto;
  countryList: { data: CountryDto[]; success: boolean };
}) {
  const router = useRouter();
  function putTravellerPersonalIdentification(
    data: UniRefund_TravellerService_PersonalIdentificationCommonDatas_UpdatePersonalIdentificationDto,
  ) {
    void putTravellerPersonalIdentificationApi({
      id: travellerId,
      requestBody: { ...data, id: identificationId },
    }).then((response) => {
      handlePutResponse(response, router);
    });
  }

  const translatedForm = createFieldConfigWithResource({
    schema:
      $UniRefund_TravellerService_PersonalIdentificationCommonDatas_UpdatePersonalIdentificationDto,
    resources: languageData,
    name: "Form.personalIdentification",
    extend: {
      nationalityCountryCode2: {
        containerClassName: "gap-2",
        renderer: (props) => (
          <CustomCombobox<CountryDto>
            childrenProps={props}
            disabled={!countryList.success}
            emptyValue={
              countryList.success
                ? languageData["Country.Select"]
                : languageData["Country.Fetch.Fail"]
            }
            list={countryList.data}
            searchPlaceholder={languageData["Select.Placeholder"]}
            searchResultLabel={languageData["Select.ResultLabel"]}
            selectIdentifier="code2"
            selectLabel="name"
          />
        ),
      },
      residenceCountryCode2: {
        containerClassName: "gap-2",
        renderer: (props) => (
          <CustomCombobox<CountryDto>
            childrenProps={props}
            disabled={!countryList.success}
            emptyValue={
              countryList.success
                ? languageData["Country.Select"]
                : languageData["Country.Fetch.Fail"]
            }
            list={countryList.data}
            searchPlaceholder={languageData["Select.Placeholder"]}
            searchResultLabel={languageData["Select.ResultLabel"]}
            selectIdentifier="code2"
            selectLabel="name"
          />
        ),
      },
    },
  });

  return (
    <AutoForm
      className="grid gap-4 space-y-0 pb-4 md:grid-cols-1 lg:grid-cols-2 "
      fieldConfig={translatedForm}
      formClassName=" space-y-0 "
      formSchema={updateTravellerIdentificationSchema}
      onSubmit={(values) => {
        putTravellerPersonalIdentification(
          values as UniRefund_TravellerService_PersonalIdentificationCommonDatas_UpdatePersonalIdentificationDto,
        );
      }}
      values={travellerData.personalIdentifications.find(
        (identification) => identification.id === identificationId,
      )}
    >
      <AutoFormSubmit className="float-right">
        {languageData["Edit.Save"]}
      </AutoFormSubmit>
    </AutoForm>
  );
}

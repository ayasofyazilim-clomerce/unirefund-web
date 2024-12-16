"use client";

import type { UniRefund_TravellerService_PersonalIdentificationCommonDatas_CreatePersonalIdentificationDto } from "@ayasofyazilim/saas/TravellerService";
import { $UniRefund_TravellerService_PersonalIdentificationCommonDatas_CreatePersonalIdentificationDto } from "@ayasofyazilim/saas/TravellerService";
import { createZodObject } from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import AutoForm, {
  AutoFormSubmit,
  createFieldConfigWithResource,
  CustomCombobox,
} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import { useRouter } from "next/navigation";
import { handlePostResponse } from "src/actions/core/api-utils-client";
import type { CountryDto } from "src/actions/unirefund/LocationService/types";
import { postTravellerIdentificationApi } from "src/actions/unirefund/TravellerService/post-actions";
import type { TravellerServiceResource } from "src/language-data/unirefund/TravellerService";

const createTravellerIdentificationSchema = createZodObject(
  $UniRefund_TravellerService_PersonalIdentificationCommonDatas_CreatePersonalIdentificationDto,
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
  countryList,
}: {
  languageData: TravellerServiceResource;
  travellerId: string;
  countryList: { data: CountryDto[]; success: boolean };
}) {
  const router = useRouter();
  function postTravellerIdentification(
    data: UniRefund_TravellerService_PersonalIdentificationCommonDatas_CreatePersonalIdentificationDto,
  ) {
    void postTravellerIdentificationApi({
      id: travellerId,
      requestBody: data,
    }).then((response) => {
      handlePostResponse(response, router, `..`);
    });
  }

  const translatedForm = createFieldConfigWithResource({
    schema:
      $UniRefund_TravellerService_PersonalIdentificationCommonDatas_CreatePersonalIdentificationDto,
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
      formSchema={createTravellerIdentificationSchema}
      onSubmit={(values) => {
        postTravellerIdentification(
          values as UniRefund_TravellerService_PersonalIdentificationCommonDatas_CreatePersonalIdentificationDto,
        );
      }}
    >
      <AutoFormSubmit className="float-right">
        {languageData.Save}
      </AutoFormSubmit>
    </AutoForm>
  );
}

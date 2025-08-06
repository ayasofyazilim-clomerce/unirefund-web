"use client";

import type {
  UniRefund_TravellerService_TravellerDocuments_UpdateTravellerDocumentDto,
  UniRefund_TravellerService_Travellers_TravellerDetailProfileDto,
} from "@ayasofyazilim/saas/TravellerService";
import {$UniRefund_TravellerService_TravellerDocuments_UpdateTravellerDocumentDto} from "@ayasofyazilim/saas/TravellerService";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {handlePutResponse} from "@repo/utils/api";
import {putTravellerDocumentApi} from "@repo/actions/unirefund/TravellerService/put-actions";
import type {CountryDto} from "@/utils/address-hook/types";
import type {TravellerServiceResource} from "src/language-data/unirefund/TravellerService";

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
  countryList: CountryDto[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const uiSchema = createUiSchemaWithResource({
    schema: $UniRefund_TravellerService_TravellerDocuments_UpdateTravellerDocumentDto,
    resources: languageData,
    name: "Form.personalIdentification",
    extend: {
      "ui:title": "",
      "ui:className": "md:grid md:grid-cols-2 md:gap-2",
      residenceCountryCode2: {
        "ui:widget": "countryWidget",
      },
      nationalityCountryCode2: {
        "ui:widget": "countryWidget",
      },
    },
  });

  return (
    <SchemaForm<UniRefund_TravellerService_TravellerDocuments_UpdateTravellerDocumentDto>
      className="flex flex-col gap-4"
      disabled={isPending}
      filter={{
        type: "include",
        sort: true,
        keys: [
          "firstName",
          "middleName",
          "lastName",
          "travelDocumentNumber",
          "birthDate",
          "issueDate",
          "expirationDate",
          "residenceCountryCode2",
          "nationalityCountryCode2",
          "identificationType",
        ],
      }}
      formData={travellerData.travellerDocuments?.find((identification) => identification.id === identificationId)}
      onSubmit={({formData}) => {
        startTransition(() => {
          void putTravellerDocumentApi({
            id: travellerId,
            requestBody: {
              ...formData,
              id: identificationId,
              expirationDate: formData?.expirationDate || "",
            },
          }).then((res) => {
            handlePutResponse(res, router, "../personal-identifications");
          });
        });
      }}
      schema={$UniRefund_TravellerService_TravellerDocuments_UpdateTravellerDocumentDto}
      submitText={languageData["Edit.Save"]}
      uiSchema={uiSchema}
      widgets={{
        countryWidget: CustomComboboxWidget<CountryDto>({
          languageData,
          list: countryList,
          selectIdentifier: "code2",
          selectLabel: "name",
        }),
      }}
    />
  );
}

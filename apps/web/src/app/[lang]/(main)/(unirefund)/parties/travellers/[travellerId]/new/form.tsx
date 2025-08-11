"use client";

import type {UniRefund_TravellerService_TravellerDocuments_CreateTravellerDocumentDto} from "@ayasofyazilim/saas/TravellerService";
import {$UniRefund_TravellerService_TravellerDocuments_CreateTravellerDocumentDto} from "@ayasofyazilim/saas/TravellerService";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {handlePostResponse} from "@repo/utils/api";
import {postTravellerDocumentApi} from "@repo/actions/unirefund/TravellerService/post-actions";
import type {CountryDto} from "@/utils/address-hook/types";
import type {TravellerServiceResource} from "src/language-data/unirefund/TravellerService";

export default function Form({
  languageData,
  travellerId,
  countryList,
}: {
  languageData: TravellerServiceResource;
  travellerId: string;
  countryList: CountryDto[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const uiSchema = createUiSchemaWithResource({
    schema: $UniRefund_TravellerService_TravellerDocuments_CreateTravellerDocumentDto,
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
    <SchemaForm<UniRefund_TravellerService_TravellerDocuments_CreateTravellerDocumentDto>
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
      onSubmit={({formData}) => {
        startTransition(() => {
          void postTravellerDocumentApi({
            id: travellerId,
            requestBody: formData,
          }).then((res) => {
            handlePostResponse(res, router, "../");
          });
        });
      }}
      schema={$UniRefund_TravellerService_TravellerDocuments_CreateTravellerDocumentDto}
      submitText={languageData.Save}
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

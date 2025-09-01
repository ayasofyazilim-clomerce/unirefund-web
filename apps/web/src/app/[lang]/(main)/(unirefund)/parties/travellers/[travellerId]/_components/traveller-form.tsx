"use client";
import type {
  UniRefund_TravellerService_Travellers_UpdateTravellerDto,
  UniRefund_TravellerService_Travellers_TravellerDetailProfileDto,
} from "@repo/saas/TravellerService";
import {$UniRefund_TravellerService_Travellers_UpdateTravellerDto} from "@repo/saas/TravellerService";
import {putTravellerApi} from "@repo/actions/unirefund/TravellerService/put-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {handlePutResponse} from "@repo/utils/api";
import {useParams, useRouter} from "next/navigation";
import {useTransition} from "react";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import type {TravellerServiceResource} from "@/language-data/unirefund/TravellerService";
import type {CountryDto} from "@/utils/address-hook/types";

export function EditTraveller({
  languageData,
  travellerDetails,
  countryList,
}: {
  languageData: TravellerServiceResource;
  travellerDetails: UniRefund_TravellerService_Travellers_TravellerDetailProfileDto;
  countryList: CountryDto[];
}) {
  const router = useRouter();
  const {travellerId} = useParams<{travellerId: string}>();
  const [isPending, startTransition] = useTransition();
  const uiSchema = createUiSchemaWithResource({
    resources: languageData,
    schema: $UniRefund_TravellerService_Travellers_UpdateTravellerDto,
    extend: {
      nationalityCountryCode2: {
        "ui:widget": "countryWidget",
      },
    },
  });
  return (
    <SchemaForm<UniRefund_TravellerService_Travellers_UpdateTravellerDto>
      disabled={isPending}
      formData={travellerDetails}
      onSubmit={({formData}) => {
        if (!formData) return;
        startTransition(() => {
          void putTravellerApi({
            id: travellerId,
            requestBody: formData,
          }).then((response) => {
            handlePutResponse(response, router);
          });
        });
      }}
      schema={$UniRefund_TravellerService_Travellers_UpdateTravellerDto}
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

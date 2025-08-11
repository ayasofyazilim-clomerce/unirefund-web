"use client";

import type {UniRefund_TravellerService_Travellers_CreateTravellerDto} from "@ayasofyazilim/saas/TravellerService";
import {$UniRefund_TravellerService_Travellers_CreateTravellerDto} from "@ayasofyazilim/saas/TravellerService";
import {postTravellerApi} from "@repo/actions/unirefund/TravellerService/post-actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {handlePostResponse} from "@repo/utils/api";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import type {CountryDto} from "@/utils/address-hook/types";
import type {TravellerServiceResource} from "src/language-data/unirefund/TravellerService";

export default function TravellerNewForm({
  languageData,
  countryList,
}: {
  languageData: TravellerServiceResource;
  countryList: CountryDto[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const uiSchema = createUiSchemaWithResource({
    schema: $UniRefund_TravellerService_Travellers_CreateTravellerDto,
    resources: languageData,
    extend: {
      "ui:className": "md:grid md:grid-cols-2 border rounded-md md:p-6 p-2 my-6 gap-y-6 gap-x-4",
      nationalityCountryCode2: {
        "ui:widget": "countryWidget",
      },
      travellerDocument: {
        "ui:className": "md:grid md:grid-cols-2 md:gap-4 md:col-span-full",
        residenceCountryCode2: {
          "ui:widget": "countryWidget",
        },
        nationalityCountryCode2: {
          "ui:widget": "countryWidget",
        },
      },
    },
  });

  return (
    <SchemaForm<UniRefund_TravellerService_Travellers_CreateTravellerDto>
      className="mx-auto flex max-w-6xl flex-col gap-0 p-0"
      defaultSubmitClassName="p-0"
      disabled={isPending}
      onSubmit={({formData}) => {
        startTransition(() => {
          void postTravellerApi({
            requestBody: formData,
          }).then((res) => {
            handlePostResponse(res, router, "../travellers");
          });
        });
      }}
      schema={$UniRefund_TravellerService_Travellers_CreateTravellerDto}
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

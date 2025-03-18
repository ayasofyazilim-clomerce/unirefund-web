"use client";

import type {UniRefund_TravellerService_Travellers_CreateTravellerDto} from "@ayasofyazilim/saas/TravellerService";
import {$UniRefund_TravellerService_Travellers_CreateTravellerDto} from "@ayasofyazilim/saas/TravellerService";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {CustomComboboxWidget} from "@repo/ayasofyazilim-ui/organisms/schema-form/widgets";
import {handlePostResponse} from "@repo/utils/api";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {postTravellerApi} from "@repo/actions/unirefund/TravellerService/post-actions";
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
      personalIdentification: {
        "ui:className": "md:grid md:grid-cols-2 md:gap-2",
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
      className="flex flex-col gap-4"
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

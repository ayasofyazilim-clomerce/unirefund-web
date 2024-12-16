"use client";

import { toast } from "@/components/ui/sonner";
import type { UniRefund_TravellerService_Travellers_CreateTravellerDto as TravellerDto } from "@ayasofyazilim/saas/TravellerService";
import { $UniRefund_TravellerService_Travellers_CreateTravellerDto } from "@ayasofyazilim/saas/TravellerService";
import { createZodObject } from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import AutoForm, {
  AutoFormSubmit,
  createFieldConfigWithResource,
  CustomCombobox,
} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import { useRouter } from "next/navigation";
import type { CountryDto } from "src/actions/unirefund/LocationService/types";
import { postTravellerApi } from "src/actions/unirefund/TravellerService/post-actions";
import type { TravellerServiceResource } from "src/language-data/unirefund/TravellerService";
import { getBaseLink } from "src/utils";

const createTravellerSchema = createZodObject(
  $UniRefund_TravellerService_Travellers_CreateTravellerDto,
);

export default function Form({
  languageData,
  countryList,
}: {
  languageData: TravellerServiceResource;
  countryList: { data: CountryDto[]; success: boolean };
}) {
  const router = useRouter();

  const translatedForm = createFieldConfigWithResource({
    schema: $UniRefund_TravellerService_Travellers_CreateTravellerDto,
    resources: languageData,
    extend: {
      personalIdentification: {
        residenceCountryCode2: {
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
        nationalityCountryCode2: {
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
    },
  });
  async function createTraveller(data: TravellerDto) {
    const response = await postTravellerApi({ requestBody: data });
    if (response.type === "error" || response.type === "api-error") {
      toast.error(response.message || languageData["Travellers.New.Error"]);
    } else {
      toast.success([languageData["Travellers.New.Succes"]]);
      router.push(getBaseLink(`/parties/traveller`));
    }
  }

  return (
    <AutoForm
      fieldConfig={translatedForm}
      formSchema={createTravellerSchema}
      onSubmit={(val) => {
        void createTraveller(val as TravellerDto);
      }}
      stickyChildren
    >
      <AutoFormSubmit className="float-right px-8 py-4">
        {languageData.Save}
      </AutoFormSubmit>
    </AutoForm>
  );
}

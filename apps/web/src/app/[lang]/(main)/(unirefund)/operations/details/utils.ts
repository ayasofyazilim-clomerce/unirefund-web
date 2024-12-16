import type { GetApiTravellerServiceTravellersData } from "@ayasofyazilim/saas/TravellerService";
import { $UniRefund_TravellerService_Travellers_TravellerListProfileDto } from "@ayasofyazilim/saas/TravellerService";
import type { ColumnFilter } from "@repo/ayasofyazilim-ui/molecules/tables/types";
import type { CountryDto } from "src/actions/unirefund/LocationService/types";
import type { TravellerServiceResource } from "src/language-data/unirefund/TravellerService";
import { getResourceDataClient } from "src/language-data/unirefund/TravellerService";

export type TravllersKeys =
  keyof typeof $UniRefund_TravellerService_Travellers_TravellerListProfileDto.properties;
const travellerKeys: TravllersKeys[] = [
  "id",
  "userAccountId",
  "firstName",
  "middleName",
  "lastName",
  "residenceCountryCode2",
  "nationalityCountryCode2",
  "hasUserAccount",
];

export const travellerTableSchema: {
  excludeList: TravllersKeys[];
  schema: typeof $UniRefund_TravellerService_Travellers_TravellerListProfileDto;
} = {
  excludeList: travellerKeys,
  schema: $UniRefund_TravellerService_Travellers_TravellerListProfileDto,
};
export type DetailedFilterTraveller = ColumnFilter & {
  name: keyof GetApiTravellerServiceTravellersData;
};
export function getTravellerFilterClient(
  lang: string,
  nationalitiesData: CountryDto[],
) {
  const languageData = getResourceDataClient(lang);
  return getTravellerFilters(languageData, nationalitiesData);
}

export function getTravellerFilters(
  languageData: TravellerServiceResource,
  nationalitiesData: CountryDto[],
) {
  const filters: DetailedFilterTraveller[] = [
    {
      name: "showExpired",
      displayName: languageData["Travellers.ShowExpired"],
      type: "boolean",
      value: "false",
    },
    {
      name: "travelDocumentNumber",
      displayName: languageData["Travellers.TravelDocumentNumber"],
      type: "string",
      value: "",
    },
    {
      name: "fullName",
      displayName: languageData.FullName,
      type: "string",
      value: "",
    },
    {
      name: "nationalities",
      displayName: languageData.Nationalities,
      type: "select-multiple",
      value: "",
      multiSelectProps: {
        options: [
          ...nationalitiesData.map((item) => ({
            label: item.name,
            value: item.code2,
          })),
        ],
      },
    },
    {
      name: "residences",
      displayName: languageData.Residences,
      type: "select-multiple",
      value: "",
      multiSelectProps: {
        options: [
          ...nationalitiesData.map((item) => ({
            label: item.name,
            value: item.code2,
          })),
        ],
      },
    },
  ];
  return filters;
}

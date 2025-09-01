"use server";

import { getAllCountriesApi } from "@repo/actions/unirefund/LocationService/actions";
import { getTravellersDetailsApi } from "@repo/actions/unirefund/TravellerService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import { structuredError } from "@repo/utils/api";
import { auth } from "@repo/utils/auth/next-auth";
import { isUnauthorized } from "@repo/utils/policies";
import { isRedirectError } from "next/dist/client/components/redirect";
import { getResourceData as getTravellerResourceData } from "src/language-data/unirefund/TravellerService";
import PartyHeader from "../../_components/party-header";
import { TravellerDocuments } from "./_components/traveller-documents"
import { EditTraveller } from "./_components/traveller-form";
import { TravellerContact } from "./_components/traveller-contact";

async function getApiRequests({ travellerId }: { travellerId: string }) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([getTravellersDetailsApi(travellerId, session)]);
    const optionalRequests = await Promise.allSettled([getAllCountriesApi({}, session)]);
    return { requiredRequests, optionalRequests };
  } catch (error) {
    if (!isRedirectError(error)) {
      return structuredError(error);
    }
    throw error;
  }
}
export default async function Page({
  params,
}: {
  params: {
    travellerId: string;
    lang: string;
  };
}) {
  const { lang, travellerId } = params;
  await isUnauthorized({
    requiredPolicies: ["TravellerService.Travellers.Detail"],
    lang,
  });
  const { languageData } = await getTravellerResourceData(lang);

  const apiRequests = await getApiRequests({ travellerId });
  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }
  const [travellerDataResponse] = apiRequests.requiredRequests;

  const [countriesResponse] = apiRequests.optionalRequests;

  return (
    <>
      <PartyHeader name={`${travellerDataResponse.data.firstName} ${travellerDataResponse.data.firstName}`} />
      <div className="grid w-full h-full overflow-hidden md:grid-cols-2">
        <EditTraveller
          countryList={countriesResponse.status === "fulfilled" ? countriesResponse.value.data.items || [] : []}
          languageData={languageData} travellerDetails={travellerDataResponse.data} />
        <div className="flex gap-4 flex-col overflow-auto h-full">
          <div className="max-h-full h-max">
            <TravellerDocuments
              countryList={countriesResponse.status === "fulfilled" ? countriesResponse.value.data.items || [] : []}
              languageData={languageData}
              travellerDetails={travellerDataResponse.data}
              travellerDocuments={travellerDataResponse.data.travellerDocuments || []}
            />
          </div>
          <TravellerContact
            params={params}
          />
        </div>
      </div>
    </>
  );
}

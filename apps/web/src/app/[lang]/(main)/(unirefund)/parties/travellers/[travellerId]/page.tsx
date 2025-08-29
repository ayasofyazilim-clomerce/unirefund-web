"use server";

import {$UniRefund_TravellerService_Travellers_CreateTravellerDto} from "@ayasofyazilim/unirefund-saas-dev/TravellerService";
import {getAllCountriesApi} from "@repo/actions/unirefund/LocationService/actions";
import {getTravellersDetailsApi} from "@repo/actions/unirefund/TravellerService/actions";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import ErrorComponent from "@repo/ui/components/error-component";
import {structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import {isRedirectError} from "next/dist/client/components/redirect";
import {getResourceData as getTravellerResourceData} from "src/language-data/unirefund/TravellerService";
import PartyHeader from "../../_components/party-header";
import {TravellerDocumentsForm} from "./identification-table";

async function getApiRequests({travellerId}: {travellerId: string}) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([getTravellersDetailsApi(travellerId, session)]);
    const optionalRequests = await Promise.allSettled([getAllCountriesApi({}, session)]);
    return {requiredRequests, optionalRequests};
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
  const {lang, travellerId} = params;
  await isUnauthorized({
    requiredPolicies: ["TravellerService.Travellers.Detail"],
    lang,
  });
  const {languageData} = await getTravellerResourceData(lang);

  const apiRequests = await getApiRequests({travellerId});
  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }
  const [travellerDataResponse] = apiRequests.requiredRequests;
  const uiSchema = createUiSchemaWithResource({
    resources: languageData,
    schema: $UniRefund_TravellerService_Travellers_CreateTravellerDto,
  });
  const [countriesResponse] = apiRequests.optionalRequests;

  return (
    <>
      <PartyHeader name={`${travellerDataResponse.data.firstName} ${travellerDataResponse.data.firstName}`} />
      <div className="grid w-full overflow-hidden md:grid-cols-2">
        <SchemaForm
          filter={{
            keys: ["id", "fullName", "userAccountId", "identificationType", "travellerDocument"],
            type: "exclude",
          }}
          formData={travellerDataResponse.data}
          schema={$UniRefund_TravellerService_Travellers_CreateTravellerDto}
          uiSchema={uiSchema}
        />
        <div className="grid gap-4 self-start">
          <TravellerDocumentsForm
            countryList={countriesResponse.status === "fulfilled" ? countriesResponse.value.data.items || [] : []}
            languageData={languageData}
            travellerDetails={travellerDataResponse.data}
            travellerDocuments={travellerDataResponse.data.travellerDocuments || []}
          />
        </div>
      </div>
    </>
  );
}

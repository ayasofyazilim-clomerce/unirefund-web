"use server";

import {auth} from "@repo/utils/auth/next-auth";
import ErrorComponent from "@repo/ui/components/error-component";
import {getRefundPointAddressByIdApi} from "@repo/actions/unirefund/CrmService/actions";
import {getAllCountriesApi} from "@repo/actions/unirefund/LocationService/actions";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import AddressForm from "./form";

async function getApiRequests({partyId}: {partyId: string}) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([
      getRefundPointAddressByIdApi(partyId, session),
      getAllCountriesApi({}, session),
    ]);
    return {
      type: "success" as const,
      data: apiRequests,
    };
  } catch (error) {
    const err = error as {data?: string; message?: string};
    return {
      type: "error" as const,
      message: err.message,
    };
  }
}
export default async function Page({
  params,
}: {
  params: {
    partyId: string;
    lang: string;
  };
}) {
  const {partyId, lang} = params;
  const {languageData} = await getResourceData(lang);

  const apiRequests = await getApiRequests({partyId});
  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }

  const [addressResponse, countriesResponse] = apiRequests.data;

  return (
    <AddressForm
      addressResponse={addressResponse.data}
      countryList={countriesResponse.data.items || []}
      languageData={languageData}
      partyId={partyId}
    />
  );
}

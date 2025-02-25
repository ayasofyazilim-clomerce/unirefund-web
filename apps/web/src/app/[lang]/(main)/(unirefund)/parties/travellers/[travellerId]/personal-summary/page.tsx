"use server";

import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import ErrorComponent from "@repo/ui/components/error-component";
import {getTravellersDetailsApi} from "@/actions/unirefund/TravellerService/actions";
import {getResourceData} from "src/language-data/unirefund/TravellerService";
import Form from "./form";

async function getApiRequests(travellerId: string) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([getTravellersDetailsApi(travellerId, session)]);
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
    travellerId: string;
    lang: string;
  };
}) {
  const {lang, travellerId} = params;
  await isUnauthorized({
    requiredPolicies: ["TravellerService.Travellers.Edit"],
    lang,
  });
  const {languageData} = await getResourceData(lang);

  const apiRequests = await getApiRequests(travellerId);

  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }

  const [travellerDataResponse] = apiRequests.data;

  return <Form languageData={languageData} travellerData={travellerDataResponse.data} travellerId={travellerId} />;
}

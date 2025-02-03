"use server";

import { auth } from "@repo/utils/auth/next-auth";
import { getTravellersDetailsApi } from "@/actions/unirefund/TravellerService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/unirefund/TravellerService";
import { isUnauthorized } from "@/utils/page-policy/page-policy";
import Form from "./form";

async function getApiRequests(travellerId: string) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([
      getTravellersDetailsApi(travellerId, session),
    ]);
    return {
      type: "success" as const,
      data: apiRequests,
    };
  } catch (error) {
    const err = error as { data?: string; message?: string };
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
  const { lang, travellerId } = params;
  await isUnauthorized({
    requiredPolicies: ["TravellerService.Travellers.Edit"],
    lang,
  });
  const { languageData } = await getResourceData(lang);

  const apiRequests = await getApiRequests(travellerId);

  if (apiRequests.type === "error") {
    return (
      <ErrorComponent
        languageData={languageData}
        message={apiRequests.message || "Unknown error occurred"}
      />
    );
  }

  const [travellerDataResponse] = apiRequests.data;

  return (
    <Form
      languageData={languageData}
      travellerData={travellerDataResponse.data}
      travellerId={travellerId}
    />
  );
}

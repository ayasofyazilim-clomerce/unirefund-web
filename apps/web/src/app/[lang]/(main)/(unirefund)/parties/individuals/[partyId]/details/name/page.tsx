"use server";

import {isUnauthorized} from "@repo/utils/policies";
import {auth} from "@repo/utils/auth/next-auth";
import {getIndividualNameByIdApi} from "src/actions/unirefund/CrmService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import NameForm from "./form";

async function getApiRequests({partyId}: {partyId: string}) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([getIndividualNameByIdApi(partyId, session)]);
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
  await isUnauthorized({
    requiredPolicies: ["CRMService.Individuals.Edit"],
    lang,
  });
  const apiRequests = await getApiRequests({partyId});
  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }
  const [individualNameResponse] = apiRequests.data;

  return <NameForm individualNameData={individualNameResponse.data} languageData={languageData} partyId={partyId} />;
}

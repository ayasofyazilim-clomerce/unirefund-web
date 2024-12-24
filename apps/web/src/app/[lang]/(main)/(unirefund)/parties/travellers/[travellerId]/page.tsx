"use server";

import { getTravellersDetailsApi } from "src/actions/unirefund/TravellerService/actions";
import { getResourceData } from "src/language-data/unirefund/TravellerService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import Form from "./form";

export default async function Page({
  params,
}: {
  params: { travellerId: string; lang: string };
}) {
  const { lang, travellerId } = params;
  await isUnauthorized({
    requiredPolicies: ["TravellerService.Travellers"],
    lang,
  });

  const travellerDetailsData = await getTravellersDetailsApi(travellerId);
  if (isErrorOnRequest(travellerDetailsData, lang)) return;
  const { languageData } = await getResourceData(lang);

  return (
    <>
      <Form
        languageData={languageData}
        travellerData={travellerDetailsData.data}
        travellerId={travellerId}
      />
      <div className="hidden" id="page-title">
        {`${languageData.Traveller} (${travellerDetailsData.data.personalIdentifications[0].fullName})`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["Travellers.Edit.Description"]}
      </div>
    </>
  );
}

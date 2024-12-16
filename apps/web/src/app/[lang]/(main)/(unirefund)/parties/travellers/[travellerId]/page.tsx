"use server";

import { notFound } from "next/navigation";
import { getTravellersDetailsApi } from "src/actions/unirefund/TravellerService/actions";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { getResourceData } from "src/language-data/unirefund/TravellerService";
import Form from "./form";

export default async function Page({
  params,
}: {
  params: { travellerId: string; lang: string };
}) {
  await isUnauthorized({
    requiredPolicies: ["TravellerService.Travellers"],
    lang: params.lang,
  });

  const { languageData } = await getResourceData(params.lang);
  const traveller = await getTravellersDetailsApi(params.travellerId);

  if (traveller.type !== "success") return notFound();
  const travellerData = traveller.data;

  return (
    <>
      <Form
        languageData={languageData}
        travellerData={travellerData}
        travellerId={params.travellerId}
      />
      <div className="hidden" id="page-title">
        {`${languageData.Traveller} (${travellerData.personalIdentifications[0].fullName})`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["Travellers.Edit.Description"]}
      </div>
    </>
  );
}

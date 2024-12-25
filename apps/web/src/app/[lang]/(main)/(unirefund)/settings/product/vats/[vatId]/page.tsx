"use server";

import { getVatDetailsByIdApi } from "src/actions/unirefund/SettingService/actions";
import { getResourceData } from "src/language-data/unirefund/SettingService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import Form from "./form";

export default async function Page({
  params,
}: {
  params: { lang: string; vatId: string };
}) {
  const { lang, vatId } = params;
  await isUnauthorized({
    requiredPolicies: ["SettingService.Vats.Edit"],
    lang,
  });
  const vatDetailsResponse = await getVatDetailsByIdApi(vatId);
  if (isErrorOnRequest(vatDetailsResponse, lang)) return;
  const { languageData } = await getResourceData(lang);
  return (
    <>
      <Form languageData={languageData} response={vatDetailsResponse.data} />
      <div className="hidden" id="page-description">
        {languageData["Vats.Edit.Description"]}
      </div>
    </>
  );
}

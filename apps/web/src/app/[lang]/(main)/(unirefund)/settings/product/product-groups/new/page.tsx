"use server";

import { getVatsApi } from "src/actions/unirefund/SettingService/actions";
import { getResourceData } from "src/language-data/unirefund/SettingService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import Form from "./_components/form";

export default async function Page({ params }: { params: { lang: string } }) {
  const { lang } = params;
  await isUnauthorized({
    requiredPolicies: ["SettingService.ProductGroups.Add"],
    lang,
  });
  const vatsResponse = await getVatsApi({
    maxResultCount: 1000,
  });
  if (isErrorOnRequest(vatsResponse, lang)) return;
  const { languageData } = await getResourceData(lang);
  return (
    <>
      <Form
        languageData={languageData}
        vatList={vatsResponse.data.items || []}
      />
      <div className="hidden" id="page-description">
        {languageData["ProductGroups.Create.Description"]}
      </div>
    </>
  );
}

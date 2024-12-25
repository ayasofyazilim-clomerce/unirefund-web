"use server";

import { getResourceData } from "src/language-data/unirefund/SettingService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import Form from "./form";

export default async function Page({ params }: { params: { lang: string } }) {
  const { lang } = params;
  await isUnauthorized({
    requiredPolicies: ["SettingService.Vats.Add"],
    lang,
  });
  const { languageData } = await getResourceData(lang);
  return (
    <>
      <Form languageData={languageData} />
      <div className="hidden" id="page-description">
        {languageData["Vats.Create.Description"]}
      </div>
    </>
  );
}

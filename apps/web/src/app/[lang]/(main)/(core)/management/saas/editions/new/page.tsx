"use server";

import {isUnauthorized} from "@repo/utils/policies";
import {getResourceData} from "src/language-data/core/SaasService";
import Form from "./_components/form";

export default async function Page({params}: {params: {lang: string}}) {
  const {lang} = params;
  await isUnauthorized({
    requiredPolicies: ["Saas.Editions.Create"],
    lang,
  });
  const {languageData} = await getResourceData(lang);
  return (
    <>
      <Form languageData={languageData} />
      <div className="hidden" id="page-description">
        {languageData["Edition.Create.Description"]}
      </div>
    </>
  );
}

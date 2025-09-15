"use server";

import {isUnauthorized} from "@repo/utils/policies";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import CreateCustomForm from "../_components/create-form";

export default async function Page({
  params,
}: {
  params: {
    lang: string;
  };
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["CRMService.Customs.Create"],
    lang,
  });

  return <CreateCustomForm languageData={languageData} />;
}

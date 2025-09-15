"use server";

import {isUnauthorized} from "@repo/utils/policies";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import {CreateIndividualForm} from "../_components/create-form";

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
    requiredPolicies: ["CRMService.Individuals.Create"],
    lang,
  });

  return <CreateIndividualForm languageData={languageData} />;
}

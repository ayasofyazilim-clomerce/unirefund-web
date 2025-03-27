"use server";

import {isUnauthorized} from "@repo/utils/policies";
import {getResourceData} from "src/language-data/unirefund/TagService";
import Filter from "./_components/filter";

export default async function Page({params}: {params: {lang: string}}) {
  const {lang} = params;
  await isUnauthorized({
    requiredPolicies: ["TagService.Tags"],
    lang,
  });

  const {languageData} = await getResourceData(lang);
  return (
    <div className="flex h-full flex-col overflow-auto">
      <Filter languageData={languageData} />
    </div>
  );
}

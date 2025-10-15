"use server";

import {isUnauthorized} from "@repo/utils/policies";
import {getResourceData} from "src/language-data/unirefund/TagService";
import ClientPage from "./client";

export default async function Page({params}: {params: {lang: string}}) {
  const {lang} = params;
  await isUnauthorized({
    requiredPolicies: ["TagService.Tags"],
    lang,
  });

  const {languageData} = await getResourceData(lang);
  return (
    <div className="mt-6 flex h-full flex-col overflow-auto md:mx-auto md:w-1/2">
      <ClientPage languageData={languageData} />
    </div>
  );
}

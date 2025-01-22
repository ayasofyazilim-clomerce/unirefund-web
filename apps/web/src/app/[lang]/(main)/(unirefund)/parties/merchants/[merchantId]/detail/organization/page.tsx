"use server";

import { getResourceData } from "src/language-data/unirefund/CRMService";

export default async function Page({ lang }: { lang: string }) {
  const { languageData } = await getResourceData(lang);
  return <div>{languageData["Parties.Organization"]}</div>;
}

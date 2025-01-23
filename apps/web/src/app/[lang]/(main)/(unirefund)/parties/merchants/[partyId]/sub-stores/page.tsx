"use server";

import { getResourceData } from "src/language-data/unirefund/CRMService";

export default async function Page({
  params,
}: {
  params: {
    merchantId: string;
    lang: string;
  };
}) {
  const { lang } = params;
  const { languageData } = await getResourceData(lang);
  return <div>{languageData["Merchants.SubOrganization"]}</div>;
}

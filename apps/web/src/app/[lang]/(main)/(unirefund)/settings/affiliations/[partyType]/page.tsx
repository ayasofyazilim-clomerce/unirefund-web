"use server";

import { getAffiliationCodeApi } from "src/actions/unirefund/CrmService/actions";
import { getResourceData } from "src/language-data/unirefund/CRMService";
import AffiliationsTable from "./table";

export default async function Page({
  params,
}: {
  params: {
    lang: string;
  };
}) {
  const { languageData } = await getResourceData(params.lang);
  const affiliationCodesResponse = await getAffiliationCodeApi();

  const affiliationCodes =
    affiliationCodesResponse.type === "success"
      ? affiliationCodesResponse.data
      : { items: [], totalCount: 0 };

  return (
    <AffiliationsTable
      languageData={languageData}
      locale={params.lang}
      response={affiliationCodes}
    />
  );
}

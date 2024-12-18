"use server";

import { getVatStatementHeadersDetailApi } from "src/actions/unirefund/FinanceService/actions";
import { getResourceData } from "src/language-data/unirefund/FinanceService";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import PageClientSide from "./page-client";

export default async function Page({
  params,
}: {
  params: { vatStatementId: string; lang: string };
}) {
  const { vatStatementId, lang } = params;
  const { languageData } = await getResourceData(lang);
  const vatStatementHeadersData =
    await getVatStatementHeadersDetailApi(vatStatementId);
  if (isErrorOnRequest(vatStatementHeadersData, lang)) return;

  return (
    <PageClientSide
      languageData={languageData}
      vatStatementHeadersData={vatStatementHeadersData.data}
    />
  );
}

"use server";

import type {GetApiFinanceServiceVatStatementHeadersData} from "@ayasofyazilim/saas/FinanceService";
import {isUnauthorized} from "@repo/utils/policies";
import {getVatStatementHeadersApi} from "src/actions/unirefund/FinanceService/actions";
import {getResourceData} from "src/language-data/unirefund/FinanceService";
import {isErrorOnRequest} from "src/utils/page-policy/utils";
import ErrorComponent from "../../../_components/error-component";
import VatStatementTable from "./_components/table";

export default async function Page({
  params,
  searchParams,
}: {
  params: {
    lang: string;
  };
  searchParams: GetApiFinanceServiceVatStatementHeadersData;
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["FinanceService.VATStatementHeaders"],
    lang,
  });
  const vatStatementHeadersResponse = await getVatStatementHeadersApi(searchParams);
  if (isErrorOnRequest(vatStatementHeadersResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={vatStatementHeadersResponse.message} />;
  }

  return <VatStatementTable languageData={languageData} locale={lang} response={vatStatementHeadersResponse.data} />;
}

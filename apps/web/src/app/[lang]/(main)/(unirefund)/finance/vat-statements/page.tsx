"use server";

import type { GetApiFinanceServiceVatStatementHeadersData } from "@ayasofyazilim/saas/FinanceService";
import { getVatStatementHeadersApi } from "src/actions/unirefund/FinanceService/actions";
import { getResourceData } from "src/language-data/unirefund/FinanceService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import BillingTable from "./table";

export default async function Page(props: {
  params: { lang: string };
  searchParams: Promise<GetApiFinanceServiceVatStatementHeadersData>;
}) {
  await isUnauthorized({
    requiredPolicies: [
      "FinanceService.Billings",
      "FinanceService.VATStatementHeader",
    ],
    lang: props.params.lang,
  });

  const searchParams = await props.searchParams;
  const response = await getVatStatementHeadersApi(searchParams);
  const { languageData } = await getResourceData(props.params.lang);
  if (isErrorOnRequest(response, props.params.lang)) return;

  return (
    <BillingTable
      languageData={languageData}
      locale={props.params.lang}
      response={response.data}
    />
  );
}

"use server";

import { notFound } from "next/navigation";
import type { GetApiFinanceServiceVatStatementHeadersData } from "@ayasofyazilim/saas/FinanceService";
import { getResourceData } from "src/language-data/unirefund/FinanceService";
import { getVatStatementHeadersApi } from "src/actions/unirefund/FinanceService/actions";
import BillingTable from "./table";

export default async function Page(props: {
  params: { lang: string };
  searchParams: Promise<GetApiFinanceServiceVatStatementHeadersData>;
}) {
  const searchParams = await props.searchParams;
  const response = await getVatStatementHeadersApi(searchParams);
  if (response.type !== "success") return notFound();
  const { languageData } = await getResourceData(props.params.lang);

  return (
    <BillingTable
      languageData={languageData}
      locale={props.params.lang}
      response={response.data}
    />
  );
}

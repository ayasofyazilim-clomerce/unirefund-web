"use server";

import type { GetApiFinanceServiceBillingsData } from "@ayasofyazilim/saas/FinanceService";
import { notFound } from "next/navigation";
import { getResourceData } from "src/language-data/unirefund/FinanceService";
import { getBillingApi } from "src/actions/unirefund/FinanceService/actions";
import BillingTable from "./table";

export default async function Page(props: {
  params: { lang: string };
  searchParams: Promise<GetApiFinanceServiceBillingsData>;
}) {
  const searchParams = await props.searchParams;
  const response = await getBillingApi(searchParams);
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

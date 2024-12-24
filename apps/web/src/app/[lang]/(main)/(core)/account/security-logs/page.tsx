"use server";

import type { GetApiAccountSecurityLogsData } from "@ayasofyazilim/saas/AccountService";
import { getSecurityLogsApi } from "src/actions/core/AccountService/actions";
import { getResourceData } from "src/language-data/core/AccountService";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import SecurityLogsTable from "./table";

export default async function Page({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams: GetApiAccountSecurityLogsData;
}) {
  const response = await getSecurityLogsApi(searchParams);
  const { languageData } = await getResourceData(params.lang);
  if (isErrorOnRequest(response, params.lang)) return;

  return (
    <SecurityLogsTable languageData={languageData} response={response.data} />
  );
}

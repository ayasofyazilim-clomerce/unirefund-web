"use server";

import type {GetApiAccountSessionsData} from "@ayasofyazilim/saas/AccountService";
import {getSessionsApi} from "src/actions/core/AccountService/actions";
import {getResourceData} from "src/language-data/core/AccountService";
import {isErrorOnRequest} from "src/utils/page-policy/utils";
import SessionsTable from "./table";

export default async function Page({
  params,
  searchParams,
}: {
  params: {lang: string};
  searchParams: GetApiAccountSessionsData;
}) {
  const {lang} = params;
  const response = await getSessionsApi(searchParams);
  const {languageData} = await getResourceData(lang);
  if (isErrorOnRequest(response, lang)) return;

  return <SessionsTable languageData={languageData} response={response.data} />;
}

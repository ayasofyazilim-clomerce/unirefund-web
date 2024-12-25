"use server";

import type { GetApiSettingServiceVatData } from "@ayasofyazilim/saas/SettingService";
import { getVatsApi } from "src/actions/unirefund/SettingService/actions";
import { getResourceData } from "src/language-data/unirefund/SettingService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import VatsTable from "./table";

export default async function Page({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams: GetApiSettingServiceVatData;
}) {
  const { lang } = params;
  await isUnauthorized({ requiredPolicies: ["SettingService.Vats"], lang });
  const vatsResponse = await getVatsApi(searchParams);
  if (isErrorOnRequest(vatsResponse, lang)) return;
  const { languageData } = await getResourceData(lang);

  return <VatsTable languageData={languageData} response={vatsResponse.data} />;
}

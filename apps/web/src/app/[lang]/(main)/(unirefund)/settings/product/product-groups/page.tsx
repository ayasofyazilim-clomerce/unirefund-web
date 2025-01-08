"use server";

import type { GetApiSettingServiceProductGroupData } from "@ayasofyazilim/saas/SettingService";
import { getProductGroupsApi } from "src/actions/unirefund/SettingService/actions";
import { getResourceData } from "src/language-data/unirefund/SettingService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import ProductGroupsTable from "./_components/table";

export default async function Page({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams: GetApiSettingServiceProductGroupData;
}) {
  const { lang } = params;
  await isUnauthorized({
    requiredPolicies: ["SettingService.ProductGroups"],
    lang,
  });
  const productGroupsResponse = await getProductGroupsApi(searchParams);
  if (isErrorOnRequest(productGroupsResponse, lang)) return;
  const { languageData } = await getResourceData(lang);

  return (
    <ProductGroupsTable
      languageData={languageData}
      response={productGroupsResponse.data}
    />
  );
}

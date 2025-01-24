"use server";

import { auth } from "@repo/utils/auth/next-auth";
import { getMerchantsByIdProductGroupApi } from "src/actions/unirefund/CrmService/actions";
import { getProductGroupsApi } from "src/actions/unirefund/SettingService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/unirefund/CRMService";
import ProductGroups from "./table";

async function getApiRequests(partyId: string) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([
      await getMerchantsByIdProductGroupApi(partyId, session),
      await getProductGroupsApi(
        {
          maxResultCount: 1000,
        },
        session,
      ),
    ]);
    return {
      type: "success" as const,
      data: apiRequests,
    };
  } catch (error) {
    const err = error as { data?: string; message?: string };
    return {
      type: "error" as const,
      message: err.message,
    };
  }
}
export default async function Page({
  params,
}: {
  params: {
    partyId: string;
    lang: string;
  };
}) {
  const { lang, partyId } = params;
  const { languageData } = await getResourceData(lang);

  const apiRequests = await getApiRequests(partyId);

  if (apiRequests.type === "error") {
    return (
      <ErrorComponent
        languageData={languageData}
        message={apiRequests.message || "Unknown error occurred"}
      />
    );
  }

  const [productGroupsResponse, productGroupListResponse] = apiRequests.data;
  return (
    <ProductGroups
      languageData={languageData}
      productGroupList={productGroupListResponse.data.items || []}
      response={productGroupsResponse.data}
    />
  );
}

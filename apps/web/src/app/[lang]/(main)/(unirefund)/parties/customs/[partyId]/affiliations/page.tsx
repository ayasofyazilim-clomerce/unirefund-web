"use server";

import { auth } from "@repo/utils/auth/next-auth";
import { isUnauthorized } from "@/utils/page-policy/page-policy";
import {
  getAffiliationCodeApi,
  getCustomAffiliationByIdApi,
} from "src/actions/unirefund/CrmService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/unirefund/CRMService";
import AffiliationsTable from "./table";

interface SearchParamType {
  affiliationCodeId?: number;
  email?: string;
  entityInformationTypeCode?: "INDIVIDUAL" | "ORGANIZATION";
  id: string;
  maxResultCount?: number;
  name?: string;
  skipCount?: number;
  sorting?: string;
  telephone?: string;
}

async function getApiRequests(filters: SearchParamType) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([
      getCustomAffiliationByIdApi(filters, session),
      getAffiliationCodeApi(
        { entityPartyTypeCode: "TAXOFFICE", maxResultCount: 1000 },
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
  searchParams,
}: {
  params: {
    partyId: string;
    lang: string;
  };
  searchParams?: SearchParamType;
}) {
  const { lang, partyId } = params;
  const { languageData } = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["CRMService.Customs.ViewAffiliationList"],
    lang,
  });

  const apiRequests = await getApiRequests({
    ...searchParams,
    id: partyId,
  });

  if (apiRequests.type === "error") {
    return (
      <ErrorComponent
        languageData={languageData}
        message={apiRequests.message || "Unknown error occurred"}
      />
    );
  }

  const [subStoresResponse, affiliationCodesResponse] = apiRequests.data;

  return (
    <AffiliationsTable
      affiliationCodes={affiliationCodesResponse.data.items || []}
      languageData={languageData}
      locale={lang}
      partyId={partyId}
      response={subStoresResponse.data}
    />
  );
}

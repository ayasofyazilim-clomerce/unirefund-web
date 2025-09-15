"use server";

import { getTaxFreeByIdApi } from "@repo/actions/unirefund/CrmService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import { structuredError } from "@repo/utils/api";
import { auth } from "@repo/utils/auth/next-auth";
import { isUnauthorized } from "@repo/utils/policies";
import { isRedirectError } from "next/dist/client/components/redirect";
import { getResourceData } from "src/language-data/unirefund/CRMService";
import CreateSubTaxFreeForm from "../../../_components/create-form";

async function getApiRequests(partyId: string) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([getTaxFreeByIdApi(partyId, session)]);
    const optionalRequests = await Promise.allSettled([]);
    return { requiredRequests, optionalRequests };
  } catch (error) {
    if (!isRedirectError(error)) {
      return structuredError(error);
    }
    throw error;
  }
}

export default async function Page({
  params,
}: {
  params: {
    lang: string;
    partyId: string;
  };
}) {
  const { lang, partyId } = params;
  const { languageData } = await getResourceData(lang);

  await isUnauthorized({
    requiredPolicies: ["CRMService.TaxFrees.Create"],
    lang,
  });

  const apiRequests = await getApiRequests(partyId);
  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }

  const [taxFreeResponse] = apiRequests.requiredRequests;

  return (
    <CreateSubTaxFreeForm
      formData={{
        typeCode: "TAXFREE",
        parentId: partyId,
      }}
      languageData={languageData}
      parentDetails={taxFreeResponse.data}
      typeCode="TAXFREE"
    />
  );
}

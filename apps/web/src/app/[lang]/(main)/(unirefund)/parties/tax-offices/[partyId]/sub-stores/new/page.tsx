"use server";

import {isUnauthorized} from "@repo/utils/policies";
import {getTaxOfficeByIdApi} from "@repo/actions/unirefund/CrmService/actions";
import {auth} from "@repo/utils/auth/next-auth";
import {isRedirectError} from "next/dist/client/components/redirect";
import {structuredError} from "@repo/utils/api";
import ErrorComponent from "@repo/ui/components/error-component";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import CreateSubTaxOfficeForm from "../../../_components/create-form";

async function getApiRequests(partyId: string) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([getTaxOfficeByIdApi(partyId, session)]);
    const optionalRequests = await Promise.allSettled([]);
    return {requiredRequests, optionalRequests};
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
  const {lang, partyId} = params;
  const {languageData} = await getResourceData(lang);

  await isUnauthorized({
    requiredPolicies: ["CRMService.TaxOffices.Create"],
    lang,
  });

  const apiRequests = await getApiRequests(partyId);
  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }

  const [taxOfficeResponse] = apiRequests.requiredRequests;
  return (
    <CreateSubTaxOfficeForm
      formData={{
        name: " ",
        typeCode: "TAXOFFICE",
        parentId: partyId,
      }}
      languageData={languageData}
      parentDetails={taxOfficeResponse.data}
      typeCode="TAXOFFICE"
    />
  );
}

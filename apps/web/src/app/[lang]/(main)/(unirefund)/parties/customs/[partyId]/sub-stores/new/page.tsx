"use server";

import {getCustomsApi} from "@repo/actions/unirefund/CrmService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {isRedirectError} from "next/dist/client/components/redirect";
import {getResourceData} from "src/language-data/unirefund/CRMService";
// import {isUnauthorized} from "@repo/utils/policies";
import CreateSubTaxFreeForm from "../../../_components/create-form";

async function getApiRequests() {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([
      getCustomsApi(
        {
          typeCodes: ["HEADQUARTER"],
        },
        session,
      ),
    ]);
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

  // await isUnauthorized({
  //   requiredPolicies: ["CRMService.TaxFrees.Create"],
  //   lang,
  // });

  const apiRequests = await getApiRequests();
  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }

  const [customResponse] = apiRequests.requiredRequests;

  return (
    <CreateSubTaxFreeForm
      customList={customResponse.data.items || []}
      formData={{
        name: " ",
        typeCode: "CUSTOM",
        parentId: partyId,
      }}
      languageData={languageData}
      typeCode="CUSTOM"
    />
  );
}

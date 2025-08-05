"use server";

import {getCustomsApi} from "@repo/actions/unirefund/CrmService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {isRedirectError} from "next/dist/client/components/redirect";
import {getResourceData} from "src/language-data/unirefund/CRMService";
// import {isUnauthorized} from "@repo/utils/policies";
import CreateCustomForm from "../_components/create-form";

async function getApiRequests() {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([]);
    const optionalRequests = await Promise.allSettled([
      getCustomsApi(
        {
          typeCodes: ["HEADQUARTER"],
        },
        session,
      ),
    ]);
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
  };
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  // await isUnauthorized({
  //   requiredPolicies: ["CRMService.Customs.  Create"],
  //   lang,
  // });

  const apiRequests = await getApiRequests();
  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }

  const [customResponse] = apiRequests.optionalRequests;

  const customList = customResponse.status === "fulfilled" ? customResponse.value.data.items || [] : [];
  return <CreateCustomForm languageData={languageData} customList={customList} />;
}

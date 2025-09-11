import {getTagsApi} from "@repo/actions/unirefund/TagService/actions";
import {getResourceData} from "src/language-data/unirefund/SSRService";
import HomePageClient from "./client";
import type {GetApiTagServiceTagData} from "@repo/saas/TagService";
import ErrorComponent from "@repo/ui/components/error-component";
import {structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {isRedirectError} from "next/dist/client/components/redirect";

async function getApiRequests(filters: GetApiTagServiceTagData) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([getTagsApi(filters, session)]);
    const optionalRequests = await Promise.allSettled([]);
    return {requiredRequests, optionalRequests};
  } catch (error) {
    if (!isRedirectError(error)) {
      return structuredError(error);
    }
    throw error;
  }
}

export default async function Home({
  params,
}: {
  params: {
    lang: string;
  };
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);

  const apiRequests = await getApiRequests({} as GetApiTagServiceTagData);

  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }

  const [tagsResponse] = apiRequests.requiredRequests;

  return <HomePageClient languageData={languageData} tagsResponse={tagsResponse} />;
}

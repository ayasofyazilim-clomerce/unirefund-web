import {getTagByIdApi} from "@repo/actions/unirefund/TagService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {structuredError} from "@repo/utils/api";
import {isRedirectError} from "next/dist/client/components/redirect";
import {getResourceData} from "src/language-data/unirefund/SSRService";
import TagDetailClient from "./client";

async function getApiRequests(id: string) {
  try {
    const requiredRequests = await Promise.all([getTagByIdApi({id})]);
    const optionalRequests = await Promise.allSettled([]);
    return {requiredRequests, optionalRequests};
  } catch (error) {
    if (!isRedirectError(error)) {
      return structuredError(error);
    }
    throw error;
  }
}

export default async function TagDetailPage({
  params,
}: {
  params: {
    lang: string;
    id: string;
  };
}) {
  const {lang, id} = params;
  const {languageData} = await getResourceData(lang);

  const apiRequests = await getApiRequests(id);

  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }

  const [tagsResponse] = apiRequests.requiredRequests;

  return <TagDetailClient lang={lang} languageData={languageData} tagsResponse={tagsResponse.data} />;
}

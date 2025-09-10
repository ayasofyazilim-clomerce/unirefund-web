"use server";

import type {GetApiFileServiceMimeTypesData} from "@repo/saas/FileService";
import {getMimeTypesApi} from "@repo/actions/unirefund/FileService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {isRedirectError} from "next/dist/client/components/redirect";
import {getResourceData} from "@/language-data/core/Default";
import MimeTypesTable from "./_components/table";

async function getApiRequests(filters: GetApiFileServiceMimeTypesData) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([getMimeTypesApi(filters, session)]);
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
  searchParams,
}: {
  params: {
    lang: string;
  };
  searchParams?: GetApiFileServiceMimeTypesData;
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);

  const apiRequests = await getApiRequests({
    ...searchParams,
  });

  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }
  const [mimeTypeResponse] = apiRequests.requiredRequests;

  return <MimeTypesTable languageData={languageData} locale={lang} response={mimeTypeResponse.data} />;
}

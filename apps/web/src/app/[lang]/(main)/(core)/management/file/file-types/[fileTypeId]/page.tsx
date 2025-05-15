"use server";

import {getFileTypeGroupsApi, getFileTypesApi, getProvidersApi} from "@repo/actions/unirefund/FileService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import {isRedirectError, permanentRedirect} from "next/dist/client/components/redirect";
import {getResourceData} from "src/language-data/unirefund/FileService";
import EditForm from "./_components/form-edit";
import NewForm from "./_components/form-new";

async function getApiRequests(fileTypeId: string) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([
      getFileTypeGroupsApi({}, session),
      getProvidersApi({}, session),
      fileTypeId !== "new" ? getFileTypesApi({id: fileTypeId}, session) : Promise.resolve({data: {items: []}}),
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

export default async function Page({params}: {params: {lang: string; fileTypeId: string}}) {
  const {lang, fileTypeId} = params;
  await isUnauthorized({
    requiredPolicies: ["FileService.FileType.Save"],
    lang,
  });
  const {languageData} = await getResourceData(lang);

  const apiRequests = await getApiRequests(fileTypeId);

  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }
  const [fileTypeGroupResponse, providerResponse, fileTypeResponse] = apiRequests.requiredRequests;
  const fileTypeData = fileTypeResponse.data.items?.[0];
  const fileTypeGroupData = fileTypeGroupResponse.data.items || [];
  const providerData = providerResponse.data.items || [];

  if (fileTypeId === "new") {
    return <NewForm fileTypeGroupData={fileTypeGroupData} languageData={languageData} providerData={providerData} />;
  }
  if (!fileTypeData) {
    return permanentRedirect(`/${lang}/management/file/file-types`);
  }
  return (
    <EditForm
      fileTypeData={fileTypeData}
      fileTypeGroupData={fileTypeGroupData}
      languageData={languageData}
      providerData={providerData}
    />
  );
}

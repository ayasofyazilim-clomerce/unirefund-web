"use server";

import {getFileRelationEntitiesApi, getFileTypesApi} from "@repo/actions/unirefund/FileService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import {isRedirectError, permanentRedirect} from "next/dist/client/components/redirect";
import {getResourceData} from "src/language-data/unirefund/FileService";
import EditForm from "./_components/form-edit";
import Newform from "./_components/form-new";

async function getApiRequests(fileRelationEntityId: string) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([
      getFileTypesApi({maxResultCount: 100}, session),
      fileRelationEntityId !== "new"
        ? getFileRelationEntitiesApi({id: fileRelationEntityId}, session)
        : Promise.resolve({data: {items: []}}),
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

export default async function Page({params}: {params: {lang: string; fileRelationEntityId: string}}) {
  const {lang, fileRelationEntityId} = params;
  await isUnauthorized({
    requiredPolicies: ["FileService.FileRelation.Save"],
    lang,
  });
  const {languageData} = await getResourceData(lang);

  const apiRequests = await getApiRequests(fileRelationEntityId);

  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }
  const [fileTypeResponse, fileRelationentityResponse] = apiRequests.requiredRequests;
  const fileTypeData = fileTypeResponse.data.items || [];
  const fileRelationEntityData = fileRelationentityResponse.data.items?.[0];
  if (fileRelationEntityId === "new") {
    return <Newform fileTypeData={fileTypeData} languageData={languageData} />;
  }
  if (!fileRelationEntityData) {
    return permanentRedirect(`/${lang}/management/file/file-relation-entities`);
  }
  return (
    <EditForm fileRelationEntityData={fileRelationEntityData} fileTypeData={fileTypeData} languageData={languageData} />
  );
}

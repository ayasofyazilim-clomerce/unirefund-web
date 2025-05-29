import {getFilesForHumanValidationByIdApi} from "@repo/actions/unirefund/FileService/actions";
import DocumentViewer from "@repo/ayasofyazilim-ui/organisms/document-viewer";
import ErrorComponent from "@repo/ui/components/error-component";
import {structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {isRedirectError} from "next/dist/client/components/redirect";
import {getResourceData} from "@/language-data/unirefund/FileService";
import Form from "./_components/form";

async function getApiRequests(fileId: string) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([getFilesForHumanValidationByIdApi(fileId, session)]);
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
    fileId: string;
  };
}) {
  const {lang, fileId} = params;
  const {languageData} = await getResourceData(lang);
  const apiRequests = await getApiRequests(fileId);

  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }

  const [fileResponse] = apiRequests.requiredRequests;
  const selectedFile = fileResponse.data;
  return (
    <div className="grid h-full gap-2 overflow-auto lg:grid-cols-2">
      <div className="relative h-full overflow-hidden">
        <DocumentViewer document={{uri: selectedFile.fileLink}} />
      </div>
      <div className="h-full overflow-auto">
        <Form fileDetails={selectedFile} languageData={languageData} />
      </div>
    </div>
  );
}

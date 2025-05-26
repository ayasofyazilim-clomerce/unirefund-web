import {getFileAiInfosApi, getFilesForHumanValidationApi} from "@repo/actions/unirefund/FileService/actions";
import DocumentViewer from "@repo/ayasofyazilim-ui/organisms/document-viewer";
import ErrorComponent from "@repo/ui/components/error-component";
import {structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {FileXIcon} from "lucide-react";
import {isRedirectError} from "next/dist/client/components/redirect";
import {getResourceData} from "@/language-data/unirefund/FileService";
import Form from "./_components/form";

async function getApiRequests(fileId: string) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([getFilesForHumanValidationApi(["NotConfirmed", "Waiting"], session)]);
    const optionalRequests = await Promise.allSettled([getFileAiInfosApi(fileId, session)]);
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
  const [fileDetailResponse] = apiRequests.optionalRequests;
  const selectedFile = fileResponse.data.items?.find((item) => item.id === fileId);
  const fileDetails = fileDetailResponse.status === "fulfilled" ? fileDetailResponse.value.data : null;
  1;
  return (
    <div className="grid h-full gap-2 overflow-auto py-4 lg:grid-cols-2">
      <div className="relative h-full overflow-hidden">
        {selectedFile ? (
          <DocumentViewer document={{uri: selectedFile.fileLink}} />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center rounded-md bg-gray-100 text-gray-500">
            <FileXIcon className="mb-4 size-16" />
            <span>{languageData.NoFileToDisplay}</span>
          </div>
        )}
      </div>
      <div className="h-full overflow-auto">
        <Form fileDetails={fileDetails} fileList={fileResponse.data.items || []} selectedFile={selectedFile?.id} />
      </div>
    </div>
  );
}

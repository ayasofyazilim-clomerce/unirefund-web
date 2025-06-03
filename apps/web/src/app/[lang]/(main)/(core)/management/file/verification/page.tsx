import {getFilesForHumanValidationApi, getFileTypesApi} from "@repo/actions/unirefund/FileService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {isRedirectError} from "next/dist/client/components/redirect";
import {getResourceData} from "@/language-data/unirefund/FileService";
import {Table} from "./_components/table";

async function getApiRequests() {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([
      getFilesForHumanValidationApi(
        {
          fileHumanValidationStatuses: ["NotConfirmed", "Waiting"],
        },
        session,
      ),
      getFileTypesApi({isHumanValidationRequired: true}, session),
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
  };
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  const apiRequests = await getApiRequests();

  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }

  const [fileResponse, fileTypeResponse] = apiRequests.requiredRequests;
  const fileTypes = fileTypeResponse.data.items
    ? Array.from(new Map(fileTypeResponse.data.items.map((item) => [item.namespace, item])).values())
    : [];

  return (
    <div className="mt-2">
      <Table availableFileTypes={fileTypes} data={fileResponse.data.items || []} languageData={languageData} />
    </div>
  );
}

import type { UniRefund_FileService_Files_FileForHumanValidationDto as FileForHumanValidationDto } from "@repo/saas/FileService";
import {
  getFilesForHumanValidationApi,
  getFilesForHumanValidationByIdApi,
  getFileTypesApi,
} from "@repo/actions/unirefund/FileService/actions";
import { TabLayout } from "@repo/ayasofyazilim-ui/templates/tab-layout";
import ErrorComponent from "@repo/ui/components/error-component";
import { structuredError } from "@repo/utils/api";
import { auth } from "@repo/utils/auth/next-auth";
import { isRedirectError } from "next/dist/client/components/redirect";
import { getBaseLink } from "@/utils";
import { getResourceData } from "@/language-data/unirefund/FileService";
import FileVerificationActions from "./_components/actions";

function filterFileList({
  fileList,
  selectedFile,
}: {
  fileList: FileForHumanValidationDto[];
  selectedFile: FileForHumanValidationDto;
}): FileForHumanValidationDto[] {
  let filtered = fileList.filter(
    (file) => file.fileHumanValidationStatus === "NotConfirmed" || file.fileHumanValidationStatus === "Waiting",
  );
  if (filtered.findIndex((x) => x.id === selectedFile.id) === -1) {
    filtered = [selectedFile, ...filtered];
  }
  return filtered;
}

async function getApiRequests(fileId: string) {
  try {
    const session = await auth();
    const file = await getFilesForHumanValidationByIdApi(fileId, session);
    const requiredRequests = await Promise.all([
      file,
      getFileTypesApi({ isHumanValidationRequired: true }, session),
      getFilesForHumanValidationApi({ fileTypeNamespace: file.data.fileTypeNamespace }, session),
    ]);
    const optionalRequests = await Promise.allSettled([]);
    return { requiredRequests, optionalRequests };
  } catch (error) {
    if (!isRedirectError(error)) {
      return structuredError(error);
    }
    throw error;
  }
}
export default async function Layout({
  params,
  children,
}: {
  params: {
    lang: string;
    fileId: string;
  };
  children: React.ReactNode;
}) {
  const { lang, fileId } = params;
  const { languageData } = await getResourceData(lang);
  const apiRequests = await getApiRequests(fileId);
  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }

  const [fileDetailsResponse, fileTypeResponse, fileListResponse] = apiRequests.requiredRequests;

  const baseLink = getBaseLink(`management/file/verification/${fileId}/`, lang);
  const tabList = [
    {
      label: languageData.Verification,
      href: `${baseLink}verify`,
    },
    {
      label: languageData.ExportValidation,
      href: `${baseLink}export-validation`,
    },
    {
      label: languageData.CreateTag,
      href: `${baseLink}create-tag`,
    },
  ];
  return (
    <TabLayout
      classNames={{ horizontal: { tabs: "pt-2", tabContent: "overflow-hidden m-0 flex flex-col gap-2 py-2" } }}
      orientation="horizontal"
      tabList={tabList.filter((tab) => tab.href === `${baseLink}verify`)}>
      <FileVerificationActions
        fileTypes={fileTypeResponse.data.items || []}
        initialFileList={filterFileList({
          fileList: fileListResponse.data.items || [],
          selectedFile: fileDetailsResponse.data,
        })}
        languageData={languageData}
        selectedFile={fileDetailsResponse.data}
      />
      {children}
    </TabLayout>
  );
}

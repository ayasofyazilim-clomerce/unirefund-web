"use client";
import type {
  PagedResultDto_FileTypeMimeTypeListDto,
  UniRefund_FileService_FileTypes_FileTypeListDto,
  UniRefund_FileService_MimeTypes_MimeTypeListDto,
} from "@ayasofyazilim/saas/FileService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {useGrantedPolicies} from "@repo/utils/policies";
import {useRouter} from "next/navigation";
import type {FileServiceResource} from "@/language-data/unirefund/FileService";
import {tableData} from "./file-type-mime-type-table-data";

function FileTypeMimeTypesTable({
  locale,
  languageData,
  response,
  mimeTypeData,
  fileTypeData,
}: {
  locale: string;
  languageData: FileServiceResource;
  response: PagedResultDto_FileTypeMimeTypeListDto;
  mimeTypeData: UniRefund_FileService_MimeTypes_MimeTypeListDto[];
  fileTypeData: UniRefund_FileService_FileTypes_FileTypeListDto[];
}) {
  const router = useRouter();
  const {grantedPolicies} = useGrantedPolicies();
  const columns = tableData.fileTypeMimeTypes.columns(locale);
  const table = tableData.fileTypeMimeTypes.table(
    locale,
    languageData,
    router,
    grantedPolicies,
    mimeTypeData,
    fileTypeData,
  );
  return <TanstackTable {...table} columns={columns} data={response.items || []} rowCount={response.totalCount} />;
}

export default FileTypeMimeTypesTable;

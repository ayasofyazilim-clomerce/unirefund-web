"use client";
import type {UniRefund_FileService_Files_FileForHumanValidationDto} from "@ayasofyazilim/saas/FileService";
import {$UniRefund_FileService_Files_FileForHumanValidationDto} from "@ayasofyazilim/saas/FileService";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import {DownloadIcon} from "lucide-react";
import {useParams} from "next/navigation";
import {getBaseLink} from "@/utils";
import type {FileServiceResource} from "@/language-data/unirefund/FileService";

type TableType = UniRefund_FileService_Files_FileForHumanValidationDto;
export function Table({data, languageData}: {data: TableType[]; languageData: FileServiceResource}) {
  const {lang} = useParams<{lang: string}>();
  const columns = tableColumns(lang);
  return (
    <TanstackTable<TableType, TableType>
      columnOrder={[
        "fileName",
        "fileTypeNamespace",
        "fileAIValidationStatus",
        "fileHumanValidationStatus",
        "isValidated",
      ]}
      columnVisibility={{
        type: "show",
        columns: [
          "fileName",
          "fileTypeNamespace",
          "fileAIValidationStatus",
          "fileHumanValidationStatus",
          "isValidated",
        ],
      }}
      columns={columns}
      data={data}
      rowActions={[
        {
          actionLocation: "row",
          type: "simple",
          icon: DownloadIcon,
          cta: languageData.DownloadFile,
          onClick: (row) => {
            const a = document.createElement("a");
            a.href = row.fileLink;
            a.target = "_blank";
            a.download = row.fileName;
            a.click();
          },
        },
      ]}
    />
  );
}

function tableColumns(lang: string) {
  return tanstackTableCreateColumnsByRowData<TableType>({
    rows: $UniRefund_FileService_Files_FileForHumanValidationDto.properties,
    links: {
      fileName: {
        prefix: getBaseLink("management/file/verification", lang),
        targetAccessorKey: "id",
        suffix: "verify",
      },
    },
  });
}

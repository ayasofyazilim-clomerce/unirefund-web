"use client";
import * as Select from "@/components/ui/select";
import type {
  UniRefund_FileService_Files_FileForHumanValidationDto,
  UniRefund_FileService_FileTypes_FileTypeListDto,
} from "@ayasofyazilim/saas/FileService";
import {$UniRefund_FileService_Files_FileForHumanValidationDto} from "@ayasofyazilim/saas/FileService";
import {getApiFileTypeGroupsRulesetApi} from "@repo/actions/unirefund/FileService/actions";
import TanstackTable from "@repo/ayasofyazilim-ui/molecules/tanstack-table";
import {tanstackTableCreateColumnsByRowData} from "@repo/ayasofyazilim-ui/molecules/tanstack-table/utils";
import type {Ruleset} from "@repo/ui/unirefund/file-upload/index";
import {FileUpload} from "@repo/ui/unirefund/file-upload/index";
import {DownloadIcon, UploadCloudIcon} from "lucide-react";
import {useParams} from "next/navigation";
import {useEffect, useState, useTransition} from "react";
import {getBaseLink} from "@/utils";
import type {FileServiceResource} from "@/language-data/unirefund/FileService";

type TableType = UniRefund_FileService_Files_FileForHumanValidationDto;

export function Table({
  data,
  languageData,
  availableFileTypes,
}: {
  data: TableType[];
  languageData: FileServiceResource;
  availableFileTypes: UniRefund_FileService_FileTypes_FileTypeListDto[];
}) {
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
      tableActions={[
        {
          actionLocation: "table",
          type: "custom-dialog",
          content: <FileUploadDialog availableFileTypes={availableFileTypes} languageData={languageData} />,
          cta: languageData.UploadFile,
          title: languageData.UploadFile,
          icon: UploadCloudIcon,
          dialogClassNames: {
            content: "max-w-2xl",
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

function FileUploadDialog({
  availableFileTypes,
  languageData,
}: {
  availableFileTypes: UniRefund_FileService_FileTypes_FileTypeListDto[];
  languageData: FileServiceResource;
}) {
  const [isPending, startTransition] = useTransition();
  const [selectedFileType, setSelectedFileType] = useState<string | null>(null);
  const [ruleset, setRuleset] = useState<Ruleset | null>(null);
  useEffect(() => {
    setRuleset(null);
    startTransition(() => {
      if (!selectedFileType) {
        setRuleset(null);
        return;
      }
      void getApiFileTypeGroupsRulesetApi({namespace: selectedFileType})
        .then((res) => {
          setRuleset(res.data);
        })
        .catch(() => {
          setRuleset(null);
        });
    });
  }, [selectedFileType]);
  return (
    <div className="grid gap-2">
      <Select.Select
        disabled={isPending}
        onValueChange={(value) => {
          setSelectedFileType(value);
        }}>
        <Select.SelectTrigger className="w-full">
          <Select.SelectValue placeholder="Select a file type" />
        </Select.SelectTrigger>
        <Select.SelectContent>
          {availableFileTypes.map((fileType) => (
            <Select.SelectItem key={fileType.fileTypeGroupNamespace} value={fileType.fileTypeGroupNamespace}>
              {fileType.name}
            </Select.SelectItem>
          ))}
        </Select.SelectContent>
      </Select.Select>
      {ruleset ? (
        <FileUpload
          disabled={isPending}
          languageData={languageData}
          propertyId={crypto.randomUUID()}
          ruleset={ruleset}
        />
      ) : null}
    </div>
  );
}

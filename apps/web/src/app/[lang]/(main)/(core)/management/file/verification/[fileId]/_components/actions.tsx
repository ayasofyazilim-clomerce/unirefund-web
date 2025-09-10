"use client";

import {Button} from "@/components/ui/button";
import type {
  UniRefund_FileService_Files_FileForHumanValidationDto as FileForHumanValidationDto,
  UniRefund_FileService_FileTypes_FileTypeListDto as FileTypeListDto,
} from "@repo/saas/FileService";
import {getFilesForHumanValidationApi} from "@repo/actions/unirefund/FileService/actions";
import {Combobox} from "@repo/ayasofyazilim-ui/molecules/combobox";
import {ArrowLeft, ArrowRight} from "lucide-react";
import {useParams, useRouter} from "next/navigation";
import {useState, useTransition} from "react";
import {getBaseLink} from "@/utils";
import type {FileServiceResource} from "@/language-data/unirefund/FileService";

export default function FileVerificationActions({
  selectedFile: initialFile,
  initialFileList = [],
  fileTypes,
  languageData,
}: {
  initialFileList: FileForHumanValidationDto[];
  fileTypes: FileTypeListDto[];
  selectedFile: FileForHumanValidationDto;
  languageData: FileServiceResource;
}) {
  const {lang} = useParams<{lang: string}>();
  const router = useRouter();
  const [fileList, setFileList] = useState<FileForHumanValidationDto[]>(initialFileList);
  const [selectedFileType, setSelectedFileType] = useState<FileTypeListDto | null>(
    fileTypes.find((fileType) => fileType.namespace === initialFile.fileTypeNamespace) || null,
  );
  const [isPending, startTransition] = useTransition();
  return (
    <div className="grid grid-cols-6 items-center gap-2 md:flex md:pr-4">
      <Combobox<FileTypeListDto>
        classNames={{
          container: "md:max-w-xs overflow-hidden col-span-full",
        }}
        list={fileTypes}
        onValueChange={(value) => {
          if (!value) return;
          setSelectedFileType(value);
          startTransition(() => {
            void getFilesForHumanValidationApi({
              fileHumanValidationStatuses: ["NotConfirmed", "Waiting"],
              fileTypeNamespace: value.namespace,
            }).then((response) => {
              setFileList(response.data.items || []);
              const file = response.data.items?.at(0);
              if (file) {
                router.push(getBaseLink(`management/file/verification/${file.id}/verify`, lang));
              } else {
                router.push(getBaseLink(`management/file/verification`, lang));
              }
            });
          });
        }}
        selectIdentifier="namespace"
        selectLabel="name"
        value={selectedFileType}
      />
      <Button
        className=""
        data-testid="previous_file"
        disabled={isPending || !selectedFileType}
        onClick={() => {
          startTransition(() => {
            const currentIndex = fileList.findIndex((file) => file.id === initialFile.id);
            const previousIndex = (currentIndex - 1 + fileList.length) % fileList.length;
            const previousFile = fileList[previousIndex];
            router.push(getBaseLink(`management/file/verification/${previousFile.id}/verify`, lang));
          });
        }}
        variant="outline">
        <ArrowLeft className="size-4 md:hidden" />
        <span className="hidden w-full overflow-hidden text-ellipsis md:flex">{languageData.PreviousFile}</span>
      </Button>
      <Combobox<FileForHumanValidationDto>
        badges={{
          fileHumanValidationStatus: {
            className: "text-xs",
            label: (item) => item.fileHumanValidationStatus,
          },
        }}
        classNames={{
          container: "col-span-4 md:max-w-60 overflow-hidden",
          trigger: {
            label: "w-60 overflow-hidden text-ellipsis text-nowrap",
          },
        }}
        disabled={isPending || !selectedFileType}
        list={fileList}
        onValueChange={(val) => {
          if (!val) return;
          startTransition(() => {
            router.push(getBaseLink(`management/file/verification/${val.id}/verify`, lang));
          });
        }}
        selectIdentifier="id"
        selectLabel="fileName"
        value={initialFile}
      />
      <Button
        className=""
        data-testid="next_file"
        disabled={isPending || !selectedFileType}
        onClick={() => {
          startTransition(() => {
            const currentIndex = fileList.findIndex((file) => file.id === initialFile.id);
            const nextIndex = (currentIndex + 1) % fileList.length;
            const nextFile = fileList[nextIndex];
            router.push(getBaseLink(`management/file/verification/${nextFile.id}/verify`, lang));
          });
        }}
        variant="outline">
        <span className="hidden w-full overflow-hidden text-ellipsis md:flex">{languageData.NextFile}</span>
        <ArrowRight className="size-4 md:hidden" />
      </Button>
    </div>
  );
}

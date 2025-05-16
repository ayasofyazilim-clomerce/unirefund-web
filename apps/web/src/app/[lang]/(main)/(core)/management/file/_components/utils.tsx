import {Button} from "@/components/ui/button";
import {FileSliders, FileType2, Server} from "lucide-react";
import Link from "next/link";
import type {FileServiceResource} from "@/language-data/unirefund/FileService";
import {getBaseLink} from "@/utils";

export function checkIsFormReady({
  lang,
  languageData,
  fileTypeGroupDataLength,
  providerDataLength,
  mimeTypeDataLength,
  fileTypeDataLength,
}: {
  lang: string;
  languageData: FileServiceResource;
  fileTypeGroupDataLength?: number;
  providerDataLength?: number;
  mimeTypeDataLength?: number;
  fileTypeDataLength?: number;
}) {
  if (fileTypeGroupDataLength !== undefined && fileTypeGroupDataLength === 0) {
    return {
      isActive: true,
      content: {
        icon: <FileSliders className="size-20 text-gray-400" />,
        title: languageData["Missing.FileTypeGroup.Title"],
        message: languageData["Missing.FileTypeGroup.Message"],
        action: <Action languageData={languageData} link={getBaseLink("management/file/file-type-groups", lang)} />,
      },
    };
  }
  if (providerDataLength !== undefined && providerDataLength === 0) {
    return {
      isActive: true,
      content: {
        icon: <Server className="size-20 text-gray-400" />,
        title: languageData["Missing.Provider.Title"],
        message: languageData["Missing.Provider.Message"],
        action: <Action languageData={languageData} link={getBaseLink("management/file/providers", lang)} />,
      },
    };
  }
  if (mimeTypeDataLength !== undefined && mimeTypeDataLength === 0) {
    return {
      isActive: true,
      content: {
        icon: <FileSliders className="size-20 text-gray-400" />,
        title: languageData["Missing.MimeType.Title"],
        message: languageData["Missing.MimeType.Message"],
        action: <Action languageData={languageData} link={getBaseLink("management/file/mime-types", lang)} />,
      },
    };
  }
  if (fileTypeDataLength !== undefined && fileTypeDataLength === 0) {
    return {
      isActive: true,
      content: {
        icon: <FileType2 className="size-20 text-gray-400" />,
        title: languageData["Missing.FileType.Title"],
        message: languageData["Missing.FileType.Message"],
        action: <Action languageData={languageData} link={getBaseLink("management/file/file-types", lang)} />,
      },
    };
  }

  return {
    isActive: false,
    content: null,
  };
}

function Action({languageData, link}: {languageData: FileServiceResource; link: string}) {
  return (
    <Button asChild className="text-blue-500" variant="link">
      <Link href={link}>{languageData.New}</Link>
    </Button>
  );
}

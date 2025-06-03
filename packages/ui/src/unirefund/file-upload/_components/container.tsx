import {Badge} from "@repo/ayasofyazilim-ui/atoms/badge";
import {Button} from "@repo/ayasofyazilim-ui/atoms/button";
import * as Hover from "@repo/ayasofyazilim-ui/atoms/hover-card";
import {FileCard} from "@repo/ayasofyazilim-ui/organisms/file-uploader";
import {FileQuestion} from "lucide-react";
import {useState} from "react";
import {FileUploadResources, Rule} from "../../file-upload";
import {FileUploaderProvider, useFileUploader} from "./file-provider";
import {FileUploadBase, FileUploadBaseProps} from "./file-upload-base";
import {FileFormData, Form} from "./form";
import {SuccessedFileList} from "./success-list";

export type FileUploadContainerProps<T> = {
  rule: Rule;
  propertyId: string;
  classNames?: {
    core?: FileUploadBaseProps<T>["classNames"] | undefined;
    successList?: string;
    childrenContainer?: string;
  };
  onSuccess: FileUploadBaseProps<T>["onSuccess"];
  children?: React.ReactNode;
  disabled?: boolean;
  languageData: FileUploadResources;
};

export function FileUploadContainer<T>({
  rule,
  propertyId,
  classNames,
  onSuccess,
  children,
  disabled,
  languageData,
}: FileUploadContainerProps<T>) {
  const [formData, setFormData] = useState<Array<FileFormData> | null>(null);
  if (!rule || !rule.mimeTypes) return null;
  const config = {
    accept: rule.mimeTypes.reduce(
      (acc, cur) => {
        const key = cur.mimeTypeCode || "";
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(cur.mimeTypeExtension || "");
        return acc;
      },
      {} as Record<string, string[]>,
    ),
    maxFileCount: rule.isMulti ? rule.maxFileCount || 5 : 1,
    maxSize: rule.maxSize || 1024 * 1024 * 5,
  };

  return (
    <FileUploaderProvider>
      <FileUploadBase
        onSuccess={onSuccess}
        languageData={languageData}
        key={rule.id}
        maxFileCount={config.maxFileCount}
        maxSize={config.maxSize}
        accept={config.accept}
        classNames={classNames?.core}
        disabled={disabled}
        constantValues={{
          RelatedEntity: rule.fileRelationsEntity?.[0].relatedEntityName || "",
          FileType: rule.namespace,
          Property: propertyId,
        }}
        formData={formData || []}
        fileCardRenderer={({file, onRemove, index}) => {
          const {pending, failed} = useFileUploader();
          const error = failed.find((x) => x.data.file.relativePath === file.relativePath);
          return (
            <div>
              <FileCard
                progress={pending.find((x) => x.data.file.relativePath === file.relativePath)?.progress || 0}
                file={file}
                onRemove={() => {
                  onRemove && onRemove();
                  setFormData((prev) => {
                    if (!prev) return null;
                    return prev.filter((_, i) => i !== index);
                  });
                }}
              />
              {error && <span className="text-xs text-red-500">{error.message}</span>}
              <Form
                rule={rule}
                validationErrors={error?.validationErrors || null}
                formData={formData && {...formData[index]}}
                index={index}
                propertyId={propertyId}
                setFormData={setFormData}
              />
            </div>
          );
        }}
        label={
          <div className="flex items-center">
            <FileTypeInfo accept={config.accept} />
            {rule.name}
            {rule.isFileTypeRequired && <span className="text-sm text-red-500">*</span>}
          </div>
        }>
        <div className={classNames?.childrenContainer}>
          <SuccessedFileList className={classNames?.successList} />
          {children}
        </div>
      </FileUploadBase>
    </FileUploaderProvider>
  );
}

function FileTypeInfo({accept}: {accept: Record<string, string[]>}) {
  return (
    <Hover.HoverCard>
      <Hover.HoverCardTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 px-1">
          <FileQuestion className="w-4" />
        </Button>
      </Hover.HoverCardTrigger>
      <Hover.HoverCardContent className="w-max max-w-60">
        <div className="flex flex-wrap gap-1">
          {Object.keys(accept).map((key) => (
            <Badge
              className="max-w-40 overflow-hidden text-ellipsis rounded-full text-xs"
              variant={"outline"}
              key={key}>
              {key}
            </Badge>
          ))}
        </div>
      </Hover.HoverCardContent>
    </Hover.HoverCard>
  );
}

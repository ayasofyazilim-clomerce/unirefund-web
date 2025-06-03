"use client";
import {Button} from "@repo/ayasofyazilim-ui/atoms/button";
import {BaseFileUploaderProps, FileUploader, FileWithPath} from "@repo/ayasofyazilim-ui/organisms/file-uploader";
import {useState} from "react";
import {useFileUploader} from "./file-provider";
import {FileFormData} from "./form";
import {cn} from "../../../utils";
import {FileUploadResources} from "../../file-upload";

export type FileUploadBaseProps<T> = Pick<
  BaseFileUploaderProps,
  "accept" | "maxFileCount" | "label" | "description" | "fileCardRenderer" | "classNames" | "children" | "maxSize"
> & {
  formData: FileFormData[];
  onSuccess?: (response: T) => void;
  constantValues: {
    RelatedEntity: string;
    FileType: string;
    Property: string;
  };
  disabled?: boolean;
  languageData: FileUploadResources;
};

export function FileUploadBase<T>({
  accept = {"*": []},
  maxFileCount = 1,
  maxSize = 1024 * 1024 * 5,
  formData,
  label,
  description,
  fileCardRenderer,
  children,
  classNames,
  constantValues,
  onSuccess,
  disabled,
  languageData,
}: FileUploadBaseProps<T>) {
  const {pending, setPending, setProgress, setSuccessed, setFailed} = useFileUploader();
  const [files, setFiles] = useState<FileWithPath[]>([]);

  function handleUpload() {
    let states = formData.map((data, index) => ({
      data: {
        ...data,
        ...constantValues,
        file: files[index],
      },
      progress: 0,
    }));
    setPending(states);
    Promise.allSettled(
      states.map(async ({data}) => {
        const _formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          _formData.append(key, value);
        });
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = function (event) {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            setProgress({data, progress: percentComplete});
          }
        };
        xhr.onload = function () {
          try {
            if (xhr.status === 200) {
              setSuccessed({data, message: "Uploaded successfully"});
              setFiles((prev) => prev.filter((x) => x.relativePath !== data.file.relativePath));
              if (onSuccess) onSuccess(JSON.parse(xhr.response));
            } else {
              const x = JSON.parse(xhr.response);
              const message = x?.error?.message || x?.error?.code || xhr.responseText;
              setFailed({data, message, validationErrors: x?.error?.validationErrors});
            }
          } catch (error) {
            setFailed({data, message: "Unknown error"});
          }
        };
        xhr.open("POST", "/api/file", true);
        xhr.send(_formData);
      }),
    );
  }

  return (
    <FileUploader
      label={label}
      description={description}
      accept={accept}
      variant="button"
      maxSize={maxSize}
      maxFileCount={maxFileCount}
      disabled={pending.length > 0 || disabled}
      fileCardRenderer={fileCardRenderer}
      value={files}
      onValueChange={(_files) => {
        setFiles(_files);
      }}
      classNames={{
        collapsible: cn("bg-white", classNames?.collapsible),
        dropzoneContainer: cn("", classNames?.dropzoneContainer),
        dropzone: cn("", classNames?.dropzone),
      }}
      headerChildren={
        <Button
          className="w-full self-end sm:max-w-max"
          disabled={disabled || files.length === 0 || pending.length > 0}
          onClick={handleUpload}>
          {languageData["FileUpload.Save"]}
        </Button>
      }>
      {children}
    </FileUploader>
  );
}

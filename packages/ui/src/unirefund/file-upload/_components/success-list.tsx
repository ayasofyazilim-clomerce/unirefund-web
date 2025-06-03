import {FileCard} from "@repo/ayasofyazilim-ui/organisms/file-uploader";
import {useFileUploader} from "./file-provider";
import {cn} from "../../../utils";

export function SuccessedFileList({className}: {className?: string}) {
  const {successed} = useFileUploader();

  if (successed.length === 0) return null;
  return (
    <div className={cn("flex flex-wrap gap-4 border-t p-4", className)}>
      {successed.map((successedFiles, index) => {
        return (
          <FileCard
            key={successedFiles.data.file.size + successedFiles.data.file.name + index}
            file={successedFiles.data.file}
            classNames={{
              container: "bg-emerald-50 border-emerald-400 border text-emerald-500 w-[calc(33.33%-.7rem)]",
            }}
          />
        );
      })}
    </div>
  );
}

export const dummySuccessed = [
  {
    message: "",
    data: {
      file: {
        lastModified: 222,
        name: "Test.png",
        path: "./test.png",
        webkitRelativePath: "",
        size: 1234,
        preview: "",
        bytes: (): Promise<Uint8Array> => {
          return new Promise(() => {});
        },
        arrayBuffer: (): Promise<ArrayBuffer> => {
          return new Promise(() => {});
        },
        slice: (start?: number, end?: number, contentType?: string): Blob => {
          return new Blob([], {type: contentType || ""});
        },
        type: "image/png",
        stream: () =>
          new ReadableStream<Uint8Array>({
            start(controller) {
              // Implementation of the start method
            },
            pull(controller) {
              // Implementation of the pull method
            },
            cancel(reason) {
              // Implementation of the cancel method
            },
          }),
        text: (): Promise<string> => {
          return new Promise(() => "");
        },
      },
      FileType: "string",
      RelatedEntity: "string",
      Property: "string",
      FileDescription: "string",
      DocumentDate: "string",
      DocumentOriginator: "string",
      DocumentNumber: "string",
    },
  },
  {
    message: "",
    data: {
      file: {
        lastModified: 222,
        name: "Test.png",
        path: "./test.png",
        webkitRelativePath: "",
        size: 1234,
        preview: "",
        bytes: (): Promise<Uint8Array> => {
          return new Promise(() => {});
        },
        arrayBuffer: (): Promise<ArrayBuffer> => {
          return new Promise(() => {});
        },
        slice: (start?: number, end?: number, contentType?: string): Blob => {
          return new Blob([], {type: contentType || ""});
        },
        type: "image/png",
        stream: () =>
          new ReadableStream<Uint8Array>({
            start(controller) {
              // Implementation of the start method
            },
            pull(controller) {
              // Implementation of the pull method
            },
            cancel(reason) {
              // Implementation of the cancel method
            },
          }),
        text: (): Promise<string> => {
          return new Promise(() => "");
        },
      },
      FileType: "string",
      RelatedEntity: "string",
      Property: "string",
      FileDescription: "string",
      DocumentDate: "string",
      DocumentOriginator: "string",
      DocumentNumber: "string",
    },
  },
];

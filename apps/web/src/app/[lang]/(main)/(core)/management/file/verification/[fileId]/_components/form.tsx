"use client";
import {Button} from "@/components/ui/button";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {toastOnSubmit} from "@repo/ui/toast-on-submit";
import {Separator} from "@/components/ui/separator";
import type {
  UniRefund_FileService_FileAIInfos_FileAIInfoDto as FileAIInfoDto,
  UniRefund_FileService_Files_FileForHumanValidationDto as FileForHumanValidationDto,
} from "@ayasofyazilim/saas/FileService";
import {Combobox} from "@repo/ayasofyazilim-ui/molecules/combobox";
import {useState} from "react";
import schema from "./schema.json";
import data from "./data.json";

export default function Form({
  fileDetails,
  fileList,
  selectedFile,
}: {
  fileDetails: FileAIInfoDto | null;
  fileList: FileForHumanValidationDto[];
  selectedFile?: string;
}) {
  const output = JSON.parse(fileDetails?.unstract1OutputJson || JSON.stringify(data)) as object;
  return (
    <SchemaForm
      className="flex flex-col-reverse"
      disabled={Object.keys(output).length === 0}
      formData={output}
      onSubmit={({formData: editedFormData}) => {
        toastOnSubmit({
          title: "Form submitted",
          description: editedFormData, //JSON.stringify(editedFormData, null, 2),
        });
      }}
      schema={schema}
      useDefaultSubmit={false}
      uiSchema={{
        "ui:className": "grid lg:grid-cols-2",
        tarife_tablosu: {
          "ui:className": "col-span-full",
        },

        ucretler_tablosu: {
          "ui:className": "col-span-full grid lg:grid-cols-2",
          "Fees Table": {
            "ui:className": "col-span-full",
          },
        },
      }}
      // customValidate={(formData, errors) => {
      //   const values = formData?.ucretler_tablosu["Fees Table"].map((a) => a["Amount Payable"]) || [];
      //   const sum = values
      //     .map((value) => parseFloat(value.replace(/\./g, "").replace(",", ".")))
      //     .reduce((acc, num) => acc + num, 0);
      //   const formattedSum = sum.toLocaleString("de-DE", {minimumFractionDigits: 2, maximumFractionDigits: 2});
      //   if (formData?.payable_amount.split(" ").at(0) !== formattedSum) {
      //     errors.payable_amount?.addError("Satır toplamları toplam tutara eşit olmalıdır");
      //   }
      //   return errors;
      // }}
      useTableForArrayItems>
      <ReviewDocumentHeader fileList={fileList} selectedFile={selectedFile} />
    </SchemaForm>
  );
}

function ReviewDocumentHeader({
  fileList,
  selectedFile,
}: {
  fileList: FileForHumanValidationDto[];
  selectedFile?: string;
}) {
  const [selected, setSelected] = useState<FileForHumanValidationDto | null | undefined>(
    fileList.find((item) => item.id === selectedFile),
  );
  return (
    <div className="sticky top-0 mb-2 grid grid-cols-2 items-center gap-2 border-b bg-white pb-2 pt-2 md:flex md:pt-0">
      <Combobox<FileForHumanValidationDto>
        list={fileList}
        onValueChange={setSelected}
        selectIdentifier="id"
        selectLabel="id"
        value={selected}
      />
      <span className="ml-auto text-nowrap text-sm font-bold">{selected?.id}</span>
      <Separator className="hidden h-8 md:block" orientation="vertical" />
      <Button disabled type="button" variant="outline">
        History
      </Button>

      <Button className="">Approve</Button>
    </div>
  );
}

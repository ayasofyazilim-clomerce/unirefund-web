"use client";
import type {
  UniRefund_FileService_FileAIInfos_FileAIInfoDto as FileAIInfoDto,
  UniRefund_FileService_Files_FileForHumanValidationDto as FileForHumanValidationDto,
} from "@ayasofyazilim/saas/FileService";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {toastOnSubmit} from "@repo/ui/toast-on-submit";
import {useState} from "react";
import data from "./data.json";
import schema from "./schema.json";
import type {ActionOption} from "./form-header";
import FormHeader from "./form-header";

export default function Form({
  fileDetails,
  fileList,
  selectedFile,
}: {
  fileDetails: FileAIInfoDto | null;
  fileList: FileForHumanValidationDto[];
  selectedFile?: string;
}) {
  const output = data;
  //  JSON.parse(fileDetails?.unstract1OutputJson || JSON.stringify(data)) as object;
  const options = [
    {
      key: "approve",
      label: "Approve",
      description: "Approve the document for further processing",
    },
    {
      key: "reject",
      label: "Reject",
      description: "Reject the document",
    },
    {
      key: "approve_and_export",
      label: "Approve and export validate",
      description: "Approve the document and start export validation process",
    },
    {
      key: "approve_and_create_tag",
      label: "Approve and create tag",
      description: "Approve the document and create a tag",
    },
  ];
  const [selectedAction, setSelectedAction] = useState<ActionOption>(options[0]);

  return (
    <SchemaForm
      className="flex flex-col-reverse"
      disabled={Object.keys(output).length === 0 || !fileDetails}
      formData={output}
      onSubmit={({formData: editedFormData}) => {
        toastOnSubmit({
          title: selectedAction.label,
          description: editedFormData,
        });
      }}
      schema={schema}
      useDefaultSubmit={false}
      uiSchema={{
        "ui:className": "grid lg:grid-cols-2",
        merchant_vat_number: {
          "ui:className": "col-span-full",
        },
        merchant_adress: {
          "ui:className": "col-span-full",
        },
        traveller_full_name: {
          "ui:className": "col-span-full",
        },
        traveller_permanent_adress: {
          "ui:className": "col-span-full",
        },
        traveller_email: {
          "ui:className": "col-span-full",
        },
        traveller_passport_no: {
          "ui:className": "col-span-full",
        },
        description_of_goods: {
          "ui:className": "col-span-full",
        },
        refund_amount: {
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
      <FormHeader
        fileList={fileList}
        options={options}
        selectedAction={selectedAction}
        selectedFile={selectedFile}
        setSelectedAction={setSelectedAction}
      />
    </SchemaForm>
  );
}

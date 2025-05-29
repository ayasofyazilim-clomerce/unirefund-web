"use client";
import {Button} from "@/components/ui/button";
import type {UniRefund_FileService_Files_FileForHumanValidationDto as FileForHumanValidationDto} from "@ayasofyazilim/saas/FileService";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {FormReadyComponent} from "@repo/ui/form-ready";
import {toastOnSubmit} from "@repo/ui/toast-on-submit";
import {FileSliders} from "lucide-react";
import Link from "next/link";
import {useParams} from "next/navigation";
import {useState} from "react";
import {getBaseLink} from "@/utils";
import type {FileServiceResource} from "@/language-data/unirefund/FileService";
import type {ActionOption} from "./form-header";
import FormHeader from "./form-header";

const checkSchemaReadiness = (formSchema: object, lang: string, languageData: FileServiceResource) => {
  const isSchemaEmpty = Object.keys(formSchema).length === 0;

  return {
    active: isSchemaEmpty,
    content: {
      icon: <FileSliders className="size-20 text-gray-400" />,
      title: languageData["Verification.SchemaNotDefined.Title"],
      message: languageData["Verification.SchemaNotDefined.Message"],
      action: (
        <Button asChild className="text-blue-500" variant="link">
          <Link href={getBaseLink("management/file/file-types/", lang)} target="_blank">
            {languageData.Edit}
          </Link>
        </Button>
      ),
    },
  };
};
const checkFormDataReadiness = (
  formData: object,
  overrideIsFormDataReady: boolean,
  setOverrideIsFormDataReady: (override: boolean) => void,
  languageData: FileServiceResource,
) => {
  const isFormDataEmpty = Object.keys(formData).length === 0;
  return {
    active: isFormDataEmpty && overrideIsFormDataReady,
    content: {
      icon: <FileSliders className="size-20 text-gray-400" />,
      title: languageData["Verification.NoFormDataExtracted.Title"],
      message: languageData["Verification.NoFormDataExtracted.Message"],
      action: (
        <div className="flex gap-2">
          <Button>{languageData["Verification.NoFormDataExtracted.TriggerAIProcess"]}</Button>
          <Button
            onClick={() => {
              setOverrideIsFormDataReady(false);
            }}
            variant="outline">
            {languageData["Verification.NoFormDataExtracted.Proceed"]}
          </Button>
        </div>
      ),
    },
  };
};

export default function Form({
  fileDetails,
  languageData,
}: {
  fileDetails: FileForHumanValidationDto | null;
  languageData: FileServiceResource;
}) {
  const [overrideIsFormDataReady, setOverrideIsFormDataReady] = useState(true);
  const {lang} = useParams<{lang: string}>();
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
  // Safely parse JSON to prevent exceptions

  const formData = safeJsonParse(fileDetails?.fileAIOutputJson);
  const formSchema = safeJsonParse(fileDetails?.fileJsonSchema);
  const formUiSchema = safeJsonParse(fileDetails?.fileUIJsonSchema);
  const [selectedAction, setSelectedAction] = useState<ActionOption>(options[0]);
  const schemaReadinessState = checkSchemaReadiness(formSchema, lang, languageData);
  const formDataReadinessState = checkFormDataReadiness(
    formData,
    overrideIsFormDataReady,
    setOverrideIsFormDataReady,
    languageData,
  );
  return (
    <FormReadyComponent {...schemaReadinessState}>
      <FormReadyComponent {...formDataReadinessState}>
        <SchemaForm
          className="flex flex-col-reverse"
          formData={formData}
          onSubmit={({formData: editedFormData}) => {
            toastOnSubmit({
              title: selectedAction.label,
              description: editedFormData,
            });
          }}
          schema={formSchema}
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
          useDefaultSubmit={false}
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
            languageData={languageData}
            options={options}
            selectedAction={selectedAction}
            setSelectedAction={setSelectedAction}
            showUISchemaWarning={Object.keys(formUiSchema).length === 0}
          />
        </SchemaForm>
      </FormReadyComponent>
    </FormReadyComponent>
  );
}

const safeJsonParse = (jsonString: string | undefined | null): object => {
  if (!jsonString) return {};
  try {
    return JSON.parse(jsonString) as object;
  } catch {
    return {};
  }
};

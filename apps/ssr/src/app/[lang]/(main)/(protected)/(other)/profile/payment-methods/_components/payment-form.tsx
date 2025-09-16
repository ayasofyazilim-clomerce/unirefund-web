import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {useMemo} from "react";
import type {ApiMethod} from "@repo/actions/unirefund/RefundService/actions";
import {toast} from "@/components/ui/sonner";
import type {SSRServiceResource} from "@/language-data/unirefund/SSRService";

type PaymentFormProps = {
  method: ApiMethod;
  languageData: SSRServiceResource;
};

function buildSchemaFromApi(method: ApiMethod, languageData: SSRServiceResource) {
  const properties: Record<
    string,
    {
      type: string;
      minLength?: number;
      maxLength?: number;
      pattern?: string;
      enum?: string[];
    }
  > = {};
  const required: string[] = [];
  const uiSchema: Record<
    string,
    {
      "ui:title": string;
      "ui:enumNames"?: string[];
      "ui:options"?: {
        mask?: string;
      };
    }
  > = {};
  for (const group of method.fields) {
    for (const field of group.group) {
      const prop: {
        type: string;
        minLength?: number;
        maxLength?: number;
        pattern?: string;
        enum?: string[];
      } = {type: "string"};
      if (field.minLength) prop.minLength = field.minLength;
      if (field.maxLength) prop.maxLength = field.maxLength;
      if (field.validationRegexp) prop.pattern = field.validationRegexp;
      if (field.type === "select" && field.valuesAllowed?.length) {
        prop.enum = field.valuesAllowed.map((v) => v.key);
        uiSchema[field.key] = {
          "ui:title": (languageData as Record<string, string>)[field.name] || field.name,
          "ui:enumNames": field.valuesAllowed.map((v) => (languageData as Record<string, string>)[v.name] || v.name),
        };
      } else {
        uiSchema[field.key] = {
          "ui:title": (languageData as Record<string, string>)[field.name] || field.name,
        };
      }
      if (field.displayFormat) {
        uiSchema[field.key]["ui:options"] = {
          ...(uiSchema[field.key]["ui:options"] || {}),
          mask: field.displayFormat,
        };
      }
      properties[field.key] = prop;
      if (field.required) required.push(field.key);
    }
  }
  return {
    schema: {
      type: "object",
      required,
      properties,
    },
    uiSchema,
  };
}

export default function PaymentForm({method, languageData}: PaymentFormProps) {
  const built = useMemo(() => buildSchemaFromApi(method, languageData), [method, languageData]);
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-6">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        {(() => {
          const step = (languageData as Record<string, string>)["PaymentMethods.Step4.Title"];
          const methodLabel = (languageData as Record<string, string>)[method.title];
          return step && methodLabel ? step.replace("{0}", methodLabel) : null;
        })()}
      </h2>
      <div className="rounded-lg ">
        <SchemaForm
          className="gap-4 md:[&>div]:grid md:[&>div]:grid-cols-2 "
          onSubmit={(data: {formData?: Record<string, unknown>}) => {
            toast.success(data.formData ? JSON.stringify(data.formData) : "Submitted");
          }}
          schema={built.schema}
          submitText={languageData["PaymentMethods.AddPaymentMethod"]}
          uiSchema={built.uiSchema}
        />
      </div>
    </div>
  );
}

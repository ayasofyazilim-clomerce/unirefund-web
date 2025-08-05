import {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";
import {cn} from "@/lib/utils";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {FieldProps} from "@repo/ayasofyazilim-ui/organisms/schema-form/types";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";

export function PhoneWithTypeField({languageData}: {languageData: CRMServiceServiceResource}) {
  const Field = (props: FieldProps) => {
    return (
      <SchemaForm
        withScrollArea={false}
        className={cn("p-px", props.uiSchema?.["ui:className"], props.className)}
        schema={props.schema}
        uiSchema={createUiSchemaWithResource({
          resources: languageData,
          name: "CRM.telephone",
          schema: props.schema,
          extend: {
            "ui:className": cn(
              "grid grid-cols-4 p-0 border-0 gap-y-2 gap-x-4 [&>label]:col-span-2  [&>div>label]:hidden [&_*:is(input,button)]:h-9",
            ),
            number: {
              "ui:className": "col-span-3",
              "ui:widget": "phone-2",
            },
            type: {
              "ui:className": " [&_button]:whitespace-normal",
            },
          },
        })}
        onChange={({formData}) => {
          props.onChange({
            ...props.formData,
            ...formData,
          });
        }}
        formData={props.formData}
        useDefaultSubmit={false}
        tagName={"div"}
      />
    );
  };
  return Field;
}

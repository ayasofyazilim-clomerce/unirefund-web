import {cn} from "@/lib/utils";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import type {FieldProps} from "@repo/ayasofyazilim-ui/organisms/schema-form/types";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import type {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";

type UISchema = {
  "ui:className"?: string;
};
export function PhoneWithTypeField({languageData}: {languageData: CRMServiceServiceResource}) {
  function Field(props: FieldProps) {
    const {uiSchema: _uiSchema} = props;
    const uiSchema = _uiSchema as unknown as UISchema;
    return (
      <SchemaForm
        className={cn("p-px", props.className, uiSchema["ui:className"])}
        formData={props.formData as object}
        onChange={({formData: editedFormData}) => {
          props.onChange({
            ...props.formData,
            ...editedFormData,
          });
        }}
        schema={props.schema}
        tagName="div"
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
              "ui:widget": "phone-with-value",
            },
            type: {
              "ui:className": " [&_button]:whitespace-normal  [&_button]:p-1",
            },
          },
        })}
        useDefaultSubmit={false}
        withScrollArea={false}
      />
    );
  }
  return Field;
}

import {cn} from "@/lib/utils";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import type {FieldProps} from "@repo/ayasofyazilim-ui/organisms/schema-form/types";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import type {DefaultResource} from "@/language-data/core/Default";

type UISchema = {
  "ui:className"?: string;
};
export function EmailWithTypeField({languageData}: {languageData: DefaultResource}) {
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
          name: "Form.email",
          schema: props.schema,
          extend: {
            "ui:className": cn(
              "grid grid-cols-4 p-0 border-0 gap-y-2 gap-x-4 [&>label]:col-span-2 [&>div>label]:hidden [&_*:is(input,button)]:h-9 ",
            ),
            emailAddress: {
              "ui:className": "col-span-3",
              "ui:widget": "email",
              "ui:baseList": ["unirefund.com", "clomerce.com", "ayasofyazilim.com"],
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

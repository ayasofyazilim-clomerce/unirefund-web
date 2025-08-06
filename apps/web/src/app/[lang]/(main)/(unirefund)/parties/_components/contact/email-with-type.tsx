import {cn} from "@/lib/utils";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import type {FieldProps} from "@repo/ayasofyazilim-ui/organisms/schema-form/types";
import {createUiSchemaWithResource} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import type {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";

export function EmailWithTypeField({languageData}: {languageData: CRMServiceServiceResource}) {
  function Field(props: FieldProps) {
    return (
      <SchemaForm
        className={cn("p-px", props.className)}
        formData={props.formData as object}
        onChange={({formData}) => {
          props.onChange({
            ...props.formData,
            ...formData,
          });
        }}
        schema={props.schema}
        tagName="div"
        uiSchema={createUiSchemaWithResource({
          resources: languageData,
          name: "CRM.email",
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
              "ui:className": " [&_button]:whitespace-normal",
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

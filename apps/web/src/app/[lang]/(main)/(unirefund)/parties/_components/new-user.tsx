import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";
import {cn} from "@/lib/utils";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import type {FieldProps} from "@repo/ayasofyazilim-ui/organisms/schema-form/types";
import {mergeUISchemaObjects} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {useState, useCallback} from "react";

// Define proper types for the data structures
type FormData = Record<string, unknown>;

interface UISchema {
  "ui:className"?: string;
  "ui:title"?: string;

  newUser?: {
    "ui:title"?: string;
  };
}

// Extend FieldProps with proper typing
interface TypedFieldProps extends Omit<FieldProps, "formData" | "uiSchema" | "onChange" | "className" | "schema"> {
  formData?: FormData;
  uiSchema?: UISchema;
  onChange: (formData: FormData | undefined) => void;
  className?: string;
  schema: object;
}

export function NewUserField(props: TypedFieldProps & {label: string}) {
  const {label, ...fieldProps} = props;
  const [createNewUser, setCreateNewUser] = useState(false);

  const handleSwitchChange = useCallback(
    (checked: boolean) => {
      fieldProps.onChange({newUser: {}});
      setCreateNewUser(checked);
    },
    [fieldProps],
  );

  const handleFormChange = useCallback(
    (data: {formData: FormData | undefined}) => {
      fieldProps.onChange({
        ...props.formData,
        ...data.formData,
      });
    },
    [fieldProps],
  );

  return (
    <div className="col-span-full grid gap-2">
      <div className="flex items-center gap-2 rounded-md border p-2">
        <Switch checked={createNewUser} id="create-new-user" onCheckedChange={handleSwitchChange} />
        <Label className="text-slate-600" htmlFor="create-new-user">
          {label}
        </Label>
      </div>
      {createNewUser ? (
        <SchemaForm
          className={cn("p-px", fieldProps.uiSchema?.["ui:className"], fieldProps.className)}
          formData={fieldProps.formData}
          onChange={({formData}) => {
            handleFormChange({formData});
          }}
          schema={fieldProps.schema}
          tagName="div"
          uiSchema={mergeUISchemaObjects(fieldProps.uiSchema || {}, {
            "ui:className": "grid grid-cols-2",
            "ui:title": fieldProps.uiSchema?.newUser?.["ui:title"],
          })}
          useDefaultSubmit={false}
          withScrollArea={false}
        />
      ) : null}
    </div>
  );
}

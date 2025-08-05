import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";
import {cn} from "@/lib/utils";
import {SchemaForm} from "@repo/ayasofyazilim-ui/organisms/schema-form";
import {FieldProps} from "@repo/ayasofyazilim-ui/organisms/schema-form/types";
import {mergeUISchemaObjects} from "@repo/ayasofyazilim-ui/organisms/schema-form/utils";
import {useState, useCallback} from "react";

export function NewUserField(props: FieldProps & {label: string}) {
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
    (params: Parameters<FieldProps["onChange"]>[0]) => {
      fieldProps.onChange({
        ...props.formData,
        ...params.formData,
      });
    },
    [fieldProps],
  );

  return (
    <div className="col-span-full grid gap-2">
      <div className="flex items-center gap-2 rounded-md border p-2">
        <Switch id="create-new-user" checked={createNewUser} onCheckedChange={handleSwitchChange} />
        <Label htmlFor="create-new-user" className="text-slate-600">
          {label}
        </Label>
      </div>
      {createNewUser && (
        <SchemaForm
          withScrollArea={false}
          className={cn("p-px", fieldProps.uiSchema?.["ui:className"], fieldProps.className)}
          schema={fieldProps.schema}
          uiSchema={mergeUISchemaObjects(fieldProps.uiSchema || {}, {
            "ui:className": "grid grid-cols-2",
            "ui:title": fieldProps.uiSchema?.newUser?.["ui:title"],
          })}
          onChange={handleFormChange}
          formData={fieldProps.formData}
          useDefaultSubmit={false}
          tagName={"div"}
        />
      )}
    </div>
  );
}

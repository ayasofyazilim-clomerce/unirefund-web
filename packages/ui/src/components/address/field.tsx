import { SchemaForm } from "@repo/ayasofyazilim-ui/organisms/schema-form";
import { FieldProps } from "@repo/ayasofyazilim-ui/organisms/schema-form/types";
import { cn } from "../../utils";
import AddressSelector, { AddressSelectorProps } from "./address";

type AddressFieldProps = {
  languageData?: AddressSelectorProps["languageData"];
  hiddenFields?: string[];
  className?: string;
};

export function AddressField({ languageData, hiddenFields, className }: AddressFieldProps) {
  const _AddressField = (props: FieldProps) => {
    console.log(props)
    return (
      <div className={cn("grid gap-2", className, props.uiSchema?.["ui:className"])}>
        <AddressSelector
          languageData={languageData}
          initialValues={props.formData}
          required={props.schema.required}
          onAddressChange={(address) => {
            props.onChange({
              ...props.formData,
              ...address,
            });
          }}
        />
        <SchemaForm
          className="p-0"
          schema={props.schema}
          uiSchema={{
            ...props.uiSchema,
            "ui:className": cn("p-0 border-none rounded-none"),
            displayLabel: false,
          }}
          withScrollArea={false}
          onChange={({ formData }) => {
            props.onChange({
              ...props.formData,
              ...formData,
            });
          }}
          formData={props.formData}
          useDefaultSubmit={false}
          filter={{
            type: "exclude",
            keys: [
              "countryId",
              "adminAreaLevel1Id",
              "adminAreaLevel2Id",
              "neighborhoodId",
              "partyType",
              "partyId",
              ...(hiddenFields || []),
            ],
          }}
          tagName={"div"}
        />
      </div>
    );
  };
  return _AddressField;
}

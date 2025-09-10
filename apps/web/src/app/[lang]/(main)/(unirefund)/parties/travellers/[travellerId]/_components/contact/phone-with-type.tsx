import {Label} from "@/components/ui/label";
import * as Select from "@/components/ui/select";
import {PhoneInput} from "@repo/ayasofyazilim-ui/molecules/phone-input";
import type {FieldProps} from "@repo/ayasofyazilim-ui/organisms/schema-form/types";
import {cn} from "@/lib/utils";
import type {DefaultResource} from "@/language-data/core/Default";

export type TelephoneDto = {
  id?: string;
  ituCountryCode?: string | null;
  areaCode?: string | null;
  localNumber?: string | null;
  readonly fullNumber?: string | null;
  isPrimary?: boolean | null;
  type?: "HOME" | "OFFICE" | "MOBILE" | "FAX" | "UNKNOWN" | "WORK" | "OTHER";
};
type UISchema = {
  "ui:className"?: string;
};
export function PhoneWithTypeField<T extends TelephoneDto>({
  languageData,
  typeOptions,
}: {
  languageData: DefaultResource;
  typeOptions: readonly string[];
}) {
  function Field(props: FieldProps<T>) {
    const {uiSchema: _uiSchema} = props;
    const uiSchema = _uiSchema as unknown as UISchema;
    const value = `${props.formData?.ituCountryCode}${props.formData?.areaCode || ""}${props.formData?.localNumber}`;
    return (
      <div className={cn("flex flex-col gap-4", uiSchema["ui:className"], props.className)}>
        <div>
          <Label>{languageData["Form.telephone.number"]}</Label>
          <PhoneInput
            defaultValue={
              props.formData && props.formData.ituCountryCode && props.formData.ituCountryCode ? value : undefined
            }
            disabled={props.disabled}
            id="phone"
            onChange={(values) => {
              props.onChange({
                ...props.formData,
                ...{
                  ituCountryCode: `+${values.parsed?.countryCallingCode}`,
                  localNumber: values.parsed?.nationalNumber,
                },
              } as T);
            }}
          />
        </div>
        <div>
          <Label>{languageData["Form.telephone.type"]}</Label>
          <Select.Select
            disabled={props.disabled}
            onValueChange={(val: string) => {
              if (typeOptions.includes(val)) {
                props.onChange({
                  ...props.formData,
                  type: val as T["type"],
                } as T);
              }
            }}
            value={props.formData?.type}>
            <Select.SelectTrigger id="type">
              <Select.SelectValue placeholder={languageData["Form.telephone.type.ui:placeholder"]} />
            </Select.SelectTrigger>
            <Select.SelectContent>
              {typeOptions.map((option, idx) => (
                <Select.SelectItem data-id={`type_${idx}`} key={option} value={option}>
                  {languageData[`Form.telephone.type.${option}` as keyof DefaultResource] || option}
                </Select.SelectItem>
              ))}
            </Select.SelectContent>
          </Select.Select>
        </div>
      </div>
    );
  }
  return Field;
}

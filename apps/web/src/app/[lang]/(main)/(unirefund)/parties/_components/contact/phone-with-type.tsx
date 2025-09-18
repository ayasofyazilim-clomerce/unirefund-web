import {Label} from "@/components/ui/label";
import * as Select from "@/components/ui/select";
import {PhoneInput} from "@repo/ayasofyazilim-ui/molecules/phone-input";
import type {FieldProps} from "@repo/ayasofyazilim-ui/organisms/schema-form/types";
import {cn} from "@/lib/utils";
import {FieldLabel} from "@repo/ayasofyazilim-ui/organisms/schema-form";
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
  "ui:required"?: boolean;
};
export function PhoneWithTypeField({
  languageData,
  typeOptions,
}: {
  languageData: DefaultResource;
  typeOptions: readonly string[];
}) {
  function Field(props: FieldProps) {
    const {uiSchema: _uiSchema} = props;
    const uiSchema = _uiSchema as unknown as UISchema;
    const formData = props.formData as TelephoneDto | undefined;
    const value = `${formData?.ituCountryCode}${formData?.areaCode || ""}${formData?.localNumber}`;
    const required = uiSchema["ui:required"] || props.required;
    return (
      <div className={cn("flex flex-col items-end gap-4", uiSchema["ui:className"], props.className)}>
        <div className="grid h-fit gap-1.5">
          <FieldLabel
            data-testid="phone-label"
            id="phone-label"
            label={languageData["Form.telephone.number"]}
            required={required}
          />
          <PhoneInput
            data-testid="phone-input"
            defaultValue={formData?.ituCountryCode && formData.localNumber ? value : undefined}
            disabled={props.disabled}
            id="phone"
            onChange={(values) => {
              props.onChange({
                ...props.formData,
                ...{
                  ituCountryCode: `+${values.parsed?.countryCallingCode}`,
                  localNumber: values.parsed?.nationalNumber,
                },
              });
            }}
            required={required}
          />
        </div>
        <div>
          <Label className="text-slate-600" data-testid="type-label">
            {languageData["Form.telephone.type"]}
          </Label>
          <Select.Select
            disabled={props.disabled}
            onValueChange={(val: string) => {
              if (typeOptions.includes(val)) {
                props.onChange({
                  ...props.formData,
                  type: val as TelephoneDto["type"],
                });
              }
            }}
            value={formData?.type}>
            <Select.SelectTrigger data-testid="type-select" id="type">
              <Select.SelectValue placeholder={languageData["Form.telephone.type.ui:placeholder"]} />
            </Select.SelectTrigger>
            <Select.SelectContent>
              {typeOptions.map((option, idx) => (
                <Select.SelectItem data-testid={`type_${idx}`} key={option} value={option}>
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

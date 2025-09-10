import {Label} from "@/components/ui/label";
import type {Volo_Abp_Identity_IdentityRoleDto} from "@ayasofyazilim/core-saas/IdentityService";
import {Combobox} from "@repo/ayasofyazilim-ui/molecules/combobox";
import {DatePicker} from "@repo/ayasofyazilim-ui/molecules/date-picker";
import type {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";

export interface SelectUserAndRoleStepProps {
  languageData: CRMServiceServiceResource;
  selectedRole: Volo_Abp_Identity_IdentityRoleDto | null | undefined;
  roleList: Volo_Abp_Identity_IdentityRoleDto[];
  onRoleSelect: (role: Volo_Abp_Identity_IdentityRoleDto | null | undefined) => void;
  onDateSelect: (date: Date | null) => void;
}

export function SelectUserAndRoleStep({
  languageData,
  onRoleSelect,
  selectedRole,
  roleList,
  onDateSelect,
}: SelectUserAndRoleStepProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <Label className="text-slate-600" htmlFor="individuals-combobox">
        {languageData["CRM.Affiliations.selectRole"] || "Select User and Role"}
      </Label>
      <Combobox<Volo_Abp_Identity_IdentityRoleDto>
        aria-describedby="individuals-help"
        disabled={!roleList}
        id="individuals-combobox"
        list={roleList}
        onValueChange={onRoleSelect}
        selectIdentifier="id"
        selectLabel="name"
        value={selectedRole}
      />
      <DatePicker id="start-date" label={languageData["Form.Merchant.affiliation.startDate"]} onChange={onDateSelect} />
    </div>
  );
}

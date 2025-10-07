import {Label} from "@/components/ui/label";
import type {UniRefund_IdentityService_AssignableRoles_AssignableRoleDto} from "@ayasofyazilim/core-saas/IdentityService";
import {Combobox} from "@repo/ayasofyazilim-ui/molecules/combobox";
import {DatePicker} from "@repo/ayasofyazilim-ui/molecules/date-picker";
import type {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";

export interface SelectUserAndRoleStepProps {
  languageData: CRMServiceServiceResource;
  selectedRole: UniRefund_IdentityService_AssignableRoles_AssignableRoleDto | null | undefined;
  roleList: UniRefund_IdentityService_AssignableRoles_AssignableRoleDto[];
  onRoleSelect: (role: UniRefund_IdentityService_AssignableRoles_AssignableRoleDto | null | undefined) => void;
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
      <Label className="text-slate-600" data-testid="individuals-label" htmlFor="individuals-combobox">
        {languageData["CRM.Affiliations.selectRole"] || "Select User and Role"}
      </Label>
      <Combobox<UniRefund_IdentityService_AssignableRoles_AssignableRoleDto>
        aria-describedby="individuals-help"
        disabled={!roleList}
        id="individuals-combobox"
        list={roleList}
        onValueChange={onRoleSelect}
        selectIdentifier="roleId"
        selectLabel="roleName"
        value={selectedRole}
      />
      <DatePicker
        defaultValue={new Date()}
        id="start-date"
        label={languageData["CRM.Affiliation.startDate"]}
        onChange={onDateSelect}
      />
    </div>
  );
}

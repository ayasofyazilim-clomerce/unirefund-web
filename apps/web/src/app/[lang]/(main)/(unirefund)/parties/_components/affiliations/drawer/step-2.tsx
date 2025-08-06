import type {UniRefund_CRMService_Individuals_IndividualListResponseDto as IndividualListResponseDto} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import type {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";

export interface SelectUserAndRoleStepProps {
  languageData: CRMServiceServiceResource;
  selectedIndividual: IndividualListResponseDto | null | undefined;
  roleList: string[];
  userList: string[];
  onSelectionChange: ({abpRoleId, abpUserId}: {abpRoleId: string; abpUserId: string}) => void;
}

export function SelectUserAndRoleStep({languageData, selectedIndividual}: SelectUserAndRoleStepProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      {selectedIndividual ? <p>{selectedIndividual.firstname}</p> : null}
      {languageData.Back}
    </div>
  );
}

import {Label} from "@/components/ui/label";
import type {UniRefund_CRMService_Individuals_IndividualListResponseDto as IndividualListResponseDto} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import {Combobox} from "@repo/ayasofyazilim-ui/molecules/combobox";
import type {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";
import {IndividualDrawer} from ".";

export interface SelectIndividualStepProps {
  languageData: CRMServiceServiceResource;
  individualList: IndividualListResponseDto[];
  selectedIndividual: IndividualListResponseDto | null | undefined;
  onIndividualSelect: (individual: IndividualListResponseDto | null | undefined) => void;
  onIndividualUpdate: (individual: IndividualListResponseDto) => void;
  isIndividualsAvailable: boolean;
}

export function SelectIndividualStep({
  languageData,
  individualList,
  selectedIndividual,
  onIndividualSelect,
  onIndividualUpdate,
  isIndividualsAvailable,
}: SelectIndividualStepProps) {
  return (
    <>
      <div className="flex w-full flex-col gap-2">
        <Label className="text-slate-600" htmlFor="individuals-combobox">
          {languageData["Form.Merchant.affiliation.individuals"]}
        </Label>
        <Combobox<IndividualListResponseDto>
          aria-describedby="individuals-help"
          disabled={!isIndividualsAvailable}
          id="individuals-combobox"
          list={individualList}
          onValueChange={onIndividualSelect}
          selectIdentifier="id"
          selectLabel="firstname"
          value={selectedIndividual}
        />
        {!isIndividualsAvailable && (
          <p className="text-muted-foreground text-sm" id="individuals-help">
            No individuals available to select
          </p>
        )}
      </div>

      <span className="w-full text-center text-sm text-slate-600" role="separator">
        {languageData["Form.Merchant.affiliation.or"]}
      </span>

      <IndividualDrawer languageData={languageData} onIndividualUpdate={onIndividualUpdate} />
    </>
  );
}

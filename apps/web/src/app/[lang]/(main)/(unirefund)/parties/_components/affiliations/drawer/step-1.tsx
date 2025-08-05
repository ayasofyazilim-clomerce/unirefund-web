import {IndividualDrawer} from ".";
import {Label} from "@/components/ui/label";
import {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";
import {UniRefund_CRMService_Individuals_IndividualListResponseDto as IndividualListResponseDto} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import {Combobox} from "@repo/ayasofyazilim-ui/molecules/combobox";

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
        <Label htmlFor="individuals-combobox" className="text-slate-600">
          {languageData["Form.Merchant.affiliation.individuals"]}
        </Label>
        <Combobox<IndividualListResponseDto>
          id="individuals-combobox"
          value={selectedIndividual}
          list={individualList}
          selectIdentifier="id"
          selectLabel="firstname"
          onValueChange={onIndividualSelect}
          disabled={!isIndividualsAvailable}
          aria-describedby="individuals-help"
        />
        {!isIndividualsAvailable && (
          <p id="individuals-help" className="text-muted-foreground text-sm">
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

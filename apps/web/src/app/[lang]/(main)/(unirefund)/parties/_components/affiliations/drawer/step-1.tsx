import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import type {UniRefund_CRMService_Individuals_IndividualListResponseDto as IndividualListResponseDto} from "@repo/saas/CRMService";
import {getIndividualByEmailApi} from "@repo/actions/unirefund/CrmService/actions";
import {EmailInput} from "@repo/ayasofyazilim-ui/molecules/email-input";
import type {UniRefund_CRMService_Individuals_IndividualWithAbpUserDto} from "@repo/saas/CRMService";
import {Minus} from "lucide-react";
import {useState, useTransition} from "react";
import {toast} from "@/components/ui/sonner";
import type {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";
import {IndividualDrawer} from ".";

export interface SelectIndividualStepProps {
  languageData: CRMServiceServiceResource;
  onIndividualUpdate: (individual: IndividualListResponseDto) => void;
  selectedIndividual: UniRefund_CRMService_Individuals_IndividualWithAbpUserDto | null | undefined;
  onIndividualSelect: (individual: {individualId: string; fullname: string} | undefined) => void;
}

export function SelectIndividualStep({
  languageData,
  onIndividualUpdate,
  selectedIndividual,
  onIndividualSelect,
}: SelectIndividualStepProps) {
  const [email, setEmail] = useState("");
  const isEmailValid = isValidEmail(email);

  const [isPending, startTransition] = useTransition();
  function isValidEmail(emailToTest: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(emailToTest);
  }

  function handleSearch() {
    if (!isEmailValid) return;

    startTransition(() => {
      getIndividualByEmailApi(email)
        .then((response) => {
          if (response.data.length > 0) {
            const individual = response.data[0];
            if (individual.individualId && individual.fullname) {
              onIndividualSelect({
                individualId: individual.individualId,
                fullname: individual.fullname,
              });
            } else {
              toast.error("User data is incomplete");
            }
            return;
          }
          toast.error("User not found");
        })
        .catch(() => {
          toast.error("An error occurred");
        });
    });
  }

  if (selectedIndividual) {
    return (
      <div className="w-full space-y-3">
        <Label className="font-bold text-slate-600" htmlFor="individuals-combobox">
          Selected Individual
        </Label>

        <div className="flex flex-row">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage alt="Image" src="/avatars/01.png" />
              <AvatarFallback>{selectedIndividual.fullname?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{selectedIndividual.fullname}</p>
              <p className="text-muted-foreground text-sm">{email}</p>
            </div>
          </div>
          <Button
            className="ml-auto rounded-full"
            onClick={() => {
              onIndividualSelect(undefined);
            }}
            size="icon"
            variant="outline">
            <Minus />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex w-full flex-col gap-2">
        <Label className="text-slate-600" htmlFor="individuals-combobox">
          Search Individual
        </Label>
        <EmailInput
          onValueChange={(e) => {
            setEmail(e);
          }}
          placeholder="john@doe.com"
          suggestions={["@gmail.com"]}
          value={email}
        />

        <Button
          aria-label="Search individual"
          className="w-full"
          disabled={!isEmailValid || isPending}
          onClick={handleSearch}
          variant="default">
          {languageData.Search || "Search Individual"}
        </Button>
      </div>

      <span className="w-full text-center text-sm text-slate-600" role="separator">
        {languageData["Form.Merchant.affiliation.or"]}
      </span>

      <IndividualDrawer languageData={languageData} onIndividualUpdate={onIndividualUpdate} />
    </>
  );
}

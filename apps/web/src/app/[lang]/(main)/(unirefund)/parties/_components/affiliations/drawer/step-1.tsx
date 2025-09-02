import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import type {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";
import type {UniRefund_CRMService_Individuals_IndividualListResponseDto as IndividualListResponseDto} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import {getIndividualByEmailApi} from "@repo/actions/unirefund/CrmService/actions";
import {EmailInput} from "@repo/ayasofyazilim-ui/molecules/email-input";
import {UniRefund_CRMService_Individuals_IndividualWithAbpUserDto} from "@repo/saas/CRMService";
import {Minus} from "lucide-react";
import {useState, useTransition} from "react";
import {IndividualDrawer} from ".";
import {toast} from "@/components/ui/sonner";

export interface SelectIndividualStepProps {
  languageData: CRMServiceServiceResource;
  onIndividualUpdate: (individual: IndividualListResponseDto) => void;
  selectedAbpUser: UniRefund_CRMService_Individuals_IndividualWithAbpUserDto | null | undefined;
  onAbpUserSelect: (individual: UniRefund_CRMService_Individuals_IndividualWithAbpUserDto | null | undefined) => void;
}

export function SelectIndividualStep({
  languageData,
  onIndividualUpdate,
  selectedAbpUser,
  onAbpUserSelect,
}: SelectIndividualStepProps) {
  const [email, setEmail] = useState("");
  const isEmailValid = isValidEmail(email);

  const [isPending, startTransition] = useTransition();
  function isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  function handleSearch() {
    if (!isEmailValid) return;

    startTransition(() => {
      getIndividualByEmailApi(email).then((res) => {
        if (res.data && res.data.length > 0) {
          onAbpUserSelect(res.data[0]);
          return;
        }
        toast.error("User not found");
      });
    });
  }

  if (selectedAbpUser) {
    return (
      <div className="w-full space-y-3">
        <Label className="font-bold text-slate-600" htmlFor="individuals-combobox">
          Selected Individual
        </Label>

        <div className="flex flex-row">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="/avatars/01.png" alt="Image" />
              <AvatarFallback>{selectedAbpUser?.fullname?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{selectedAbpUser.fullname}</p>
              <p className="text-muted-foreground text-sm">{email}</p>
            </div>
          </div>
          <Button
            size="icon"
            variant="outline"
            className="ml-auto rounded-full"
            onClick={() => onAbpUserSelect(undefined)}>
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
          value={email}
          suggestions={["@gmail.com"]}
          onValueChange={(e) => setEmail(e)}
          placeholder="john@doe.com"
        />

        <Button
          aria-label="Search individual"
          className="w-full"
          variant="default"
          disabled={!isEmailValid || isPending}
          onClick={handleSearch}>
          {languageData["Search"] || "Search Individual"}
        </Button>
        {/* {!isIndividualsAvailable && (
          <p className="text-muted-foreground text-sm" id="individuals-help">
            No individuals available to select
          </p>
        )} */}
      </div>

      <span className="w-full text-center text-sm text-slate-600" role="separator">
        {languageData["Form.Merchant.affiliation.or"]}
      </span>

      <IndividualDrawer languageData={languageData} onIndividualUpdate={onIndividualUpdate} />
    </>
  );
}

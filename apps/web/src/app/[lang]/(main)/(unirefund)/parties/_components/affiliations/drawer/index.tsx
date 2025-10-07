import {Button} from "@/components/ui/button";
import {Drawer, DrawerContent, DrawerHeader, DrawerTrigger} from "@/components/ui/drawer";
import {toast} from "@/components/ui/sonner";
import type {Volo_Abp_Identity_IdentityRoleDto} from "@ayasofyazilim/core-saas/IdentityService";
import type {
  UniRefund_CRMService_Individuals_CreateIndividualDto as CreateIndividualDto,
  UniRefund_CRMService_Individuals_IndividualListResponseDto as IndividualListResponseDto,
} from "@repo/saas/CRMService";
import {useParams, useRouter} from "next/navigation";
import type {Dispatch, SetStateAction} from "react";
import {useCallback, useMemo, useState, useTransition} from "react";
import type {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";
import {CreateIndividualForm} from "../../individual-form";
import type {PartyTypeHasAffiliations} from "../../party-header";
import {createAffiliationByPartyType} from "../utils";
import {StepperFooter} from "./footer";
import {SelectIndividualStep} from "./step-1";
import {SelectUserAndRoleStep} from "./step-2";

interface AffiliationDrawerProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  languageData: CRMServiceServiceResource;
  roles: Volo_Abp_Identity_IdentityRoleDto[];
  partyType: PartyTypeHasAffiliations;
}

interface FormResponse {
  type: "success" | "api-error";
  data: CreateIndividualDto;
  message?: string;
}

export const STEP_KEYS = ["select-individual", "select-user-and-role"] as const;
export const INITIAL_STEP = 0;

type StepKey = (typeof STEP_KEYS)[number];

export const getStepTitle = (languageData: CRMServiceServiceResource, stepKey: StepKey): string => {
  const stepTitleMap: Record<StepKey, keyof CRMServiceServiceResource> = {
    "select-individual": "CRM.Affiliations.createOrSelect",
    "select-user-and-role": "CRM.Affiliations.selectUserAndRole",
  };
  return languageData[stepTitleMap[stepKey]];
};

export function AffiliationDrawer({open, setOpen, languageData, roles, partyType}: AffiliationDrawerProps) {
  const router = useRouter();
  const {partyId} = useParams<{partyId: string}>();
  const [isPending, startTransition] = useTransition();
  const [currentStep, setCurrentStep] = useState(INITIAL_STEP);
  const [selectedRole, setSelectedRole] = useState<Volo_Abp_Identity_IdentityRoleDto | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [preventClose, setPreventClose] = useState(true);

  const [selectedIndividual, setSelectedIndividual] = useState<{individualId: string; fullname: string} | undefined>();

  const currentStepKey = useMemo(() => STEP_KEYS[currentStep], [currentStep]);
  const currentStepTitle = useMemo(() => getStepTitle(languageData, currentStepKey), [languageData, currentStepKey]);

  const isNextStepDisabled = useMemo(
    () => (currentStep === INITIAL_STEP && !selectedIndividual) || (currentStep === 1 && (!selectedRole || !date)),
    [currentStep, selectedIndividual, selectedRole, date],
  );

  const isFirstStep = currentStep === INITIAL_STEP;
  const buttonText = isFirstStep
    ? languageData["CRM.Affiliations.Drawer.cancel"]
    : languageData["CRM.Affiliations.Drawer.previous"];

  const handleDrawerOpenChange = useCallback(
    (isOpen: boolean) => {
      if (preventClose) return;
      setOpen(isOpen);
      setPreventClose(true);
    },
    [preventClose, setOpen],
  );

  const handlePreviousStep = useCallback(() => {
    if (isFirstStep) {
      setOpen(false);
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, INITIAL_STEP));
    }
  }, [isFirstStep, setOpen]);

  const handleNextStep = useCallback(() => {
    if (currentStep === 1) {
      if (!selectedIndividual || !selectedRole?.id || !date) {
        toast.error("Error");
        return;
      }
      startTransition(() => {
        const requestBody = {
          individualId: selectedIndividual.individualId,
          abpRoleId: selectedRole.id || "",
          startDate: date.toISOString(),
          isPrimary: false,
        };
        createAffiliationByPartyType({
          partyId,
          partyType,
          requestBody,
          router,
        });
      });
      setSelectedIndividual(undefined);
      setSelectedRole(null);
      setCurrentStep(INITIAL_STEP);
      setDate(null);
      setOpen(false);

      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, STEP_KEYS.length - 1));
  }, [currentStep, date, selectedIndividual, selectedRole, partyId, partyType, router, setOpen]);

  const handleStepChange = useCallback((step: number) => {
    const normalizedStep = Math.max(INITIAL_STEP, Math.min(step - 1, STEP_KEYS.length - 1));
    setCurrentStep(normalizedStep);
  }, []);

  const handleIndividualUpdate = useCallback((newIndividual: IndividualListResponseDto) => {
    setSelectedIndividual({
      individualId: newIndividual.id || "",
      fullname: `${newIndividual.firstname} ${newIndividual.lastname}`,
    });
  }, []);

  const handleRoleSelect = useCallback((role: Volo_Abp_Identity_IdentityRoleDto | null | undefined) => {
    setSelectedRole(role || null);
  }, []);

  const handleDateSelect = useCallback((selectedDate: Date | null) => {
    setDate(selectedDate);
  }, []);

  return (
    <Drawer dismissible={false} nested onOpenChange={handleDrawerOpenChange} open={open}>
      <DrawerContent
        aria-describedby="drawer-description"
        aria-labelledby="drawer-title"
        className="bottom-4 mx-auto max-w-2xl overflow-hidden rounded-md border-0 p-0 [&>div.bg-muted]:hidden"
        role="dialog">
        <DrawerHeader>
          <h2 className="text-lg font-semibold" id="drawer-title">
            {currentStepTitle}
          </h2>
          <p className="sr-only" id="drawer-description">
            Step {currentStep + 1} of {STEP_KEYS.length}: {currentStepTitle}
          </p>
        </DrawerHeader>

        <div className="content flex flex-col items-center justify-between gap-2 p-4 pt-0">
          {isFirstStep ? (
            <SelectIndividualStep
              languageData={languageData}
              onIndividualSelect={setSelectedIndividual}
              onIndividualUpdate={handleIndividualUpdate}
              selectedIndividual={selectedIndividual}
            />
          ) : (
            <SelectUserAndRoleStep
              languageData={languageData}
              onDateSelect={handleDateSelect}
              onRoleSelect={handleRoleSelect}
              roleList={roles}
              selectedRole={selectedRole}
            />
          )}
          {}
        </div>

        <StepperFooter
          buttonText={buttonText}
          currentStep={currentStep}
          isNextStepDisabled={isNextStepDisabled}
          isSubmitting={isPending}
          languageData={languageData}
          onNextStep={handleNextStep}
          onPreviousStep={handlePreviousStep}
          onStepChange={handleStepChange}
        />
      </DrawerContent>
    </Drawer>
  );
}

interface OptimizedIndividualDrawerProps {
  languageData: CRMServiceServiceResource;
  onIndividualUpdate: (individual: IndividualListResponseDto) => void;
}

export function IndividualDrawer({languageData, onIndividualUpdate}: OptimizedIndividualDrawerProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleOpenChange = useCallback(() => {
    if (isPending) return;
    setOpen((prev) => !prev);
  }, [isPending]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleFormSubmit = useCallback(
    (response: FormResponse) => {
      if (response.type === "success") {
        onIndividualUpdate(response.data);
        setOpen(false);
      } else {
        toast.error(response.message || "An error occurred");
      }
    },
    [onIndividualUpdate],
  );

  const createButtonText = languageData["Form.Individual.create"] || "Create Individual";
  const cancelText = languageData.Cancel || "Cancel";

  return (
    <Drawer onOpenChange={handleOpenChange} open={open}>
      <DrawerTrigger asChild data-testid="create-new-individual-drawer-trigger">
        <Button
          aria-label="Create new individual"
          className="w-full"
          data-testid="create-new-individual-trigger"
          disabled={isPending}
          variant="outline">
          {createButtonText}
        </Button>
      </DrawerTrigger>

      <DrawerContent
        aria-describedby="individual-drawer-description"
        aria-labelledby="individual-drawer-title"
        className="bottom-4 mx-auto h-full max-h-[80dvh] max-w-2xl overflow-hidden rounded-md border-0 p-0 [&>div.bg-muted]:hidden"
        role="dialog">
        <DrawerHeader>
          <h2 className="text-lg font-semibold" id="individual-drawer-title">
            {createButtonText}
          </h2>
          <p className="sr-only" id="individual-drawer-description">
            Form to create a new individual
          </p>
        </DrawerHeader>

        <CreateIndividualForm
          className="rounded-none border-none p-4 pt-0"
          isPending={isPending}
          languageData={languageData}
          onSubmit={handleFormSubmit}
          startTransition={startTransition}>
          <div className="sticky bottom-0 flex items-center justify-between gap-2 border-t bg-white p-2">
            <Button
              aria-label="Cancel individual creation"
              data-testid="cancel-individual-creation"
              disabled={isPending}
              onClick={handleClose}
              type="button"
              variant="outline">
              {cancelText}
            </Button>
            <Button
              aria-label="Submit individual creation form"
              data-testid="submit-individual-creation"
              disabled={isPending}
              type="submit">
              {isPending ? "Creating..." : createButtonText}
            </Button>
          </div>
        </CreateIndividualForm>
      </DrawerContent>
    </Drawer>
  );
}

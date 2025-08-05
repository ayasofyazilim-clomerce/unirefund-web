import {Button} from "@/components/ui/button";
import {Drawer, DrawerContent, DrawerHeader, DrawerTrigger} from "@/components/ui/drawer";
import {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";
import {
  UniRefund_CRMService_Individuals_CreateIndividualDto as CreateIndividualDto,
  UniRefund_CRMService_Individuals_IndividualListResponseDto as IndividualListResponseDto,
} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import {Dispatch, SetStateAction, useCallback, useMemo, useState, useTransition} from "react";
import {CreateIndividualForm} from "../../individual-form";
import {StepperFooter} from "./footer";
import {SelectIndividualStep} from "./step-1";
import {
  Volo_Abp_Identity_IdentityUserDto,
  Volo_Abp_Identity_IdentityRoleDto,
} from "@ayasofyazilim/core-saas/IdentityService";

// Types
interface AffiliationDrawerProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  languageData: CRMServiceServiceResource;
  individuals: IndividualListResponseDto[];
  isIndividualsAvailable: boolean;
  users: Volo_Abp_Identity_IdentityUserDto[];
  roles: Volo_Abp_Identity_IdentityRoleDto[];
}

interface FormResponse {
  type: "success" | "api-error";
  data: CreateIndividualDto;
}

// Constants
export const STEP_KEYS = ["select-individual", "select-user-and-role", "fill-details"] as const;
export const INITIAL_STEP = 0;
export const MAX_DRAWER_HEIGHT = 500;

type StepKey = (typeof STEP_KEYS)[number];

// Utility functions
export const getStepTitle = (languageData: CRMServiceServiceResource, stepKey: StepKey): string => {
  const stepTitleMap: Record<StepKey, keyof CRMServiceServiceResource> = {
    "select-individual": "CRM.Affiliations.createOrSelect",
    "select-user-and-role": "CRM.Affiliations.selectUserAndRole",
    "fill-details": "CRM.Affiliations.fillDetails",
  };
  return languageData[stepTitleMap[stepKey]];
};

export function AffiliationDrawer({
  open,
  setOpen,
  languageData,
  individuals,
  isIndividualsAvailable,

  users,
  roles,
}: AffiliationDrawerProps) {
  // State management
  const [currentStep, setCurrentStep] = useState(INITIAL_STEP);
  const [individualList, setIndividualList] = useState<IndividualListResponseDto[]>(individuals);
  const [individualId, setIndividualId] = useState<string | null>(null);
  const [preventClose, setPreventClose] = useState(true);

  // Memoized values
  const currentStepKey = useMemo(() => STEP_KEYS[currentStep], [currentStep]);
  const currentStepTitle = useMemo(() => getStepTitle(languageData, currentStepKey), [languageData, currentStepKey]);

  const selectedIndividual = useMemo(
    () => (individualId ? individualList.find((individual) => individual.id === individualId) : null),
    [individualId, individualList],
  );

  const isNextStepDisabled = useMemo(
    () => currentStep >= STEP_KEYS.length - 1 || !individualId,
    [currentStep, individualId],
  );

  const isFirstStep = currentStep === INITIAL_STEP;
  const buttonText = isFirstStep
    ? languageData["CRM.Affiliations.Drawer.cancel"]
    : languageData["CRM.Affiliations.Drawer.previous"];

  // Event handlers
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
    setCurrentStep((prev) => Math.min(prev + 1, STEP_KEYS.length - 1));
  }, []);

  const handleStepChange = useCallback((step: number) => {
    const normalizedStep = Math.max(INITIAL_STEP, Math.min(step - 1, STEP_KEYS.length - 1));
    setCurrentStep(normalizedStep);
  }, []);

  const handleIndividualSelect = useCallback((individual: IndividualListResponseDto | null | undefined) => {
    setIndividualId(individual?.id || null);
  }, []);

  const handleIndividualUpdate = useCallback((newIndividual: IndividualListResponseDto) => {
    setIndividualId(newIndividual.id!);
    setIndividualList((prev) => [...prev, newIndividual]);
    setCurrentStep((prev) => prev + 1);
  }, []);

  return (
    <Drawer dismissible={false} open={open} nested onOpenChange={handleDrawerOpenChange}>
      <DrawerContent
        className="bottom-4 mx-auto max-w-lg overflow-hidden rounded-md border-0 p-0 [&>div.bg-muted]:hidden"
        role="dialog"
        aria-labelledby="drawer-title"
        aria-describedby="drawer-description">
        <DrawerHeader>
          <h2 id="drawer-title" className="text-lg font-semibold">
            {currentStepTitle}
          </h2>
          <p id="drawer-description" className="sr-only">
            Step {currentStep + 1} of {STEP_KEYS.length}: {currentStepTitle}
          </p>
        </DrawerHeader>

        <div className="content flex flex-col items-center justify-between gap-2 p-4 pt-0">
          {isFirstStep && (
            <SelectIndividualStep
              languageData={languageData}
              individualList={individualList}
              selectedIndividual={selectedIndividual}
              onIndividualSelect={handleIndividualSelect}
              onIndividualUpdate={handleIndividualUpdate}
              isIndividualsAvailable={isIndividualsAvailable}
            />
          )}
          {}
        </div>

        <StepperFooter
          currentStep={currentStep}
          languageData={languageData}
          buttonText={buttonText}
          isNextStepDisabled={isNextStepDisabled}
          onPreviousStep={handlePreviousStep}
          onNextStep={handleNextStep}
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
      }
    },
    [onIndividualUpdate],
  );

  const createButtonText = languageData["Form.Individual.create"] || "Create Individual";
  const cancelText = languageData.Cancel || "Cancel";

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full" disabled={isPending} aria-label="Create new individual">
          {createButtonText}
        </Button>
      </DrawerTrigger>

      <DrawerContent
        className={`bottom-4 mx-auto h-full max-h-[${MAX_DRAWER_HEIGHT}px] max-w-lg overflow-hidden rounded-md border-0 p-0 [&>div.bg-muted]:hidden`}
        role="dialog"
        aria-labelledby="individual-drawer-title"
        aria-describedby="individual-drawer-description">
        <DrawerHeader>
          <h2 id="individual-drawer-title" className="text-lg font-semibold">
            {createButtonText}
          </h2>
          <p id="individual-drawer-description" className="sr-only">
            Form to create a new individual
          </p>
        </DrawerHeader>

        <CreateIndividualForm
          languageData={languageData}
          className="rounded-none border-none p-4 pt-0"
          isPending={isPending}
          onSubmit={handleFormSubmit}
          startTransition={startTransition}>
          <div className="sticky bottom-0 flex items-center justify-between gap-2 border-t bg-white p-2">
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              disabled={isPending}
              aria-label="Cancel individual creation">
              {cancelText}
            </Button>
            <Button type="submit" disabled={isPending} aria-label="Submit individual creation form">
              {isPending ? "Creating..." : createButtonText}
            </Button>
          </div>
        </CreateIndividualForm>
      </DrawerContent>
    </Drawer>
  );
}

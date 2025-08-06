import {Button} from "@/components/ui/button";
import {Drawer, DrawerContent, DrawerHeader, DrawerTrigger} from "@/components/ui/drawer";
import type {
  UniRefund_CRMService_Individuals_CreateIndividualDto as CreateIndividualDto,
  UniRefund_CRMService_Individuals_IndividualListResponseDto as IndividualListResponseDto,
} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import type {Dispatch, SetStateAction} from "react";
import {useCallback, useMemo, useState, useTransition} from "react";
import type {
  Volo_Abp_Identity_IdentityUserDto,
  Volo_Abp_Identity_IdentityRoleDto,
} from "@ayasofyazilim/core-saas/IdentityService";
import type {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";
import {CreateIndividualForm} from "../../individual-form";
import {StepperFooter} from "./footer";
import {SelectIndividualStep} from "./step-1";

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
    setIndividualId(newIndividual.id || null);
    setIndividualList((prev) => [...prev, newIndividual]);
    setCurrentStep((prev) => prev + 1);
  }, []);

  return (
    <Drawer dismissible={false} nested onOpenChange={handleDrawerOpenChange} open={open}>
      <DrawerContent
        aria-describedby="drawer-description"
        aria-labelledby="drawer-title"
        className="bottom-4 mx-auto max-w-lg overflow-hidden rounded-md border-0 p-0 [&>div.bg-muted]:hidden"
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
              individualList={individualList}
              isIndividualsAvailable={isIndividualsAvailable}
              languageData={languageData}
              onIndividualSelect={handleIndividualSelect}
              onIndividualUpdate={handleIndividualUpdate}
              selectedIndividual={selectedIndividual}
            />
          ) : null}
          {}
        </div>

        <StepperFooter
          buttonText={buttonText}
          currentStep={currentStep}
          isNextStepDisabled={isNextStepDisabled}
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
      }
    },
    [onIndividualUpdate],
  );

  const createButtonText = languageData["Form.Individual.create"] || "Create Individual";
  const cancelText = languageData.Cancel || "Cancel";

  return (
    <Drawer onOpenChange={handleOpenChange} open={open}>
      <DrawerTrigger asChild>
        <Button aria-label="Create new individual" className="w-full" disabled={isPending} variant="outline">
          {createButtonText}
        </Button>
      </DrawerTrigger>

      <DrawerContent
        aria-describedby="individual-drawer-description"
        aria-labelledby="individual-drawer-title"
        className={`bottom-4 mx-auto h-full max-h-[${MAX_DRAWER_HEIGHT}px] max-w-lg overflow-hidden rounded-md border-0 p-0 [&>div.bg-muted]:hidden`}
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
              disabled={isPending}
              onClick={handleClose}
              type="button"
              variant="outline">
              {cancelText}
            </Button>
            <Button aria-label="Submit individual creation form" disabled={isPending} type="submit">
              {isPending ? "Creating..." : createButtonText}
            </Button>
          </div>
        </CreateIndividualForm>
      </DrawerContent>
    </Drawer>
  );
}

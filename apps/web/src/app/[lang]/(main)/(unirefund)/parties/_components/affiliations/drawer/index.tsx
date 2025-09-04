import {Button} from "@/components/ui/button";
import {Drawer, DrawerContent, DrawerHeader, DrawerTrigger} from "@/components/ui/drawer";
import {toast} from "@/components/ui/sonner";
import type {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";
import type {Volo_Abp_Identity_IdentityRoleDto} from "@ayasofyazilim/core-saas/IdentityService";
import type {
  UniRefund_CRMService_Individuals_CreateIndividualDto as CreateIndividualDto,
  UniRefund_CRMService_Individuals_IndividualListResponseDto as IndividualListResponseDto,
} from "@ayasofyazilim/unirefund-saas-dev/CRMService";
import {
  postCustomAffiliationApi,
  postMerchantAffiliationApi,
  postRefundPointAffiliationApi,
  postTaxFreeAffiliationApi,
  postTaxOfficesAffiliationApi,
} from "@repo/actions/unirefund/CrmService/actions";
import {handlePostResponse} from "@repo/utils/api";
import {useParams, useRouter} from "next/navigation";
import type {Dispatch, SetStateAction} from "react";
import {useCallback, useMemo, useState, useTransition} from "react";
import {CreateIndividualForm} from "../../individual-form";
import {StepperFooter} from "./footer";
import {SelectIndividualStep} from "./step-1";
import {SelectUserAndRoleStep} from "./step-2";

interface AffiliationDrawerProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  languageData: CRMServiceServiceResource;
  roles: Volo_Abp_Identity_IdentityRoleDto[];
  partyType: "merchants" | "refund-points" | "tax-free" | "tax-offices" | "customs";
}

interface FormResponse {
  type: "success" | "api-error";
  data: CreateIndividualDto;
  message?: string;
}

// Constants
export const STEP_KEYS = ["select-individual", "select-user-and-role"] as const;
export const INITIAL_STEP = 0;

type StepKey = (typeof STEP_KEYS)[number];

// Utility functions
export const getStepTitle = (languageData: CRMServiceServiceResource, stepKey: StepKey): string => {
  const stepTitleMap: Record<StepKey, keyof CRMServiceServiceResource> = {
    "select-individual": "CRM.Affiliations.createOrSelect",
    "select-user-and-role": "CRM.Affiliations.selectUserAndRole",
  };
  return languageData[stepTitleMap[stepKey]];
};

export function AffiliationDrawer({open, setOpen, languageData, roles, partyType}: AffiliationDrawerProps) {
  // State management
  const router = useRouter();
  const params = useParams<{partyId: string}>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(INITIAL_STEP);
  const [selectedRole, setSelectedRole] = useState<Volo_Abp_Identity_IdentityRoleDto | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [preventClose, setPreventClose] = useState(true);

  const [selectedIndividual, setSelectedIndividual] = useState<{individualId: string; fullname: string} | undefined>();

  // Memoized values
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

  const handleNextStep = useCallback(async () => {
    if (currentStep === 1) {
      setIsSubmitting(true);
      const data = {
        merchantId: params.partyId,
        refundPointId: params.partyId,
        taxFreeId: params.partyId,
        taxOfficeId: params.partyId,
        customId: params.partyId,
        requestBody: {
          individualId: selectedIndividual?.individualId,
          abpRoleId: selectedRole?.id,
          startDate: date?.toISOString(),
        },
      };
      let res;
      switch (partyType) {
        case "merchants":
          res = await postMerchantAffiliationApi(data);
          break;
        case "refund-points":
          res = await postRefundPointAffiliationApi(data);
          break;
        case "customs":
          res = await postCustomAffiliationApi(data);
          break;
        case "tax-free":
          res = await postTaxFreeAffiliationApi(data);
          break;
        case "tax-offices":
          res = await postTaxOfficesAffiliationApi(data);
          break;
      }
      handlePostResponse(res, router);
      setIsSubmitting(false);
      setSelectedIndividual(undefined);
      setSelectedRole(null);
      setCurrentStep(INITIAL_STEP);
      setDate(null);
      setOpen(false);

      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, STEP_KEYS.length - 1));
  }, [currentStep, date, selectedIndividual, selectedRole, params.partyId]);

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
          isSubmitting={isSubmitting}
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
      <DrawerTrigger asChild>
        <Button aria-label="Create new individual" className="w-full" disabled={isPending} variant="outline">
          {createButtonText}
        </Button>
      </DrawerTrigger>

      <DrawerContent
        aria-describedby="individual-drawer-description"
        aria-labelledby="individual-drawer-title"
        className="bottom-4 mx-auto h-full max-h-[80dvh] max-w-lg overflow-hidden rounded-md border-0 p-0 [&>div.bg-muted]:hidden"
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

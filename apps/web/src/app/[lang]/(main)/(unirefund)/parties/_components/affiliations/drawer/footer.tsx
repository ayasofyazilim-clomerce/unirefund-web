import {Button} from "@/components/ui/button";
import {Stepper, StepperItem, StepperTrigger, StepperIndicator} from "@/components/ui/stepper";
import type {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";
import {getStepTitle, INITIAL_STEP, STEP_KEYS} from ".";

/**
 * StepperFooter Component
 *
 * Footer component with navigation buttons and step indicator.
 */
export interface StepperFooterProps {
  currentStep: number;
  languageData: CRMServiceServiceResource;
  buttonText: string;
  isNextStepDisabled: boolean;
  onPreviousStep: () => void;
  onNextStep: () => Promise<void>;
  onStepChange: (step: number) => void;
  isSubmitting: boolean;
}

export function StepperFooter({
  currentStep,
  languageData,
  buttonText,
  isNextStepDisabled,
  onPreviousStep,
  onNextStep,
  onStepChange,
  isSubmitting,
}: StepperFooterProps) {
  return (
    <div className="footer flex flex-col">
      <div className="flex items-center justify-between border-t p-2">
        <Button
          aria-label={currentStep === INITIAL_STEP ? "Close drawer" : "Go to previous step"}
          className="w-32"
          data-testid="close-or-previous-drawer"
          disabled={isSubmitting}
          onClick={onPreviousStep}
          variant="outline">
          {buttonText}
        </Button>
        <Button
          aria-label="Go to next step"
          className="w-32"
          data-testid="next-step"
          disabled={isNextStepDisabled || isSubmitting}
          onClick={() => void onNextStep()}
          variant="outline">
          {STEP_KEYS.length === currentStep + 1
            ? languageData["Form.Custom.affiliation.create"] || "Create"
            : languageData["CRM.Affiliations.Drawer.next"] || "Next step"}
        </Button>
      </div>

      <Stepper aria-label="Form progress" onValueChange={onStepChange} value={currentStep}>
        {STEP_KEYS.map((stepKey, index) => (
          <StepperItem className="flex-1" key={stepKey} step={index}>
            <StepperTrigger
              aria-label={`Step ${index}: ${getStepTitle(languageData, stepKey)}`}
              asChild
              className="w-full flex-col items-start gap-2"
              data-testid={`stepper-trigger-${index}`}>
              <StepperIndicator asChild className="bg-border h-2 w-full rounded-none">
                <span className="sr-only">{getStepTitle(languageData, stepKey)}</span>
              </StepperIndicator>
            </StepperTrigger>
          </StepperItem>
        ))}
      </Stepper>
    </div>
  );
}

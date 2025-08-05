import {getStepTitle, INITIAL_STEP, STEP_KEYS} from ".";
import {Button} from "@/components/ui/button";
import {Stepper, StepperItem, StepperTrigger, StepperIndicator} from "@/components/ui/stepper";
import {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";

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
  onNextStep: () => void;
  onStepChange: (step: number) => void;
}

export function StepperFooter({
  currentStep,
  languageData,
  buttonText,
  isNextStepDisabled,
  onPreviousStep,
  onNextStep,
  onStepChange,
}: StepperFooterProps) {
  return (
    <div className="footer flex flex-col">
      <div className="flex items-center justify-between border-t p-2">
        <Button
          variant="outline"
          className="w-32"
          onClick={onPreviousStep}
          aria-label={currentStep === INITIAL_STEP ? "Close drawer" : "Go to previous step"}>
          {buttonText}
        </Button>
        <Button
          variant="outline"
          className="w-32"
          onClick={onNextStep}
          disabled={isNextStepDisabled}
          aria-label="Go to next step">
          {languageData["CRM.Affiliations.Drawer.next"] || "Next step"}
        </Button>
      </div>

      <Stepper value={currentStep} onValueChange={onStepChange} aria-label="Form progress">
        {STEP_KEYS.map((stepKey, index) => (
          <StepperItem key={stepKey} step={index} className="flex-1">
            <StepperTrigger
              className="w-full flex-col items-start gap-2"
              asChild
              aria-label={`Step ${index}: ${getStepTitle(languageData, stepKey)}`}>
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

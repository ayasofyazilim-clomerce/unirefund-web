import {Button} from "@/components/ui/button";
import {IdCard, LogIn} from "lucide-react";
import {useRouter} from "next/navigation";
import type {AccountServiceResource} from "@/language-data/core/AccountService";

interface LoadingSpinnerProps {
  className?: string;
}

export function LoadingSpinner({className = ""}: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="text-center">
        <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    </div>
  );
}

interface ValidationToggleButtonsProps {
  showMainForm: boolean;
  currentStep: string;
  loading: boolean;
  languageData: AccountServiceResource;
  mainActionText: React.ReactNode;
  mainActionWithoutValidationText: React.ReactNode;
  mainPath: string;
  alternativeActionText?: React.ReactNode;
  alternativePath?: string;
}

export function ValidationToggleButtons({
  showMainForm,
  currentStep,
  loading,
  languageData,
  mainActionText,
  mainActionWithoutValidationText,
  mainPath,
  alternativeActionText,
  alternativePath,
}: ValidationToggleButtonsProps) {
  const router = useRouter();

  // Show toggle button only when on main form or on start step
  if (!showMainForm && currentStep !== "start") {
    return null;
  }

  return (
    <div>
      {showMainForm ? (
        <div className="mx-auto mb-5 flex w-full flex-col items-center gap-3 px-5 sm:w-[350px]">
          {/* Ayırıcı çizgi ve metin */}
          <div className="flex w-full items-center gap-2">
            <span className="bg-muted h-px min-w-[20px] flex-1" />
            <span className="text-muted-foreground max-w-[200px] text-center text-xs uppercase leading-tight">
              {languageData["Auth.WithDocument"]}
            </span>
            <span className="bg-muted h-px min-w-[20px] flex-1" />
          </div>

          {/* Ana kimlik doğrulama butonu */}
          <Button
            className="mt-1 w-full gap-1 shadow-sm"
            disabled={loading}
            onClick={() => {
              router.push(`${mainPath}?startValidation=true`);
            }}
            type="button">
            <IdCard className="h-5 w-5" />
            {mainActionText}
          </Button>

          {/* Alternative action button (isteğe bağlı) */}
          {alternativeActionText && alternativePath ? <Button
              className="text-muted-foreground w-full gap-1"
              disabled={loading}
              onClick={() => {
                router.push(`${alternativePath}?startValidation=true`);
              }}
              variant="outline">
              <IdCard className="h-5 w-5" />
              {alternativeActionText}
            </Button> : null}
        </div>
      ) : (
        <div>
          {/* Geri dönüş için ayırıcı ve buton */}
          <div className="mt-4 flex w-full items-center gap-2">
            <span className="bg-muted h-px min-w-[20px] flex-1" />
            <span className="text-muted-foreground max-w-[200px] text-center text-xs uppercase leading-tight">
              {languageData["Auth.WithoutDocument"]}
            </span>
            <span className="bg-muted h-px min-w-[20px] flex-1" />
          </div>

          <Button
            className="mt-2 w-full gap-1 shadow-sm"
            disabled={loading}
            onClick={() => {
              router.push(mainPath);
            }}
            type="button">
            <LogIn className="h-5 w-5" />
            {mainActionWithoutValidationText}
          </Button>
        </div>
      )}
    </div>
  );
}

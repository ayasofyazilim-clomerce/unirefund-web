import {replacePlaceholders} from "@repo/ayasofyazilim-ui/lib/replace-placeholders";
import type {AccountServiceResource} from "@/language-data/core/AccountService";
import {useMemo} from "react";

export function useAuthTexts(languageData: AccountServiceResource) {
  const loginTextWithValidation = useMemo(
    () =>
      replacePlaceholders(languageData["Auth.{0}.WithValidation"], [
        {
          holder: "{0}",
          replacement: <span className="font-medium">{languageData.Login}</span>,
        },
      ]),
    [languageData],
  );

  const loginTextWithoutValidation = useMemo(
    () =>
      replacePlaceholders(languageData["Auth.{0}.WithoutValidation"], [
        {
          holder: "{0}",
          replacement: <span className="font-medium">{languageData.Login}</span>,
        },
      ]),
    [languageData],
  );

  const registerTextWithValidation = useMemo(
    () =>
      replacePlaceholders(languageData["Auth.{0}.WithValidation"], [
        {
          holder: "{0}",
          replacement: <span className="font-medium">{languageData.Register}</span>,
        },
      ]),
    [languageData],
  );

  const registerTextWithoutValidation = useMemo(
    () =>
      replacePlaceholders(languageData["Auth.{0}.WithoutValidation"], [
        {
          holder: "{0}",
          replacement: <span className="font-medium">{languageData.Register}</span>,
        },
      ]),
    [languageData],
  );

  const resetPasswordTextWithValidation = useMemo(
    () =>
      replacePlaceholders(languageData["Auth.{0}.WithValidation"], [
        {
          holder: "{0}",
          replacement: <span className="font-medium">{languageData.ResetPassword}</span>,
        },
      ]),
    [languageData],
  );

  const resetPasswordTextWithoutValidation = useMemo(
    () =>
      replacePlaceholders(languageData["Auth.{0}.WithoutValidation"], [
        {
          holder: "{0}",
          replacement: <span className="font-medium">{languageData.ResetPassword}</span>,
        },
      ]),
    [languageData],
  );

  return {
    loginTextWithValidation,
    loginTextWithoutValidation,
    registerTextWithValidation,
    registerTextWithoutValidation,
    resetPasswordTextWithValidation,
    resetPasswordTextWithoutValidation,
  };
}

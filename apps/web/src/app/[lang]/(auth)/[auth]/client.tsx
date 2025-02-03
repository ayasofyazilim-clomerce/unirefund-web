/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument -- TODO: we need to fix this*/
"use client";
import type { ResetPasswordFormDataType } from "@repo/ayasofyazilim-ui/molecules/forms/reset-password-form";
import type { authTypes } from "@repo/ayasofyazilim-ui/pages/auth";
import { Auth, isAuthType } from "@repo/ayasofyazilim-ui/pages/auth";
import { Logo } from "@repo/ui/logo";
import NextError from "next/error";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import {
  sendPasswordResetCodeServer,
  signInServer,
  signUpServer,
} from "src/actions/core/AccountService/actions";
import { useApplication } from "src/providers/application";
import { useLocale } from "src/providers/locale";

export function AuthPage({ tenantId }: { tenantId: string }): JSX.Element {
  const { cultureName, resources, changeLocale } = useLocale();
  const router = useRouter();
  const params = useParams();
  const { appName } = useApplication();
  const searchParams = useSearchParams();
  const authTypeParam = params.auth as authTypes;
  const [errorMessage, setErrorMessage] = useState<string | null | undefined>(
    null,
  );
  if (!isAuthType(authTypeParam)) {
    return (
      <NextError
        statusCode={404}
        title={resources.AbpUi?.texts?.PageNotFound}
      />
    );
  }

  //Login start

  const loginFormSchema = z.object({
    userIdentifier: z.string().min(5),
    password: z.string().min(4).max(32),
    tenantId: z.string(),
  });

  const registerFormSchema = z.object({
    userName: z.string().min(5),
    email: z.string().email(),
    password: z.string().min(4).max(32),
    //tenantId: z.string(),
  });
  //Login end
  //Register waiting for implementation
  //ResetPassword start
  const onResetPasswordSubmit = async (values: ResetPasswordFormDataType) => {
    return new Promise((resolve, reject) => {
      void (async () => {
        try {
          const response = await fetch("./api/auth/reset-password", {
            method: "POST",
            body: JSON.stringify({
              password: values.password,
              resetToken: searchParams.get("resetToken"),
              userId: searchParams.get("userId"),
            }),
          });
          if (response.status > 199 && response.status < 300) {
            router.push("/login");
            resolve("");
            return;
          }
          const result = await response.json();

          reject(new Error(result.error.code));
        } catch (e: any) {
          reject(new Error(e));
        }
      })();
    });
  };

  //ResetPassword end
  let props: any;
  switch (authTypeParam) {
    case "login":
      // const login:LoginFormPropsType TODO: Fix this add type and check related code
      props = {
        router,
        allowTenantChange: true,
        formSchema: loginFormSchema,
        onSubmitFunction: signInServer,
        loginFunction: signInServer,
        passwordResetFunction: sendPasswordResetCodeServer,
        registerPath: "register",
        defaultValues: { tenantId },
      };
      break;
    case "register":
      props = {
        router,
        allowTenantChange: true,
        formSchema: registerFormSchema,
        registerFunction: signUpServer,
        loginPath: "login",
        defaultValues: { tenantId },
      };
      break;
    case "reset-password": {
      props = {
        onResetPasswordSubmit,
        onResetPasswordCancel: () => {
          router.push("/login");
        },
        passwordRequirements: {
          passwordRequiredLength: 5,
          passwordRequiredUniqueCharsLength: 3,
          passwordRequiresDigit: true,
          passwordRequiresLower: true,
          passwordRequiresNonAlphanumeric: true,
          passwordRequiresUniqueChars: true,
          passwordRequiresUpper: true,
        },
        error: errorMessage,
      };
      const verifyResetToken = async () => {
        await new Promise((resolve, reject) => {
          void (async () => {
            try {
              // TODO: Implement this
              const response = await fetch("./api/post", {
                method: "POST",
                body: JSON.stringify({
                  body: {
                    resetToken: searchParams.get("resetToken"),
                    userId: searchParams.get("userId"),
                  },
                  url: "account/verify-password-reset-token",
                }),
              });
              if (response.status > 199 && response.status < 300) {
                const res = await response.json();
                if (!res) {
                  setErrorMessage(
                    resources.AbpIdentity?.texts?.[
                      "Volo.Abp.Identity:InvalidToken"
                    ],
                  );
                }
                resolve("");
              } else {
                const result = await response.json();
                setErrorMessage(result.error.code);
                reject(new Error(result.error.code));
              }
            } catch (e: any) {
              reject(new Error(e));
            }
          })();
        });
      };
      void verifyResetToken();
      break;
    }
  }

  const renderAppContent = (projectName: string) => {
    switch (projectName) {
      default:
        return (
          <Logo
            textProps={{
              className: "max-w-lg w-full px-4",
            }}
            variant="text"
          />
          // <div className={baseClassName}>
          // </div>
        );
    }
  };
  return (
    <Auth
      authProps={props}
      authType={authTypeParam}
      cultureName={cultureName || "en"}
      onLangChange={changeLocale}
      resources={resources}
    >
      <div className="flex flex-auto items-center justify-center bg-slate-100">
        {renderAppContent(appName)}
      </div>
    </Auth>
  );
}

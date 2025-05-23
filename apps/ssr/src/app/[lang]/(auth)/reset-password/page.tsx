"use server";

import NewPasswordForm from "@repo/ui/theme/auth/new-password";
import ResetPasswordForm from "@repo/ui/theme/auth/reset-password";
import {redirect} from "next/navigation";
import {
  getTenantByNameApi,
  resetPasswordApi,
  sendPasswordResetCodeApi,
  verifyPasswordResetTokenApi,
} from "@repo/actions/core/AccountService/actions";
import {getResourceData} from "src/language-data/core/AccountService";
import {getBaseLink} from "src/utils";

export default async function Page({
  params,
  searchParams,
}: {
  params: {lang: string};
  searchParams: {
    userId?: string;
    resetToken?: string;
    returnUrl?: string;
    __tenant?: string;
  };
}) {
  const {lang} = params;
  const {userId, resetToken, __tenant} = searchParams;
  const {languageData} = await getResourceData(lang);
  const isTenantDisabled = process.env.FETCH_TENANT !== "true";

  if (userId && resetToken) {
    const verifyPasswordResetTokenResponse = await verifyPasswordResetTokenApi({
      userId,
      resetToken,
      tenantId: __tenant || "",
    });

    if (verifyPasswordResetTokenResponse.type !== "success" || !verifyPasswordResetTokenResponse.data) {
      return redirect(getBaseLink("/login?error=invalidToken", lang));
    }
    return (
      <NewPasswordForm
        languageData={languageData}
        onSubmitAction={resetPasswordApi}
        resetToken={resetToken}
        tenantId={__tenant || ""}
        userId={userId}
      />
    );
  }

  return (
    <ResetPasswordForm
      isTenantDisabled={isTenantDisabled}
      languageData={languageData}
      onSubmitAction={sendPasswordResetCodeApi}
      onTenantSearchAction={getTenantByNameApi}
    />
  );
}

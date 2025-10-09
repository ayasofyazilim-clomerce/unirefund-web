"use server";

import {verifyPasswordResetTokenApi} from "@repo/actions/core/AccountService/actions";
import {redirect} from "next/navigation";
import {NewPasswordForm} from "@/components/auth/new-password-form";
import {ResetPasswordForm} from "@/components/auth/reset-password-form";
import {getBaseLink} from "@/utils";
import {getResourceData} from "src/language-data/core/AccountService";

export default async function Page({
  params,
  searchParams,
}: {
  params: {lang: string};
  searchParams: {
    userId?: string;
    resetToken?: string;
    returnUrl?: string;
  };
}) {
  const {lang} = params;
  const {userId, resetToken} = searchParams;
  const {languageData} = await getResourceData(lang);
  const TENANT_ID = process.env.TENANT_ID;
  if (userId && resetToken) {
    const verifyPasswordResetTokenResponse = await verifyPasswordResetTokenApi({
      userId,
      resetToken,
      tenantId: TENANT_ID || "",
    });

    if (verifyPasswordResetTokenResponse.type !== "success" || !verifyPasswordResetTokenResponse.data) {
      return redirect(getBaseLink(`/login?error=${languageData["Auth.ResetPasswordError"]}`, lang));
    }
    return <NewPasswordForm defaultTenantId={TENANT_ID} languageData={languageData} />;
  }
  return <ResetPasswordForm defaultTenantId={TENANT_ID} languageData={languageData} />;
}

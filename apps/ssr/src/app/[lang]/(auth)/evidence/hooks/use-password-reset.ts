"use client";

import {useEffect} from "react";
import {redirect} from "next/navigation";
import {verifyPasswordResetTokenApi} from "@repo/actions/core/AccountService/actions";
import {getBaseLink} from "src/utils";

interface UsePasswordResetParams {
  searchParams: {
    userId?: string;
    resetToken?: string;
    tenantId?: string;
  };
  lang: string;
}

export function usePasswordReset({searchParams, lang}: UsePasswordResetParams) {
  const {userId, resetToken, tenantId} = searchParams;

  useEffect(() => {
    async function verifyToken() {
      if (userId && resetToken) {
        const verifyPasswordResetTokenResponse = await verifyPasswordResetTokenApi({
          userId,
          resetToken,
          tenantId: tenantId || "",
        });
        if (verifyPasswordResetTokenResponse.type !== "success" || !verifyPasswordResetTokenResponse.data) {
          return redirect(getBaseLink("/login?error=invalidToken", lang));
        }
      }
    }
    void verifyToken();
  }, [userId, resetToken, tenantId, lang]);

  return {userId, resetToken, tenantId};
}

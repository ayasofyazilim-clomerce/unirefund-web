import {z} from "@repo/ayasofyazilim-ui/lib/create-zod-object";

export function createAuthSchemas({
  languageData,
  defaultTenantId,
}: {
  languageData: LanguageData;
  defaultTenantId: string | undefined;
}) {
  const loginSchema = z.object({
    userName: z.string().min(1, languageData["Auth.userNameOrEmail.required"]).trim(),
    password: z.string().min(1, languageData["Auth.password.required"]),
    tenantId: !defaultTenantId ? z.string().optional().default("") : z.string().min(1).trim().default(defaultTenantId),
  });

  const registerSchema = z.object({
    email: z.string().email().min(1, languageData["Auth.email.required"]).trim(),
    userName: z.string().min(1, languageData["Auth.userName.required"]).trim(),
    password: z.string().min(1, languageData["Auth.password.required"]),
    tenantId: !defaultTenantId ? z.string().optional().default("") : z.string().min(1).trim().default(defaultTenantId),
  });

  const resetPasswordSchema = z.object({
    email: z.string().email().min(1, languageData["Auth.userName.required"]).trim(),
    tenantId: !defaultTenantId ? z.string().optional().default("") : z.string().min(1).trim().default(defaultTenantId),
  });

  const newPasswordSchema = z.object({
    password: z.string().min(1, languageData["Auth.password.required"]),
    tenantId: !defaultTenantId ? z.string().optional().default("") : z.string().min(1).trim().default(defaultTenantId),
  });

  return {loginSchema, registerSchema, resetPasswordSchema, newPasswordSchema};
}
export type LanguageData = {
  "Auth.LoginTitle": string;
  "Auth.LoginMessage": string;
  "Auth.RegisterTitle": string;
  "Auth.RegisterMessage": string;
  "Auth.RegisterSuccess": string;
  "Auth.ResetPasswordTitle": string;
  "Auth.ResetPasswordMessage": string;
  "Auth.ResetPasswordSuccess": string;
  "Auth.ResetPasswordError": string;
  "Auth.NewPasswordTitle": string;
  "Auth.NewPasswordMessage": string;

  "Auth.userNameOrEmail.label": string;
  "Auth.userNameOrEmail.placeholder": string;
  "Auth.userNameOrEmail.required": string;

  "Auth.userName.label": string;
  "Auth.userName.placeholder": string;
  "Auth.userName.required": string;

  "Auth.email.label": string;
  "Auth.email.placeholder": string;
  "Auth.email.required": string;

  "Auth.password.label": string;
  "Auth.password.placeholder": string;
  "Auth.password.forgot": string;
  "Auth.password.required": string;

  "Auth.signIn": string;
  "Auth.signUp": string;
  "Auth.dontHaveAnAccount": string;
  "Auth.alreadyHaveAnAccount": string;
  "Auth.resetPassword": string;
  "Auth.newPassword": string;

  "Auth.tenant": string;
  "Auth.tenant.switch": string;
  "Auth.tenant.placeholder": string;
  "Auth.tenant.label": string;
  "Auth.tenant.error": string;
  "Auth.tenant.save": string;
};

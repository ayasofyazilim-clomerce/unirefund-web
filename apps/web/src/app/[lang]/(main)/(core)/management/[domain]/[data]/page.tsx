"use server";

import { isUnauthorized } from "src/utils/page-policy/page-policy";
import PageClient from "./client";

type Policy =
  | "OpenIddictPro.Application"
  | "OpenIddictPro.Scope"
  | "LanguageManagement.Languages"
  | "LanguageManagement.LanguageTexts"
  | "Saas.Editions"
  | "Saas.Tenants"
  | "AbpIdentity.Roles"
  | "AbpIdentity.Users"
  | "AbpIdentity.ClaimTypes"
  | "AbpIdentity.SecurityLogs"
  | "AbpIdentity.OrganizationUnits"
  | "AuditLogging.AuditLogs"
  | "TextTemplateManagement.TextTemplates";

const authorizationRules: Record<string, Record<string, Policy>> = {
  openiddict: {
    applications: "OpenIddictPro.Application",
    scopes: "OpenIddictPro.Scope",
  },
  admin: {
    languages: "LanguageManagement.Languages",
    "language-texts": "LanguageManagement.LanguageTexts",
  },
  saas: {
    edition: "Saas.Editions",
    tenant: "Saas.Tenants",
  },
  identity: {
    role: "AbpIdentity.Roles",
    user: "AbpIdentity.Users",
    "claim-type": "AbpIdentity.ClaimTypes",
    "security-logs": "AbpIdentity.SecurityLogs",
    organization: "AbpIdentity.OrganizationUnits",
  },
  "audit-logs": {
    "audit-logs": "AuditLogging.AuditLogs",
  },
  "text-templates": {
    "text-templates": "TextTemplateManagement.TextTemplates",
  },
};

export default async function Page({
  params,
}: {
  params: {
    lang: string;
    domain: string;
    data: string;
  };
}) {
  const { lang, domain, data } = params;
  const domainRules = authorizationRules[domain];
  await isUnauthorized({
    requiredPolicies: [domainRules[data]],
    lang,
  });
  return <PageClient />;
}

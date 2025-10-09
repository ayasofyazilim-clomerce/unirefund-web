"use server";

import {RegisterForm} from "@/components/auth/register-form";
import {getResourceData} from "src/language-data/core/AccountService";

export default async function Page({params}: {params: {lang: string}}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  const TENANT_ID = process.env.TENANT_ID;

  return <RegisterForm defaultTenantId={TENANT_ID} languageData={languageData} />;
}

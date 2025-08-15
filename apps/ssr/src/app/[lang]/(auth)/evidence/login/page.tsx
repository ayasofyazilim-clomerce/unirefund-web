"use server";

import {getResourceData} from "src/language-data/core/AccountService";
import LoginClient from "./client";

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: {lang: string};
  searchParams: {startValidation?: string};
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  return (
    <LoginClient
      lang={lang}
      languageData={languageData}
      showRegisterFormOnStart={searchParams?.startValidation === "true" || false}
    />
  );
}

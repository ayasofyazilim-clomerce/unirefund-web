"use server";

import {getResourceData} from "src/language-data/core/AccountService";
import RegisterClient from "./client";

export default async function RegisterPage({
  params,
  searchParams,
}: {
  params: {lang: string};
  searchParams: {startValidation?: string};
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  return (
    <RegisterClient
      lang={lang}
      languageData={languageData}
      showRegisterFormOnStart={searchParams?.startValidation === "true" || false}
    />
  );
}

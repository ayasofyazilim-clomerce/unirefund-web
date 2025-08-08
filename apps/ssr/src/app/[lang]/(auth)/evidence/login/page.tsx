"use server";

import {getResourceData} from "src/language-data/core/AccountService";
import LoginClient from "./client";

export default async function LoginPage({params}: {params: {lang: string}}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);

  return (
    <LoginClient lang={lang} languageData={languageData} />
  );
}

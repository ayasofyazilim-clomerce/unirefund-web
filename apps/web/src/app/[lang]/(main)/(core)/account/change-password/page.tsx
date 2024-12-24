"use server";

import { getResourceData } from "src/language-data/core/AccountService";
import ChangePassword from "./change-passwod";

export default async function Page({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const { languageData } = await getResourceData(lang);
  return <ChangePassword languageData={languageData} />;
}

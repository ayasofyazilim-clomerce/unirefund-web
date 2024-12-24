"use server";

import { getResourceData } from "src/language-data/core/AccountService";
import PersonalPicture from "./personal-picture";

export default async function Page({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const { languageData } = await getResourceData(lang);
  return <PersonalPicture languageData={languageData} />;
}

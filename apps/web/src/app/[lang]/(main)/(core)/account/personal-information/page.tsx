"use server";

import {isErrorOnRequest} from "@repo/utils/api";
import {getPersonalInfomationApi} from "@repo/actions/core/AccountService/actions";
import {getResourceData} from "src/language-data/core/AccountService";
import PersonalInformation from "./_components/personal-information";

export default async function Page({params}: {params: {lang: string}}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  const response = await getPersonalInfomationApi();
  if (isErrorOnRequest(response, lang)) return;
  return <PersonalInformation languageData={languageData} personalInformationData={response.data} />;
}

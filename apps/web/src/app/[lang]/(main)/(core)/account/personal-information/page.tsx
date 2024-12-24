"use server";

import { getPersonalInfomationApi } from "src/actions/core/AccountService/actions";
import { getResourceData } from "src/language-data/core/AccountService";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import PersonalInformation from "./personal-information";

export default async function Page({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const { languageData } = await getResourceData(lang);
  const response = await getPersonalInfomationApi();
  if (isErrorOnRequest(response, lang)) return;
  return (
    <PersonalInformation
      languageData={languageData}
      personalInformationData={response.data}
    />
  );
}

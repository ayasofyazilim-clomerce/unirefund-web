"use server";

import { getPersonalInfomationApi } from "src/actions/core/AccountService/actions";
import { getResourceData } from "src/language-data/core/AccountService";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import PersonalInformation from "./_components/personal-information";
import ProfilePicture from "./_components/profile-picture";

export default async function Page({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const { languageData } = await getResourceData(lang);
  const response = await getPersonalInfomationApi();
  if (isErrorOnRequest(response, lang)) return;
  return (
    <div className="flex flex-col gap-2">
      <ProfilePicture languageData={languageData} />
      <PersonalInformation
        languageData={languageData}
        personalInformationData={response.data}
      />
    </div>
  );
}

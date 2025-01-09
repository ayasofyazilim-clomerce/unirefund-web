"use server";

import { getResourceData } from "src/language-data/core/IdentityService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import Form from "./_components/form";

export default async function Page({ params }: { params: { lang: string } }) {
  const { lang } = params;
  await isUnauthorized({
    requiredPolicies: ["AbpIdentity.ClaimTypes.Create"],
    lang,
  });
  const { languageData } = await getResourceData(lang);
  return (
    <>
      <Form languageData={languageData} />
      <div className="hidden" id="page-description">
        {languageData["ClaimType.Create.Description"]}
      </div>
    </>
  );
}

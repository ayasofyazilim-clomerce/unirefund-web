"use server";

import { isUnauthorized } from "@repo/utils/policies";
import { getResourceData } from "src/language-data/core/IdentityService";
import Form from "./_components/form";

export default async function Page({ params }: { params: { lang: string } }) {
  const { lang } = params;
  await isUnauthorized({
    requiredPolicies: ["AbpIdentity.Roles.Create"],
    lang,
  });
  const { languageData } = await getResourceData(lang);
  return (
    <>
      <Form languageData={languageData} />
      <div className="hidden" id="page-description">
        {languageData["Role.Create.Description"]}
      </div>
    </>
  );
}

"use server";

import {isUnauthorized} from "@repo/utils/policies";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import CreateSubTaxFreeForm from "../../../_components/create-form";

export default async function Page({
  params,
}: {
  params: {
    lang: string;
    partyId: string;
  };
}) {
  const {lang, partyId} = params;
  const {languageData} = await getResourceData(lang);

  await isUnauthorized({
    requiredPolicies: ["CRMService.TaxFrees.Create"],
    lang,
  });

  return (
    <CreateSubTaxFreeForm
      formData={{
        parentId: partyId,
      }}
      languageData={languageData}
      typeCode="CUSTOM"
    />
  );
}

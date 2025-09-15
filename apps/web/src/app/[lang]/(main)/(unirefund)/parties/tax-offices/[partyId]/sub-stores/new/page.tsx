"use server";

import { isUnauthorized } from "@repo/utils/policies";
import { getResourceData } from "src/language-data/unirefund/CRMService";
import CreateSubTaxOfficeForm from "../../../_components/create-form";

export default async function Page({
  params,
}: {
  params: {
    lang: string;
    partyId: string;
  };
}) {
  const { lang, partyId } = params;
  const { languageData } = await getResourceData(lang);

  await isUnauthorized({
    requiredPolicies: ["CRMService.TaxOffices.Create"],
    lang,
  });

  return (
    <CreateSubTaxOfficeForm
      formData={{
        parentId: partyId,
      }}
      languageData={languageData}
      typeCode="TAXOFFICE"
    />
  );
}

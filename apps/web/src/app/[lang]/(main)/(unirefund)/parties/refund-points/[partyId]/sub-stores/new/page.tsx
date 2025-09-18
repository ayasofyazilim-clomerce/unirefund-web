"use server";

import {isUnauthorized} from "@repo/utils/policies";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import CreateSubRefundPointForm from "../../../_components/create-form";

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
    requiredPolicies: ["CRMService.RefundPoints.Create"],
    lang,
  });

  return (
    <CreateSubRefundPointForm
      formData={{
        name: " ",
        typeCode: "REFUNDPOINT",
        parentId: partyId,
      }}
      languageData={languageData}
      typeCode="REFUNDPOINT"
    />
  );
}

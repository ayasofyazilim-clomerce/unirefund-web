"use server";

import type { GetApiTagServiceTagTagsRefundData } from "@ayasofyazilim/saas/TagService";
import { redirect } from "next/navigation";
import { getAccessibleRefundPointsApi } from "src/actions/unirefund/CrmService/actions";
import { getRefundableTagsApi } from "src/actions/unirefund/TagService/actions";
import { getResourceData } from "src/language-data/unirefund/TagService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import TravellerDocumentForm from "../_components/traveller-document-form";
import ClientPage from "./client-page";
import { isUnauthorizedRefundPoint } from "./utils";

export default async function Page({
  params,
  searchParams,
}: {
  params: { lang: string; refundType: "export-validated" | "need-validation" };
  searchParams?: Partial<GetApiTagServiceTagTagsRefundData>;
}) {
  const { lang, refundType } = params;

  await isUnauthorized({
    requiredPolicies: [
      "TagService.Tags",
      "RefundService.Refunds",
      "RefundService.Refunds.Create",
      "RefundService.Refunds.View",
    ],
    lang,
  });

  const { languageData } = await getResourceData(lang);

  const accessibleRefundPointsResponse = await getAccessibleRefundPointsApi();
  if (isErrorOnRequest(accessibleRefundPointsResponse, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={accessibleRefundPointsResponse.message}
      />
    );
  }

  const accessibleRefundPoints =
    accessibleRefundPointsResponse.data.items || [];

  if (
    isUnauthorizedRefundPoint(
      searchParams?.refundPointId,
      accessibleRefundPoints,
    )
  ) {
    return redirect(`/${lang}/unauthorized`);
  }

  if (!searchParams?.travellerDocumentNumber || !searchParams.refundPointId) {
    return (
      <TravellerDocumentForm
        accessibleRefundPoints={accessibleRefundPoints}
        languageData={languageData}
      />
    );
  }

  const refundableTagsResponse = await getRefundableTagsApi({
    travellerDocumentNumber: searchParams.travellerDocumentNumber,
    refundType: searchParams.refundType || "Cash",
    refundPointId: searchParams.refundPointId,
    isExportValidated: refundType === "export-validated",
  });

  // Traveller'ın uygun durumda  tag'ı yoksa "An internal error occurred during your request!" dönüyor. Backend değişince bu kontrol silinebilir.
  // if (isErrorOnRequest(refundableTagsResponse, lang, false)) {
  //   return (
  //     <ErrorComponent
  //       languageData={languageData}
  //       message={refundableTagsResponse.message}
  //     />
  //   );
  // }

  const refundableTags =
    refundableTagsResponse.type === "success"
      ? refundableTagsResponse.data
      : {
          totalCount: 0,
          items: [],
        };
  return (
    <ClientPage
      accessibleRefundPoints={accessibleRefundPoints}
      languageData={languageData}
      locale={lang}
      response={refundableTags}
    />
  );
}

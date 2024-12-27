"use server";

import type { GetApiTagServiceTagTagsRefundData } from "@ayasofyazilim/saas/TagService";
import { redirect } from "next/navigation";
import { getAccessibleRefundPointsApi } from "src/actions/unirefund/CrmService/actions";
import { getRefundableTagsApi } from "src/actions/unirefund/TagService/actions";
import { getResourceData } from "src/language-data/unirefund/TagService";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
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
  await isUnauthorized({
    requiredPolicies: [
      "TagService.Tags",
      "RefundService.Refunds",
      "RefundService.Refunds.Create",
      "RefundService.Refunds.View",
    ],
    lang: params.lang,
  });

  const { languageData } = await getResourceData(params.lang);

  const accessibleRefundPointsResponse = await getAccessibleRefundPointsApi();
  if (isErrorOnRequest(accessibleRefundPointsResponse, params.lang)) return;

  const accessibleRefundPoints =
    accessibleRefundPointsResponse.data.items || [];

  if (
    isUnauthorizedRefundPoint(
      searchParams?.refundPointId,
      accessibleRefundPoints,
    )
  ) {
    return redirect(`/${params.lang}/unauthorized`);
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
    isExportValidated: params.refundType === "export-validated",
  });

  // Backend problemi için yorum satırına alındı
  // if (isErrorOnRequest(refundableTagsResponse, params.lang)) return;
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
      locale={params.lang}
      response={refundableTags}
    />
  );
}

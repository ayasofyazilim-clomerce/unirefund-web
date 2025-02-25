"use server";

import type {GetApiTagServiceTagTagsRefundData} from "@ayasofyazilim/saas/TagService";
import {redirect} from "next/navigation";
import {isUnauthorized} from "@repo/utils/policies";
import {isErrorOnRequest} from "@repo/utils/api";
import ErrorComponent from "@repo/ui/components/error-component";
import {getAccessibleRefundPointsApi} from "src/actions/unirefund/CrmService/actions";
import {getRefundableTagsApi} from "src/actions/unirefund/TagService/actions";
import {getResourceData} from "src/language-data/unirefund/TagService";
import TravellerDocumentForm from "../_components/traveller-document-form";
import ClientPage from "./client-page";
import {isUnauthorizedRefundPoint} from "./utils";

export default async function Page({
  params,
  searchParams,
}: {
  params: {lang: string; refundType: "export-validated" | "need-validation"};
  searchParams?: Partial<Omit<GetApiTagServiceTagTagsRefundData, "tagIds">> & Partial<{tagIds: string}>;
}) {
  const {lang, refundType} = params;
  const {travellerDocumentNumber, refundPointId, refundType: refundMethod, tagIds} = searchParams || {};

  await isUnauthorized({
    requiredPolicies: [
      "TagService.Tags",
      "RefundService.Refunds",
      "RefundService.Refunds.Create",
      "RefundService.Refunds.View",
    ],
    lang,
  });

  const {languageData} = await getResourceData(lang);

  const accessibleRefundPointsResponse = await getAccessibleRefundPointsApi();
  if (isErrorOnRequest(accessibleRefundPointsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={accessibleRefundPointsResponse.message} />;
  }

  const accessibleRefundPoints = accessibleRefundPointsResponse.data.items || [];

  if (isUnauthorizedRefundPoint(refundPointId, accessibleRefundPoints)) {
    return redirect(`/${lang}/unauthorized`);
  }

  if (accessibleRefundPoints.length === 1 && !refundPointId) {
    const newParams = Object.keys(searchParams || {})
      .map((key) => {
        return `${key}=${searchParams?.[key as keyof typeof searchParams]}`;
      })
      .join("&");

    return redirect(
      `/${lang}/operations/refund/${refundType}/?${newParams ? `${newParams}&` : ""}refundPointId=${accessibleRefundPoints[0].id}`,
    );
  }

  if (!travellerDocumentNumber || !refundPointId) {
    return <TravellerDocumentForm accessibleRefundPoints={accessibleRefundPoints} languageData={languageData} />;
  }

  const refundableTagsResponse = await getRefundableTagsApi({
    travellerDocumentNumber,
    refundType: refundMethod || "Cash",
    refundPointId,
    isExportValidated: refundType === "export-validated",
    tagIds: tagIds?.split(",") || [],
  });

  if (isErrorOnRequest(refundableTagsResponse, lang, false)) {
    return <ErrorComponent languageData={languageData} message={refundableTagsResponse.message} />;
  }

  return (
    <ClientPage
      accessibleRefundPoints={accessibleRefundPoints}
      languageData={languageData}
      locale={lang}
      response={refundableTagsResponse.data}
    />
  );
}

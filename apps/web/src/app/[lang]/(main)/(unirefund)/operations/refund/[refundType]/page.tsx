"use server";

import type {GetApiTagServiceTagTagsRefundData} from "@repo/saas/TagService";
import {getRefundPointsApi} from "@repo/actions/unirefund/CrmService/actions";
import {getRefundableTagsApi} from "@repo/actions/unirefund/TagService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {isErrorOnRequest, structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import {isRedirectError} from "next/dist/client/components/redirect";
import {redirect} from "next/navigation";
import {getResourceData} from "src/language-data/unirefund/TagService";
import TravellerDocumentForm from "../_components/traveller-document-form";
import ClientPage from "./client-page";
import {isUnauthorizedRefundPoint} from "./utils";

async function getApiRequests() {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([getRefundPointsApi({}, session)]);
    const optionalRequests = await Promise.allSettled([]);
    return {requiredRequests, optionalRequests};
  } catch (error) {
    if (!isRedirectError(error)) {
      return structuredError(error);
    }
    throw error;
  }
}

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

  const apiRequests = await getApiRequests();

  if ("message" in apiRequests) {
    return null;
  }
  const [refundPointResponse] = apiRequests.requiredRequests;

  const accessibleRefundPoints = refundPointResponse.data.items || [];

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
  const requestBody = {
    travellerDocumentNumber,
    refundType: refundMethod || ("Cash" as const),
    refundPointId,
    isExportValidated: refundType === "export-validated",
    tagIds: tagIds?.split(",") || [],
  };
  console.log("Getting refundable tags with data:", requestBody);
  const refundableTagsResponse = await getRefundableTagsApi(requestBody);

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

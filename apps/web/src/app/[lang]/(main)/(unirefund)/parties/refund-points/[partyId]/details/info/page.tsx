"use server";

import { auth } from "@repo/utils/auth/next-auth";
import {
  getRefundPointByIdApi,
  getRefundPointsApi,
  getTaxOfficesApi,
} from "src/actions/unirefund/CrmService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/unirefund/CRMService";
import RefundPointForm from "./form";

async function getApiRequests({ partyId }: { partyId: string }) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([
      getRefundPointsApi({}, session),
      getRefundPointByIdApi(partyId, session),
      getTaxOfficesApi({}, session),
    ]);
    return {
      type: "success" as const,
      data: apiRequests,
    };
  } catch (error) {
    const err = error as { data?: string; message?: string };
    return {
      type: "error" as const,
      message: err.message,
    };
  }
}
export default async function Page({
  params,
}: {
  params: {
    partyId: string;
    lang: string;
  };
}) {
  const { partyId, lang } = params;
  const { languageData } = await getResourceData(lang);

  const apiRequests = await getApiRequests({ partyId });
  if (apiRequests.type === "error") {
    return (
      <ErrorComponent
        languageData={languageData}
        message={apiRequests.message || "Unknown error occurred"}
      />
    );
  }

  const [refundPointsResponse, refundPointDetailResponse, taxOfficesResponse] =
    apiRequests.data;
  const refundPoints = refundPointsResponse.data;
  const refundPointDetail = refundPointDetailResponse.data;
  const taxOffices = taxOfficesResponse.data;

  const refundPointList =
    refundPoints.items?.filter((refundPoint) => refundPoint.id !== partyId) ||
    [];

  return (
    <RefundPointForm
      languageData={languageData}
      partyId={partyId}
      refundPointDetail={refundPointDetail}
      refundPointList={refundPointList}
      taxOfficeList={taxOffices.items || []}
    />
  );
}
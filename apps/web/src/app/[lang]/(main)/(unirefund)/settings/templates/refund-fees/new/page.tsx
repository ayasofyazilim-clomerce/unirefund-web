"use server";
import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import ErrorComponent from "@repo/ui/components/error-component";
import {getRefundPointsApi} from "@/actions/unirefund/CrmService/actions";
import {getResourceData} from "@/language-data/unirefund/ContractService";
import RefundFeeHeaderCreateForm from "./_components/form";

async function getApiRequests() {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([getRefundPointsApi({}, session)]);
    return {
      type: "success" as const,
      data: apiRequests,
    };
  } catch (error) {
    const err = error as {data?: string; message?: string};
    return {
      type: "error" as const,
      message: err.message,
    };
  }
}
export default async function Page({params}: {params: {lang: string}}) {
  const {lang} = params;
  await isUnauthorized({
    requiredPolicies: ["CRMService.RefundPoints"],
    lang,
  });
  const {languageData} = await getResourceData(lang);
  const apiRequests = await getApiRequests();

  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }

  const [refundPointResponse] = apiRequests.data;

  return <RefundFeeHeaderCreateForm languageData={languageData} refundPoints={refundPointResponse.data.items || []} />;
}

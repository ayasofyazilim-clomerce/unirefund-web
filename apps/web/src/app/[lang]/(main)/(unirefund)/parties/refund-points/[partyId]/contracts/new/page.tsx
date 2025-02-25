import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import {FormReadyComponent} from "@repo/ui/form-ready";
import {FileText} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import ErrorComponent from "@repo/ui/components/error-component";
import {
  getRefundFeeHeadersAssignablesByRefundPointIdApi,
  // getRefundPointContractHeadersByRefundPointIdApi,
} from "src/actions/unirefund/ContractService/action";
import {getRefundPointDetailsByIdApi} from "src/actions/unirefund/CrmService/actions";
import {getResourceData} from "src/language-data/unirefund/ContractService";
import {getBaseLink} from "src/utils";
import RefundPointContractHeaderCreateForm from "./_components/form";

async function getApiRequests(partyId: string) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([
      getRefundPointDetailsByIdApi(partyId, session),
      getRefundFeeHeadersAssignablesByRefundPointIdApi(
        {
          refundPointId: partyId,
          sorting: "name",
        },
        session,
      ),
      // getRefundPointContractHeadersByRefundPointIdApi(
      //   {
      //     id: partyId,
      //     sorting: "validTo desc",
      //   },
      //   session,
      // ),
    ]);
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

export default async function Page({
  params,
}: {
  params: {
    partyId: string;
    lang: string;
  };
}) {
  const {partyId, lang} = params;
  await isUnauthorized({
    requiredPolicies: ["ContractService.ContractHeaderForMerchant.Create"],
    lang,
  });

  const {languageData} = await getResourceData(lang);
  const apiRequests = await getApiRequests(partyId);
  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }
  const [
    refundPointDetailsResponse,
    refundFeeHeadersResponse,
    // otherContractHeaders,
  ] = apiRequests.data;

  const refundPointDetailsSummary = refundPointDetailsResponse.data.entityInformations?.at(0)?.organizations?.at(0);
  // const biggestContractHeader = otherContractHeaders.data.items?.at(0);

  return (
    <FormReadyComponent
      active={refundFeeHeadersResponse.data.length < 1}
      content={{
        icon: <FileText className="size-20 text-gray-400" />,
        title: languageData["Missing.RefundFeeHeaders.Title"],
        message: languageData["Missing.RefundFeeHeaders.Message"],
        action: (
          <Button asChild className="text-blue-500" variant="link">
            <Link href={getBaseLink("settings/templates/refund-fees/new", lang)}>{languageData.New}</Link>
          </Button>
        ),
      }}>
      <RefundPointContractHeaderCreateForm
        addressList={refundPointDetailsSummary?.contactInformations?.at(0)?.addresses || []}
        languageData={languageData}
        refundFeeHeaders={refundFeeHeadersResponse.data}
      />
    </FormReadyComponent>
  );
}

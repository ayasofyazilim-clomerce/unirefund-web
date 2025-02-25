import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import {FormReadyComponent} from "@repo/ui/form-ready";
import {FileText} from "lucide-react";
import Link from "next/link";
import Button from "@repo/ayasofyazilim-ui/molecules/button";
import ErrorComponent from "@repo/ui/components/error-component";
import {getResourceData} from "src/language-data/unirefund/ContractService";
import {getMerchantAddressByIdApi} from "src/actions/unirefund/CrmService/actions";
import {
  // getMerchantContractHeadersByMerchantIdApi,
  getRefundTableHeadersAssignablesByMerchantIdApi,
} from "src/actions/unirefund/ContractService/action";
import {getBaseLink} from "@/utils";
import MerchantContractHeaderCreateForm from "./components/form";

async function getApiRequests(partyId: string) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([
      getMerchantAddressByIdApi(partyId, session),
      // getMerchantContractHeadersByMerchantIdApi(
      //   {
      //     id: partyId,
      //     isDraft: false,
      //   },
      //   session,
      // ),
      getRefundTableHeadersAssignablesByMerchantIdApi(
        {
          merchantId: partyId,
        },
        session,
      ),
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
    addressListResponse,
    // otherContractHeadersResponse,
    refundTableHeadersResponse,
  ] = apiRequests.data;

  // const biggestContractHeader = otherContractHeadersResponse.data.items?.at(0);
  return (
    <FormReadyComponent
      active={refundTableHeadersResponse.data.length < 1}
      content={{
        icon: <FileText className="size-20 text-gray-400" />,
        title: languageData["Missing.RefundTableHeaders.Title"],
        message: languageData["Missing.RefundTableHeaders.Message"],
        action: (
          <Button asChild className="text-blue-500" variant="link">
            <Link href={getBaseLink("settings/templates/refund-tables/new", lang)}>{languageData.New}</Link>
          </Button>
        ),
      }}>
      <MerchantContractHeaderCreateForm
        addressList={addressListResponse.data}
        languageData={languageData}
        refundTableHeaders={refundTableHeadersResponse.data}
      />
    </FormReadyComponent>
  );
}

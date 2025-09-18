import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import {FormReadyComponent} from "@repo/ui/form-ready";
import {FileText} from "lucide-react";
import Link from "next/link";
import Button from "@repo/ayasofyazilim-ui/molecules/button";
import ErrorComponent from "@repo/ui/components/error-component";
import {getMerchantAddressesByIdApi} from "@repo/actions/unirefund/CrmService/actions";
import {
  // getMerchantContractHeadersByMerchantIdApi,
  getRefundTableHeadersAssignablesByMerchantIdApi,
} from "@repo/actions/unirefund/ContractService/action";
import {isRedirectError} from "next/dist/client/components/redirect";
import {structuredError} from "@repo/utils/api";
import {getResourceData} from "src/language-data/unirefund/ContractService";
import {getBaseLink} from "@/utils";
import MerchantContractHeaderCreateForm from "./components/form";

async function getApiRequests(partyId: string) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([
      getMerchantAddressesByIdApi(partyId, session),
      getRefundTableHeadersAssignablesByMerchantIdApi(
        {
          merchantId: partyId,
        },
        session,
      ),
    ]);
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

  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }
  const [addressListResponse, refundTableHeadersResponse] = apiRequests.requiredRequests;

  // const biggestContractHeader = otherContractHeadersResponse.data.items?.at(0);
  return (
    <FormReadyComponent
      active={refundTableHeadersResponse.data.length < 1}
      content={{
        icon: <FileText className="size-20 text-gray-400" />,
        title: languageData["Missing.RefundTableHeaders.Title"],
        message: languageData["Missing.RefundTableHeaders.Message"],
        action: (
          <Button asChild className="text-blue-500" data-testid="contract-new-action-button" variant="link">
            <Link
              data-testid="contract-new-action-link"
              href={getBaseLink("settings/templates/refund-tables/new", lang)}>
              {languageData.New}
            </Link>
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

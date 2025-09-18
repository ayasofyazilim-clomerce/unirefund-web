import {Button} from "@/components/ui/button";
import {getRefundFeeHeadersAssignablesByRefundPointIdApi} from "@repo/actions/unirefund/ContractService/action";
import {getRefundPointAddressesByIdApi} from "@repo/actions/unirefund/CrmService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {FormReadyComponent} from "@repo/ui/form-ready";
import {structuredError} from "@repo/utils/api";
import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import {FileText} from "lucide-react";
import {isRedirectError} from "next/dist/client/components/redirect";
import Link from "next/link";
import {getResourceData} from "src/language-data/unirefund/ContractService";
import {getBaseLink} from "src/utils";
import RefundPointContractHeaderCreateForm from "./_components/form";

async function getApiRequests(partyId: string) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([
      getRefundFeeHeadersAssignablesByRefundPointIdApi(
        {
          refundPointId: partyId,
          sorting: "name",
        },
        session,
      ),
      getRefundPointAddressesByIdApi(partyId, session),
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
  const [refundFeeHeadersResponse, refundPointAddressesResponse] = apiRequests.requiredRequests;

  return (
    <FormReadyComponent
      active={refundFeeHeadersResponse.data.length < 1}
      content={{
        icon: <FileText className="size-20 text-gray-400" />,
        title: languageData["Missing.RefundFeeHeaders.Title"],
        message: languageData["Missing.RefundFeeHeaders.Message"],
        action: (
          <Button asChild className="text-blue-500" data-testid="form-ready-action-button" variant="link">
            <Link data-testid="form-ready-action-link" href={getBaseLink("settings/templates/refund-fees/new", lang)}>
              {languageData.New}
            </Link>
          </Button>
        ),
      }}>
      <RefundPointContractHeaderCreateForm
        addressList={refundPointAddressesResponse.data}
        languageData={languageData}
        refundFeeHeaders={refundFeeHeadersResponse.data}
      />
    </FormReadyComponent>
  );
}

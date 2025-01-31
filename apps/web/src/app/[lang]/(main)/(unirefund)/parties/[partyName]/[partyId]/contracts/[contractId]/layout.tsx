"use server";
import { TabLayout } from "@repo/ayasofyazilim-ui/templates/tab-layout";
import {
  getMerchantContractHeaderByIdApi,
  getRefundPointContractHeaderByIdApi,
} from "src/actions/unirefund/ContractService/action";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import { getResourceData } from "src/language-data/unirefund/ContractService";
import { getBaseLink } from "src/utils";
import { isUnauthorized } from "src/utils/page-policy/page-policy";
import { isErrorOnRequest } from "src/utils/page-policy/utils";
import type { ContractPartyName } from "../_components/types";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    lang: string;
    contractId: string;
    partyName: ContractPartyName;
    partyId: string;
  };
}) {
  const { lang, contractId, partyId, partyName } = params;

  const { languageData } = await getResourceData(lang);
  if (params.partyName === "merchants") {
    await isUnauthorized({
      requiredPolicies: [
        "ContractService.ContractHeaderForMerchant",
        "ContractService.ContractSetting.Edit",
        "ContractService.RebateSetting.Edit",
        "ContractService.ContractHeaderForMerchant.Edit",
      ],
      lang,
    });

    const contractHeaderDetails =
      await getMerchantContractHeaderByIdApi(contractId);
    if (isErrorOnRequest(contractHeaderDetails, lang, false)) {
      return (
        <ErrorComponent
          languageData={languageData}
          message="contractHeaderDetails.message"
        />
      );
    }
    const baseLink = getBaseLink(
      `parties/${partyName}/${partyId}/contracts/${contractId}/`,
      lang,
    );
    return (
      <>
        <TabLayout
          tabList={[
            {
              label: languageData["Contracts.Contract"],
              href: `${baseLink}contract`,
            },
            {
              label: languageData["Contracts.RebateSettings"],
              href: `${baseLink}rebate-settings`,
            },
            {
              label: languageData["Contracts.Stores"],
              href: `${baseLink}stores`,
            },
            {
              label: languageData["Contracts.ContractSettings"],
              href: `${baseLink}contract-settings`,
            },
          ]}
        >
          {children}
        </TabLayout>
        <div className="hidden" id="page-title">
          {languageData["Contracts.Edit.Title"]} -
          {contractHeaderDetails.data.name}
        </div>
        <div className="hidden" id="page-description">
          {languageData["Contracts.Edit.Description"]}
        </div>
        <div className="hidden" id="page-back-link">
          {getBaseLink(`/parties/${partyName}/${partyId}`)}
        </div>
      </>
    );
  }

  await isUnauthorized({
    requiredPolicies: [
      "ContractService.ContractHeaderForRefundPoint",
      "ContractService.ContractHeaderForRefundPoint.Edit",
    ],
    lang,
  });

  const contractHeaderDetails =
    await getRefundPointContractHeaderByIdApi(contractId);
  if (isErrorOnRequest(contractHeaderDetails, lang, false)) {
    return (
      <ErrorComponent
        languageData={languageData}
        message={contractHeaderDetails.message}
      />
    );
  }

  return (
    <>
      {children}
      <div className="hidden" id="page-title">
        {languageData["Contracts.Edit.Title"]} -
        {contractHeaderDetails.data.name}
      </div>
      <div className="hidden" id="page-description">
        {languageData["Contracts.Edit.Description"]}
      </div>
      <div className="hidden" id="page-back-link">
        {getBaseLink(`/parties/${partyName}/${partyId}`)}
      </div>
    </>
  );
}

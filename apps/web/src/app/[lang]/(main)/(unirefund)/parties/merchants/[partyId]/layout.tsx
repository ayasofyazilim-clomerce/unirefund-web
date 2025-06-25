"use server";

import {getMerchantDetailByIdApi} from "@repo/actions/unirefund/CrmService/actions";
import {TabLayout} from "@repo/ayasofyazilim-ui/templates/tab-layout";
import ErrorComponent from "@repo/ui/components/error-component";
import {auth} from "@repo/utils/auth/next-auth";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import {getBaseLink} from "src/utils";
import PartyHeader from "../../_components/party-header";

async function getApiRequests({partyId}: {partyId: string}) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([getMerchantDetailByIdApi(partyId, session)]);
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

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    partyId: string;
    lang: string;
  };
}) {
  const {partyId, lang} = params;
  const {languageData} = await getResourceData(lang);
  const baseLink = getBaseLink(`parties/merchants/${partyId}/`, lang);

  const apiRequests = await getApiRequests({partyId});
  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }
  const [merchantDetailsResponse] = apiRequests.data;
  const merchantDetails = merchantDetailsResponse.data.merchant;
  const isHeadquarter = merchantDetails?.typeCode === "HEADQUARTER";
  return (
    <>
      <PartyHeader
        lang={lang}
        link={`${baseLink}details/info`}
        name={merchantDetails?.entityInformations?.[0]?.organizations?.[0]?.name}
        parentId={merchantDetails?.parentId}
      />
      <TabLayout
        orientation="vertical"
        tabList={[
          {
            label: languageData["Merchants.Details"],
            href: `${baseLink}details/info`,
          },
          ...(!isHeadquarter
            ? []
            : [{label: languageData["Merchants.SubOrganization"], href: `${baseLink}sub-stores`}]),
          {
            label: languageData.ProductGroups,
            href: `${baseLink}product-groups`,
          },
          {
            label: languageData.Affiliations,
            href: `${baseLink}affiliations`,
          },
          ...(!isHeadquarter ? [] : [{label: languageData["Merchants.Contracts"], href: `${baseLink}contracts`}]),
        ]}
        variant="simple">
        {children}
      </TabLayout>
      <div className="hidden" id="page-title">
        {`${languageData.Merchant} (${
          merchantDetails?.entityInformations?.[0]?.organizations?.[0]?.name ||
          `${merchantDetails?.entityInformations?.[0]?.individuals?.[0]?.name?.firstName} ${merchantDetails?.entityInformations?.[0]?.individuals?.[0]?.name?.lastName}`
        })`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["Merchants.Edit.Description"]}
      </div>
    </>
  );
}

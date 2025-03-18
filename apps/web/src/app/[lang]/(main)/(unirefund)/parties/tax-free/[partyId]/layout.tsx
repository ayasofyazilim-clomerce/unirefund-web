"use server";

import {TabLayout} from "@repo/ayasofyazilim-ui/templates/tab-layout";
import {auth} from "@repo/utils/auth/next-auth";
import ErrorComponent from "@repo/ui/components/error-component";
import {getTaxFreeDetailsByIdApi} from "@repo/actions/unirefund/CrmService/actions";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import {getBaseLink} from "src/utils";

async function getApiRequests({partyId}: {partyId: string}) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([getTaxFreeDetailsByIdApi(partyId, session)]);
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
  const baseLink = getBaseLink(`parties/tax-free/${partyId}/`, lang);

  const apiRequests = await getApiRequests({partyId});
  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }
  const [taxfreeDetailsResponse] = apiRequests.data;

  return (
    <>
      <TabLayout
        orientation="vertical"
        tabList={[
          {
            label: "Details",
            href: `${baseLink}details/info`,
            disabled: true,
          },
          {
            label: languageData["Merchants.SubOrganization"],
            href: `${baseLink}sub-stores`,
          },
          {
            label: languageData.Affiliations,
            href: `${baseLink}affiliations`,
          },
        ]}
        variant="simple">
        {children}
      </TabLayout>
      <div className="hidden" id="page-title">
        {`${languageData.TaxFree} (${taxfreeDetailsResponse.data.entityInformations?.[0]?.organizations?.[0]?.name})`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["TaxFree.Edit.Description"]}
      </div>
    </>
  );
}

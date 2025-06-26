"use server";

import {TabLayout} from "@repo/ayasofyazilim-ui/templates/tab-layout";
import {auth} from "@repo/utils/auth/next-auth";
import ErrorComponent from "@repo/ui/components/error-component";
import {getTaxOfficeDetailsByIdApi} from "@repo/actions/unirefund/CrmService/actions";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import {getBaseLink} from "src/utils";
import PartyHeader from "../../_components/party-header";

async function getApiRequests({partyId}: {partyId: string}) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([getTaxOfficeDetailsByIdApi(partyId, session)]);
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
  const baseLink = getBaseLink(`parties/tax-offices/${partyId}/`, lang);

  const apiRequests = await getApiRequests({partyId});
  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }
  const [taxOfficeDetailsResponse] = apiRequests.data;

  return (
    <>
      <PartyHeader
        link={`${baseLink}details/info`}
        name={taxOfficeDetailsResponse.data.entityInformations?.[0]?.organizations?.[0]?.name}
        parentId={taxOfficeDetailsResponse.data.parentId}
      />
      <TabLayout
        classNames={{
          vertical: {
            tabs: "my-6 flex items-center lg:items-start flex-col lg:flex-row overflow-auto gap-4 lg:gap-0 w-full",
            tabContent: "border rounded-md p-6 [&>div]:h-max",
            tabList:
              "border rounded-md py-6 pr-0 px-6 border-gray-200 h-max w-full max-w-full   lg:w-1/6 text-center lg:text-left",
          },
        }}
        orientation="vertical"
        tabList={[
          {
            label: "Details",
            href: `${baseLink}details/info`,
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
        {`${languageData.TaxOffice} (${taxOfficeDetailsResponse.data.entityInformations?.[0]?.organizations?.[0]?.name})`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["TaxOffices.Edit.Description"]}
      </div>
    </>
  );
}

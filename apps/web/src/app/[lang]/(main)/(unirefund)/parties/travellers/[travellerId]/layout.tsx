"use server";

import {TabLayout} from "@repo/ayasofyazilim-ui/templates/tab-layout";
import {auth} from "@repo/utils/auth/next-auth";
import ErrorComponent from "@repo/ui/components/error-component";
import {getTravellersDetailsApi} from "@repo/actions/unirefund/TravellerService/actions";
import {getResourceData} from "src/language-data/unirefund/TravellerService";
import {getBaseLink} from "src/utils";

async function getApiRequests(travellerId: string) {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([getTravellersDetailsApi(travellerId, session)]);
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
    travellerId: string;
    lang: string;
  };
}) {
  const {travellerId, lang} = params;
  const {languageData} = await getResourceData(lang);

  const apiRequests = await getApiRequests(travellerId);
  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }
  const [travellerDataResponse] = apiRequests.data;
  const baseLink = getBaseLink(`parties/travellers/${travellerId}/`, lang);
  return (
    <>
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
            label: languageData["Travellers.Personal.Identifications"],
            href: `${baseLink}personal-identifications`,
          },
          {
            label: languageData["Travellers.Personal.Preferences"],
            href: `${baseLink}personal-preferences`,
          },
          {
            label: languageData["Travellers.Personal.Summary"],
            href: `${baseLink}personal-summary`,
          },
        ]}
        variant="simple">
        {children}
      </TabLayout>
      <div className="hidden" id="page-title">
        {`${languageData.Traveller} (${travellerDataResponse.data.personalIdentifications[0].fullName})`}
      </div>
      <div className="hidden" id="page-description">
        {languageData["Travellers.Identifications.Edit.Description"]}
      </div>
    </>
  );
}

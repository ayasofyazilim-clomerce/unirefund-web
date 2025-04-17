"use server";

import {TabLayout} from "@repo/ayasofyazilim-ui/templates/tab-layout";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import {getBaseLink} from "src/utils";

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
  const baseLink = getBaseLink(`parties/individuals/${partyId}/`, lang);

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
            label: languageData["Individual.Details"],
            href: `${baseLink}details/name`,
          },
        ]}
        variant="simple">
        {children}
      </TabLayout>
      <div className="hidden" id="page-title">
        {languageData.Individual}
      </div>
      <div className="hidden" id="page-description">
        {languageData["Individual.Edit.Description"]}
      </div>
    </>
  );
}

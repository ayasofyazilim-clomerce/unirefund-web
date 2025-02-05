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

import {auth} from "@repo/utils/auth/next-auth";
import {Separator} from "@/components/ui/separator";
import {TabLayout} from "@repo/ayasofyazilim-ui/templates/tab-layout";
import {getRefundDetailByIdApi} from "@/actions/unirefund/RefundService/actions";
import ErrorComponent from "@/app/[lang]/(main)/_components/error-component";
import {getResourceData} from "@/language-data/unirefund/RefundService";
import {getBaseLink} from "@/utils";
import {RefundSummary} from "./_components/refund-summary";
import {RefundLocation} from "./_components/refund-location";
import {TravellerDetails} from "./_components/traveller-details";

export default async function Layout({
  params,
  children,
}: {
  params: {id: string; lang: string};
  children: React.ReactNode;
}) {
  const {id: refundId, lang} = params;
  const {languageData} = await getResourceData(lang);

  const session = await auth();
  const refundDetailsResponse = await getRefundDetailByIdApi(refundId, session);
  const baseLink = getBaseLink(`operations/refunds/${refundId}`, lang);
  if (refundDetailsResponse.type === "api-error") {
    return (
      <ErrorComponent languageData={languageData} message={refundDetailsResponse.message || "Unknown error occurred"} />
    );
  }
  return (
    <div className="grid h-full gap-4 overflow-hidden pb-4 md:auto-rows-[auto_1fr] md:grid-cols-2 lg:grid-cols-3">
      <div className="h-full overflow-hidden rounded-md border lg:col-span-2">
        <RefundSummary refundDetails={refundDetailsResponse.data} />
      </div>
      <div className="h-full overflow-hidden rounded-md border border md:row-span-2">
        <RefundLocation refundPointDetails={refundDetailsResponse.data.refundPoint} />
        <Separator />
        <TravellerDetails
          lang={lang}
          traveller={{
            ...refundDetailsResponse.data.traveller,
            travellerDocumentNumber: refundDetailsResponse.data.travellerDocumentNumber,
          }}
        />
      </div>
      <div className="overflow-hidden rounded-md border border p-4 lg:col-span-2">
        <TabLayout
          tabList={[
            {
              href: `${baseLink}/tags`,
              label: "Taxfree tags",
            },
            {
              href: `${baseLink}/payments`,
              label: "Payments",
              disabled: true,
            },
            {
              href: `${baseLink}/history`,
              label: "History",
              disabled: true,
            },
          ]}>
          {children}
        </TabLayout>
      </div>
    </div>
  );
}

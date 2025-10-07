import {Separator} from "@/components/ui/separator";
import {TabLayout} from "@repo/ayasofyazilim-ui/templates/tab-layout";
import {auth} from "@repo/utils/auth/next-auth";
import {isRedirectError} from "next/dist/client/components/redirect";
import {structuredError} from "@repo/utils/api";
import ErrorComponent from "@repo/ui/components/error-component";
import {getRefundDetailByIdApi} from "@repo/actions/unirefund/RefundService/actions";
import {getResourceData} from "@/language-data/unirefund/RefundService";
import {getBaseLink} from "@/utils";
import {RefundLocation} from "./_components/refund-location";
import {RefundSummary} from "./_components/refund-summary";
import {TravellerDetails} from "./_components/traveller-details";

async function getApiRequests(refundId: string) {
  try {
    const session = await auth();
    const requiredRequests = await Promise.all([getRefundDetailByIdApi(refundId, session)]);

    const optionalRequests = await Promise.allSettled([]);
    return {requiredRequests, optionalRequests};
  } catch (error) {
    if (!isRedirectError(error)) {
      return structuredError(error);
    }
    throw error;
  }
}

export default async function Layout({
  params,
  children,
}: {
  params: {refundId: string; lang: string};
  children: React.ReactNode;
}) {
  const {refundId, lang} = params;
  const {languageData} = await getResourceData(lang);

  const apiRequests = await getApiRequests(refundId);
  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} />;
  }
  const {requiredRequests} = apiRequests;
  const [refundDetailsResponse] = requiredRequests;

  const baseLink = getBaseLink(`operations/refunds/${refundId}`, lang);
  return (
    <div className="my-6 grid h-full gap-4 overflow-hidden rounded-md border p-2 pb-4 md:auto-rows-[auto_1fr] md:grid-cols-2 md:p-6 lg:grid-cols-3">
      <div className="h-full overflow-hidden rounded-md border lg:col-span-2">
        <RefundSummary refundDetails={refundDetailsResponse.data} />
      </div>
      <div className="h-full overflow-hidden rounded-md border md:row-span-2">
        <RefundLocation refundPointDetails={refundDetailsResponse.data.refundPoint} />
        <Separator />
        <TravellerDetails
          lang={lang}
          traveller={{
            ...refundDetailsResponse.data.traveller,
            travellerDocumentNumber: refundDetailsResponse.data.travellerDocumentNumber || "",
          }}
        />
      </div>
      <div className="overflow-hidden rounded-md border p-4 lg:col-span-2">
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

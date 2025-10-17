"use server";
import {myProfileApi} from "@repo/actions/core/AccountService/actions";
import {getAllLanguagesApi} from "@repo/actions/core/AdministrationService/actions";
import {getInfoForCurrentTenantApi} from "@repo/actions/unirefund/AdministrationService/actions";
import {getMerchantsApi, getRefundPointsApi, getUserAffiliationsApi} from "@repo/actions/unirefund/CrmService/actions";
import {getTagsApi} from "@repo/actions/unirefund/TagService/actions";
import {getTravellersApi} from "@repo/actions/unirefund/TravellerService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import {getGrantedPoliciesApi, structuredError} from "@repo/utils/api";
import type {Session} from "@repo/utils/auth";
import {signOutServer} from "@repo/utils/auth";
import {auth} from "@repo/utils/auth/next-auth";
import type {Policy} from "@repo/utils/policies";
import {LogOut} from "lucide-react";
import {isRedirectError} from "next/dist/client/components/redirect";
import {getResourceData as getResourceDataCRM} from "@/language-data/unirefund/CRMService";
import type {CRMServiceServiceResource} from "@/language-data/unirefund/CRMService";
import {getResourceData} from "@/language-data/core/AbpUiNavigation";
import type {AbpUiNavigationResource} from "@/language-data/core/AbpUiNavigation";
import unirefund from "public/unirefund.png";
import Providers from "src/providers/providers";
import {getBaseLink} from "src/utils";
import SidebarLayout from "@/components/sidebar-layout/sidebar-layout";
import {getProfileMenuFromDB} from "../../../utils/navbar/navbar-profile-data";
import {getNavbarFromDB} from "../../../utils/navbar/navbar-data";

interface LayoutProps {
  params: {lang: string};
  children: JSX.Element;
}
const appName = process.env.APPLICATION_NAME || "UNIREFUND";

async function getApiRequests(session: Session | null) {
  try {
    const requiredRequests = await Promise.all([
      getGrantedPoliciesApi(),
      getInfoForCurrentTenantApi(session),
      getUserAffiliationsApi(session),
      getAllLanguagesApi(session),
      myProfileApi(),
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

function getSearchFromDB(
  grantedPolicies: Record<Policy, boolean>,
  languageData: AbpUiNavigationResource,
  languageDataCRM: CRMServiceServiceResource,
) {
  const searchFromDB: {
    key: string;
    icon: string;
    search: (search: string) => Promise<
      {
        id: string;
        name: string;
        href: string;
      }[]
    >;
    title: string;
  }[] = [];
  if (grantedPolicies["TagService.Tags"] && grantedPolicies["TagService.Tags.View"]) {
    searchFromDB.push({
      key: "tag",
      icon: "tag",
      search: async (search: string) => {
        "use server";
        try {
          const res = await getTagsApi({tagNumber: search});
          if (typeof res.data === "string") return [];
          return (
            res.data.items?.map((i) => ({
              id: i.id || "",
              name: `${i.travellerFullName} (${i.tagNumber})`,
              href: `operations/tax-free-tags/${i.id}`,
            })) || []
          );
        } catch (error) {
          return [];
        }
      },
      title: languageData.TaxFreeTags,
    });
  }
  if (grantedPolicies["CRMService.Merchants"] && grantedPolicies["CRMService.Merchants.View"]) {
    searchFromDB.push({
      key: "merchants",
      icon: "shop",
      search: async (search: string) => {
        "use server";
        try {
          const res = await getMerchantsApi({name: search});
          return (
            res.data.items?.map((i) => ({
              id: i.id || "",
              name: i.name || "",
              href: `parties/merchants/${i.id}/details`,
            })) || []
          );
        } catch (error) {
          return [];
        }
      },
      title: languageDataCRM.MERCHANT,
    });
  }
  if (grantedPolicies["CRMService.RefundPoints"] && grantedPolicies["CRMService.RefundPoints.View"]) {
    searchFromDB.push({
      key: "refund-points",
      icon: "refund",
      search: async (search: string) => {
        "use server";
        try {
          const res = await getRefundPointsApi({name: search});
          return (
            res.data.items?.map((i) => ({
              id: i.id || "",
              name: i.name || "",
              href: `parties/refund-points/${i.id}/details`,
            })) || []
          );
        } catch (error) {
          return [];
        }
      },
      title: languageDataCRM.REFUNDPOINT,
    });
  }

  if (grantedPolicies["TravellerService.Travellers"] && grantedPolicies["TravellerService.Travellers.Detail"]) {
    searchFromDB.push({
      key: "traveller",
      icon: "plane",
      search: async (search: string) => {
        "use server";
        try {
          const res = await getTravellersApi({travellerDocumentNumber: search});
          return (
            res.data.items?.map((i) => ({
              id: i.id,
              name: `${i.fullName} (${i.nationalityCountryName})`,
              href: `parties/travellers/${i.id}`,
            })) || []
          );
        } catch (error) {
          return [];
        }
      },
      title: languageDataCRM.TRAVELLER,
    });
  }

  return searchFromDB;
}
export default async function Layout({children, params}: LayoutProps) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  const {languageData: languageDataCRM} = await getResourceDataCRM(lang);

  const session = await auth();
  const apiRequests = await getApiRequests(session);

  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} signOutServer={signOutServer} />;
  }

  const [grantedPolicies, tenantData, affiliations, languagesResponse] = apiRequests.requiredRequests;
  const navbarFromDB = await getNavbarFromDB(lang, languageData, grantedPolicies as Record<Policy, boolean>);
  affiliations.data;
  const searchFromDB = getSearchFromDB(grantedPolicies as Record<Policy, boolean>, languageData, languageDataCRM);

  const logo = appName === "UNIREFUND" ? unirefund : undefined;
  return (
    <Providers lang={lang}>
      <SidebarLayout
        affiliations={affiliations.data}
        languageData={languageData}
        user={{
          name: session?.user?.name || "",
          userName: session?.user?.userName || "",
          email: session?.user?.email || "",
          signOut: signOutServer,
        }}>
        {children}
      </SidebarLayout>
    </Providers>
  );
}

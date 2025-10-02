"use server";
import {getAllLanguagesApi} from "@repo/actions/core/AdministrationService/actions";
import {getInfoForCurrentTenantApi} from "@repo/actions/unirefund/AdministrationService/actions";
import {getMerchantsApi, getRefundPointsApi, getUserAffiliationsApi} from "@repo/actions/unirefund/CrmService/actions";
import ErrorComponent from "@repo/ui/components/error-component";
import MainAdminLayout from "@repo/ui/theme/main-admin-layout";
import {getGrantedPoliciesApi, structuredError} from "@repo/utils/api";
import type {Session} from "@repo/utils/auth";
import {signOutServer} from "@repo/utils/auth";
import {auth} from "@repo/utils/auth/next-auth";
import type {Policy} from "@repo/utils/policies";
import {LogOut} from "lucide-react";
import {isRedirectError} from "next/dist/client/components/redirect";
import {myProfileApi} from "@repo/actions/core/AccountService/actions";
import {getTravellersApi} from "@repo/actions/unirefund/TravellerService/actions";
import unirefund from "public/unirefund.png";
import Providers from "src/providers/providers";
import {getBaseLink} from "src/utils";
import AffiliationSwitch from "@/utils/affiliation-switch";
import {getResourceData as getResourceDataCRM} from "@/language-data/unirefund/CRMService";
import {getResourceData} from "@/language-data/core/AbpUiNavigation";
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

export default async function Layout({children, params}: LayoutProps) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  const {languageData: languageDataCRM} = await getResourceDataCRM(lang);
  const session = await auth();
  const apiRequests = await getApiRequests(session);

  if ("message" in apiRequests) {
    return <ErrorComponent languageData={languageData} message={apiRequests.message} signOutServer={signOutServer} />;
  }

  const baseURL = getBaseLink("", lang);
  const profileMenuProps = getProfileMenuFromDB(languageData);
  profileMenuProps.info.name = session?.user?.name ?? profileMenuProps.info.name;
  profileMenuProps.info.email = session?.user?.email ?? profileMenuProps.info.email;
  profileMenuProps.info.image = "https://flowbite.com/docs/images/people/profile-picture-5.jpg";
  profileMenuProps.menu.secondary = [
    {
      href: undefined,
      onClick: signOutServer,
      name: languageData.LogOut,
      icon: <LogOut className="mr-2 h-4 w-4" />,
    },
  ];

  const [grantedPolicies, tenantData, affiliations, languagesResponse] = apiRequests.requiredRequests;
  const navbarFromDB = await getNavbarFromDB(lang, languageData, grantedPolicies as Record<Policy, boolean>);

  const logo = appName === "UNIREFUND" ? unirefund : undefined;
  return (
    <Providers lang={lang}>
      <main className="m-0 grid h-dvh grid-rows-[102px_1fr] overflow-hidden bg-white transition-all">
        <MainAdminLayout
          appName={appName}
          baseURL={baseURL}
          lang={lang}
          languagesList={languagesResponse.data.items || []}
          logo={logo}
          navbarItems={navbarFromDB}
          notification={{
            langugageData: languageData,
            appUrl: process.env.NOVU_APP_URL || "",
            appId: process.env.NOVU_APP_IDENTIFIER || "",
            subscriberId: session?.user?.sub || "67b8674f58411ad400a054e9",
          }}
          prefix=""
          profileMenu={profileMenuProps}
          searchFromDB={[
            {
              key: "merchants",
              icon: "shop",
              search: async (search: string) => {
                "use server";
                try {
                  const res = await getMerchantsApi({name: search});
                  return (
                    res.data.items?.map((i) => ({
                      id: i.id,
                      name: i.name,
                      href: `parties/merchants/${i.id}/details`,
                    })) || []
                  );
                } catch (error) {
                  return [];
                }
              },
              title: languageDataCRM.MERCHANT,
            },
            {
              key: "refund-points",
              icon: "refund",
              search: async (search: string) => {
                "use server";
                try {
                  const res = await getRefundPointsApi({name: search});
                  return (
                    res.data.items?.map((i) => ({
                      id: i.id,
                      name: i.name,
                      href: `parties/refund-points/${i.id}/details`,
                    })) || []
                  );
                } catch (error) {
                  return [];
                }
              },
              title: languageDataCRM.REFUNDPOINT,
            },
            {
              key: "traveller",
              icon: "plane",
              search: async (search: string) => {
                "use server";
                try {
                  const res = await getTravellersApi({travelDocumentNumber: search});
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
            },
          ]}
          tenantData={tenantData.data}>
          <AffiliationSwitch affiliations={affiliations.data} languageData={languageDataCRM} />
        </MainAdminLayout>
        <div className="flex w-full max-w-full flex-col overflow-auto px-2 py-2 sm:px-4 md:px-8 lg:px-16">
          {children}
        </div>
      </main>
    </Providers>
  );
}

"use server";

import {Button} from "@/components/ui/button";
import {FormReadyComponent} from "@repo/ui/form-ready";
import {auth} from "@repo/utils/auth/next-auth";
import {isUnauthorized} from "@repo/utils/policies";
import {FileText} from "lucide-react";
import Link from "next/link";
import {getBaseLink} from "@/utils";
import {getAllCountriesApi} from "@/actions/unirefund/LocationService/actions";
import {getTaxOfficesApi} from "src/actions/unirefund/CrmService/actions";
import ErrorComponent from "src/app/[lang]/(main)/_components/error-component";
import {getResourceData} from "src/language-data/unirefund/CRMService";
import PageClientSide from "./page-client";

async function getApiRequests() {
  try {
    const session = await auth();
    const apiRequests = await Promise.all([
      getTaxOfficesApi(
        {
          maxResultCount: 1000,
        },
        session,
      ),
      getAllCountriesApi({}, session),
    ]);
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

export default async function Page({
  params,
}: {
  params: {
    lang: string;
  };
}) {
  const {lang} = params;
  const {languageData} = await getResourceData(lang);
  await isUnauthorized({
    requiredPolicies: ["CRMService.Merchants.Create"],
    lang,
  });

  const apiRequests = await getApiRequests();
  if (apiRequests.type === "error") {
    return <ErrorComponent languageData={languageData} message={apiRequests.message || "Unknown error occurred"} />;
  }

  const [taxOfficeResponse, countriesResponse] = apiRequests.data;

  return (
    <FormReadyComponent
      active={taxOfficeResponse.data.totalCount === 0}
      content={{
        icon: <FileText className="size-20 text-gray-400" />,
        title: languageData["Missing.TaxOffices.Title"],
        message: languageData["Missing.TaxOffices.Message"],
        action: (
          <Button asChild className="text-blue-500" variant="link">
            <Link href={getBaseLink("parties/tax-offices/new", lang)}>{languageData.New}</Link>
          </Button>
        ),
      }}>
      <>
        <PageClientSide
          countryList={countriesResponse.data.items || []}
          languageData={languageData}
          taxOfficeList={taxOfficeResponse.data.items || []}
        />
        <div className="hidden" id="page-description">
          {languageData["Merchants.New.Description"]}
        </div>
      </>
    </FormReadyComponent>
  );
}
